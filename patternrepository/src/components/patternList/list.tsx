import React, { useState, useEffect, useCallback } from 'react';
import PatternService from '../../logic/services/patternServices';

import { pattern as patternType, basicImage } from '../../logic/types';

import {
    ItemList,
    Item,
    ItemDetail,
    ItemHeader,
    ButtonRow,
    SuccessButton,
    DangerButton,
    Difficulty,
    Tag,
} from '../../design/styledComponents';

interface PropsType {
    setCurrentPattern: (pattern: patternType) => void;
}

const List: React.FC<PropsType> = React.memo(({ setCurrentPattern }) => {
    const [patterns, setPatterns] = useState<patternType[]>([]);

    const onDataChange = useCallback((items: any) => {
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
            });
        });

        setPatterns(loadedPatterns);
    }, []);

    useEffect(() => {
        const unsubscribe = PatternService.getAll()
            .orderBy('title', 'asc')
            .onSnapshot(onDataChange);

        return () => unsubscribe();
    }, [onDataChange]);

    return (
        <ItemList>
            {patterns.map((pattern: patternType) => (
                <Item key={pattern.id}>
                    <ItemDetail>
                        <ItemHeader>{pattern.title}</ItemHeader>
                        <ButtonRow>
                            <DangerButton block={false} onClick={() => setCurrentPattern(pattern)}>
                                Detail
                            </DangerButton>
                            <SuccessButton block={false} onClick={() => {}}>
                                Copy
                            </SuccessButton>
                        </ButtonRow>
                        <Difficulty difficulty={pattern.difficulty} />
                        <>
                            {pattern.tags?.map((tag) => (
                                <Tag key={tag.id} colour="tag">
                                    {' '}
                                    {tag}{' '}
                                </Tag>
                            ))}
                        </>
                        {pattern.finishedWorkImages.slice(0, 3).map((image: basicImage) => (
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
