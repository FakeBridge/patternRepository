import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Login from './login';

const isLoggedIn = false;

const App: React.FC = () => {
    if (!isLoggedIn) {
        return (
            <BrowserRouter>
                <Route path="/" component={Login} />
            </BrowserRouter>
        );
    }
    return (
        <div className="App">
            <header className="App-header">
                <p> Hello worlad! </p>
            </header>
        </div>
    );
};

export default App;
