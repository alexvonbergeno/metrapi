<script setup>
    import { ref } from "vue";
    const props = defineProps({
        station: {
            type: Object,
            required: true
        },
        zoom: {
            type: Number,
            default: 13
        }
    });
    const showInfoWindow = ref(false);
    const parsePosition = (pos) => {
        return {
            lat: parseFloat(pos.lat),
            lng: parseFloat(pos.long)
        };
    }
</script>
<template>
    <GMapMarker
        :key="props.key"
        :position="parsePosition(props.station.position)"
        :icon="{
            url: '/icons/BlackDot.png',
            anchor: {
                x: 8,
                y: 6
            },
            scaledSize: {
                width: 3 + 0.7*props.zoom,
                height: 3 + 0.7*props.zoom
            },
            labelOrigin: {
                x: 8,
                y: -8
            }
        }"
        :title="props.station.name"
        :options="{zIndex: 2}"
        :label="{
            text: props.station.station_id,
            fontSize: 0.8*props.zoom + 'px'
        }"
        @click="showInfoWindow=!showInfoWindow"
    >
        <GMapInfoWindow 
            :opened="showInfoWindow"
            :closeclick="true"
        >
            <div class="station-info-window-container">
                <h3>Estación: {{ station.name }} ({{ station.station_id }}) </h3>
                <p>Línea: {{ station.line_id }} </p>
                <p>Trenes en Estación:</p>
                <ul class="station-info-window-train-list">
                    <li v-for="tr in station.trains">
                        <ul class="station-info-window-train-description">
                            <li>ID: {{ train.id }}</li>
                            <li>Línea: {{train.line_id}}</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </GMapInfoWindow>
    </GMapMarker>
</template>
<style>
.station-info-window-train-list {
    list-style-type: none;
}

.station-info-window-train-description {
    list-style-type: none;
}

</style>
