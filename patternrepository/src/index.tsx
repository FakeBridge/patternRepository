import React from 'react';
import ReactDOM from 'react-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
    faTrash,
    faPrint,
    faFileDownload,
    faSpinner,
    faCopy,
    faInfoCircle,
    faHeart,
    faArrowUp,
    faArrowDown,
    faPlus,
    faCommentAlt,
} from '@fortawesome/free-solid-svg-icons';

import App from './components/App';

import 'bootstrap/dist/css/bootstrap.css';
import './design/styles.scss';

library.add(
    fab,
    faTrash,
    faPrint,
    faFileDownload,
    faSpinner,
    faCopy,
    faInfoCircle,
    faHeart,
    faArrowUp,
    faArrowDown,
    faPlus,
    faCommentAlt,
);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);
