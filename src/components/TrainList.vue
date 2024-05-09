<script setup>
const props = defineProps({
    trains: {
        type: Object,
        required: true,
    }
});
</script>

<template>
    <div class="train-container">
        <h3 class="list-title" id="train-title">
            Trenes
        </h3>
        <div class="list-headers">
            <p class="list-header train-list-id" id="estacion-header">ID</p>
            <p class="list-header train-list-driver" id="id-header">Chofer</p>
            <p class="list-header train-list-origin" id="linea-header">Origen</p>
            <p class="list-header train-list-destination" id="linea-header">Destino</p>
            <p class="list-header train-list-line" id="linea-header">Línea</p>
            <p class="list-header train-list-current-station" id="linea-header">Estación Actual</p>
        </div>
        <div class="list-items-container">
            <div class="list-items" v-for="train in Object.values(props.trains)">
                <p class="list-item train-list-id">{{ train.train_id }}</p>
                <p class="list-item train-list-driver">{{ train.driver_name }}</p>
                <p class="list-item train-list-origin">{{ train.origin_station_id }}</p>
                <p class="list-item train-list-destination">{{ train.destination_station_id }}</p>
                <p class="list-item train-list-line">{{ train.line_id }}</p>
                <p class="list-item train-list-current-station">{{ train.last_station_id }}</p>
            </div>
        </div>
    </div>
</template>

<style>
.train-list-id {
    width: 30%;
    min-width: 30px;
}

.train-list-driver {
    width: 25%;
    min-width: 60px;
}

.train-list-origin {
    width: 10%;
    min-width: 60px;
}

.train-list-destination {
    width: 10%;
    min-width: 80px;
}

.train-list-line {
    width: 5%;
    min-width: 50px;
}

.train-list-current-station {
    width: 20%;
    min-width: 115px;
    border-right-width: 0px;
}
</style>
