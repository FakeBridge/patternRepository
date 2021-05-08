import React, { useContext, useEffect, useCallback, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../logic/providers/userProvider';
import { UsersContext } from '../../logic/providers/usersProvider';
import { pattern as patternType, comment as commentType, commentToAdd } from '../../logic/types';
import CommentsService from '../../logic/services/commentsService';
import PatternService from '../../logic/services/patternServices';

import PatternPrint from './patternPrint';
import ToExport from './toExport2';

import {
    Input,
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
    SuccessButton,
    HelperText,
    UserInfoRow,
} from '../../design/styledComponents';

interface PropsType {
    openEdit: (open: boolean) => void;
    closeModal: () => void;
    currentPattern: patternType | null;
}

const ViewPattern: React.FC<PropsType> = React.memo(({ openEdit, closeModal, currentPattern }) => {
    const { user } = useContext(UserContext);
    const { allUsers } = useContext(UsersContext);

    const [comments, setComments] = useState<commentType[]>([]);
    const [commentMessage, setComment] = useState<string>('');
    const [showAddComment, setShowAddComment] = useState<boolean>(false);

    const handleClose = () => {
        closeModal();
    };

    const onDataChange = useCallback(
        (items: any) => {
            let loadedComments: commentType[] = [];
            loadedComments = [];

            items.docs.forEach((item: any) => {
                const { id } = item;
                const data = item.data();

                loadedComments.push({
                    id,
                    patternId: data.patternId,
                    message: data.message,
                    by: allUsers.find((u) => u.uid === data.by),
                    dateCreated: data.dateCreated,
                });
            });

            setComments(
                loadedComments.sort((c1: commentType, c2: commentType) =>
                    c1.dateCreated > c2.dateCreated ? -1 : 1,
                ),
            );
        },
        [allUsers],
    );

    useEffect(() => {
        const unsubscribe = CommentsService.getAll()
            .where('patternId', '==', currentPattern?.id)
            .onSnapshot(onDataChange);

        return () => {
            unsubscribe();
        };
    }, [onDataChange, currentPattern]);

    const showAddCommentToggle = () => {
        setShowAddComment(!showAddComment);
    };

    const addComment = () => {
        if (currentPattern) {
            const newComment: commentToAdd = {
                patternId: currentPattern.id,
                message: commentMessage,
                by: user?.uid ? user.uid : '',
                dateCreated: moment().unix(),
            };
            CommentsService.create(newComment);

            const commentAmount = currentPattern.comments + 1;
            PatternService.updateComments(currentPattern.id, commentAmount);

            setShowAddComment(false);
        }
    };

    const removeComment = (id: string) => {
        if (currentPattern) {
            CommentsService.remove(id);

            const commentAmount = currentPattern.comments - 1;
            PatternService.updateComments(currentPattern.id, commentAmount);

            setShowAddComment(false);
        }
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
                    __html: currentPattern?.description
                        ? currentPattern.description
                        : 'No description here :c',
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

            <ItemLabel>
                Comments{' '}
                <LinkButton block={false} onClick={showAddCommentToggle}>
                    <FontAwesomeIcon icon={['fas', 'plus']} />
                </LinkButton>
            </ItemLabel>
            {showAddComment && (
                <>
                    <Input
                        block
                        name="comment"
                        placeholder="Enter your comment <3"
                        value={commentMessage}
                        style={{ marginBottom: '1em' }}
                        onChange={(e) =>
                            setComment(e.target.value ? e.target.value.toString() : '')
                        }
                    />
                    <ButtonRow style={{ marginBottom: '1em' }}>
                        <CancelButton block={false} onClick={showAddCommentToggle}>
                            Cancel
                        </CancelButton>
                        <SuccessButton block={false} onClick={addComment}>
                            Comment
                        </SuccessButton>
                    </ButtonRow>
                </>
            )}
            <>
                {comments.map((comment: commentType) => (
                    <Description key={comment.id} style={{ marginBottom: '1em' }}>
                        <UserInfoRow>
                            <Link to={`/profile/${comment.by?.uid}`}>
                                <img
                                    key={comment.by?.uid}
                                    src={comment.by?.avatar ? comment.by.avatar : undefined}
                                    alt={comment.by?.avatar ? comment.by.avatar : undefined}
                                />
                                <span>{comment.by?.username}</span>
                            </Link>
                            <HelperText style={{ marginLeft: '1em' }}>
                                {moment.unix(comment.dateCreated).format('DD.MM.YYYY HH:mm')}
                            </HelperText>
                            <InvisibleIconButton
                                style={{ fontSize: '1em', float: 'right' }}
                                red
                                onClick={() => removeComment(comment.id)}
                            >
                                <FontAwesomeIcon icon={['fas', 'trash']} />
                            </InvisibleIconButton>
                        </UserInfoRow>
                        {comment.message}
                    </Description>
                ))}
            </>

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
