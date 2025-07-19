<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

import ChatMessage from '@/components/ChatMessage.vue';
import { useChatWebSocket } from '@/composables/useChatWebSocket';

const chatWebSocket = useChatWebSocket();

onMounted(() => {
  chatWebSocket.connect();
});

onBeforeUnmount(() => {
  chatWebSocket.disconnect();
});
</script>

<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-sheet class="flex-grow-1 overflow-hidden mb-2" border rounded>
      <div class="fill-height overflow-y-auto pa-1" style="scrollbar-gutter: stable">
        <ChatMessage
          v-for="(message, index) in chatWebSocket.messages.value"
          :key="index"
          :nickname="message.senderNickname"
          :content="message.content"
        />
      </div>
    </v-sheet>

    <div class="flex-shrink-0">
      <v-textarea
        v-model="chatWebSocket.newMessage.value"
        variant="outlined"
        density="compact"
        auto-grow
        no-resize
        rows="1"
        max-rows="3"
        hide-details
        @keydown.enter.exact.prevent="chatWebSocket.sendMessage"
      />
    </div>
  </div>
</template>

<style scoped></style>
