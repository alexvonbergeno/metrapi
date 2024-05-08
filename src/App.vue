<script setup>
import StationList from "./components/StationList.vue";
import TrainList from "./components/TrainList.vue";
import Map from "./components/Map.vue";
import ChatBox from "./components/ChatBox.vue";

import axios from "axios";

import { provide, ref } from "vue";


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

const trains = ref([]);
const stations = ref([]);
const lines = ref([]);
const loading = ref(true);
const loadData = async () => {
    trains.value = (await axios.get(apiUrl + "/trains")).data;
    stations.value = (await axios.get(apiUrl + "/stations")).data;
    lines.value = (await axios.get(apiUrl + "/lines")).data;
    loading.value = false;

    const searchableStations = {};
    stations.value.forEach((st) => {
        searchableStations[st.station_id] = st;
    });

    let stationCoords = []
    lines.value.forEach((line) => {
        line.station_ids.forEach((st_id) => {
            stationCoords.push({
                lat: parseFloat(searchableStations[st_id].position.lat),
                lng: parseFloat(searchableStations[st_id].position.long)
            });
        })
        line.path = [...stationCoords];
        stationCoords = [];
    });
};
loadData();

</script>

<template>
    <div class="row-container">
        <div class="row" id="top-row">
            <Map v-if="!loading" :stations="stations" :trains="trains" :lines="lines" />
            <ChatBox />
        </div>
        <div class="row" id="bottom-row">
            <StationList v-if="!loading" :stations="stations"/>
            <TrainList v-if="!loading" :trains="trains"/>
        </div>
    </div>
</template>
