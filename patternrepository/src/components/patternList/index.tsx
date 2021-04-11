import React, { useState } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import AddPattern from './addPattern';
import PatternContainer from './patternContainer';
import List from './list';
import { pattern as patternType } from '../../logic/types';

const PatternList: React.FC = () => {
    const [modalAddOpen, setModalAddOpen] = useState<boolean>(false);
    const [currentPattern, setCurrentPattern] = useState<patternType | null>(null);

    const modalAddToggle = () => {
        setModalAddOpen(!modalAddOpen);
    };

    return (
        <div style={{ width: '60%', margin: '0px auto' }}>
            <div>
                <Button color="info" onClick={modalAddToggle}>
                    + Pattern
                </Button>
            </div>

            <List setCurrentPattern={setCurrentPattern} />

            <Modal isOpen={modalAddOpen} toggle={modalAddToggle}>
                <ModalBody>
                    <AddPattern closeModal={modalAddToggle} />
                </ModalBody>
            </Modal>

            <Modal isOpen={currentPattern !== null} toggle={() => setCurrentPattern(null)}>
                <ModalBody>
                    <PatternContainer
                        closeModal={() => setCurrentPattern(null)}
                        currentPattern={currentPattern}
                    />
                </ModalBody>
            </Modal>
        </div>
    );
};

export default PatternList;
