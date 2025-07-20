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
  <v-container fluid style="height: 100vh">
    <v-row dense style="height: 100%">
      <v-col cols="9">
        <div class="d-flex align-center justify-center" style="height: 100%">
          <PhaserPanel :players="spaceWebSocket.players.value" @send-move="spaceWebSocket.sendMove" />
        </div>
      </v-col>
      <v-col cols="3">
        <ChatPanel :messages="spaceWebSocket.messages.value" @send-message="spaceWebSocket.sendMessage" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
