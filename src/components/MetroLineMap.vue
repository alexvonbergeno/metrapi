<script setup>
    import colors from "../assets/colors.json";
    const props = defineProps({
        line: {
            type: Object,
            required: true
        },
        zoom: {
            type: Number,
            default: 13
        }
    });
    const toRGB = (color) => {
        if (!color.includes("#")) {
            return colors[color];
        }
        return color;
    }
</script>

<template>
    <GMapPolyline
        :path="line.path"
        :options="{
            strokeColor: toRGB(line.color),
            strokeWeight: 2.5*zoom - 29,
            zIndex: 1
        }"
    />
</template>
