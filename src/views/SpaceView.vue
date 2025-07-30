<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

import ChatPanel from '@/components/ChatPanel.vue';
import KakaoMap from '@/components/map/KakaoMap.vue';
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
        <KakaoMap />
      </v-col>
      <v-col cols="3" class="fill-height">
        <ChatPanel :messages="spaceWebSocket.messages.value" @send-message="spaceWebSocket.sendMessage" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
