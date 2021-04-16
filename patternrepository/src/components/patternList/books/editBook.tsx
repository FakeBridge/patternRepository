import React, { useState, useCallback } from 'react';

import BookService from '../../../logic/services/bookServices';

import { book, bookInfo } from '../../../logic/types';

import {
    FormGroup,
    Input,
    Label,
    ItemDetail,
    ItemHeader,
    ButtonRow,
    SuccessButton,
    CancelButton,
    DangerAlert,
} from '../../../design/styledComponents';

interface PropsType {
    closeModal: () => void;
    book: book;
}

const EditBook: React.FC<PropsType> = React.memo(({ closeModal, book }) => {
    const [label, setLabel] = useState<string>(book.label);
    const [colour, setColour] = useState<string>(book.colour);

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(() => {
        const data: bookInfo = {
            label,
            colour,
        };

        BookService.update(book?.id ? book.id : '00', data)
            .then(() => {
                closeModal();
            })
            .catch((e) => {
                setError(e?.message);
            });
    }, [closeModal, colour, label]);

    const handleCancel = useCallback(() => {
        closeModal();
    }, [closeModal]);

    return (
        <ItemDetail>
            <ItemHeader>Edit this book</ItemHeader>

            <FormGroup>
                <Label>Title</Label>
                <Input
                    block
                    name="bookTitle"
                    placeholder="Enter title"
                    value={label}
                    onChange={(e) => setLabel(e.target.value ? e.target.value.toString() : '')}
                />
            </FormGroup>

            <FormGroup>
                <Label>Colour</Label>
                <Input
                    block
                    type="color"
                    name="bookColour"
                    placeholder="Choose colour"
                    value={colour}
                    onChange={(e) => setColour(e.target.value)}
                />
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

EditBook.displayName = 'EditBook';

export default EditBook;
