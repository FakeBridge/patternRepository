import React from 'react';
import {
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Button,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
} from 'reactstrap';
import classnames from 'classnames';

const Login: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState(1);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordRepeat, setPasswordRepeat] = React.useState('');

    const toggle = (tab: React.SetStateAction<number>) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    const [error, setError] = React.useState<string | null>(null);

    const signInWithEmailAndPasswordHandler = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setError('a');
    };

    const createUserWithEmailAndPasswordHandler = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setEmail('');
        setPassword('');
        setPasswordRepeat('');
    };

    return (
        <div className="login">
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 1 })}
                        onClick={() => {
                            toggle(1);
                        }}
                    >
                        Log in
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 2 })}
                        onClick={() => {
                            toggle(2);
                        }}
                    >
                        Create an account
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>email</InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>password</InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="password"
                            value={password}
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </InputGroup>
                    <p>{error}</p>
                    <Button block onClick={signInWithEmailAndPasswordHandler}>
                        Log in
                    </Button>
                </TabPane>
                <TabPane tabId={2}>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>email</InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>password</InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="password"
                            value={password}
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>repeat password</InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="repeat password"
                            value={passwordRepeat}
                            type="password"
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                        />
                    </InputGroup>
                    <Button block onClick={createUserWithEmailAndPasswordHandler}>
                        Sign up
                    </Button>
                </TabPane>
            </TabContent>
        </div>
    );
};

export default Login;
