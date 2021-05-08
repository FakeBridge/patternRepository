import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { UncontrolledCarousel, Modal } from 'reactstrap';

import { UsersContext } from '../../logic/providers/usersProvider';
import { UserContext } from '../../logic/providers/userProvider';
import { BookContext } from '../../logic/providers/bookProvider';
import { TagContext } from '../../logic/providers/tagProvider';

import BookContainer from '../patternList/books/bookContainer';

import { userInfo, book as bookType, pattern as patternType } from '../../logic/types';
import PatternService from '../../logic/services/patternServices';
import FollowedUsersService from '../../logic/services/followedUsersService';

import noAvatar from '../../design/images/no-image-icon.png';

import {
    Main,
    HelperText,
    LinkButton,
    MarginItemDetail,
    BookButton,
    ProfileHeader,
    SuccessButton,
    DangerButton,
    ItemLabel,
    ItemHeader,
    Description,
    UserInfoRow,
} from '../../design/styledComponents';

interface PropsType {
    openEdit: (open: boolean) => void;
}

const items2 = [
    {
        src:
            'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa1d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa1d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22218.3%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
        altText: 'Image could not be showcased',
        header: 'You have no images to show here yet :c',
        key: '1',
    },
];

const ProfileView: React.FC<PropsType> = ({ openEdit }) => {
    const { user: currentUser } = useContext(UserContext);
    const { allUsers } = useContext(UsersContext);
    const { allBooks } = useContext(BookContext);
    const { allTags } = useContext(TagContext);

    const [user, setUser] = useState<userInfo>();
    const [books, setBooks] = useState<bookType[]>([]);
    const [chosenBook, setChosenBook] = useState<bookType | null>(null);

    const [patterns, setPatterns] = useState<patternType[]>([]);
    const [followedUsers, setFollowedUsers] = useState<userInfo[]>([]);
    const [myFollowedUsers, setMyFollowedUsers] = useState<string[]>([]);

    const uid = useLocation().pathname.substring(9);

    useEffect(() => {
        const chosenUser = allUsers.find((u) => u.uid === uid);
        setUser(chosenUser);
        const ownedBooks = allBooks.filter((book) => book.owner === uid);
        setBooks(ownedBooks);
    }, [uid, allBooks, allUsers]);

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
                    owner: user,
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
                    dateCreated: data.dateCreated ? data.dateCreated : -1,
                    comments: data.comments ? data.comments : 0,
                });
            });

            setPatterns(
                loadedPatterns.sort((p1: patternType, p2: patternType) =>
                    (p1?.dateCreated ? p1.dateCreated : -1) >
                    (p2?.dateCreated ? p2.dateCreated : -1)
                        ? 1
                        : -1,
                ),
            );
        },
        [allTags, allBooks, user],
    );

    useEffect(() => {
        const unsubscribe = PatternService.getAll()
            .where('owner', '==', uid)
            .onSnapshot(onDataChange);

        return () => {
            unsubscribe();
        };
    }, [onDataChange, uid]);

    const onDataFollowedChange = useCallback(
        (items: any) => {
            if (allUsers.length > 0) {
                let newFollowedUsers = items.data()?.users ? items.data()?.users : [];
                newFollowedUsers = newFollowedUsers.map((followedUserId: string) =>
                    allUsers.find((u: userInfo) => u.uid === followedUserId),
                );
                setFollowedUsers(newFollowedUsers);
            }
        },
        [allUsers],
    );

    const onDataMyFollowedChange = useCallback((items: any) => {
        setMyFollowedUsers(items.data()?.users ? items.data()?.users : []);
    }, []);

    useEffect(() => {
        const unsubscribe2 = FollowedUsersService.getAll()
            .doc(currentUser?.uid ? currentUser.uid : '')
            .onSnapshot(onDataMyFollowedChange);

        const unsubscribe3 = FollowedUsersService.getAll()
            .doc(uid)
            .onSnapshot(onDataFollowedChange);

        return () => {
            unsubscribe2();
            unsubscribe3();
        };
    }, [onDataFollowedChange, onDataMyFollowedChange, currentUser?.uid, uid]);

    const getPatternsInBook = (bookId: string) => {
        return patterns.filter((p: patternType) => p.books.some((b: bookType) => b.id === bookId));
    };

    const changeFollow = (userId: string) => {
        let newMyFollowedUsers: string[] = [];
        if (myFollowedUsers.includes(userId)) {
            newMyFollowedUsers = [...myFollowedUsers.filter((id) => id !== userId)];
        } else {
            newMyFollowedUsers = [...myFollowedUsers, userId];
        }

        FollowedUsersService.setFollowed(
            currentUser?.uid ? currentUser.uid : '',
            newMyFollowedUsers,
        );
    };

    return (
        <Main>
            {currentUser?.uid === user?.uid && (
                <HelperText>
                    {`This is how other users see you profile. Click `}
                    <LinkButton block={false} onClick={() => openEdit(true)}>
                        here
                    </LinkButton>{' '}
                    to edit.
                </HelperText>
            )}

            <MarginItemDetail>
                <UncontrolledCarousel items={items2} />
                <ProfileHeader>
                    <img src={user?.avatar ? user.avatar : noAvatar} alt="avatar" />
                    <ItemHeader>{`${user?.username}`}</ItemHeader>
                    {uid !== currentUser?.uid && !myFollowedUsers.includes(uid) && (
                        <SuccessButton block={false} onClick={() => changeFollow(uid)}>
                            Follow
                        </SuccessButton>
                    )}
                    {uid !== currentUser?.uid && myFollowedUsers.includes(uid) && (
                        <DangerButton block={false} onClick={() => changeFollow(uid)}>
                            Unfollow
                        </DangerButton>
                    )}
                    {uid === currentUser?.uid && (
                        <img src={user?.avatar ? user.avatar : noAvatar} alt="avatar" />
                    )}
                </ProfileHeader>
                <Description
                    dangerouslySetInnerHTML={{
                        __html: user?.description ? user?.description : 'No description here ^^;',
                    }}
                />
            </MarginItemDetail>

            <MarginItemDetail>
                <ItemLabel style={{ marginTop: '0em' }}>Books</ItemLabel>
                {books.length === 0 && <div>You have no books :c</div>}
                {books.length > 0 &&
                    books.map((book) => (
                        <BookButton
                            key={book.label}
                            colour={book.colour}
                            onClick={() => setChosenBook(book)}
                        >
                            {`${book.label} (${getPatternsInBook(book.id).length} patterns)`}
                        </BookButton>
                    ))}
            </MarginItemDetail>
            <MarginItemDetail>
                <ItemLabel style={{ marginTop: '0em' }}>Followed users</ItemLabel>
                {followedUsers.length === 0 && uid === currentUser?.uid && (
                    <div>You follow no users</div>
                )}
                {followedUsers.length === 0 && uid !== currentUser?.uid && (
                    <div>This user follows noone.</div>
                )}
                {followedUsers.length > 0 &&
                    followedUsers.map((followedUser: userInfo) => (
                        <UserInfoRow key={followedUser.uid}>
                            <Link to={`/profile/${followedUser.uid}`}>
                                <img
                                    key={followedUser.uid}
                                    src={followedUser.avatar ? followedUser.avatar : undefined}
                                    alt={followedUser.avatar ? followedUser.avatar : undefined}
                                />
                                <span>{followedUser.username}</span>
                            </Link>
                        </UserInfoRow>
                    ))}
            </MarginItemDetail>

            {chosenBook && (
                <Modal isOpen={chosenBook !== null} toggle={() => setChosenBook(null)}>
                    <BookContainer
                        closeModal={() => setChosenBook(null)}
                        currentBook={chosenBook}
                        patterns={getPatternsInBook(chosenBook.id)}
                    />
                </Modal>
            )}
        </Main>
    );
};

export default ProfileView;
