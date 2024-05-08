<script setup>
    import jsonMapOptions from "../assets/mapOptions.json";
    import StationMap from "./StationMap.vue";
    import MetroLineMap from "./MetroLineMap.vue";
    import { ref } from "vue";
    const props = defineProps({
        stations: {
            type: Object,
            required: true
        },
        trains: {
            type: Object,
            required: true,
        },
        lines: {
            type: Array,
            required: true,
        }
    });

    const zoom = ref(13);
    const zoomHandler = (newZoom) => {
        zoom.value = newZoom
    }

    const mapOptions = {
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: 'cooperative',
        styles: jsonMapOptions
    }
</script>

<template>
    <div class="map-container">
        <GMapMap
            class="mainmap"
            :center="{lat: -33.4389, lng: -70.6393}"
            :zoom="zoom"
            :options="mapOptions"
            :disableDefaultUI="true"
            v-on:zoom_changed="zoomHandler"
        >
            <StationMap v-for="(st, index) in Object.values(stations)" :key="index" :station="st" :zoom="zoom"/>
            <MetroLineMap v-for="(line, index) in lines" :key="index" :line="line"/>

        </GMapMap>
    </div>
</template>
