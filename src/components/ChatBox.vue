<script setup>
    import { ref, inject } from "vue";
    import ChatMessage from "./ChatMessage.vue";
    const props = defineProps({
        clientUsername: {
            type: String,
            required: true
        }
    })
    const messages = ref([]);
    const newMessageBoxPlaceholder = "Escribe tu mensaje aqui";
    const newMessageText = ref("");
    const webSocket = inject("webSocket");
    webSocket.eventHandlers["message"] = (event) => {
        messages.value.push(event);
    }
    const sendMessage = () => {
        let newMessage = {
            "type": "MESSAGE",
            "payload": {
                "content": newMessageText.value
            }
        }
        webSocket.send(newMessage);
        let now = new Date()
        newMessage.timestamp = now.toLocaleString("es-CL");
        newMessage.data = {}
        newMessage.data.name = props.clientUsername;
        newMessage.data.content = newMessageText.value;
        newMessageText.value = "";
        messages.value.push(newMessage);
    }



</script>

<template>
    <div class="chat-container">
        <h3 class="list-title" id="chat-title">
            Chat
        </h3>
        <div id="chat-feed">
            <ChatMessage v-for="m in messages" :message="m" :clientUsername="props.clientUsername" />
        </div>
        <div id="chat-box">
            <textarea v-model="newMessageText" :placeholder="newMessageBoxPlaceholder"></textarea>
            <button class="chat-button" @click="sendMessage">Enviar</button>
        </div>
       
    </div>
</template>

<style>
.chat-container {
    display: flex;
    flex-direction: column;
}

#chat-box {
    margin-top: auto;
    display: flex;
    height: 8%;
    border-top: 1px solid black;
}

textarea {
    resize: none;
    border: 0;
    border-right: 1px solid black;
    width: 80%;
    height: 100%;
}

.chat-button {
    background-color: lightgray;
    border-radius: 0;
}

</style>
