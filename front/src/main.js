import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";
import Notifications from "@kyvg/vue3-notification";
import clickOutside from "vue3-clickoutside-component";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(clickOutside);
app.use(Notifications);
app.mount("#app");
