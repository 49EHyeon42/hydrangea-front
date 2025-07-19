<script setup lang="ts">
import { Client, type IMessage } from '@stomp/stompjs';
import { onBeforeUnmount, onMounted, ref } from 'vue';

import ChatMessage from '@/components/ChatMessage.vue';

interface ChatMessageData {
  senderNickname: string;
  content: string;
}

// NOTE: 나중에 messages 많아져서 무거워지면 어떻게 하지
const messages = ref<ChatMessageData[]>([]);
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
        messages.value.push({
          senderNickname: body.senderNickname,
          content: body.content,
        });
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
  <v-container fluid class="d-flex flex-column" style="height: 100vh">
    <v-sheet class="flex-grow-1 overflow-hidden mb-2" border rounded>
      <div class="fill-height overflow-y-auto pa-1" style="scrollbar-gutter: stable">
        <ChatMessage
          v-for="(message, index) in messages"
          :key="index"
          :nickname="message.senderNickname"
          :content="message.content"
        />
      </div>
    </v-sheet>

    <div class="flex-shrink-0">
      <v-textarea
        v-model="newMessage"
        variant="outlined"
        density="compact"
        auto-grow
        no-resize
        rows="1"
        max-rows="3"
        hide-details
        @keydown.enter.exact.prevent="sendMessage"
      />
    </div>
  </v-container>
</template>

<style scoped></style>
