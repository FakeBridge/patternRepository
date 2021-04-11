import React, { useState, useContext } from 'react';
import { Button, Label } from 'reactstrap';
import { UserContext } from '../../logic/providers/userProvider';
import { pattern as patternType } from '../../logic/types';

interface PropsType {
    openEdit: (open: boolean) => void;
    closeModal: () => void;
}

const ViewPattern: React.FC<PropsType> = ({ openEdit, closeModal }) => {
    const { user } = useContext(UserContext);

    const [pattern] = useState<patternType | null>(null);

    const handleClose = () => {
        closeModal();
    };

    return (
        <div style={{}}>
            {pattern?.owner === user?.uid && (
                <p>
                    This is how other users see this patterns. Click{' '}
                    <Button
                        onClick={() => openEdit(true)}
                        color="link"
                        style={{ padding: '0', lineHeight: '1em' }}
                    >
                        here
                    </Button>{' '}
                    to edit.
                </p>
            )}

            <Label for="title">Title</Label>

            <Label for="tags">Tags</Label>

            <Label for="difficulty">Difficulty</Label>

            <Label for="books">Books</Label>

            <Label for="description">Description</Label>

            <Label for="description" style={{ display: 'block' }}>
                Pattern pictures
            </Label>
            <>
                {/* pattern.patternImages.map((picture, index) => (
                        <div key={picture.name}>
                            <Label>{picture.name}</Label>
                            <Button color="danger" onClick={() => removePaternPicture(index)}>
                                x
                            </Button>
                        </div>
                    )) */}
            </>

            <Label for="description" style={{ display: 'block' }}>
                Finished works
            </Label>
            <>
                {/* finishedWorkPictures.map((picture, index) => (
                        <div key={picture.name}>
                            <Label>{picture.name}</Label>
                            <Button color="danger" onClick={() => removeWorkPicture(index)}>
                                x
                            </Button>
                        </div>
                    )) */}
            </>

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Button color="info" onClick={handleClose}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default ViewPattern;
