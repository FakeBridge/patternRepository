import React, { useContext, useState, useEffect, useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { storage, firestore } from '../../logic/firebase';

import { UserContext } from '../../logic/providers/userProvider';

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

const imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

interface PropsType {
    openEdit: (open: boolean) => void;
}

const ProfileEdit: React.FC<PropsType> = ({ openEdit }) => {
    const { user } = useContext(UserContext);

    const [username, setUsername] = useState('');
    const [description, setDescription] = useState('');
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState<boolean>(false);

    useEffect(() => {
        let name = '';
        let descriptionText = '';
        if (user && user.username) {
            name = user.username;
        }
        if (user && user.description) {
            descriptionText = user.description;
        }
        setUsername(name);
        setDescription(descriptionText);
    }, [user]);

    const handleImageChange = useCallback(
        (selectedFile: File | null) => {
            if (selectedFile) {
                if (imageTypes.includes(selectedFile.type)) {
                    const maxAllowSize = 5 * 1024 * 1024;
                    if (selectedFile.size > maxAllowSize) {
                        setError('Image is too big! Maximum size is 5MB.');
                    } else {
                        const storageRef = storage.ref(`avatars/${user?.uid}`);

                        storageRef.put(selectedFile).on(
                            'state_changed',
                            () => {},
                            (err) => {
                                setError(err.message);
                            },
                            async () => {
                                const downloadUrl = await storageRef.getDownloadURL();
                                setFileUrl(downloadUrl);
                            },
                        );
                    }
                } else {
                    setError('Please use only select an image file (png or jpg)');
                }
            }
        },
        [user?.uid],
    );

    const updateData = () => {
        firestore
            .collection(`users`)
            .doc(`${user?.uid}`)
            .update({
                username,
                description,
                avatar: fileUrl,
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
                        Close
                    </CancelButton>

                    <SuccessButton onClick={() => updateData()} block={false}>
                        Save
                    </SuccessButton>
                </ButtonRow>

                {saved && <SuccessAlert>Your changes were saved!</SuccessAlert>}

                {error && <DangerAlert>{error}</DangerAlert>}

                <FormGroup>
                    <Label>Profile picture</Label>
                    {fileUrl && (
                        <img
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            src={fileUrl}
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
                </FormGroup>

                <FormGroup>
                    <Label>Username</Label>
                    <Input block value={username} onChange={(e) => setUsername(e.target.value)} />
                </FormGroup>

                <FormGroup>
                    <Label>{`Something about you <3`}</Label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={description}
                        onChange={(event: any, editor: any) => {
                            setDescription(editor.getData());
                        }}
                    />
                </FormGroup>
            </MarginItemDetail>
        </Main>
    );
};

export default ProfileEdit;
