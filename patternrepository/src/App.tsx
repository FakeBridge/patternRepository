import React from 'react';
import UserProvider from './providers/userProvider';
import Navigation from './navigation';

const App: React.FC = () => {
    return (
        <UserProvider>
            <Navigation />
        </UserProvider>
    );
};

export default App;
