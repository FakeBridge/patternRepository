import React, { useContext } from 'react';
import { UserContext } from '../../../logic/providers/userProvider';
import { book as bookType, pattern as patternType, basicImage } from '../../../logic/types';

import {
    ItemDetail,
    ItemLabel,
    ButtonRow,
    CancelButton,
    LinkButton,
    HelperText,
    ItemHeader,
    ItemList,
    FullWidthItem,
    TagRow,
    Difficulty,
    Tag,
} from '../../../design/styledComponents';

interface PropsType {
    openEdit: (open: boolean) => void;
    closeModal: () => void;
    currentBook: bookType | null;
    patterns: patternType[];
}

const ViewBook: React.FC<PropsType> = React.memo(
    ({ openEdit, closeModal, currentBook, patterns }) => {
        const { user } = useContext(UserContext);

        const handleClose = () => {
            closeModal();
        };

        return (
            <ItemDetail
                style={{
                    backgroundColor: currentBook?.colour ? `${currentBook?.colour}88` : 'white',
                }}
            >
                {currentBook?.owner === user?.uid && (
                    <HelperText>
                        {`This book is yours and this is how other users see it's detail. Click `}
                        <LinkButton block={false} onClick={() => openEdit(true)}>
                            here
                        </LinkButton>{' '}
                        to edit.
                    </HelperText>
                )}

                <ItemHeader>{currentBook ? currentBook.label : 'Untitled'}</ItemHeader>
                <ItemLabel>Patterns in this books</ItemLabel>
                <ItemList>
                    {patterns.map((pattern: patternType) => (
                        <FullWidthItem key={pattern.id}>
                            <ItemDetail>
                                <ItemHeader>{pattern.title}</ItemHeader>
                                <TagRow>
                                    {pattern.tags?.map((tag) => (
                                        <Tag key={tag.id} colour="tag">
                                            {' '}
                                            {tag.label}{' '}
                                        </Tag>
                                    ))}
                                </TagRow>
                                <Difficulty difficulty={pattern.difficulty} />
                                <TagRow>
                                    {pattern.books?.map((book) => (
                                        <Tag key={book.id} colour={book.colour}>
                                            {' '}
                                            {book.label}{' '}
                                        </Tag>
                                    ))}
                                </TagRow>
                                {pattern.finishedWorkImages.slice(0, 4).map((image: basicImage) => (
                                    <img
                                        key={image.name}
                                        src={image.url}
                                        alt={image.name}
                                        width="100px"
                                        height="100px"
                                    />
                                ))}
                            </ItemDetail>
                        </FullWidthItem>
                    ))}
                </ItemList>

                <ButtonRow>
                    <CancelButton block onClick={handleClose}>
                        Close
                    </CancelButton>
                </ButtonRow>
            </ItemDetail>
        );
    },
);

ViewBook.displayName = 'ViewBook';

export default ViewBook;
