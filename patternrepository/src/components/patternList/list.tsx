import React, { useState, useEffect, useCallback } from 'react';
import PatternService from '../../logic/services/patternServices';

import { pattern as patternType, basicImage } from '../../logic/types';

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
        <div>
            {patterns.map((pattern: patternType) => (
                <div key={pattern.id} style={{ width: '33%', backgroundColor: 'aliceblue' }}>
                    <button type="button" onClick={() => setCurrentPattern(pattern)}>
                        Detail
                    </button>
                    <h2>{pattern.title}</h2>
                    {pattern.finishedWorkImages.slice(0, 3).map((image: basicImage) => (
                        <img
                            key={image.name}
                            src={image.url}
                            alt={image.name}
                            width="100px"
                            height="100px"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
});

List.displayName = 'List';

export default List;
