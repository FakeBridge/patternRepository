import React, { createContext, useState, useEffect } from 'react';
import UserService from '../services/userServices';
import { basicUser } from '../types';

export const UsersContext = createContext<{ allUsers: basicUser[] }>({ allUsers: [] });

interface PropsType {
    children: JSX.Element;
}

const UsersProvider: React.FC<PropsType> = ({ children }) => {
    const [allUsers, setAllUsers] = useState<{ allUsers: basicUser[] }>({ allUsers: [] });

    const onUserDataChange = (items: any) => {
        let loadedUsers: basicUser[] = [];
        loadedUsers = [];

        items.docs.forEach((item: any) => {
            const { id: userId } = item;
            const data = item.data();

            loadedUsers.push({
                uid: userId,
                username: data.username,
                avatar: data.avatar,
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
