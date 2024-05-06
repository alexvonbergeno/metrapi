<script setup>
import { inject, ref, onMounted } from "vue";

const messages = ref([]);
const socket = inject("webSocket");

</script>

<template>
    <div class="chat-container">
        <h3 class="list-title" id="chat-title">
            Chat
        </h3>
        <div id="chat-feed">
            <!-- vfor messages -->
        </div>
        <div id="chat-box">
            <!-- textarea -->
            <!-- send button -->
        </div>
       
    </div>
</template>

<style>

</style>
