<script setup lang="ts">
import ChatPanel from '@/components/ChatPanel.vue';
</script>

<template>
  <v-container fluid style="height: 100vh">
    <v-row dense style="height: 100%">
      <v-col cols="9">
        <v-sheet class="d-flex align-center justify-center" border rounded style="height: 100%">
          <h1>준비 중</h1>
        </v-sheet>
      </v-col>
      <v-col cols="3">
        <ChatPanel />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
