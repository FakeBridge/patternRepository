import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import 'bootstrap/dist/css/bootstrap.css';
import './design/styles.scss';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);
