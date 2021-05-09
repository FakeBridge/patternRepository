import React, { useContext } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Login from './login/index';
import PageHeader from './pageHeader';
import HomePage from './homePage';
import Notes from './notes';
import AdminContact from './adminContact';
import Profile from './userProfile';
import PatternList from './patternList';
import UsersProvider from '../logic/providers/usersProvider';

import Error from './generalComponents/errorCard';

import { UserContext } from '../logic/providers/userProvider';

import { Body, Content } from '../design/styledComponents';

const Navigation: React.FC = React.memo(() => {
    const { user } = useContext(UserContext);

    return (
        <Body>
            <Content>
                <BrowserRouter>
                    <UsersProvider>
                        <>
                            <PageHeader />
                            {!user && <Route path="/" component={Login} />}
                            {user && (
                                <>
                                    <Route
                                        path={['/patterns', '/patterns/:patternID']}
                                        component={PatternList}
                                    />
                                    <Route exact path={['/', '/home']} component={HomePage} />
                                    <Route exact path="/profile" component={Error} />
                                    <Route exact path="/profile/:userID" component={Profile} />
                                    <Route exact path="/note-to-admins" component={AdminContact} />
                                    <Route exact path="/notes" component={Notes} />
                                </>
                            )}
                        </>
                    </UsersProvider>
                </BrowserRouter>
            </Content>
        </Body>
    );
});

Navigation.displayName = 'Navigation';

export default Navigation;
