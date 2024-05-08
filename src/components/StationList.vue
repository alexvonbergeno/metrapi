<script setup>
const props = defineProps({
    stations: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <div class="station-container">
        <h3 class="list-title" id="estacion-title">
            Estaciones
        </h3>
        <div class="list-headers">
            <p class="list-header station-estacion">Estación</p>
            <p class="list-header station-id">ID</p>
            <p class="list-header station-linea">Línea</p>
        </div>
        <div class="list-items-container">
            <div class="list-items" v-for="station in props.stations">
                <p class="list-item station-estacion">{{ station.name }}</p>
                <p class="list-item station-id">{{ station.station_id }}</p>
                <p class="list-item station-linea">{{ station.line_id }}</p>
            </div>
        </div>
    </div>
</template>

<style>

.station-estacion {
    width: 60%;
    min-width: 100px;
}
.station-id {
    width: 20%;
    min-width: 50px;
}
.station-linea {
    width: 20%;
    min-width: 50px;
    border-right-width: 0px;
}

</style>
