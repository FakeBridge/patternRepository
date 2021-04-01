import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import SignUp from './signUp';
import SignIn from './signIn';

const Login: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState(1);

    const toggle = (tab: React.SetStateAction<number>) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    return (
        <div className="login">
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 1 })}
                        onClick={() => {
                            toggle(1);
                        }}
                    >
                        Sign in
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 2 })}
                        onClick={() => {
                            toggle(2);
                        }}
                    >
                        Create an account
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
                    <SignIn />
                </TabPane>
                <TabPane tabId={2}>
                    <SignUp />
                </TabPane>
            </TabContent>
        </div>
    );
};

export default Login;
