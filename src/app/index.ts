import { createApp } from 'vue';
import App from './App.vue';
import router from './providers/router';

import './assets/scss/base.scss';

const app = createApp(App);

app.use(router);

export default app;
