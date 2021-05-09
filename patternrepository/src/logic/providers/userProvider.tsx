import React, { createContext, useState, useEffect } from 'react';
import { auth, generateUserDocument } from '../firebase';
import { user } from '../types';

export const UserContext = createContext<{ user: user }>({
    user: null,
});

interface PropsType {
    children: JSX.Element;
}

const UserProvider: React.FC<PropsType> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<{ user: user }>({
        user: null,
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
            if (userAuth) {
                const signedUser: any = await generateUserDocument(userAuth, null);
                setCurrentUser({
                    user: {
                        uid: signedUser?.uid,
                        email: signedUser?.email,
                        username: signedUser?.username,
                        avatar: signedUser?.avatar,
                        description: signedUser?.description,
                        darkTheme: signedUser?.darkTheme,
                        hasUnreadNotes: signedUser?.hasUnreadNotes
                            ? signedUser?.hasUnreadNotes
                            : false,
                    },
                });
            } else {
                setCurrentUser({ user: null });
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>;
};

export default UserProvider;
