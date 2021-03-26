import React from 'react';
import { Button, Input, Label } from 'reactstrap';
import { auth, generateUserDocument } from '../firebase';

const SignUp: React.FC = () => {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordRepeat, setPasswordRepeat] = React.useState('');

    const [error, setError] = React.useState<string | null>(null);

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
        <div>
            <Label>Username</Label>
            <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Label>E-mail</Label>
            <Input
                placeholder="Enter mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Label>Password</Label>
            <Input
                placeholder="Enter password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Label>Repeat password</Label>
            <Input
                placeholder="Repeat password"
                value={passwordRepeat}
                type="password"
                onChange={(e) => setPasswordRepeat(e.target.value)}
            />

            <p>{error}</p>
            <Button block onClick={createUserWithEmailAndPasswordHandler}>
                Sign up
            </Button>
        </div>
    );
};

export default SignUp;
