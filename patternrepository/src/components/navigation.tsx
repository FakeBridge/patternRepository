import React, { useContext } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Login from './login/index';
import PageHeader from './pageHeader';
import Profile from './userProfile';
import PatternList from './patternList';

import Error from './generalComponents/errorCard';

import { UserContext } from '../logic/providers/userProvider';

const Navigation: React.FC = () => {
    const { user } = useContext(UserContext);
    if (!user) {
        return <Login />;
    }
    return (
        <BrowserRouter>
            <Route path="/" component={PageHeader} />
            <Route exact path={['/', '/patterns']} component={PatternList} />
            <Route exact path="/profile" component={Error} />
            <Route exact path="/profile/:userID" component={Profile} />
        </BrowserRouter>
    );
};

export default Navigation;
