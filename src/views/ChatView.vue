<script setup lang="ts">
import { Client, type IMessage } from '@stomp/stompjs';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const messages = ref<string[]>([]);
const newMessage = ref('');

let client: Client;

const sendMessage = () => {
  if (!newMessage.value.trim() || !client.connected) return;

  client.publish({
    destination: '/app/message',
    body: JSON.stringify({ content: newMessage.value, senderNickname: '사용자닉네임' }),
  });

  newMessage.value = '';
};

onMounted(() => {
  client = new Client({
    brokerURL: 'ws://localhost:8080/ws', // 백엔드에서 설정한 WebSocket 엔드포인트
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('✅ STOMP connected');

      client.subscribe('/topic/message', (message: IMessage) => {
        const body = JSON.parse(message.body);
        messages.value.push(`${body.senderNickname}: ${body.content}`);
      });
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame);
    },
  });

  client.activate();
});

onBeforeUnmount(() => {
  client.deactivate();
});
</script>

<template>
  <div>
    <h1>ChatView</h1>
    <div class="chat-box">
      <div v-for="(msg, index) in messages" :key="index">{{ msg }}</div>
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type message..." />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<style scoped>
.chat-box {
  border: 1px solid #ccc;
  height: 300px;
  overflow-y: auto;
  padding: 8px;
  margin-bottom: 10px;
}
</style>
