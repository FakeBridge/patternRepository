import React from 'react';
import { Button, Input, Label } from 'reactstrap';
import { auth } from '../firebase';

const SignIn: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [error, setError] = React.useState<string | null>(null);

    const signInWithEmailAndPasswordHandler = (event: any) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password).catch((errorData) => {
            setError('Error signing in with password and email!');
            console.error('Error signing in with password and email', errorData);
        });
    };

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
