<script setup>
    import { ref } from "vue";
    const props = defineProps({
        train: {
            type: Object,
            required: true
        },
        zoom: {
            type: Number,
            default: 13
        }
    })
    const iconUrl = "/icons/train" + props.train.line_id + ".png";
    const showTrainInfoWindow = ref(false);
</script>

<template>
    <GMapMarker
        :key="props.train.train_id"
        :position="props.train.position"
        :icon="{
            url: iconUrl,
            anchor: {
                x: 16,
                y: 16
            },
            scaledSize: {
                width: 10 + 2*props.zoom,
                height: 10 + 2*props.zoom
            }
        }"
        :options="{ zIndex: 3 }"
        @click="showTrainInfoWindow=!showTrainInfoWindow"
    >
        <GMapInfoWindow 
            :opened="showTrainInfoWindow"
            :closeclick="true"
        >
            <div class="train-info-window-container">
                <h3>Tren: {{ train.train_id }} </h3>
                <p>Línea: {{ train.line_id }}</p>
                <p>Conductor: {{ train.driver_name }} </p>
                <p>Última Estación Visitada: {{ train.last_station_id }}</p>
                <p>Pasajeros: {{ train.passengers }}</p>
                <p>Estado: {{ train.status }}</p>
                <p>Origen: {{ train.origin_station_id }}</p>
                <p>Destino: {{ train.destination_station_id }}</p>
                <p>Position: {{ train.position }}</p>
            </div>
        </GMapInfoWindow>
    </GMapMarker>
</template>
