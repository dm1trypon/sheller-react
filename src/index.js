import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import Shell from './Shell';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Shell />, document.getElementById('root'));

serviceWorker.unregister();
