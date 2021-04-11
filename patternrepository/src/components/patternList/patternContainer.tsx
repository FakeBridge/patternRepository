import React, { useState } from 'react';
import EditPattern from './editPattern';
import ViewPattern from './viewPattern';
import { pattern } from '../../logic/types';

interface PropsType {
    closeModal: () => void;
    currentPattern: pattern | null;
}

const PatternContainer: React.FC<PropsType> = ({ closeModal, currentPattern }) => {
    const [openEdit, setOpenEdit] = useState<boolean>(false);

    console.log(currentPattern);

    return (
        <>
            {openEdit && <EditPattern openEdit={setOpenEdit} />}
            {!openEdit && <ViewPattern openEdit={setOpenEdit} closeModal={closeModal} />}
        </>
    );
};

export default PatternContainer;
