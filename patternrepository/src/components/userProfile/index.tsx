import React, { useState } from 'react';
import ProfileEdit from './profileEdit';
import ProfileView from './profileView';

const Profile: React.FC = () => {
    const [openEdit, setOpenEdit] = useState<boolean>(false);

    return (
        <>
            {openEdit && <ProfileEdit openEdit={setOpenEdit} />}
            {!openEdit && <ProfileView openEdit={setOpenEdit} />}
        </>
    );
};

export default Profile;
