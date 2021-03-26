import React, { useContext } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Login from './login/index';

import { UserContext } from './providers/userProvider';

const Navigation: React.FC = () => {
    const { user } = useContext(UserContext);
    if (!user) {
        return (
            <BrowserRouter>
                <Route path="/" component={Login} />
            </BrowserRouter>
        );
    }
    return (
        <div className="App">
            <header className="App-header">
                <p>{` Hello world and ${user.username}! `} </p>
            </header>
        </div>
    );
};

export default Navigation;
