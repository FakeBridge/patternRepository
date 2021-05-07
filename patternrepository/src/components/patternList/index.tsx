import React, { useState, useCallback } from 'react';
import { Modal } from 'reactstrap';
import AddPattern from './addPattern';
import AddBook from './books/addBook';
import PatternContainer from './patternContainer';
import List from './list';

import TagProvider from '../../logic/providers/tagProvider';
import BookProvider from '../../logic/providers/bookProvider';
import UsersProvider from '../../logic/providers/usersProvider';
import { pattern as patternType } from '../../logic/types';

import { Main, SearchCard, SuccessButton, Input } from '../../design/styledComponents';

const emptyPattern: patternType = {
    id: '',
    title: null,
    description: null,
    difficulty: 3,
    owner: { uid: '0', username: '', avatar: '' },
    patternImages: [],
    finishedWorkImages: [],
    tags: [],
    books: [],
    likes: 0,
};

const PatternList: React.FC = React.memo(() => {
    const [modalAddOpen, setModalAddOpen] = useState<boolean>(false);
    const [modalAddBookOpen, setModalAddBookOpen] = useState<boolean>(false);
    const [currentPattern, setCurrentPattern] = useState<patternType>(emptyPattern);
    const [copyPattern, setCopyPattern] = useState<patternType | null>(null);

    const [searchTitle, setSearchTitle] = useState<string>('');

    const modalAddToggle = useCallback(() => {
        setModalAddOpen(!modalAddOpen);
        setCopyPattern(null);
    }, [modalAddOpen]);

    const modalAddBookToggle = useCallback(() => {
        setModalAddBookOpen(!modalAddBookOpen);
    }, [modalAddBookOpen]);

    const closeContainerModal = useCallback(() => setCurrentPattern(emptyPattern), []);

    return (
        <UsersProvider>
            <TagProvider>
                <BookProvider>
                    <Main>
                        <SearchCard>
                            <Input
                                block={false}
                                name="patternSearch"
                                placeholder="Search in titles"
                                value={searchTitle}
                                onChange={(e) =>
                                    setSearchTitle(e.target.value ? e.target.value.toString() : '')
                                }
                            />
                            <SuccessButton block={false} onClick={modalAddToggle}>
                                + Pattern
                            </SuccessButton>
                            <SuccessButton block={false} onClick={modalAddBookToggle}>
                                + Book
                            </SuccessButton>
                        </SearchCard>

                        <List
                            setCurrentPattern={setCurrentPattern}
                            setCopyPattern={(pattern: patternType) => {
                                setCopyPattern(pattern);
                                setModalAddOpen(true);
                            }}
                            searchTitle={searchTitle}
                        />

                        <Modal isOpen={modalAddBookOpen} toggle={modalAddBookToggle}>
                            <AddBook closeModal={modalAddBookToggle} />
                        </Modal>

                        <Modal isOpen={modalAddOpen} toggle={modalAddToggle}>
                            <AddPattern closeModal={modalAddToggle} copyPattern={copyPattern} />
                        </Modal>

                        <Modal isOpen={currentPattern.id !== ''} toggle={closeContainerModal}>
                            <PatternContainer
                                closeModal={closeContainerModal}
                                currentPattern={currentPattern}
                            />
                        </Modal>
                    </Main>
                </BookProvider>
            </TagProvider>
        </UsersProvider>
    );
});

PatternList.displayName = 'PatternList';

export default PatternList;
