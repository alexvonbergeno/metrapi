<script setup>
    const props = defineProps({
        message: {
            type: Object,
            required: true
        },
        clientUsername: {
            type: String,
            required: true
        },
        startTime: {
            type: Number,
            required: true
        }
    });
    const containerClass = {
        'message-container': true,
        'self-message': props.clientUsername == props.message.data.name
    }

    
</script>

<template>
    <div :class="containerClass">
        <h3 class="message-name">{{ props.message.data.name }}</h3>
        <p>{{ props.message.timestamp }}</p>
        <p class="message-content">{{ props.message.data.content }}</p>
    </div>
</template>

<style>
.message-container {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    border: 1px solid black;
    width: 60%;
    background-color: lightgray;
    font-size: x-small;
    margin-left: auto;
    margin-top: 15px;
    margin-right: 5px;
    padding: 2px
}

.self-message {
    margin-left: 5px !important;
    margin-right: auto !important;
    background-color: lightblue !important;
}

.message-name {
    font-weight: bold;
}

.message-content {
    margin-top: auto;
}

</style>
