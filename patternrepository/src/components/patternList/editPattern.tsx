import React, { useState, useCallback, useContext, useMemo } from 'react';
import Select from 'react-select';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { storage } from '../../logic/firebase';
import PatternService from '../../logic/services/patternServices';
import { TagContext } from '../../logic/providers/tagProvider';
import { BookContext } from '../../logic/providers/bookProvider';
import TagService from '../../logic/services/tagServices';

import {
    pattern,
    patternToAdd,
    basicImage,
    tag as tagType,
    tagToAdd,
    book,
} from '../../logic/types';

import multiSelectWithColour from '../../design/selectStyles';

import {
    FormGroup,
    Input,
    Label,
    ItemDetail,
    ItemHeader,
    ButtonRow,
    SuccessButton,
    CancelButton,
    DifficultyInput,
    FormImageContainer,
    IconButton,
    DangerAlert,
    InvisibleIconButton,
} from '../../design/styledComponents';

interface PropsType {
    openEdit: (open: boolean) => void;
    closeModal: () => void;
    currentPattern: pattern;
}
const imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

const EditPattern: React.FC<PropsType> = React.memo(({ openEdit, closeModal, currentPattern }) => {
    const { allTags } = useContext(TagContext);
    const { allBooks } = useContext(BookContext);

    const [title, setTitle] = useState<string>(currentPattern.title ? currentPattern.title : '');
    const [tags, setTags] = useState<tagType[]>(currentPattern.tags ? currentPattern.tags : []);
    const [books, setBooks] = useState<book[]>(currentPattern.books ? currentPattern.books : []);
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

    const { id } = currentPattern;

    const allPossibleBooks = useMemo(
        () =>
            allBooks.filter(
                (possibleBook) => possibleBook.owner === currentPattern.owner?.username,
            ),
        [allBooks, currentPattern.owner],
    );

    const HandlePatternImageChange = useCallback(
        (selectedFile: File | null) => {
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
        },
        [id, newPatternImages],
    );

    const HandleWorkImageChange = useCallback(
        (selectedFile: File | null) => {
            if (selectedFile) {
                if (imageTypes.includes(selectedFile.type)) {
                    const maxAllowSize = 5 * 1024 * 1024;
                    if (selectedFile.size > maxAllowSize) {
                        setError('Image is too big! Maximum size is 5MB.');
                    } else {
                        const storageRef = storage.ref(
                            `finishedWorkImages/${id}/${selectedFile.name}`,
                        );

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
        },
        [id, newFinishedWorkImages],
    );

    const removePaternPicture = useCallback(
        (index: number) => {
            if (index < patternImages.length) {
                const newPictures: basicImage[] = [...patternImages.filter((_, i) => i !== index)];
                setPatternImages(newPictures);

                // TODO: check if not other patterns are using this picture;
                /*    const fileToRemove: basicImage = patternImages[index];
                const storageRef = storage.ref(`patternImages/${id}/${fileToRemove.name}`);
                storageRef
                    .delete()
                    .then(() => {
                         })
                    .catch((err) => {
                        setError(err.message);
                    }); */
            } else {
                const newPictures: basicImage[] = [
                    ...newPatternImages.filter((_, i) => i !== index),
                ];
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
        },
        [id, newPatternImages, patternImages],
    );

    const removeWorkPicture = useCallback(
        (index: number) => {
            if (index < finishedWorkImages.length) {
                const newPictures: basicImage[] = [
                    ...finishedWorkImages.filter((_, i) => i !== index),
                ];
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
        },
        [finishedWorkImages, id, newFinishedWorkImages],
    );

    const handleSubmit = useCallback(() => {
        const data: patternToAdd = {
            title,
            description,
            difficulty,
            patternImages: [...patternImages, ...newPatternImages],
            finishedWorkImages: [...finishedWorkImages, ...newFinishedWorkImages],
            tags: tags.map((t) => t.id),
            books: books.map((b) => b.id),
        };

        PatternService.update(id, data)
            .then(() => {
                closeModal();
            })
            .catch((e) => {
                setError(e?.message);
            });
    }, [
        closeModal,
        description,
        difficulty,
        finishedWorkImages,
        id,
        newFinishedWorkImages,
        newPatternImages,
        patternImages,
        tags,
        books,
        title,
    ]);

    const handleTagAddition = useCallback(() => {
        if (newTag) {
            const data: tagToAdd = {
                label: newTag,
            };

            const tagId = (new Date().getTime() / 1000).toFixed(0).toString();

            TagService.set(`${tagId}`, data)
                .then(() => {
                    setTags([...tags, { id: tagId, value: tagId, label: newTag }]);
                    setNewTag('');
                })
                .catch((e) => {
                    setError(e?.message);
                });
        }
    }, [newTag, tags]);

    const handleCancel = useCallback(() => {
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
    }, [id, newFinishedWorkImages, newPatternImages, openEdit]);

    const remove = useCallback(() => {
        if (window.confirm('Are you sure you want to delete this pattern?')) {
            PatternService.remove(id);
            closeModal();
        }
    }, [id, closeModal]);

    return (
        <ItemDetail>
            <ItemHeader>
                Edit this pattern{' '}
                <InvisibleIconButton style={{ fontSize: '1em' }} red onClick={remove}>
                    <FontAwesomeIcon icon={['fas', 'trash']} />
                </InvisibleIconButton>
            </ItemHeader>

            <FormGroup>
                <Label>Title</Label>
                <Input
                    block
                    name="patternTitle"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value ? e.target.value.toString() : '')}
                />
            </FormGroup>

            <FormGroup>
                <Label>Tags</Label>
                <Select
                    options={allTags}
                    value={tags}
                    isMulti
                    backspaceRemovesValue
                    inputValue={newTag}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleTagAddition();
                            e.preventDefault();
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
                <Label>Difficulty</Label>
                <DifficultyInput
                    block
                    type="range"
                    name="patternDifficulty"
                    min={1}
                    max={5}
                    step={1}
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value, 10))}
                />
            </FormGroup>

            <FormGroup>
                <Label>Books</Label>
                <Select
                    styles={multiSelectWithColour}
                    options={allPossibleBooks}
                    value={books}
                    isMulti
                    onChange={(e) => {
                        setBooks([...e]);
                    }}
                />
            </FormGroup>

            <FormGroup>
                <Label>Description</Label>
                <CKEditor
                    editor={ClassicEditor}
                    data={description}
                    onChange={(event: any, editor: any) => {
                        setDescription(editor.getData());
                    }}
                />
            </FormGroup>

            <FormGroup>
                <Label>Pattern pictures</Label>
                <>
                    {patternImages.map((picture: basicImage, index) => (
                        <FormImageContainer key={picture.name}>
                            <IconButton onClick={() => removePaternPicture(index)}>
                                <FontAwesomeIcon icon={['fas', 'trash']} />
                            </IconButton>
                            <img src={picture.url} alt="pattern" />
                        </FormImageContainer>
                    ))}
                    {newPatternImages.map((picture: basicImage, index) => (
                        <FormImageContainer key={picture.name}>
                            <IconButton onClick={() => removePaternPicture(index)}>
                                <FontAwesomeIcon icon={['fas', 'trash']} />
                            </IconButton>
                            <img src={picture.url} alt="pattern" />
                        </FormImageContainer>
                    ))}
                    <Input
                        block
                        type="file"
                        onChange={(e) =>
                            HandlePatternImageChange(e?.target?.files ? e?.target?.files[0] : null)
                        }
                    />
                </>
            </FormGroup>

            <FormGroup>
                <Label>Finished works</Label>
                <>
                    {finishedWorkImages.map((picture, index) => (
                        <FormImageContainer key={picture.name}>
                            <IconButton onClick={() => removeWorkPicture(index)}>
                                <FontAwesomeIcon icon={['fas', 'trash']} />
                            </IconButton>
                            <img src={picture.url} alt="finishedWork" />
                        </FormImageContainer>
                    ))}
                    {newFinishedWorkImages.map((picture, index) => (
                        <FormImageContainer key={picture.name}>
                            <IconButton onClick={() => removeWorkPicture(index)}>
                                <FontAwesomeIcon icon={['fas', 'trash']} />
                            </IconButton>
                            <img src={picture.url} alt="finishedWork" />
                        </FormImageContainer>
                    ))}
                    <Input
                        block
                        type="file"
                        onChange={(e) =>
                            HandleWorkImageChange(e?.target?.files ? e?.target?.files[0] : null)
                        }
                    />
                </>
            </FormGroup>

            {error && <DangerAlert>{error}</DangerAlert>}
            <ButtonRow>
                <CancelButton block={false} onClick={handleCancel}>
                    Cancel
                </CancelButton>

                <SuccessButton block={false} onClick={handleSubmit}>
                    Save
                </SuccessButton>
            </ButtonRow>
        </ItemDetail>
    );
});

EditPattern.displayName = 'EditPattern';

export default EditPattern;
