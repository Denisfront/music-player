import { createApp } from 'vue';

import App from './App.vue';
import router from './providers/router';
import store from './providers/store';

import './assets/scss/base.scss';

const app = createApp(App);

app.use(router);
app.use(store);

export default app;
