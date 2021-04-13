import React, { useState } from 'react';
import EditPattern from './editPattern';
import ViewPattern from './viewPattern';
import { pattern } from '../../logic/types';

interface PropsType {
    closeModal: () => void;
    currentPattern: pattern;
}

const PatternContainer: React.FC<PropsType> = React.memo(({ closeModal, currentPattern }) => {
    const [openEdit, setOpenEdit] = useState<boolean>(false);

    return (
        <>
            {openEdit && (
                <EditPattern
                    openEdit={setOpenEdit}
                    closeModal={closeModal}
                    currentPattern={currentPattern}
                />
            )}
            {!openEdit && (
                <ViewPattern
                    openEdit={setOpenEdit}
                    closeModal={closeModal}
                    currentPattern={currentPattern}
                />
            )}
        </>
    );
});

PatternContainer.displayName = 'PatternContainer';

export default PatternContainer;
