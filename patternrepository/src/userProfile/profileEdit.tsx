import React, { useContext, useState, useEffect } from 'react';
import { Button, Input, Label } from 'reactstrap';

import { UserContext } from '../providers/userProvider';

interface PropsType {
    openEdit: (open: boolean) => void;
}

const ProfileEdit: React.FC<PropsType> = ({ openEdit }) => {
    const { user } = useContext(UserContext);

    const [username, setUsername] = useState('');

    useEffect(() => {
        let name = '';
        if (user && user.username) {
            name = user.username;
        }
        setUsername(name);
    }, [user]);

    return (
        <div style={{ maxWidth: '60%', margin: '0px auto' }}>
            <div>
                <Button
                    onClick={() => openEdit(false)}
                    color="info"
                    style={{ padding: '0', lineHeight: '1em' }}
                >
                    Cancel
                </Button>

                <Button
                    onClick={() => openEdit(false)}
                    color="info"
                    style={{ padding: '0', lineHeight: '1em', marginLeft: '10px' }}
                >
                    Save
                </Button>
            </div>

            <div>
                <Label>Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
        </div>
    );
};

export default ProfileEdit;
