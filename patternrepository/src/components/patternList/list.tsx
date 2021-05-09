import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { Link, useLocation, useHistory } from 'react-router-dom';
import PatternService from '../../logic/services/patternServices';
import LikedPatternsService from '../../logic/services/likedPatternsServices';
import { TagContext } from '../../logic/providers/tagProvider';
import { BookContext } from '../../logic/providers/bookProvider';
import { UsersContext } from '../../logic/providers/usersProvider';
import { UserContext } from '../../logic/providers/userProvider';
import NoteService from '../../logic/services/noteServices';
import { firestore } from '../../logic/firebase';

import {
    pattern as patternType,
    basicImage,
    tag as tagType,
    book as bookType,
    noteToAdd,
} from '../../logic/types';

import {
    ItemList,
    Item,
    ItemDetail,
    ItemHeader,
    ButtonRow,
    InvisibleIconButton,
    Difficulty,
    TagRow,
    Tag,
    BottomInfoRow,
    UserInfoRow,
} from '../../design/styledComponents';

interface PropsType {
    setCurrentPattern: (pattern: patternType) => void;
    setCopyPattern: (pattern: patternType) => void;
    sortBy: string;
    ascending: boolean;
    searchTitle: string;
    withDifficulty: boolean;
    difficulty: number;
    withTags: boolean;
    tags: tagType[];
    withBooks: boolean;
    books: bookType[];
    owner: string;
    withOwner: boolean;
    likedStatus: number;
    withLikedStatus: boolean;
}

const List: React.FC<PropsType> = React.memo(
    ({
        setCurrentPattern,
        setCopyPattern,
        searchTitle,
        difficulty,
        withDifficulty,
        tags: searchTags,
        withTags: searchWithTags,
        books: searchBooks,
        withBooks: searchWithBooks,
        owner: searchOwner,
        withOwner: searchWithOwner,
        likedStatus,
        withLikedStatus,
        sortBy,
        ascending,
    }) => {
        const { user } = useContext(UserContext);
        const { allTags } = useContext(TagContext);
        const { allBooks } = useContext(BookContext);
        const { allUsers } = useContext(UsersContext);

        const [patterns, setPatterns] = useState<patternType[]>([]);

        const [likedPatterns, setLikedPatterns] = useState<string[]>([]);

        const location = useLocation();

        const currentPatternId = useMemo(() => {
            let id = location.pathname.substring(10);
            if (id.includes('?')) {
                const endIndex = id.indexOf('?');
                id = id.substring(0, endIndex);
            }
            return id;
        }, [location.pathname]);

        const history = useHistory();

        const onDataChange = useCallback(
            (items: any) => {
                let loadedPatterns: patternType[] = [];
                loadedPatterns = [];

                items.docs.forEach((item: any) => {
                    const { id } = item;
                    const data = item.data();

                    loadedPatterns.push({
                        id,
                        title: data.title,
                        description: data.description,
                        difficulty: data.difficulty,
                        owner: allUsers.find((u) => u.uid === data.owner),
                        patternImages: data.patternImages,
                        finishedWorkImages: data.finishedWorkImages,
                        tags: allTags.length
                            ? data.tags.map((tagId: string) =>
                                  allTags.find((tag) => tag.id === tagId),
                              )
                            : [],
                        books: allBooks.length
                            ? data.books.map((bookId: string) =>
                                  allBooks.find((book) => book.id === bookId),
                              )
                            : [],
                        likes: data.likes ? data.likes : 0,
                        dateCreated: data.dateCreated ? data.dateCreated : -1,
                        comments: data.comments ? data.comments : 0,
                    });
                });

                setPatterns(loadedPatterns);
            },
            [allTags, allBooks, allUsers],
        );

        const onLikedDataChange = useCallback((items: any) => {
            setLikedPatterns(items.data()?.patterns ? items.data()?.patterns : []);
        }, []);

        useEffect(() => {
            const unsubscribePattern = PatternService.getAll().limit(20).onSnapshot(onDataChange);
            const unsubscribeLiked = LikedPatternsService.getAll()
                .doc(user?.uid ? user.uid : '')
                .onSnapshot(onLikedDataChange);

            return () => {
                unsubscribePattern();
                unsubscribeLiked();
            };
        }, [onDataChange, onLikedDataChange, user]);

        useEffect(() => {
            if (currentPatternId.length > 0) {
                const foundPattern = patterns.find(
                    (pattern: patternType) => pattern.id === currentPatternId,
                );
                if (foundPattern) {
                    setCurrentPattern(foundPattern);
                }
            }
        }, [setCurrentPattern, currentPatternId, patterns]);

        const changeLike = (patternData: patternType, by: number) => {
            if (user?.uid) {
                const likes = patternData.likes + by;
                PatternService.updateLikes(patternData.id, likes);

                let newLiked = likedPatterns;
                if (by > 0) {
                    newLiked = [...likedPatterns, patternData.id];
                } else {
                    newLiked = likedPatterns.filter((p) => p !== patternData.id);
                }
                LikedPatternsService.setLiked(user.uid, newLiked);
                if (by > 0) {
                    const newNote: noteToAdd = {
                        by: user?.uid ? user.uid : 'none',
                        message: `${user?.username} just liked your pattern!${patternData.title}-${patternData.id}`,
                        dateCreated: moment().unix(),
                        to: patternData.owner?.uid ? patternData.owner.uid : '',
                        seen: false,
                    };
                    NoteService.create(newNote);

                    firestore
                        .collection(`users`)
                        .doc(patternData.owner?.uid ? patternData.owner.uid : '')
                        .update({
                            hasUnreadNotes: true,
                        });
                }
            }
        };

        const FILTERED_PATTERNS = useMemo(() => {
            return patterns
                .filter(
                    (pattern: patternType) =>
                        pattern.title?.toLowerCase().includes(searchTitle.toLowerCase()) &&
                        (withDifficulty ? pattern.difficulty === difficulty : true) &&
                        (searchWithTags
                            ? searchTags.every((t1: tagType) =>
                                  pattern.tags.find((t2: tagType) => t1.id === t2.id),
                              )
                            : true) &&
                        (searchWithBooks
                            ? searchBooks.every((b1: bookType) =>
                                  pattern.books.find((b2: bookType) => b1.id === b2.id),
                              )
                            : true) &&
                        (searchWithOwner && searchOwner.length > 0
                            ? pattern.owner?.uid === searchOwner
                            : true) &&
                        (withLikedStatus && likedStatus === 1
                            ? likedPatterns.includes(pattern.id)
                            : true) &&
                        (withLikedStatus && likedStatus === 2
                            ? !likedPatterns.includes(pattern.id)
                            : true),
                )
                .sort((p1: patternType, p2: patternType) => {
                    let value1: any = p1?.dateCreated ? p1.dateCreated : -1;
                    let value2: any = p2?.dateCreated ? p2.dateCreated : -1;
                    if (sortBy === 'title') {
                        value1 = p1.title;
                        value2 = p2.title;
                    }
                    if (sortBy === 'liked') {
                        value1 = p1.likes;
                        value2 = p2.likes;
                    }
                    if (ascending) {
                        return value1 > value2 ? 1 : -1;
                    }
                    return value1 > value2 ? -1 : 1;
                });
        }, [
            searchTitle,
            patterns,
            difficulty,
            withDifficulty,
            searchWithTags,
            searchTags,
            searchWithBooks,
            searchBooks,
            searchWithOwner,
            searchOwner,
            likedStatus,
            withLikedStatus,
            likedPatterns,
            ascending,
            sortBy,
        ]);

        return (
            <ItemList>
                {FILTERED_PATTERNS.map((pattern: patternType) => (
                    <Item key={pattern.id}>
                        <ItemDetail>
                            <ButtonRow>
                                <InvisibleIconButton
                                    red={false}
                                    onClick={() => {
                                        setCurrentPattern(pattern);
                                        history.push(`/patterns/${pattern.id}`);
                                    }}
                                >
                                    <FontAwesomeIcon icon={['fas', 'info-circle']} />
                                </InvisibleIconButton>
                                <InvisibleIconButton
                                    red={false}
                                    onClick={() => setCopyPattern(pattern)}
                                >
                                    <FontAwesomeIcon icon={['fas', 'copy']} />
                                </InvisibleIconButton>
                            </ButtonRow>
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
                            <UserInfoRow>
                                <Link to={`/profile/${pattern.owner?.uid}`}>
                                    <img
                                        key={pattern.owner?.uid}
                                        src={
                                            pattern.owner?.avatar ? pattern.owner.avatar : undefined
                                        }
                                        alt={
                                            pattern.owner?.avatar ? pattern.owner.avatar : undefined
                                        }
                                    />
                                    <span>{pattern.owner?.username}</span>
                                </Link>
                            </UserInfoRow>
                            <BottomInfoRow>
                                <InvisibleIconButton
                                    red={likedPatterns.includes(pattern.id)}
                                    onClick={() =>
                                        changeLike(
                                            pattern,
                                            likedPatterns.includes(pattern.id) ? -1 : 1,
                                        )
                                    }
                                >
                                    <FontAwesomeIcon icon={['fas', 'heart']} />
                                    <span>{pattern.likes}</span>
                                </InvisibleIconButton>

                                <InvisibleIconButton
                                    style={{ marginLeft: '1em' }}
                                    red={false}
                                    onClick={() => {}}
                                >
                                    <FontAwesomeIcon icon={['fas', 'comment-alt']} />
                                    <span>{pattern.comments}</span>
                                </InvisibleIconButton>
                            </BottomInfoRow>
                        </ItemDetail>
                    </Item>
                ))}
            </ItemList>
        );
    },
);

List.displayName = 'List';

export default List;
