import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { auth } from '../logic/firebase';

import { UserContext } from '../logic/providers/userProvider';

import { PageHeader as PH, HeaderName, Navigation, NavItem } from '../design/styledComponents';

const PageHeader: React.FC = () => {
    const { user } = useContext(UserContext);

    const logOutHandler = (event: any) => {
        event.preventDefault();
        auth.signOut();
    };

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
                <NavItem style={{ float: 'right' }}>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            {`Welcome ${user?.username}`}
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                                <Link to={`/profile/${user?.uid}`}>Profile</Link>
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
