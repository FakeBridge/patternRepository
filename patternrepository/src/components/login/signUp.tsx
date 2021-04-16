import React, { useState } from 'react';
import { auth, generateUserDocument } from '../../logic/firebase';

import { isEmail } from '../../logic/helperFunctions';

import {
    SuccessButton,
    Input,
    Label,
    FormGroup,
    DangerAlert,
    HelperText,
} from '../../design/styledComponents';

const SignUp: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const [error, setError] = useState<string | null>(null);

    const createUserWithEmailAndPasswordHandler = async (event: any) => {
        event.preventDefault();
        try {
            const { user } = await auth.createUserWithEmailAndPassword(email, password);
            generateUserDocument(user, { username });
        } catch (errorData) {
            setError('Error Signing up with email and password');
        }

        setUsername('');
        setEmail('');
        setPassword('');
        setPasswordRepeat('');
        event.preventDefault();
    };

    return (
        <>
            <FormGroup>
                <Label>Username</Label>
                <Input
                    block
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <HelperText>You can change your username later ^^</HelperText>
            </FormGroup>
            <FormGroup>
                <Label>E-mail</Label>
                <Input
                    block
                    placeholder="Enter mail"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        if (!isEmail(e.target.value)) {
                            setError('This is not a valid email!');
                        } else {
                            setError(null);
                        }
                        setEmail(e.target.value);
                    }}
                />
            </FormGroup>
            <FormGroup>
                <Label>Password</Label>
                <Input
                    block
                    placeholder="Enter password"
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <HelperText>Password has to have at least six characters</HelperText>
            </FormGroup>
            <FormGroup>
                <Label>Repeat password</Label>
                <Input
                    block
                    placeholder="Repeat password"
                    value={passwordRepeat}
                    type="password"
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                />
            </FormGroup>

            {error && <DangerAlert>{error}</DangerAlert>}
            <SuccessButton block onClick={createUserWithEmailAndPasswordHandler}>
                Sign up
            </SuccessButton>
        </>
    );
};

export default SignUp;
