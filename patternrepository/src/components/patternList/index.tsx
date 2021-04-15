import React, { useState, useCallback } from 'react';
import { Modal } from 'reactstrap';
import AddPattern from './addPattern';
import PatternContainer from './patternContainer';
import List from './list';
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
};

const PatternList: React.FC = () => {
    const [modalAddOpen, setModalAddOpen] = useState<boolean>(false);
    const [currentPattern, setCurrentPattern] = useState<patternType>(emptyPattern);

    const modalAddToggle = useCallback(() => {
        setModalAddOpen(!modalAddOpen);
    }, [modalAddOpen]);

    const closeContainerModal = useCallback(() => setCurrentPattern(emptyPattern), []);

    return (
        <Main>
            <SearchCard>
                <SuccessButton block={false} onClick={modalAddToggle}>
                    + Pattern
                </SuccessButton>
            </SearchCard>

            <List setCurrentPattern={setCurrentPattern} />

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
    );
};

export default PatternList;
