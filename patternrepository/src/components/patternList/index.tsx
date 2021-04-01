import React, { useState } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import AddPattern from './addPattern';

const PatternList: React.FC = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const modalToggle = () => {
        setModalOpen(!modalOpen);
    };

    return (
        <div style={{ width: '60%', margin: '0px auto' }}>
            <div>
                <Button color="info" onClick={modalToggle}>
                    + Pattern
                </Button>
            </div>

            <p>HI</p>

            <Modal isOpen={modalOpen} toggle={modalToggle}>
                <ModalBody>
                    <AddPattern closeModal={modalToggle} />
                </ModalBody>
            </Modal>
        </div>
    );
};

export default PatternList;
