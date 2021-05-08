import React, { useState, useContext, useMemo } from 'react';
import Select from 'react-select';
import { SearchGroup, AdvancedSearch, DifficultyInput, Label } from '../../design/styledComponents';
import { TagContext } from '../../logic/providers/tagProvider';
import { BookContext } from '../../logic/providers/bookProvider';
import { UsersContext } from '../../logic/providers/usersProvider';
import { UserContext } from '../../logic/providers/userProvider';
import multiSelectWithColour from '../../design/selectStyles';

import { tag, book, user as userType } from '../../logic/types';

interface PropsType {
    show: boolean;
    setSearchDifficulty: (searchDiff: number) => void;
    setSearchWithDifficulty: (use: boolean) => void;
    setSearchTags: (tagsUsef: tag[]) => void;
    setSearchWithTags: (use: boolean) => void;
    setSearchBooks: (booksUsef: book[]) => void;
    setSearchWithBooks: (use: boolean) => void;
    setSearchOwner: (userUsed: string) => void;
    setSearchWithOwner: (use: boolean) => void;
    setSearchLikedStatus: (statusUsed: number) => void;
    setSearchWithLikedStatus: (use: boolean) => void;
}

const Search: React.FC<PropsType> = React.memo(
    ({
        show: showAdvancedSearch,
        setSearchDifficulty: setSearchDifficultyProps,
        setSearchWithDifficulty: setSearchWithDifficultyProps,
        setSearchTags: setSearchTagsProps,
        setSearchWithTags: setSearchWithTagsProps,
        setSearchBooks: setSearchBooksProps,
        setSearchWithBooks: setSearchWithBooksProps,
        setSearchOwner: setSearchOwnerProps,
        setSearchWithOwner: setSearchWithOwnerProps,
        setSearchLikedStatus: setSearchLikedStatusProps,
        setSearchWithLikedStatus: setSearchWithLikedStatusProps,
    }) => {
        const { user } = useContext(UserContext);
        const { allUsers } = useContext(UsersContext);
        const { allTags } = useContext(TagContext);
        const { allBooks } = useContext(BookContext);

        const [difficulty, setDifficulty] = useState<number>(3);
        const [withDifficulty, setWithDifficulty] = useState<boolean>(false);

        const [tags, setTags] = useState<tag[]>([]);
        const [withTags, setWithTags] = useState<boolean>(false);

        const [books, setBooks] = useState<book[]>([]);
        const [withBooks, setWithBooks] = useState<boolean>(false);

        const [owner, setOwner] = useState<any>('');
        const [withOwner, setWithOwner] = useState<boolean>(false);

        const [likedStatus, setLikedStatus] = useState<any>({ label: 'All', value: 0 });
        const [withLikedStatus, setWithLikedStatus] = useState<boolean>(false);

        const MAPPED_USERS = useMemo(() => {
            let mapped: any = [{ label: 'My patterns', value: user?.uid }];
            mapped = mapped.concat(
                allUsers
                    .filter((u: userType) => u?.uid !== user?.uid)
                    .map((u: userType) => ({ ...u, label: u?.username, value: u?.uid })),
            );
            return mapped;
        }, [allUsers, user]);

        if (!showAdvancedSearch) {
            return <></>;
        }

        return (
            <AdvancedSearch>
                <SearchGroup>
                    <input
                        name="patternTitle"
                        placeholder="Enter title"
                        type="checkbox"
                        checked={withDifficulty}
                        onChange={() => {
                            setWithDifficulty(!withDifficulty);
                            setSearchWithDifficultyProps(!withDifficulty);
                        }}
                    />
                    <Label style={{ display: 'inline', marginLeft: '' }}>Difficulty</Label>
                    <DifficultyInput
                        block
                        type="range"
                        name="patternDifficulty"
                        min={1}
                        max={5}
                        step={1}
                        value={difficulty}
                        onChange={(e) => {
                            setDifficulty(parseInt(e.target.value, 10));
                            setSearchDifficultyProps(parseInt(e.target.value, 10));
                        }}
                    />
                </SearchGroup>

                <SearchGroup>
                    <input
                        name="patternTitle"
                        placeholder="Enter title"
                        type="checkbox"
                        checked={withTags}
                        onChange={() => {
                            setWithTags(!withTags);
                            setSearchWithTagsProps(!withTags);
                        }}
                    />
                    <Label style={{ display: 'inline', marginLeft: '' }}>Has tags</Label>
                    <Select
                        options={allTags}
                        value={tags}
                        isMulti
                        onChange={(e) => {
                            setTags([...e]);
                            setSearchTagsProps([...e]);
                        }}
                    />
                </SearchGroup>

                <SearchGroup>
                    <input
                        name="patternTitle"
                        placeholder="Enter title"
                        type="checkbox"
                        checked={withBooks}
                        onChange={() => {
                            setWithBooks(!withBooks);
                            setSearchWithBooksProps(!withBooks);
                        }}
                    />
                    <Label style={{ display: 'inline', marginLeft: '' }}>Is in books</Label>
                    <Select
                        styles={multiSelectWithColour}
                        options={allBooks}
                        value={books}
                        isMulti
                        onChange={(e) => {
                            setBooks([...e]);
                            setSearchBooksProps([...e]);
                        }}
                    />
                </SearchGroup>

                <SearchGroup>
                    <input
                        name="patternTitle"
                        placeholder="Enter title"
                        type="checkbox"
                        checked={withOwner}
                        onChange={() => {
                            setWithOwner(!withOwner);
                            setSearchWithOwnerProps(!withOwner);
                        }}
                    />
                    <Label style={{ display: 'inline', marginLeft: '' }}>Owner</Label>
                    <Select
                        options={MAPPED_USERS}
                        value={owner}
                        onChange={(e) => {
                            setOwner(e);
                            setSearchOwnerProps(e.value);
                        }}
                    />
                </SearchGroup>

                <SearchGroup>
                    <input
                        name="patternTitle"
                        placeholder="Enter title"
                        type="checkbox"
                        checked={withLikedStatus}
                        onChange={() => {
                            setWithLikedStatus(!withLikedStatus);
                            setSearchWithLikedStatusProps(!withLikedStatus);
                        }}
                    />
                    <Label style={{ display: 'inline', marginLeft: '' }}>Liked status</Label>
                    <Select
                        options={[
                            { label: 'All', value: 0 },
                            { label: 'Liked', value: 1 },
                            { label: 'Not liked', value: 2 },
                        ]}
                        value={likedStatus}
                        onChange={(e) => {
                            setLikedStatus(e);
                            setSearchLikedStatusProps(e.value);
                        }}
                    />
                </SearchGroup>
            </AdvancedSearch>
        );
    },
);

Search.displayName = 'PatternLSearchist';

export default Search;
