import React, { useContext } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../logic/providers/userProvider';
import { pattern as patternType } from '../../logic/types';

import PatternPrint from './patternPrint';
import ToExport from './toExport2';

import {
    ItemDetail,
    ItemHeader,
    ItemLabel,
    InvisibleIconButton,
    Difficulty,
    Tag,
    Description,
    ButtonRow,
    TagRow,
    CancelButton,
    LinkButton,
    HelperText,
} from '../../design/styledComponents';

interface PropsType {
    openEdit: (open: boolean) => void;
    closeModal: () => void;
    currentPattern: patternType | null;
}

const ViewPattern: React.FC<PropsType> = React.memo(({ openEdit, closeModal, currentPattern }) => {
    const { user } = useContext(UserContext);

    const handleClose = () => {
        closeModal();
    };

    return (
        <ItemDetail>
            {currentPattern?.owner?.uid === user?.uid && (
                <HelperText>
                    {`This pattern is yours and this is how other users see it's detail. Click `}
                    <LinkButton block={false} onClick={() => openEdit(true)}>
                        here
                    </LinkButton>{' '}
                    to edit.
                </HelperText>
            )}

            <ButtonRow>
                <PatternPrint pattern={currentPattern} />
                <PDFDownloadLink
                    document={<ToExport pattern={currentPattern} />}
                    fileName={currentPattern?.title ? currentPattern.title : 'Untitled'}
                >
                    {({ loading }) =>
                        loading ? (
                            <InvisibleIconButton red={false}>
                                <FontAwesomeIcon icon={['fas', 'spinner']} />
                            </InvisibleIconButton>
                        ) : (
                            <InvisibleIconButton red={false}>
                                <FontAwesomeIcon icon={['fas', 'file-download']} />
                            </InvisibleIconButton>
                        )
                    }
                </PDFDownloadLink>
            </ButtonRow>

            <ItemHeader>{currentPattern ? currentPattern.title : 'Untitled'}</ItemHeader>

            <TagRow>
                {currentPattern?.tags.map((tag) => (
                    <Tag key={tag.id} colour="tag">
                        {' '}
                        {tag.label}{' '}
                    </Tag>
                ))}
            </TagRow>

            <Difficulty difficulty={currentPattern?.difficulty ? currentPattern?.difficulty : 3} />

            <ItemLabel>Books</ItemLabel>
            <TagRow>
                {currentPattern?.books?.map((book) => (
                    <Tag key={book.id} colour={book.colour}>
                        {' '}
                        {book.label}{' '}
                    </Tag>
                ))}
            </TagRow>

            <ItemLabel>Description</ItemLabel>
            <Description
                dangerouslySetInnerHTML={{
                    __html: currentPattern?.description ? currentPattern.description : '',
                }}
            />

            <ItemLabel>Pattern pictures</ItemLabel>
            <>
                {currentPattern?.patternImages.map((picture) => (
                    <img
                        key={picture.name}
                        src={picture.url}
                        alt={picture.name}
                        width="100px"
                        height="100px"
                    />
                ))}
            </>

            <ItemLabel>Finished works</ItemLabel>
            <>
                {currentPattern?.finishedWorkImages.map((picture) => (
                    <img
                        key={picture.name}
                        src={picture.url}
                        alt={picture.name}
                        width="100px"
                        height="100px"
                    />
                ))}
            </>
            <Difficulty difficulty={currentPattern?.difficulty ? currentPattern?.difficulty : 3} />

            <ButtonRow>
                <CancelButton block onClick={handleClose}>
                    Close
                </CancelButton>
            </ButtonRow>
        </ItemDetail>
    );
});

ViewPattern.displayName = 'ViewPattern';

export default ViewPattern;
