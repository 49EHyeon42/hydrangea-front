<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

import ChatPanel from '@/components/ChatPanel.vue';
import PhaserPanel from '@/components/PhaserPanel.vue';
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
  <v-container fluid class="h-screen">
    <v-row dense class="fill-height">
      <v-col cols="9">
        <div class="d-flex align-center justify-center">
          <PhaserPanel :players="spaceWebSocket.players.value" @send-move="spaceWebSocket.sendMove" />
        </div>
      </v-col>
      <v-col cols="3" class="fill-height">
        <ChatPanel :messages="spaceWebSocket.messages.value" @send-message="spaceWebSocket.sendMessage" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
