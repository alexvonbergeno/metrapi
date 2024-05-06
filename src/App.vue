<script setup>
import { RouterLink, RouterView } from "vue-router";
import StationList from "./components/StationList.vue";
import TrainList from "./components/TrainList.vue";

import { provide } from "vue";


const apiUrl = "https://tarea-2.2024-1.tallerdeintegracion.cl/api/metro";
provide("apiUrl", apiUrl);

const webSocketServerUrl = "wss://tarea-2.2024-1.tallerdeintegracion.cl/connect";
const webSocket = new WebSocket(webSocketServerUrl);
webSocket.onopen = (event) => console.log(event);
webSocket.eventTypes = ["position", "status", "arrival", "departure", "boarding", "unboarding", "message"];
webSocket.eventHandlers = {};
webSocket.eventTypes.forEach(eventType => {
    webSocket.eventHandlers[eventType] = (event) => console.log(event);
});
webSocket.onmessage = (event) => {
    if (event.type in webSocket.eventTypes) {
        let eventHandler = webSocket.eventHandlers[event.type];
        eventHandler(event);
    } else {
        console.log(event);
    }
}

provide("webSocket", webSocket);

</script>

<template>
    <!-- <header>
        <img
            alt="Vue logo"
            class="logo"
            src="@/assets/logo.svg"
            width="125"
            height="125"
        >

        <div class="wrapper">
            <HelloWorld msg="You did it!" />

            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </div>
    </header> -->
    <div class="row-container">
        <div class="row" id="top-row">
            <p>Here goes map</p>
        </div>
        <div class="row" id="bottom-row">
            <StationList />
            <TrainList />
        </div>
    </div>

    
</template>
