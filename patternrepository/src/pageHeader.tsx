import React, { useContext } from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

import { UserContext } from './providers/userProvider';

const PageHeader: React.FC = () => {
    const { user } = useContext(UserContext);

    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">patternRepository</NavbarBrand>

                <Nav className="" navbar style={{ width: '-webkit-fill-available' }}>
                    <NavItem>
                        <NavLink href="/">Home</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/patterns">Browse patterns</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/smth">Smth</NavLink>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar style={{ marginLeft: 'auto' }}>
                        <DropdownToggle nav caret>
                            {`Welcome ${user?.username}`}
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem href={`/profile/${user?.uid}`}>Profile</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Log out</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            </Navbar>
        </div>
    );
};

export default PageHeader;
