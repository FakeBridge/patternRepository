import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { auth } from '../logic/firebase';

import { UserContext } from '../logic/providers/userProvider';
import { UsersContext } from '../logic/providers/usersProvider';

import { PageHeader as PH, HeaderName, Navigation, NavItem } from '../design/styledComponents';

const PageHeader: React.FC = () => {
    const { user } = useContext(UserContext);
    const { allUsers } = useContext(UsersContext);

    const logOutHandler = (event: any) => {
        event.preventDefault();
        auth.signOut();
    };

    const updatedUser = allUsers.find((u) => u.uid === user?.uid);

    return (
        <PH>
            <HeaderName>
                <Link to="/home">patternRepository</Link>
            </HeaderName>
            <Navigation>
                <NavItem>
                    <Link to="/home">Home</Link>
                </NavItem>
                <NavItem>
                    <Link to="/patterns">Browse patterns</Link>
                </NavItem>
                <NavItem>
                    <Link to="/about">About us</Link>
                </NavItem>
                <NavItem>
                    <Link to="/note-to-admins">Something wrong? Let us know!</Link>
                </NavItem>
                <NavItem style={{ float: 'right' }}>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            {`Welcome ${user?.username}`}
                            {updatedUser?.hasUnreadNotes && (
                                <FontAwesomeIcon
                                    style={{ color: '#DB7093', paddingLeft: '0.2em' }}
                                    icon={['fas', 'circle']}
                                />
                            )}
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                                <Link to={`/profile/${user?.uid}`}>Profile</Link>
                            </DropdownItem>
                            <DropdownItem>
                                <Link to="/notes">
                                    Notes{' '}
                                    {updatedUser?.hasUnreadNotes && (
                                        <FontAwesomeIcon
                                            style={{ color: '#DB7093', paddingLeft: '0.2em' }}
                                            icon={['fas', 'circle']}
                                        />
                                    )}
                                </Link>
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={logOutHandler}>Log out</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </NavItem>
            </Navigation>
        </PH>
    );
};

export default PageHeader;
