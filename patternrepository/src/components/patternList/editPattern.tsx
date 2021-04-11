import React, { useState, useMemo } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';

import { storage } from '../../logic/firebase';

interface PropsType {
    openEdit: (open: boolean) => void;
}

const EditPattern: React.FC<PropsType> = ({ openEdit }) => {
    const [title, setTitle] = useState<string | number | readonly string[] | undefined>('');
    const [tags, setTags] = useState<any>([]);
    const [description, setDescription] = useState<string | number | readonly string[] | undefined>(
        '',
    );
    const [difficulty, setDifficulty] = useState<string | number | readonly string[] | undefined>(
        3,
    );

    const [newOpen, setNewOpen] = useState<boolean>(false);

    const [patternPictures, setPatternPictures] = useState<File[]>([]);
    const [finishedWorkPictures, setFinishedWorkPictures] = useState<File[]>([]);

    const [error, setError] = useState<string | null>(null);

    const imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    const id = useMemo(
        () =>
            `${newOpen ? 'y' : ''}${(new Date().getTime() / 1000).toFixed(0)}${new Array(5)
                .join()
                .replace(/(.|$)/g, function () {
                    return (Math.random() * 36)
                        .toString(36)
                        [Math.random() < 0.5 ? 'toString' : 'toUpperCase']();
                })}`,
        [newOpen],
    );

    const HandlePatternImageChange = (selectedFile: File | null) => {
        if (selectedFile) {
            if (imageTypes.includes(selectedFile.type)) {
                const maxAllowSize = 5 * 1024 * 1024;
                if (selectedFile.size > maxAllowSize) {
                    setError('Image is too big! Maximum size is 5MB.');
                } else {
                    const storageRef = storage.ref(`patternImages/${id}/${selectedFile.name}`);

                    storageRef.put(selectedFile).on(
                        'state_changed',
                        () => {},
                        (err) => {
                            setError(err.message);
                        },
                    );
                    setPatternPictures([...patternPictures, selectedFile]);
                }
            } else {
                setError('Please use only select an image file (png or jpg)');
            }
        }
    };

    const HandleWorkImageChange = (selectedFile: File | null) => {
        if (selectedFile) {
            if (imageTypes.includes(selectedFile.type)) {
                const maxAllowSize = 5 * 1024 * 1024;
                if (selectedFile.size > maxAllowSize) {
                    setError('Image is too big! Maximum size is 5MB.');
                } else {
                    const storageRef = storage.ref(`finishedWorkImages/${id}/${selectedFile.name}`);

                    storageRef.put(selectedFile).on(
                        'state_changed',
                        () => {},
                        (err) => {
                            setError(err.message);
                        },
                    );

                    setFinishedWorkPictures([...finishedWorkPictures, selectedFile]);
                }
            } else {
                setError('Please use only select an image file (png or jpg)');
            }
        }
    };

    const removePaternPicture = (index: number) => {
        const newPictures: File[] = [...patternPictures.filter((_, i) => i !== index)];
        const fileToRemove: File = patternPictures[index];
        const storageRef = storage.ref(`patternImages/${id}/${fileToRemove.name}`);
        storageRef
            .delete()
            .then(() => {
                setPatternPictures(newPictures);
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    const removeWorkPicture = (index: number) => {
        const newPictures: File[] = [...finishedWorkPictures.filter((_, i) => i !== index)];
        const fileToRemove: File = finishedWorkPictures[index];
        const storageRef = storage.ref(`finishedWorkImages/${id}/${fileToRemove.name}`);
        storageRef
            .delete()
            .then(() => {
                setFinishedWorkPictures(newPictures);
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    const handleSubmit = () => {};

    const handleCancel = () => {
        let newError = 'Errors:';
        newError = '';
        patternPictures.forEach((picture) => {
            storage
                .ref(`patternImages/${id}/${picture.name}`)
                .delete()
                .catch((err: Error) => {
                    newError.concat(err.message);
                });
        });
        finishedWorkPictures.forEach((picture) => {
            storage
                .ref(`finishedWorkImages/${id}/${picture.name}`)
                .delete()
                .catch((err: Error) => {
                    newError.concat(err.message);
                });
        });
        if (newError.length) {
            setError(newError);
        } else {
            setNewOpen(true);
            openEdit(false);
        }
    };

    return (
        <div style={{}}>
            <h1>Edit this pattern</h1>

            <FormGroup>
                <Label for="title">Title</Label>
                <Input
                    name="patternTitle"
                    id="title"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <Label for="tags">Tags</Label>
                <Input
                    type="select"
                    multiple
                    name="patternTags"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                >
                    <option>Tag 1</option>
                    <option>Tag 2 </option>
                    <option>Tag 3</option>
                </Input>
            </FormGroup>

            <FormGroup>
                <Label for="difficulty">Difficulty</Label>
                <Input
                    type="range"
                    id="difficulty"
                    name="patternDifficulty"
                    min={1}
                    max={5}
                    step={1}
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                />
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <Label for="description" style={{ display: 'block' }}>
                    Pattern pictures
                </Label>
                <>
                    {patternPictures.map((picture, index) => (
                        <div key={picture.name}>
                            <Label>{picture.name}</Label>
                            <img src={picture.name} alt="pattern" width="100px" height="100px" />
                            <Button color="danger" onClick={() => removePaternPicture(index)}>
                                x
                            </Button>
                        </div>
                    ))}
                    <Input
                        type="file"
                        onChange={(e) =>
                            HandlePatternImageChange(e?.target?.files ? e?.target?.files[0] : null)
                        }
                    />
                    <Button color="info" onClick={() => {}}>
                        +
                    </Button>
                </>
            </FormGroup>

            <FormGroup>
                <Label for="description" style={{ display: 'block' }}>
                    Finished works
                </Label>
                <>
                    {finishedWorkPictures.map((picture, index) => (
                        <div key={picture.name}>
                            <Label>{picture.name}</Label>
                            <img
                                src={picture.name}
                                alt="finishedWork"
                                width="100px"
                                height="100px"
                            />
                            <Button color="danger" onClick={() => removeWorkPicture(index)}>
                                x
                            </Button>
                        </div>
                    ))}
                    <Input
                        type="file"
                        onChange={(e) =>
                            HandleWorkImageChange(e?.target?.files ? e?.target?.files[0] : null)
                        }
                    />
                    <Button color="info" onClick={() => {}}>
                        +
                    </Button>
                </>
            </FormGroup>

            {error && <p>{error}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Button color="info" onClick={handleCancel}>
                    Cancel
                </Button>

                <Button color="info" style={{ marginLeft: 'auto' }} onClick={handleSubmit}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default EditPattern;
