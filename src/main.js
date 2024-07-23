import "./assets/main.css";

import { createApp } from "vue";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(VueGoogleMaps, {
    load: {
        key: process.env.GMAP_KEY,
    },
}).mount("#app");
