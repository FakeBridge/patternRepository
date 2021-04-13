import React, { useState, useEffect } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import Select from 'react-select';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { storage } from '../../logic/firebase';
import PatternService from '../../logic/services/patternServices';
import TagService from '../../logic/services/tagServices';

import { pattern, patternToAdd, basicImage, tag as tagType, tagToAdd } from '../../logic/types';

interface PropsType {
    openEdit: (open: boolean) => void;
    closeModal: () => void;
    currentPattern: pattern;
}

const EditPattern: React.FC<PropsType> = React.memo(({ openEdit, closeModal, currentPattern }) => {
    const [title, setTitle] = useState<string>(currentPattern.title ? currentPattern.title : '');
    const [tags, setTags] = useState<tagType[]>([]);
    const [allTags, setAllTags] = useState<tagType[]>([]);
    const [newTag, setNewTag] = useState<string>('');
    const [description, setDescription] = useState<string>(
        currentPattern.description ? currentPattern.description : '',
    );
    const [difficulty, setDifficulty] = useState<number>(
        currentPattern.difficulty ? currentPattern.difficulty : 3,
    );

    const [patternImages, setPatternImages] = useState<basicImage[]>(
        currentPattern.patternImages ? currentPattern.patternImages : [],
    );
    const [finishedWorkImages, setFinishedWorkImages] = useState<basicImage[]>(
        currentPattern.finishedWorkImages ? currentPattern.finishedWorkImages : [],
    );

    const [newPatternImages, setNewPatternImages] = useState<basicImage[]>([]);
    const [newFinishedWorkImages, setNewFinishedWorkImages] = useState<basicImage[]>([]);

    const [error, setError] = useState<string | null>(null);

    const imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    const { id } = currentPattern;

    const onTagDataChange = (items: any) => {
        let loadedTags: tagType[] = [];
        loadedTags = [];

        items.docs.forEach((item: any) => {
            const { id: tagId } = item;
            const data = item.data();

            loadedTags.push({
                id: tagId,
                label: data.label,
                value: tagId,
            });
        });

        setAllTags(loadedTags);
    };

    useEffect(() => {
        const unsubscribe = TagService.getAll().orderBy('label', 'asc').onSnapshot(onTagDataChange);

        return () => unsubscribe();
    }, []);

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
                        async () => {
                            const downloadUrl = await storageRef.getDownloadURL();
                            setNewPatternImages([
                                ...newPatternImages,
                                { name: selectedFile.name, url: downloadUrl },
                            ]);
                        },
                    );
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
                        async () => {
                            const downloadUrl = await storageRef.getDownloadURL();
                            setNewFinishedWorkImages([
                                ...newFinishedWorkImages,
                                { name: selectedFile.name, url: downloadUrl },
                            ]);
                        },
                    );
                }
            } else {
                setError('Please use only select an image file (png or jpg)');
            }
        }
    };

    const removePaternPicture = (index: number) => {
        if (index < patternImages.length) {
            const newPictures: basicImage[] = [...patternImages.filter((_, i) => i !== index)];
            const fileToRemove: basicImage = patternImages[index];
            const storageRef = storage.ref(`patternImages/${id}/${fileToRemove.name}`);
            storageRef
                .delete()
                .then(() => {
                    setPatternImages(newPictures);
                })
                .catch((err) => {
                    setError(err.message);
                });
        } else {
            const newPictures: basicImage[] = [...newPatternImages.filter((_, i) => i !== index)];
            const fileToRemove: basicImage = newPatternImages[index];
            const storageRef = storage.ref(`patternImages/${id}/${fileToRemove.name}`);
            storageRef
                .delete()
                .then(() => {
                    setNewPatternImages(newPictures);
                })
                .catch((err) => {
                    setError(err.message);
                });
        }
    };

    const removeWorkPicture = (index: number) => {
        if (index < finishedWorkImages.length) {
            const newPictures: basicImage[] = [...finishedWorkImages.filter((_, i) => i !== index)];
            const fileToRemove: basicImage = finishedWorkImages[index];
            const storageRef = storage.ref(`finishedWorkImages/${id}/${fileToRemove.name}`);
            storageRef
                .delete()
                .then(() => {
                    setFinishedWorkImages(newPictures);
                })
                .catch((err) => {
                    setError(err.message);
                });
        } else {
            const newPictures: basicImage[] = [
                ...newFinishedWorkImages.filter((_, i) => i !== index),
            ];
            const fileToRemove: basicImage = newFinishedWorkImages[index];
            const storageRef = storage.ref(`finishedWorkImages/${id}/${fileToRemove.name}`);
            storageRef
                .delete()
                .then(() => {
                    setNewFinishedWorkImages(newPictures);
                })
                .catch((err) => {
                    setError(err.message);
                });
        }
    };

    const handleSubmit = () => {
        const data: patternToAdd = {
            title,
            description,
            difficulty,
            patternImages: [...patternImages, ...newPatternImages],
            finishedWorkImages: [...finishedWorkImages, ...newFinishedWorkImages],
            tags: tags.map((t) => t.id),
        };

        PatternService.update(id, data)
            .then(() => {
                closeModal();
            })
            .catch((e) => {
                setError(e?.message);
            });
    };

    const handleTagAddition = () => {
        if (newTag) {
            const data: tagToAdd = {
                label: newTag,
            };

            const tagId = (new Date().getTime() / 1000).toFixed(0).toString();

            TagService.set(`${tagId}`, data)
                .then(() => {
                    setAllTags([...allTags, { id: tagId, value: tagId, label: newTag }]);
                    setTags([...tags, { id: tagId, value: tagId, label: newTag }]);
                    setNewTag('');
                })
                .catch((e) => {
                    setError(e?.message);
                });
        }
    };

    const handleCancel = () => {
        let newError = 'Errors:';
        newError = '';
        newPatternImages.forEach((picture) => {
            storage
                .ref(`patternImages/${id}/${picture.name}`)
                .delete()
                .catch((err: Error) => {
                    newError.concat(err.message);
                });
        });
        newFinishedWorkImages.forEach((picture) => {
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
                    onChange={(e) => setTitle(e.target.value ? e.target.value.toString() : '')}
                />
            </FormGroup>

            <FormGroup>
                <Label for="tags">Tags</Label>
                <Select
                    options={allTags}
                    value={tags}
                    isMulti
                    backspaceRemovesValue
                    inputValue={newTag}
                    onKeyDown={(e) => {
                        const enterKeyCode = 13;
                        if (e.keyCode === enterKeyCode) {
                            handleTagAddition();
                        }
                    }}
                    onInputChange={(e) => {
                        setNewTag(e);
                    }}
                    onChange={(e) => {
                        setTags([...e]);
                    }}
                />
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
                    onChange={(e) => setDifficulty(parseInt(e.target.value, 10))}
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
                <CKEditor
                    editor={ClassicEditor}
                    data={description}
                    onChange={(event: any, editor: any) => {
                        setDescription(editor.getData());
                    }}
                />
            </FormGroup>

            <FormGroup>
                <Label for="description" style={{ display: 'block' }}>
                    Pattern pictures
                </Label>
                <>
                    {patternImages.map((picture: basicImage, index) => (
                        <div key={picture.name}>
                            <Label>{picture.name}</Label>
                            <img src={picture.url} alt="pattern" width="100px" height="100px" />
                            <Button color="danger" onClick={() => removePaternPicture(index)}>
                                x
                            </Button>
                        </div>
                    ))}
                    {newPatternImages.map((picture: basicImage, index) => (
                        <div key={picture.name}>
                            <Label>{picture.name}</Label>
                            <img src={picture.url} alt="pattern" width="100px" height="100px" />
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
                </>
            </FormGroup>

            <FormGroup>
                <Label for="description" style={{ display: 'block' }}>
                    Finished works
                </Label>
                <>
                    {finishedWorkImages.map((picture, index) => (
                        <div key={picture.name}>
                            <Label>{picture.name}</Label>
                            <img
                                src={picture.url}
                                alt="finishedWork"
                                width="100px"
                                height="100px"
                            />
                            <Button color="danger" onClick={() => removeWorkPicture(index)}>
                                x
                            </Button>
                        </div>
                    ))}
                    {newFinishedWorkImages.map((picture, index) => (
                        <div key={picture.name}>
                            <Label>{picture.name}</Label>
                            <img
                                src={picture.url}
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
});

EditPattern.displayName = 'EditPattern';

export default EditPattern;
