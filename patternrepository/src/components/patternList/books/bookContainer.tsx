import React, { useState } from 'react';
import EditBook from './editBook';
import ViewBook from './viewBook';
import { book, pattern } from '../../../logic/types';

interface PropsType {
    closeModal: () => void;
    currentBook: book;
    patterns: pattern[];
}

const BookContainer: React.FC<PropsType> = React.memo(({ closeModal, currentBook, patterns }) => {
    const [openEdit, setOpenEdit] = useState<boolean>(false);

    return (
        <>
            {openEdit && (
                <EditBook
                    openEdit={setOpenEdit}
                    closeModal={closeModal}
                    currentBook={currentBook}
                />
            )}
            {!openEdit && (
                <ViewBook
                    openEdit={setOpenEdit}
                    closeModal={closeModal}
                    currentBook={currentBook}
                    patterns={patterns}
                />
            )}
        </>
    );
});

BookContainer.displayName = 'BookContainer';

export default BookContainer;
