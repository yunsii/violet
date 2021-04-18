// @ts-nocheck
import ReactDOM from 'react-dom';

import App from './App';
import { MOUNT_ELEMENT_ID, checkEntry, injectCss, autoReload, listenServiceWorker } from './utils';
import './global.less';

checkEntry();
injectCss();
autoReload();
listenServiceWorker();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById(MOUNT_ELEMENT_ID)
);
