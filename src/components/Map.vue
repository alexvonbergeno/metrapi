<script setup>
import jsonMapOptions from "../assets/mapOptions.json";
import colors from "../assets/colors.json";
import { ref } from "vue";
const props = defineProps({
    stations: {
        type: Array,
        required: true
    },
    trains: {
        type: Array,
        required: true,
    },
    lines: {
        type: Array,
        required: true,
    }
});

const zoom = ref(12);
const parsePosition = (pos) => {
    let coords = {
        lat: parseFloat(pos.lat),
        lng: parseFloat(pos.long)
    };
    return coords;
}

const toRGB = (color) => {
    if (!color.includes("#")) {
        return colors[color];
    }
    return color;
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

const circleOptions = {
    fillOpacity: 1,
    fillColor: "#000000",
    strokeColor: "#000000",
    strokeOpacity: 1,
}

const lineOptions = {
    zIndex: "1"
}
const handleMouseOver = () => {
    console.log("Moused Over this");
}

const zoomHandler = (newZoom) => {
    zoom.value = newZoom
}
const radiusHandler = (z) => {
    return Math.min(40, 30+0.25*zoom.value);
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
            <GMapCircle
                :key="index"
                :radius="Math.min(40, 80 - 3*zoom)"
                :center="parsePosition(st.position)"
                :options="{...circleOptions, zIndex: 2 + index }"
                v-for="(st, index) in stations"
            />

            <GMapPolyline
                :path="l.path"
                :options="{
                    ...lineOptions, 
                    strokeColor: toRGB(l.color),
                    strokeWeight: 2.5*zoom - 28
                    }"
                v-for="l in props.lines"
            />

        </GMapMap>
    </div>
</template>
