import React from 'react';
import { TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

import SignUp from './signUp';
import SignIn from './signIn';

import { LoginCard, Tabs, Tab } from '../../design/styledComponents';

const Login: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState(1);

    const toggle = (tab: React.SetStateAction<number>) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    return (
        <LoginCard>
            <Tabs>
                <Tab
                    className={classnames({ active: activeTab === 1 })}
                    onClick={() => {
                        toggle(1);
                    }}
                >
                    Sign in
                </Tab>
                <Tab
                    className={classnames({ active: activeTab === 2 })}
                    onClick={() => {
                        toggle(2);
                    }}
                >
                    Create an account
                </Tab>
            </Tabs>
            <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
                    <SignIn />
                </TabPane>
                <TabPane tabId={2}>
                    <SignUp />
                </TabPane>
            </TabContent>
        </LoginCard>
    );
};

export default Login;
