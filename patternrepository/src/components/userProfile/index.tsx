import React, { useState } from 'react';
import ProfileEdit from './profileEdit';
import ProfileView from './profileView';
import BookProvider from '../../logic/providers/bookProvider';
import UsersProvider from '../../logic/providers/usersProvider';

const Profile: React.FC = () => {
    const [openEdit, setOpenEdit] = useState<boolean>(false);

    return (
        <UsersProvider>
            <BookProvider>
                <>
                    {openEdit && <ProfileEdit openEdit={setOpenEdit} />}
                    {!openEdit && <ProfileView openEdit={setOpenEdit} />}
                </>
            </BookProvider>
        </UsersProvider>
    );
};

Profile.displayName = 'Profile';

export default Profile;
