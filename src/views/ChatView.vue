<script setup lang="ts">
import ChatPanel from '@/components/ChatPanel.vue';
import PhaserPanel from '@/components/PhaserPanel.vue';
</script>

<template>
  <v-container fluid style="height: 100vh">
    <v-row dense style="height: 100%">
      <v-col cols="9">
        <div class="d-flex align-center justify-center" style="height: 100%">
          <PhaserPanel />
        </div>
      </v-col>
      <v-col cols="3">
        <ChatPanel />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
