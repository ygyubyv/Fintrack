import "./assets/main.css";
import "@cyhnkckali/vue3-color-picker/dist/style.css";
import "vue-toast-notification/dist/theme-bootstrap.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import { AUTH_CONFIG } from "./config";

import { FontAwesomeIcon } from "./plugins/fontAwesome";

import App from "./App.vue";
import router from "./router";

import GoogleSignInPlugin from "vue3-google-signin";
import ToastPlugin from "vue-toast-notification";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(GoogleSignInPlugin, {
  clientId: AUTH_CONFIG.googleClientId,
});

app.use(ToastPlugin);

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
