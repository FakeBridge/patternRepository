import React, { useState, useContext, useCallback } from 'react';

import { UserContext } from '../../../logic/providers/userProvider';
import BookService from '../../../logic/services/bookServices';

import { bookInfo } from '../../../logic/types';

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
}

const AddBook: React.FC<PropsType> = React.memo(({ closeModal }) => {
    const { user } = useContext(UserContext);

    const [label, setLabel] = useState<string>('');
    const [colour, setColour] = useState<string>('#4F5D76');

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(() => {
        const data: bookInfo = {
            label,
            colour,
            owner: user?.uid,
        };

        BookService.create(data)
            .then(() => {
                closeModal();
            })
            .catch((e) => {
                setError(e?.message);
            });
    }, [closeModal, colour, label, user?.uid]);

    const handleCancel = useCallback(() => {
        closeModal();
    }, [closeModal]);

    return (
        <ItemDetail>
            <ItemHeader>Add a new book for your patterns</ItemHeader>

            <FormGroup>
                <Label>Title</Label>
                <Input
                    block
                    name="bookTitle"
                    placeholder="Enter label"
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

AddBook.displayName = 'AddBook';

export default AddBook;
