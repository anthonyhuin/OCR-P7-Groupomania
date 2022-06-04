import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";
import Notifications from "@kyvg/vue3-notification";
import clickOutside from "vue3-clickoutside-component";
import ResizeTextarea from "resize-textarea-vue3";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(clickOutside);
app.use(ResizeTextarea);
app.use(Notifications);
app.mount("#app");
