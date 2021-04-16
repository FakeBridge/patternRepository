import React, { useState, useCallback } from 'react';
import { Modal } from 'reactstrap';
import AddPattern from './addPattern';
import AddBook from './books/addBook';
import PatternContainer from './patternContainer';
import List from './list';

import TagProvider from '../../logic/providers/tagProvider';
import BookProvider from '../../logic/providers/bookProvider';
import { pattern as patternType } from '../../logic/types';

import { Main, SearchCard, SuccessButton } from '../../design/styledComponents';

const emptyPattern: patternType = {
    id: '',
    title: null,
    description: null,
    difficulty: 3,
    owner: null,
    patternImages: [],
    finishedWorkImages: [],
    tags: [],
    books: [],
};

const PatternList: React.FC = React.memo(() => {
    const [modalAddOpen, setModalAddOpen] = useState<boolean>(false);
    const [modalAddBookOpen, setModalAddBookOpen] = useState<boolean>(false);
    const [currentPattern, setCurrentPattern] = useState<patternType>(emptyPattern);

    const modalAddToggle = useCallback(() => {
        setModalAddOpen(!modalAddOpen);
    }, [modalAddOpen]);

    const modalAddBookToggle = useCallback(() => {
        setModalAddBookOpen(!modalAddBookOpen);
    }, [modalAddBookOpen]);

    const closeContainerModal = useCallback(() => setCurrentPattern(emptyPattern), []);

    return (
        <TagProvider>
            <BookProvider>
                <Main>
                    <SearchCard>
                        <SuccessButton block={false} onClick={modalAddToggle}>
                            + Pattern
                        </SuccessButton>
                        <SuccessButton block={false} onClick={modalAddBookToggle}>
                            + Book
                        </SuccessButton>
                    </SearchCard>

                    <List setCurrentPattern={setCurrentPattern} />

                    <Modal isOpen={modalAddBookOpen} toggle={modalAddBookToggle}>
                        <AddBook closeModal={modalAddBookToggle} />
                    </Modal>

                    <Modal isOpen={modalAddOpen} toggle={modalAddToggle}>
                        <AddPattern closeModal={modalAddToggle} />
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
    );
});

PatternList.displayName = 'PatternList';

export default PatternList;
