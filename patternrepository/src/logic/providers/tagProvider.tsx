import React, { createContext, useState, useEffect } from 'react';
import TagService from '../services/tagServices';
import { tag } from '../types';

export const TagContext = createContext<{ allTags: tag[] }>({ allTags: [] });

interface PropsType {
    children: JSX.Element;
}

const TagProvider: React.FC<PropsType> = ({ children }) => {
    const [allTags, setAllTags] = useState<{ allTags: tag[] }>({ allTags: [] });

    const onTagDataChange = (items: any) => {
        let loadedTags: tag[] = [];
        loadedTags = [];

        items.docs.forEach((item: any) => {
            const { id: tagId } = item;
            const data = item.data();

            loadedTags.push({
                id: tagId,
                label: data.label,
                value: tagId,
            });
        });

        setAllTags({ allTags: loadedTags });
    };

    useEffect(() => {
        const unsubscribe = TagService.getAll().orderBy('label', 'asc').onSnapshot(onTagDataChange);

        return () => unsubscribe();
    }, []);

    return <TagContext.Provider value={allTags}>{children}</TagContext.Provider>;
};

export default TagProvider;
