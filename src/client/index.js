import 'normalize.css';
import './styles/main.scss';
import './styles/form.scss';
import './styles/entries.scss';

import { registerFormHandlers } from './js/forms';
import { loadRecentTrips } from './js/tripPreview';
import registerServiceWorker from './js/registerServiceWorker';

registerServiceWorker();

window.addEventListener('load', () => {
    loadRecentTrips();
    registerFormHandlers();
});
