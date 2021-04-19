import React, { useState, useEffect, useCallback, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PatternService from '../../logic/services/patternServices';
import { TagContext } from '../../logic/providers/tagProvider';
import { BookContext } from '../../logic/providers/bookProvider';

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
} from '../../design/styledComponents';

interface PropsType {
    setCurrentPattern: (pattern: patternType) => void;
    setCopyPattern: (pattern: patternType) => void;
}

const List: React.FC<PropsType> = React.memo(({ setCurrentPattern, setCopyPattern }) => {
    const { allTags } = useContext(TagContext);
    const { allBooks } = useContext(BookContext);

    const [patterns, setPatterns] = useState<patternType[]>([]);

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
                    owner: data.owner,
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
                });
            });

            setPatterns(loadedPatterns);
        },
        [allTags, allBooks],
    );

    useEffect(() => {
        const unsubscribe = PatternService.getAll().limit(20).onSnapshot(onDataChange);

        return () => unsubscribe();
    }, [onDataChange]);

    return (
        <ItemList>
            {patterns.map((pattern: patternType) => (
                <Item key={pattern.id}>
                    <ItemDetail>
                        <ButtonRow>
                            <InvisibleIconButton onClick={() => setCurrentPattern(pattern)}>
                                <FontAwesomeIcon icon={['fas', 'info-circle']} />
                            </InvisibleIconButton>
                            <InvisibleIconButton
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
                    </ItemDetail>
                </Item>
            ))}
        </ItemList>
    );
});

List.displayName = 'List';

export default List;
