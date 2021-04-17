import React, { useContext } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Login from './login/index';
import PageHeader from './pageHeader';
import Profile from './userProfile';
import PatternList from './patternList';

import Error from './generalComponents/errorCard';

import { UserContext } from '../logic/providers/userProvider';

import { Body } from '../design/styledComponents';

const Navigation: React.FC = React.memo(() => {
    const { user } = useContext(UserContext);

    return (
        <Body>
            <PageHeader />
            <BrowserRouter>
                {!user && <Route path="/" component={Login} />}
                {user && (
                    <>
                        <Route exact path="/" component={PatternList} />
                        <Route exact path="/profile" component={Error} />
                        <Route exact path="/profile/:userID" component={Profile} />
                    </>
                )}
            </BrowserRouter>
        </Body>
    );
});

Navigation.displayName = 'Navigation';

export default Navigation;
