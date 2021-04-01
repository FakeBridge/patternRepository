import React, { useContext, useState, useEffect } from 'react';
import { Alert, Button, Input, Label } from 'reactstrap';

import { UserContext } from '../../logic/providers/userProvider';

import useStorage from '../../logic/hooks/useStorage';

import { firestore } from '../../logic/firebase';

interface PropsType {
    openEdit: (open: boolean) => void;
}

const ProfileEdit: React.FC<PropsType> = ({ openEdit }) => {
    const { user } = useContext(UserContext);

    const [username, setUsername] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState<boolean>(false);

    const types = ['image/png', 'image/jpeg', 'image/jpg'];

    useEffect(() => {
        let name = '';
        if (user && user.username) {
            name = user.username;
        }
        setUsername(name);
    }, [user]);

    const { progress, url, uploadImage } = useStorage(file);

    const handleImageChange = (selectedFile: File | null) => {
        if (selectedFile) {
            if (types.includes(selectedFile.type)) {
                const maxAllowSize = 5 * 1024 * 1024;
                if (selectedFile.size > maxAllowSize) {
                    setError('Image is too big! Maximum size is 5MB.');
                } else {
                    setError(null);
                    setFile(selectedFile);
                }
            } else {
                setFile(null);
                setError('Please use only select an image file (png or jpg)');
            }
        }
    };

    const updateData = () => {
        firestore
            .collection(`users`)
            .doc(`${user?.uid}`)
            .update({
                username,
                description,
            })
            .then(() => {
                setSaved(true);
            })
            .catch((errorData) => {
                setError(errorData?.message);
            });
    };

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
                    onClick={() => updateData()}
                    color="info"
                    style={{ padding: '0', lineHeight: '1em', marginLeft: '10px' }}
                >
                    Save
                </Button>
            </div>
            <Alert isOpen={saved} toggle={() => setSaved(!saved)} color="info">
                Your changes were saved!
            </Alert>

            {error && <p>{error}</p>}

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div>
                    <Label style={{ display: 'block' }}>Profile picture</Label>
                    {url && (
                        <img
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            src={url}
                            alt=""
                        />
                    )}
                    <Input
                        type="file"
                        onChange={(e) =>
                            handleImageChange(e?.target?.files ? e?.target?.files[0] : null)
                        }
                    />
                    {file && (
                        <Button size="sm" onClick={uploadImage}>
                            Save image{' '}
                        </Button>
                    )}
                    {file && progress > 0 && progress < 100 && <p>{`${progress}% uploaded`}</p>}
                </div>

                <div>
                    <Label>Username</Label>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
            </div>
            <div>
                <Label>{`Something about you <3`}</Label>
                <Input
                    type="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
        </div>
    );
};

export default ProfileEdit;
