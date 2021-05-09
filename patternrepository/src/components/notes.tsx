import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { firestore } from '../logic/firebase';
import { UserContext } from '../logic/providers/userProvider';
import { UsersContext } from '../logic/providers/usersProvider';
import NoteService from '../logic/services/noteServices';

import { note as noteType, user as userType } from '../logic/types';

import {
    Main,
    MarginItemDetail,
    Description,
    UserInfoRow,
    HelperText,
    InvisibleIconButton,
} from '../design/styledComponents';

const Notes: React.FC = () => {
    const { user } = useContext(UserContext);
    const { allUsers } = useContext(UsersContext);

    const [notes, setNotes] = useState<noteType[]>([]);

    const location = useLocation();

    const onDataChange = useCallback(
        (items: any) => {
            let loadedNotes: noteType[] = [];
            loadedNotes = [];

            items.docs.forEach((item: any) => {
                const { id } = item;
                const data = item.data();

                loadedNotes.push({
                    id,
                    by: allUsers.find((u: userType) => u?.uid === data.by),
                    message: data.message,
                    dateCreated: data.dateCreated,
                    to: allUsers.find((u: userType) => u?.uid === data.to),
                    seen: data.seen,
                });
            });

            setNotes(
                loadedNotes.sort((n1: noteType, n2: noteType) =>
                    n1.dateCreated > n2.dateCreated ? -1 : 1,
                ),
            );
        },
        [allUsers],
    );

    useEffect(() => {
        const unsubscribe = NoteService.getAll()
            .where('to', '==', user?.uid)
            .onSnapshot(onDataChange);

        return () => {
            unsubscribe();
        };
    }, [onDataChange, user?.uid]);

    const removeNote = (id: string) => {
        NoteService.remove(id);
    };

    useEffect(() => {
        if (location.pathname === '/notes') {
            firestore
                .collection(`users`)
                .doc(user?.uid ? user.uid : '')
                .update({
                    hasUnreadNotes: false,
                });
        }
    }, [user?.uid, location.pathname]);

    return (
        <Main>
            <MarginItemDetail>
                {notes.length === 0 && <Description>You have no notes!</Description>}
                {notes.map((note: noteType) => (
                    <Description key={note.id} style={{ marginBottom: '1em' }}>
                        <UserInfoRow>
                            <Link to={`/profile/${note.by?.uid}`}>
                                <img
                                    key={note.by?.uid}
                                    src={note.by?.avatar ? note.by.avatar : undefined}
                                    alt={note.by?.avatar ? note.by.avatar : undefined}
                                />
                                <span>{note.by?.username}</span>
                            </Link>
                            <HelperText style={{ marginLeft: '1em' }}>
                                {moment.unix(note.dateCreated).format('DD.MM.YYYY HH:mm')}
                            </HelperText>
                            <InvisibleIconButton
                                style={{ fontSize: '1em', float: 'right' }}
                                red
                                onClick={() => removeNote(note.id)}
                            >
                                <FontAwesomeIcon icon={['fas', 'trash']} />
                            </InvisibleIconButton>
                        </UserInfoRow>
                        {!note.message.includes('pattern') && <span>note.message</span>}
                        {note.message.includes('pattern') && (
                            <>
                                <span>
                                    {note.message.substring(0, note.message.lastIndexOf('!'))}
                                </span>
                                <Link
                                    to={`/patterns/${note.message.substring(
                                        note.message.lastIndexOf('-') + 1,
                                    )}`}
                                >
                                    {note.message.substring(
                                        note.message.lastIndexOf('!'),
                                        note.message.lastIndexOf('-'),
                                    )}
                                </Link>
                            </>
                        )}
                    </Description>
                ))}
            </MarginItemDetail>
        </Main>
    );
};

export default Notes;
