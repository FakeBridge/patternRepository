import React, { useContext } from 'react';
import { Button } from 'reactstrap';
import { UserContext } from '../../logic/providers/userProvider';
import { pattern as patternType } from '../../logic/types';

interface PropsType {
    openEdit: (open: boolean) => void;
    closeModal: () => void;
    currentPattern: patternType | null;
}

const ViewPattern: React.FC<PropsType> = React.memo(({ openEdit, closeModal, currentPattern }) => {
    const { user } = useContext(UserContext);

    const handleClose = () => {
        closeModal();
    };

    return (
        <div style={{}}>
            {currentPattern?.owner === user?.uid && (
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

            <h1>{currentPattern ? currentPattern.title : 'Untitled'}</h1>

            <h3>Tags</h3>

            <h3>{currentPattern?.difficulty}</h3>

            <h3>Books</h3>

            <h3>Description</h3>
            <div
                dangerouslySetInnerHTML={{
                    __html: currentPattern?.description ? currentPattern.description : '',
                }}
            />

            <h2 style={{ display: 'block' }}>Pattern pictures</h2>
            <>
                {currentPattern?.patternImages.map((picture) => (
                    <img
                        key={picture.name}
                        src={picture.url}
                        alt={picture.name}
                        width="100px"
                        height="100px"
                    />
                ))}
            </>

            <h2 style={{ display: 'block' }}>Finished works</h2>
            <>
                {currentPattern?.finishedWorkImages.map((picture) => (
                    <img
                        key={picture.name}
                        src={picture.url}
                        alt={picture.name}
                        width="100px"
                        height="100px"
                    />
                ))}
            </>

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Button color="info" onClick={handleClose}>
                    Cancel
                </Button>
            </div>
        </div>
    );
});

ViewPattern.displayName = 'ViewPattern';

export default ViewPattern;
