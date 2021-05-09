import React, { createContext, useState, useEffect } from 'react';
import UserService from '../services/userServices';
import { userInfo } from '../types';

export const UsersContext = createContext<{ allUsers: userInfo[] }>({ allUsers: [] });

interface PropsType {
    children: JSX.Element;
}

const UsersProvider: React.FC<PropsType> = ({ children }) => {
    const [allUsers, setAllUsers] = useState<{ allUsers: userInfo[] }>({ allUsers: [] });

    const onUserDataChange = (items: any) => {
        let loadedUsers: userInfo[] = [];
        loadedUsers = [];

        items.docs.forEach((item: any) => {
            const { id: userId } = item;
            const data = item.data();

            loadedUsers.push({
                uid: userId,
                username: data.username,
                avatar: data.avatar,
                email: data.email,
                description: data.description,
                darkTheme: data.darkTheme,
                hasUnreadNotes: data.hasUnreadNotes ? data.hasUnreadNotes : false,
            });
        });

        setAllUsers({ allUsers: loadedUsers });
    };

    useEffect(() => {
        const unsubscribe = UserService.getAll().onSnapshot(onUserDataChange);

        return () => unsubscribe();
    }, []);

    return <UsersContext.Provider value={allUsers}>{children}</UsersContext.Provider>;
};

export default UsersProvider;
