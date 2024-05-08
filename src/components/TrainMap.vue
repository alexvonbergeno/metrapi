<script setup>
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
    const icon = "/icons/train" + props.train.line_id + ".png";
    const parsePosition = (pos) => {
            return {
                lat: parseFloat(pos.lat),
                lng: parseFloat(pos.long)
            };
        }
</script>

<template>
    <GMapMarker
        :key="props.train.train_id"
        :position="parsePosition(props.train.position)"
        :icon="{
            url: icon,
            anchor: {
                x: 16,
                y: 12
            },
            scaledSize: {
                width: 3 + 0.3*props.zoom,
                height: 3 + 0.3*props.zoom
            }
        }"
        />
</template>
