import React, { useContext, useState, useEffect } from 'react';

import { UserContext } from '../../logic/providers/userProvider';

import useStorage from '../../logic/hooks/useStorage';

import { firestore } from '../../logic/firebase';

import {
    Main,
    FormGroup,
    Input,
    Label,
    MarginItemDetail,
    ButtonRow,
    SuccessButton,
    CancelButton,
    DangerAlert,
    SuccessAlert,
} from '../../design/styledComponents';

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
        <Main>
            <MarginItemDetail>
                <ButtonRow>
                    <CancelButton onClick={() => openEdit(false)} block={false}>
                        Cancel
                    </CancelButton>

                    <SuccessButton onClick={() => updateData()} block={false}>
                        Save
                    </SuccessButton>
                </ButtonRow>

                {saved && <SuccessAlert>Your changes were saved!</SuccessAlert>}

                {error && <DangerAlert>{error}</DangerAlert>}

                <FormGroup>
                    <Label>Profile picture</Label>
                    {url && (
                        <img
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            src={url}
                            alt=""
                        />
                    )}
                    <Input
                        block
                        type="file"
                        onChange={(e) =>
                            handleImageChange(e?.target?.files ? e?.target?.files[0] : null)
                        }
                    />
                    {file && (
                        <SuccessButton
                            block={false}
                            onClick={() => uploadImage('avatars', user?.uid ? user.uid : '')}
                        >
                            Save image{' '}
                        </SuccessButton>
                    )}
                    {file && progress > 0 && progress < 100 && <p>{`${progress}% uploaded`}</p>}
                </FormGroup>

                <FormGroup>
                    <Label>Username</Label>
                    <Input block value={username} onChange={(e) => setUsername(e.target.value)} />
                </FormGroup>

                <FormGroup>
                    <Label>{`Something about you <3`}</Label>
                    <Input
                        block
                        type="textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormGroup>
            </MarginItemDetail>
        </Main>
    );
};

export default ProfileEdit;
