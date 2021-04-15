import React, { useState, useCallback } from 'react';
import { auth } from '../../logic/firebase';

import { SuccessButton, Input, Label, FormGroup, DangerAlert } from '../../design/styledComponents';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);

    const signInWithEmailAndPasswordHandler = useCallback(
        (event: any) => {
            event.preventDefault();
            auth.signInWithEmailAndPassword(email, password).catch((errorData) => {
                setError('Error signing in with password and email!');
                console.error('Error signing in with password and email', errorData);
            });
        },
        [email, password],
    );

    return (
        <>
            <FormGroup>
                <Label>E-mail</Label>
                <Input
                    block
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
            </FormGroup>
            {error && <DangerAlert>{error}</DangerAlert>}
            <SuccessButton block onClick={signInWithEmailAndPasswordHandler}>
                Sign in
            </SuccessButton>
        </>
    );
};
export default SignIn;
