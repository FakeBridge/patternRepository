import React, { useState, useEffect, useCallback, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PatternService from '../../logic/services/patternServices';
import LikedPatternsService from '../../logic/services/likedPatternsServices';
import { TagContext } from '../../logic/providers/tagProvider';
import { BookContext } from '../../logic/providers/bookProvider';
import { UsersContext } from '../../logic/providers/usersProvider';
import { UserContext } from '../../logic/providers/userProvider';

import { pattern as patternType, basicImage } from '../../logic/types';

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
}

const List: React.FC<PropsType> = React.memo(({ setCurrentPattern, setCopyPattern }) => {
    const { user } = useContext(UserContext);
    const { allTags } = useContext(TagContext);
    const { allBooks } = useContext(BookContext);
    const { allUsers } = useContext(UsersContext);

    const [patterns, setPatterns] = useState<patternType[]>([]);

    const [likedPatterns, setLikedPatterns] = useState<string[]>([]);

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
                        ? data.tags.map((tagId: string) => allTags.find((tag) => tag.id === tagId))
                        : [],
                    books: allBooks.length
                        ? data.books.map((bookId: string) =>
                              allBooks.find((book) => book.id === bookId),
                          )
                        : [],
                    likes: data.likes ? data.likes : 0,
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
        }
    };

    return (
        <ItemList>
            {patterns.map((pattern: patternType) => (
                <Item key={pattern.id}>
                    <ItemDetail>
                        <ButtonRow>
                            <InvisibleIconButton
                                red={false}
                                onClick={() => setCurrentPattern(pattern)}
                            >
                                <FontAwesomeIcon icon={['fas', 'info-circle']} />
                            </InvisibleIconButton>
                            <InvisibleIconButton
                                red={false}
                                onClick={() => {
                                    setCopyPattern(pattern);
                                }}
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
                            <img
                                key={pattern.owner?.uid}
                                src={pattern.owner?.avatar ? pattern.owner.avatar : undefined}
                                alt={pattern.owner?.avatar ? pattern.owner.avatar : undefined}
                            />
                            <span>{pattern.owner?.username}</span>
                        </UserInfoRow>
                        <BottomInfoRow liked={likedPatterns.includes(pattern.id)}>
                            <InvisibleIconButton
                                red={likedPatterns.includes(pattern.id)}
                                onClick={() =>
                                    changeLike(pattern, likedPatterns.includes(pattern.id) ? -1 : 1)
                                }
                            >
                                <FontAwesomeIcon icon={['fas', 'heart']} />
                            </InvisibleIconButton>
                            <span>{pattern.likes}</span>
                        </BottomInfoRow>
                    </ItemDetail>
                </Item>
            ))}
        </ItemList>
    );
});

List.displayName = 'List';

export default List;
