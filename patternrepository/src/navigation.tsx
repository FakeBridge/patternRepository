import React, { useContext } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Login from './login/index';
import PageHeader from './pageHeader';
import Profile from './userProfile';

import Error from './components/errorCard';

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
        <BrowserRouter>
            <Route path="/" component={PageHeader} />
            <Route exact path="/profile" component={Error} />
            <Route exact path="/profile/:userID" component={Profile} />
        </BrowserRouter>
    );
};

export default Navigation;
