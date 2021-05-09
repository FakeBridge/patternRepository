import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../logic/providers/userProvider';

import {
    Main,
    MarginItemDetail,
    ProfileHeader,
    ItemHeader,
    Description,
} from '../design/styledComponents';

const HomePage: React.FC = () => {
    const { user } = useContext(UserContext);

    return (
        <Main>
            <MarginItemDetail>
                <ProfileHeader style={{ marginBottom: '1em' }}>
                    <ItemHeader>Welcome to pattern repository!</ItemHeader>
                </ProfileHeader>
                <Description>
                    <p>
                        {`This page let's you store all of your patterns and works, inspire and get
                    inspired by others.`}
                    </p>
                    <h3>Where to now?</h3>
                    <p>
                        Visit our pattern <Link to="/patterns">browsing section</Link> where you can
                        see all of the cool patterns on this page. I you want, you can even make
                        your own or copy some to your collection.
                    </p>
                    <p>
                        Wanna let others know something about you? Go to your{' '}
                        <Link to={`/profile/${user?.uid}`}>profile page</Link> and customize your
                        username, avatar and write something about yourself.
                    </p>
                    <p>
                        Something not working or you have suggestion to make this app better?{' '}
                        <Link to="/note-to-admins">Let us know!</Link>
                    </p>
                </Description>
            </MarginItemDetail>
        </Main>
    );
};

export default HomePage;
