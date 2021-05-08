import React, { useState, useCallback } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'reactstrap';
import AddPattern from './addPattern';
import AddBook from './books/addBook';
import PatternContainer from './patternContainer';
import List from './list';
import Search from './search';

import { searchStyle } from '../../design/selectStyles';

import TagProvider from '../../logic/providers/tagProvider';
import BookProvider from '../../logic/providers/bookProvider';
import UsersProvider from '../../logic/providers/usersProvider';
import { pattern as patternType, tag, book } from '../../logic/types';

import {
    Main,
    SearchCard,
    SuccessButton,
    Input,
    CancelButton,
    InvisibleIconButton,
} from '../../design/styledComponents';

const emptyPattern: patternType = {
    id: '',
    title: null,
    description: null,
    difficulty: 3,
    owner: { uid: '0', username: '', avatar: '' },
    patternImages: [],
    finishedWorkImages: [],
    tags: [],
    books: [],
    likes: 0,
    comments: 0,
};

const PatternList: React.FC = React.memo(() => {
    const [modalAddOpen, setModalAddOpen] = useState<boolean>(false);
    const [modalAddBookOpen, setModalAddBookOpen] = useState<boolean>(false);
    const [currentPattern, setCurrentPattern] = useState<patternType>(emptyPattern);
    const [copyPattern, setCopyPattern] = useState<patternType | null>(null);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);

    const [searchTitle, setSearchTitle] = useState<string>('');
    const [searchWithDifficulty, setSearchWithDifficulty] = useState<boolean>(false);
    const [searchDifficulty, setSearchDifficulty] = useState<number>(3);
    const [searchWithTags, setSearchWithTags] = useState<boolean>(false);
    const [searchTags, setSearchTags] = useState<tag[]>([]);
    const [searchWithBooks, setSearchWithBooks] = useState<boolean>(false);
    const [searchBooks, setSearchBooks] = useState<book[]>([]);
    const [searchWithOwner, setSearchWithOwner] = useState<boolean>(false);
    const [searchOwner, setSearchOwner] = useState<string>('');
    const [searchWithLikedStatus, setSearchWithLikedStatus] = useState<boolean>(false);
    const [searchLikedStatus, setSearchLikedStatus] = useState<number>(0);

    const [sortBy, setSortBy] = useState<any>({
        label: 'Sort by DATE ADDED',
        value: 'dateCreated',
    });
    const [ascending, setAscending] = useState<boolean>(true);

    const modalAddToggle = useCallback(() => {
        setModalAddOpen(!modalAddOpen);
        setCopyPattern(null);
    }, [modalAddOpen]);

    const modalAddBookToggle = useCallback(() => {
        setModalAddBookOpen(!modalAddBookOpen);
    }, [modalAddBookOpen]);

    const closeContainerModal = useCallback(() => setCurrentPattern(emptyPattern), []);

    return (
        <UsersProvider>
            <TagProvider>
                <BookProvider>
                    <Main>
                        <SearchCard>
                            <>
                                <Input
                                    block={false}
                                    style={{ marginRight: '1em' }}
                                    name="patternSearch"
                                    placeholder="Search in titles"
                                    value={searchTitle}
                                    onChange={(e) =>
                                        setSearchTitle(
                                            e.target.value ? e.target.value.toString() : '',
                                        )
                                    }
                                />
                                <div style={{ width: '20%', display: 'inline-block' }}>
                                    <Select
                                        styles={searchStyle}
                                        options={[
                                            { label: 'Sort by TITLE', value: 'title' },
                                            { label: 'Sort by LIKED', value: 'liked' },
                                            { label: 'Sort by DATE ADDED', value: 'dateCreated' },
                                        ]}
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e);
                                        }}
                                    />
                                </div>
                                <InvisibleIconButton
                                    style={{ height: '30px', marginRight: '1em' }}
                                    red={false}
                                    onClick={() => setAscending(!ascending)}
                                >
                                    {ascending && (
                                        <FontAwesomeIcon
                                            style={{ verticalAlign: 'middle' }}
                                            icon={['fas', 'arrow-up']}
                                        />
                                    )}
                                    {!ascending && (
                                        <FontAwesomeIcon
                                            style={{ verticalAlign: 'middle' }}
                                            icon={['fas', 'arrow-down']}
                                        />
                                    )}
                                </InvisibleIconButton>

                                <CancelButton
                                    style={{ marginRight: '1em' }}
                                    block={false}
                                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                                >
                                    Advanced
                                </CancelButton>

                                <SuccessButton
                                    style={{ marginRight: '1em' }}
                                    block={false}
                                    onClick={modalAddToggle}
                                >
                                    + Pattern
                                </SuccessButton>
                                <SuccessButton block={false} onClick={modalAddBookToggle}>
                                    + Book
                                </SuccessButton>
                            </>
                            <Search
                                show={showAdvancedSearch}
                                setSearchDifficulty={(value) => setSearchDifficulty(value)}
                                setSearchWithDifficulty={(value) => setSearchWithDifficulty(value)}
                                setSearchTags={(value) => setSearchTags(value)}
                                setSearchWithTags={(value) => setSearchWithTags(value)}
                                setSearchBooks={(value) => setSearchBooks(value)}
                                setSearchWithBooks={(value) => setSearchWithBooks(value)}
                                setSearchOwner={(value) => setSearchOwner(value)}
                                setSearchWithOwner={(value) => setSearchWithOwner(value)}
                                setSearchLikedStatus={(value) => setSearchLikedStatus(value)}
                                setSearchWithLikedStatus={(value) =>
                                    setSearchWithLikedStatus(value)
                                }
                            />
                        </SearchCard>

                        <List
                            setCurrentPattern={setCurrentPattern}
                            setCopyPattern={(pattern: patternType) => {
                                setCopyPattern(pattern);
                                setModalAddOpen(true);
                            }}
                            sortBy={sortBy.value}
                            ascending={ascending}
                            searchTitle={searchTitle}
                            difficulty={searchDifficulty}
                            withDifficulty={searchWithDifficulty}
                            tags={searchTags}
                            withTags={searchWithTags}
                            books={searchBooks}
                            withBooks={searchWithBooks}
                            owner={searchOwner}
                            withOwner={searchWithOwner}
                            likedStatus={searchLikedStatus}
                            withLikedStatus={searchWithLikedStatus}
                        />

                        <Modal isOpen={modalAddBookOpen} toggle={modalAddBookToggle}>
                            <AddBook closeModal={modalAddBookToggle} />
                        </Modal>

                        <Modal isOpen={modalAddOpen} toggle={modalAddToggle}>
                            <AddPattern closeModal={modalAddToggle} copyPattern={copyPattern} />
                        </Modal>

                        <Modal isOpen={currentPattern.id !== ''} toggle={closeContainerModal}>
                            <PatternContainer
                                closeModal={closeContainerModal}
                                currentPattern={currentPattern}
                            />
                        </Modal>
                    </Main>
                </BookProvider>
            </TagProvider>
        </UsersProvider>
    );
});

PatternList.displayName = 'PatternList';

export default PatternList;
