import React, { useState } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';

//  import useStorage from '../../logic/hooks/useStorage';

// import { imageTypes } from '../../logic/types';

interface PropsType {
    closeModal: () => void;
}

const PatternList: React.FC<PropsType> = ({ closeModal }) => {
    const [patternPictures, setPatternPictures] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    const handleImageChange = (selectedFile: File | null) => {
        if (selectedFile) {
            if (imageTypes.includes(selectedFile.type)) {
                const maxAllowSize = 5 * 1024 * 1024;
                if (selectedFile.size > maxAllowSize) {
                    setError('Image is too big! Maximum size is 5MB.');
                } else {
                    setError(null);
                    setPatternPictures([...patternPictures, selectedFile]);
                    console.log(selectedFile);
                }
            } else {
                setError('Please use only select an image file (png or jpg)');
            }
        }
    };

    //  const { url } = useStorage(file);

    return (
        <div style={{}}>
            <h1>Add a new pattern</h1>

            <FormGroup>
                <Label for="title">Title</Label>
                <Input name="patternTitle" id="title" placeholder="Enter title" />
            </FormGroup>

            <FormGroup>
                <Label for="tags">Tags</Label>
                <Input type="select" multiple name="patternTags" id="tags">
                    <option>Tag 1</option>
                    <option>Tag 2 </option>
                    <option>Tag 3</option>
                </Input>
            </FormGroup>

            <FormGroup>
                <Label for="difficulty">Difficulty</Label>
                <Input type="range" id="difficulty" name="patternDifficulty" />
            </FormGroup>

            <FormGroup>
                <Label for="books">Add to...</Label>
                <Input type="select" multiple name="patternBooks" id="books">
                    <option>Book 1</option>
                    <option>Book 2 </option>
                    <option>Book 3</option>
                </Input>
            </FormGroup>

            <FormGroup>
                <Label for="description">Description</Label>
                <Input
                    type="textarea"
                    name="patternDescription"
                    id="description"
                    placeholder="Enter description"
                />
            </FormGroup>

            <FormGroup>
                <Label for="description">Pattern pictures</Label>
                {patternPictures.map((picture) => (
                    <img
                        key={picture.name}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        src={picture.name}
                        alt=""
                    />
                ))}
                <Input
                    type="file"
                    onChange={(e) =>
                        handleImageChange(e?.target?.files ? e?.target?.files[0] : null)
                    }
                />
                <Button color="info" onClick={() => {}}>
                    +
                </Button>
            </FormGroup>

            {error && <p>{error}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Button color="info" onClick={closeModal}>
                    Cancel
                </Button>

                <Button color="info" style={{ marginLeft: 'auto' }} onClick={() => {}}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default PatternList;
