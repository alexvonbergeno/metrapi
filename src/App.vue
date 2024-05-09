<script setup>
    import StationList from "./components/StationList.vue";
    import TrainList from "./components/TrainList.vue";
    import Map from "./components/Map.vue";
    import ChatBox from "./components/ChatBox.vue";

    import axios from "axios";

    import { provide, ref } from "vue";

    /* WEBSOCKET */
    const clientUsername = "Sebasthian";
    const webSocketServerUrl = "wss://tarea-2.2024-1.tallerdeintegracion.cl/connect";
    const webSocket = new WebSocket(webSocketServerUrl);
    webSocket.onopen = (event) => {
        webSocket.send({
            "type": "JOIN",
            "payload": {
                "id": "15635635",
                "username": clientUsername
            }
        });
    }
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
    const getOrCreateTrain = (key) => {
        if (!(key in Object.keys(trains.value))) {
            trains.value[key] = {}
        }
        return trains.value[key];
    }

    webSocket.eventHandlers["position"] = (event) => {
        let tr = getOrCreateTrain(event.data.train_id);
        let newPos = {
            lat: parseFloat(event.data.position.lat),
            lng: parseFloat(event.data.position.long)
        }
        tr.position = newPos;
        tr.line_id = event.data.line_id
        tr.history.push(event);
    }

    webSocket.eventHandlers["status"] = (event) => {
        let tr = trains.value[event.data.train_id];
        tr.status = event.data.status;
        tr.history.push(event);
    }

    webSocket.eventHandlers["arrival"] = (event) => {
        let tr = trains.value[event.data.train_id];
        tr.last_station_id = event.data.station_id;
        tr.history.push(event);
    }

    webSocket.eventHandlers["departure"] = (event) => {
        let tr = trains.value[event.data.train_id];
        tr.history.push(event);
    }

    webSocket.eventHandlers["boarding"] = (event) => {
        let tr = trains.value[event.data.train_id];
        tr.passengers += parseInt(event.data.boarded_passengers);
        tr.history.push(event);
    }

    webSocket.eventHandlers["unboarding"] = (event) => {
        let tr = trains.value[event.data.train_id];
        tr.passengers -= parseInt(event.data.unboarded_passengers);
        tr.history.push(event);
    }

    /* Load Data from Server */
    const apiUrl = "https://tarea-2.2024-1.tallerdeintegracion.cl/api/metro";
    provide("apiUrl", apiUrl);

    const trains = ref({});
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
                st.position = {
                    lat: parseFloat(st.position.lat),
                    lng: parseFloat(st.position.long)
                }
                searchableStations[st.station_id] = st;
            }
        });
        stations.value = searchableStations;

        /* preprocess trains for search by train_id */
        const searchableTrains = {}
        trainList.forEach((tr) => {
            tr.position = {...stations.value[tr.origin_station_id].position};
            tr.last_station_id = tr.origin_station_id;
            tr.status = "moving";
            tr.passengers = 0;
            tr.history = [];
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
                stationCoords.push({...stations.value[st_id].position});
            })
            line.path = [...stationCoords];
            stationCoords = [];
        });
    };
    loadData();
    provide("webSocket", webSocket);
</script>

<template>
    <div class="row-container">
        <div class="row" id="top-row">
            <Map :stations="stations" :trains="trains" :lines="lines" />
            <ChatBox :clientUsername="clientUsername"/>
        </div>
        <div class="row" id="bottom-row">
            <StationList :stations="stations"/>
            <TrainList :trains="trains"/>
        </div>
    </div>
</template>
