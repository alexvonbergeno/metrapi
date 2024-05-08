<script setup>
    import StationList from "./components/StationList.vue";
    import TrainList from "./components/TrainList.vue";
    import Map from "./components/Map.vue";
    import ChatBox from "./components/ChatBox.vue";

    import axios from "axios";

    import { provide, ref } from "vue";

    /* WEBSOCKET */

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

    /* Load Data from Server */
    const apiUrl = "https://tarea-2.2024-1.tallerdeintegracion.cl/api/metro";
    provide("apiUrl", apiUrl);

    const trains = ref([]);
    const stations = ref({});
    const lines = ref([]);
    const loadData = async () => {
        let stationList = (await axios.get(apiUrl + "/stations")).data;
        let trainList =  (await axios.get(apiUrl + "/trains")).data;
        lines.value = (await axios.get(apiUrl + "/lines")).data;

        /* Preprocess to facilitate search of stations for later path creation */
        /* Also add line_ids together and remove for repeated stations */
        const searchableStations = {};
        stationList.forEach((st) => {
            if (st.station_id in searchableStations) {
                searchableStations[st.station_id].line_id += "/" + st.line_id;
            } else {
                st.trains = [];
                searchableStations[st.station_id] = st;
            }
        });
        stations.value = searchableStations;

        /* preprocess trains for search by train_id */
        const searchableTrains = {}
        trainList.forEach((tr) => {
            tr.position = {...stations.value[tr.origin_station_id]};
            tr.status = "moving";
            tr.passengers = 0;
            searchableTrains[tr.train_id] = tr;
        })
        trains.value = searchableTrains;
        /* Creating Path for Lines */
        /* To facilitate drawing metro lines in the map */
        /* we create a path (list of coordinates) */
        /* of the stations belonging to each line */
        let stationCoords = []
        lines.value.forEach((line) => {
            line.station_ids.forEach((st_id) => {
                stationCoords.push({
                    lat: parseFloat(stations.value[st_id].position.lat),
                    lng: parseFloat(stations.value[st_id].position.long)
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
            <Map :stations="stations" :trains="trains" :lines="lines" />
            <ChatBox />
        </div>
        <div class="row" id="bottom-row">
            <StationList :stations="stations"/>
            <TrainList :trains="trains"/>
        </div>
    </div>
</template>
