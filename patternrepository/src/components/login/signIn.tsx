import React, { useState, useCallback } from 'react';
import { Button, Input, Label } from 'reactstrap';
import { auth } from '../../logic/firebase';

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
        <div>
            <Label>E-mail</Label>
            <Input
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Label>password</Label>
            <Input
                placeholder="Enter password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <p>{error}</p>
            <Button block onClick={signInWithEmailAndPasswordHandler}>
                Sign in
            </Button>
        </div>
    );
};
export default SignIn;
