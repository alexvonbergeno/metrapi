import "./assets/main.css";

import { createApp } from "vue";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyAcQxzoE5uarJ9OLpAxvW4bsqDINgOf030',
    },
}).mount("#app");
