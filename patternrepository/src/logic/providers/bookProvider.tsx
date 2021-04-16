import React, { createContext, useState, useEffect } from 'react';
import BookService from '../services/bookServices';
import { book } from '../types';

export const BookContext = createContext<{ allBooks: book[] }>({ allBooks: [] });

interface PropsType {
    children: JSX.Element;
}

const BookProvider: React.FC<PropsType> = ({ children }) => {
    const [allBooks, setAllBooks] = useState<{ allBooks: book[] }>({ allBooks: [] });

    const onBookDataChange = (items: any) => {
        let loadedBooks: book[] = [];
        loadedBooks = [];

        items.docs.forEach((item: any) => {
            const { id: bookId } = item;
            const data = item.data();

            loadedBooks.push({
                id: bookId,
                label: data.label,
                value: bookId,
                colour: data.colour,
                owner: data.owner,
            });
        });

        setAllBooks({ allBooks: loadedBooks });
    };

    useEffect(() => {
        const unsubscribe = BookService.getAll()
            .orderBy('label', 'asc')
            .onSnapshot(onBookDataChange);

        return () => unsubscribe();
    }, []);

    return <BookContext.Provider value={allBooks}>{children}</BookContext.Provider>;
};

export default BookProvider;
