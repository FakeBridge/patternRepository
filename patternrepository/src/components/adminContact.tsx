import React, { useContext, useState } from 'react';
import moment from 'moment';
import NoteService from '../logic/services/noteServices';
import { UserContext } from '../logic/providers/userProvider';
import { firestore } from '../logic/firebase';

import { noteToAdd } from '../logic/types';

import {
    ItemDetail,
    ItemHeader,
    Label,
    Textarea,
    FormGroup,
    ButtonRow,
    SuccessButton,
    Main,
    SuccessAlert,
} from '../design/styledComponents';

const AdminContact: React.FC = () => {
    const { user } = useContext(UserContext);

    const [message, setMessage] = useState<string>('');
    const [messageSent, setMessageSent] = useState<boolean>(false);

    const handleSend = () => {
        const newNote: noteToAdd = {
            by: user?.uid ? user.uid : 'none',
            message,
            dateCreated: moment().unix(),
            to: 'TpuR73pwRvdMXsmDfI77L193XBH2',
            seen: false,
        };
        NoteService.create(newNote);

        firestore
            .collection(`users`)
            .doc('TpuR73pwRvdMXsmDfI77L193XBH2')
            .update({
                hasUnreadNotes: true,
            })
            .then(() => {})
            .catch((e) => console.log(e));
        setMessage('');
        setMessageSent(true);
    };

    return (
        <Main style={{ marginTop: '2em' }}>
            <ItemDetail>
                <ItemHeader>Write to us!</ItemHeader>

                <FormGroup>
                    <Label>
                        Is sometnig not working as it should? Do you have a suggestion to make this
                        page better? Let us know below:
                    </Label>
                    <Textarea
                        name="message"
                        placeholder="Enter your message here"
                        value={message}
                        onChange={(e) => {
                            setMessageSent(false);
                            setMessage(e.target.value ? e.target.value.toString() : '');
                        }}
                    />
                </FormGroup>

                {messageSent && <SuccessAlert>Your message was sent!</SuccessAlert>}
                <ButtonRow>
                    <SuccessButton block={false} onClick={handleSend}>
                        Send!
                    </SuccessButton>
                </ButtonRow>
            </ItemDetail>
        </Main>
    );
};

export default AdminContact;
