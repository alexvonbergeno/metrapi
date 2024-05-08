<script setup>
import jsonMapOptions from "../assets/mapOptions.json";
import colors from "../assets/colors.json";
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

</script>

<template>
    <div class="map-container">
        <GMapMap
            class="mainmap"
            :center="{lat: -33.4389, lng: -70.6393}"
            :zoom="12"
            :options="mapOptions"
            :disableDefaultUI="true"
        >
            <GMapCircle
                :key="index"
                :radius="30"
                :center="parsePosition(st.position)"
                :options="{...circleOptions, zIndex: 2 + index }"
                v-for="(st, index) in stations"
            />

            <GMapPolyline
                :path="l.path"
                :options="{...lineOptions, strokeColor: toRGB(l.color) }"
                v-for="l in props.lines"
            />

        </GMapMap>
    </div>
</template>
