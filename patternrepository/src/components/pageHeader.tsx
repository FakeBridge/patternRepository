import React, { useContext } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { auth } from '../logic/firebase';

import { UserContext } from '../logic/providers/userProvider';

import {
    PageHeader as PH,
    HeaderName,
    Navigation,
    NavItem,
    NavLink,
} from '../design/styledComponents';

const PageHeader: React.FC = () => {
    const { user } = useContext(UserContext);

    const logOutHandler = (event: any) => {
        event.preventDefault();
        auth.signOut();
    };

    return (
        <PH>
            <HeaderName href="/" onClick={(e) => e.preventDefault()}>
                patternRepository
            </HeaderName>
            <Navigation>
                <NavItem>
                    <NavLink href="/" onClick={(e) => e.preventDefault()}>
                        Home
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/">Browse patterns</NavLink>
                </NavItem>
                <NavItem style={{ float: 'right' }}>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            {`Welcome ${user?.username}`}
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem href={`/profile/${user?.uid}`}>Profile</DropdownItem>
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
