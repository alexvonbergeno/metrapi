<script setup>
    import StationList from "./components/StationList.vue";
    import TrainList from "./components/TrainList.vue";
    import Map from "./components/Map.vue";
    import ChatBox from "./components/ChatBox.vue";

    import axios from "axios";

    import { onMounted, provide, ref } from "vue";

    /* WEBSOCKET */
    const clientUsername = "Sebasthian";
    const webSocketServerUrl = "wss://tarea-2.2024-1.tallerdeintegracion.cl/connect";
    const webSocket = new WebSocket(webSocketServerUrl);
    webSocket.eventTypes = ["position", "status", "arrival", "departure", "boarding", "unboarding", "message"];
    webSocket.eventHandlers = {};
    webSocket.eventTypes.forEach(eventType => {
        webSocket.eventHandlers[eventType] = (event) => console.log(event);
    });
    webSocket.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if (webSocket.eventTypes.includes(data.type)) {
            let eventHandler = webSocket.eventHandlers[data.type];
            eventHandler(event);
        }
    }
    provide("webSocket", webSocket);
    const getOrLoadTrains = async (data) => {
        if (!trains.value[data.train_id]) {
            console.log("Attempting Train Load");
            await loadTrains();
            return await getOrLoadTrains(data);
        } else {
            return trains.value[data.train_id];
        }
    }

    webSocket.eventHandlers["position"] = async (e) => {
        let event = JSON.parse(e.data);
        let tr = await getOrLoadTrains(event.data);
        let newPos = {
            "lat": parseFloat(event.data.position.lat),
            "lng": parseFloat(event.data.position.long)
        }
        tr.position = newPos;
        tr.line_id = event.data.line_id
        tr.history.push(event);
        trains.value[event.data.train_id] = tr;
    }

    webSocket.eventHandlers["status"] = async (e) => {
        let event = JSON.parse(e.data)
        let tr = await getOrLoadTrains(event.data);
        tr.status = event.data.status;
        tr.excited = true;
        tr.history.push(event);
        setTimeout(() => {
            tr.excited = false
        }, 1000)
    }

    webSocket.eventHandlers["arrival"] = async (e) => {
        let event = JSON.parse(e.data);
        let tr = await getOrLoadTrains(event.data);
        tr.last_station_id = event.data.station_id;
        tr.history.push(event);
        stations.value[event.data.station_id].trains.push(tr);
    }

    webSocket.eventHandlers["departure"] = async (e) => {
        let event = JSON.parse(e.data);
        let tr = await getOrLoadTrains(event.data);
        tr.history.push(event);
        stations.value[event.data.station_id].trains.filter((train) => train.train_id == tr.train_id);
    }

    webSocket.eventHandlers["boarding"] = async (e) => {
        let event = JSON.parse(e.data);
        let tr = await getOrLoadTrains(event.data);
        tr.passengers += parseInt(event.data.boarded_passengers);
        tr.history.push(event)
    }

    webSocket.eventHandlers["unboarding"] = async (e) => {
        let event = JSON.parse(e.data);
        let tr = await getOrLoadTrains(event.data);
        tr.passengers -= parseInt(event.data.unboarded_passengers);
        tr.history.push(event);
    }

    webSocket.eventHandlers["message"] = (e) => {
        let event = JSON.parse(e.data);
        messages.value.push(event);
        if (messages.value.length > 4) {
            messages.value = messages.value.slice(1)
        }

    }

    /* Load Data from Server */
    const apiUrl = "https://tarea-2.2024-1.tallerdeintegracion.cl/api/metro";

    const trains = ref({});
    const stations = ref({});
    const lines = ref([]);
    const messages = ref([]);
    const loading = ref(true);

    const loadStations = async () => {
        let stationList = (await axios.get(apiUrl + "/stations")).data;
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
    }

    const loadTrains = async () => {
        let trainList =  (await axios.get(apiUrl + "/trains")).data;
        /* preprocess trains for search by train_id */
        const searchableTrains = {}
        trainList.forEach((tr) => {
            if (!trains.value[tr.train_id]) {
                tr.position = {...stations.value[tr.origin_station_id].position};
                tr.last_station_id = tr.origin_station_id;
                tr.status = "traveling";
                tr.passengers = 0;
                tr.history = [];
                tr.excited = false;
                searchableTrains[tr.train_id] = tr;
            } else {
                searchableTrains[tr.train_id] = trains.value[tr.train_id];
            }
            
        })
        trains.value = searchableTrains;
        console.log("Train Load Complete");
    }

    const loadLines = async () => {
        lines.value = (await axios.get(apiUrl + "/lines")).data;
        let stationCoords = [];
        /* Creating Path for Lines */
        /* To facilitate drawing metro lines in the map */
        /* we create a path (list of coordinates) */
        /* of the stations belonging to each line */
        lines.value.forEach((line) => {
            line.station_ids.forEach((st_id) => {
                stationCoords.push({...stations.value[st_id].position});
            })
            line.path = [...stationCoords];
            stationCoords = [];
        });
    }

    const loadData = async () => {
        await loadStations();
        await loadTrains();
        await loadLines();
        loading.value = false;
    };
    onMounted(async () => {
        await loadData();
        if (webSocket.readyState == 1) {
            webSocket.send(JSON.stringify({
                "type": "JOIN",
                "payload": {
                    id: "15635635",
                    username: clientUsername
                }
            }));
        } else {
            webSocket.onopen = (e) => {
                console.log(e);
                webSocket.send(JSON.stringify({
                    "type": "JOIN",
                    "payload": {
                        id: "15635635",
                        username: clientUsername
                    }
                }));
            }
        }

    })
    
</script>

<template>
    <div class="row-container">
        <div class="row" id="top-row">
            <Map v-if="!loading" :stations="stations" :trains="trains" :lines="lines" />
            <ChatBox :messages="messages" :clientUsername="clientUsername"/>
        </div>
        <div class="row" id="bottom-row">
            <StationList v-if="!loading" :stations="stations"/>
            <TrainList v-if="!loading" :trains="trains"/>
        </div>
    </div>
</template>
