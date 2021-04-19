import React, { useState, useMemo, useContext, useCallback, useEffect } from 'react';
import Select from 'react-select';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { UserContext } from '../../logic/providers/userProvider';
import { TagContext } from '../../logic/providers/tagProvider';
import { BookContext } from '../../logic/providers/bookProvider';
import { storage } from '../../logic/firebase';
import PatternService from '../../logic/services/patternServices';
import TagService from '../../logic/services/tagServices';

import {
    patternToAdd,
    fileWithUrl,
    basicImage,
    tag,
    book,
    tagToAdd,
    pattern,
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
} from '../../design/styledComponents';

interface PropsType {
    closeModal: () => void;
    copyPattern: pattern | null;
}

const imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

const AddPattern: React.FC<PropsType> = React.memo(({ closeModal, copyPattern }) => {
    const { user } = useContext(UserContext);
    const { allTags } = useContext(TagContext);
    const { allBooks } = useContext(BookContext);

    const [title, setTitle] = useState<string>('');
    const [tags, setTags] = useState<tag[]>([]);
    const [books, setBooks] = useState<book[]>([]);
    const [newTag, setNewTag] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [difficulty, setDifficulty] = useState<number>(3);

    const [newOpen, setNewOpen] = useState<boolean>(false);

    const [copiedPatternPictures, setCopiedPatternPictures] = useState<basicImage[]>([]);
    const [patternPictures, setPatternPictures] = useState<fileWithUrl[]>([]);
    const [finishedWorkPictures, setFinishedWorkPictures] = useState<fileWithUrl[]>([]);

    const [error, setError] = useState<string | null>(null);

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

    const allPossibleBooks = useMemo(
        () => allBooks.filter((possibleBook) => possibleBook.owner === user?.uid),
        [allBooks, user?.uid],
    );

    useEffect(() => {
        if (copyPattern) {
            setTitle(copyPattern?.title ? copyPattern.title : 'Untitled pattern');
            setTags(copyPattern.tags);
            setDescription(copyPattern?.description ? copyPattern.description : '');
            setCopiedPatternPictures(copyPattern.patternImages);
        }
    }, [copyPattern]);

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
                                setPatternPictures([
                                    ...patternPictures,
                                    { file: selectedFile, url: downloadUrl },
                                ]);
                            },
                        );
                    }
                } else {
                    setError('Please use only select an image file (png or jpg)');
                }
            }
        },
        [id, patternPictures],
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
                                setFinishedWorkPictures([
                                    ...finishedWorkPictures,
                                    { file: selectedFile, url: downloadUrl },
                                ]);
                            },
                        );
                    }
                } else {
                    setError('Please use only select an image file (png or jpg)');
                }
            }
        },
        [id, finishedWorkPictures],
    );

    const removeCopiedPaternPicture = useCallback(
        (index: number) => {
            const newPictures: basicImage[] = [
                ...copiedPatternPictures.filter((_, i) => i !== index),
            ];
            setCopiedPatternPictures(newPictures);
        },
        [copiedPatternPictures],
    );

    const removePaternPicture = useCallback(
        (index: number) => {
            const newPictures: fileWithUrl[] = [
                ...patternPictures.filter((picture, i) => i !== index),
            ];
            const fileToRemove: fileWithUrl = patternPictures[index];
            const storageRef = storage.ref(`patternImages/${id}/${fileToRemove.file.name}`);
            storageRef
                .delete()
                .then(() => {
                    setPatternPictures(newPictures);
                })
                .catch((err) => {
                    setError(err.message);
                });
        },
        [id, patternPictures],
    );

    const removeWorkPicture = useCallback(
        (index: number) => {
            const newPictures: fileWithUrl[] = [
                ...finishedWorkPictures.filter((_, i) => i !== index),
            ];
            const fileToRemove: fileWithUrl = finishedWorkPictures[index];
            const storageRef = storage.ref(`finishedWorkImages/${id}/${fileToRemove.file.name}`);
            storageRef
                .delete()
                .then(() => {
                    setFinishedWorkPictures(newPictures);
                })
                .catch((err) => {
                    setError(err.message);
                });
        },
        [id, finishedWorkPictures],
    );

    const handleSubmit = useCallback(() => {
        const data: patternToAdd = {
            title,
            description,
            difficulty,
            patternImages: patternPictures.map((picture) => ({
                name: picture.file.name,
                url: picture.url,
            })),
            finishedWorkImages: finishedWorkPictures.map((picture) => ({
                name: picture.file.name,
                url: picture.url,
            })),
            owner: user?.uid ? user.uid : null,
            tags: tags.map((t) => t.id),
            books: books.map((b) => b.id),
        };

        PatternService.set(id, data)
            .then(() => {
                setNewOpen(true);
                closeModal();
            })
            .catch((e) => {
                setError(e?.message);
            });
    }, [
        closeModal,
        description,
        difficulty,
        finishedWorkPictures,
        id,
        patternPictures,
        tags,
        title,
        books,
        user?.uid,
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
        patternPictures.forEach((picture) => {
            storage
                .ref(`patternImages/${id}/${picture.file.name}`)
                .delete()
                .catch((err: Error) => {
                    newError.concat(err.message);
                });
        });
        finishedWorkPictures.forEach((picture) => {
            storage
                .ref(`finishedWorkImages/${id}/${picture.file.name}`)
                .delete()
                .catch((err: Error) => {
                    newError.concat(err.message);
                });
        });
        if (newError.length) {
            setError(newError);
        } else {
            setNewOpen(true);
            closeModal();
        }
    }, [closeModal, finishedWorkPictures, id, patternPictures]);

    return (
        <ItemDetail>
            <ItemHeader>Add a new pattern</ItemHeader>

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
                    difficulty={difficulty}
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
                    {copiedPatternPictures.map((picture, index) => (
                        <FormImageContainer key={picture.name}>
                            <IconButton onClick={() => removeCopiedPaternPicture(index)}>
                                <FontAwesomeIcon icon={['fas', 'trash']} />
                            </IconButton>
                            <img src={picture.url} alt="pattern" />
                        </FormImageContainer>
                    ))}
                    {patternPictures.map((picture, index) => (
                        <FormImageContainer key={picture.file.name}>
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
                    {finishedWorkPictures.map((picture, index) => (
                        <FormImageContainer key={picture.file.name}>
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

AddPattern.displayName = 'AddPattern';

export default AddPattern;
