import React, { createContext, useContext, useState, useEffect } from 'react';
import NoteService from '../services/noteServices';
import { UserContext } from './userProvider';
import { note } from '../types';

export const NoteContext = createContext<{ allNotes: note[] }>({ allNotes: [] });

interface PropsType {
    children: JSX.Element;
}

const NoteProvider: React.FC<PropsType> = ({ children }) => {
    const { user } = useContext(UserContext);
    const [allNotes, setAllNotes] = useState<{ allNotes: note[] }>({ allNotes: [] });

    const onNoteDataChange = (items: any) => {
        let loadedNotes: note[] = [];
        loadedNotes = [];

        items.docs.forEach((item: any) => {
            const { id: noteId } = item;
            const data = item.data();

            loadedNotes.push({
                id: noteId,
                by: data.by,
                dateCreated: data.dateCreated,
                message: data.message,
                to: data.to,
                seen: data.seen,
            });
        });

        setAllNotes({ allNotes: loadedNotes });
    };

    useEffect(() => {
        const unsubscribe = NoteService.getAll()
            .where('to', '==', user?.uid)
            .orderBy('dateCreated', 'asc')
            .onSnapshot(onNoteDataChange);

        return () => unsubscribe();
    }, []);

    return <NoteContext.Provider value={allNotes}>{children}</NoteContext.Provider>;
};

export default NoteProvider;
