<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

import ChatMessage from '@/components/ChatMessage.vue';
import { useSpaceWebSocket } from '@/composables/useSpaceWebSocket';

const spaceWebSocket = useSpaceWebSocket();

onMounted(() => {
  spaceWebSocket.connect();
});

onBeforeUnmount(() => {
  spaceWebSocket.disconnect();
});
</script>

<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-sheet class="flex-grow-1 overflow-hidden mb-2" border rounded>
      <div class="fill-height overflow-y-auto pa-1" style="scrollbar-gutter: stable">
        <ChatMessage
          v-for="(message, index) in spaceWebSocket.messages.value"
          :key="index"
          :nickname="message.senderNickname"
          :content="message.content"
        />
      </div>
    </v-sheet>

    <div class="flex-shrink-0">
      <v-textarea
        v-model="spaceWebSocket.newMessage.value"
        variant="outlined"
        density="compact"
        auto-grow
        no-resize
        rows="1"
        max-rows="3"
        hide-details
        @keydown.enter.exact.prevent="spaceWebSocket.sendMessage"
      />
    </div>
  </div>
</template>

<style scoped></style>
