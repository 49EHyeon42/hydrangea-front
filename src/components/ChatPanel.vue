<script setup lang="ts">
import { ref } from 'vue';

import ChatMessage from '@/components/ChatMessage.vue';

const props = defineProps<{
  messages: { senderNickname: string; content: string }[];
}>();

const emit = defineEmits<{
  (e: 'send-message', message: string): void;
}>();

const inputContent = ref('');

// NOTE: 고민, 메시지를 서버에 보내는 것은 HTTP로?
const sendMessage = async () => {
  if (!inputContent.value.trim()) {
    return;
  }

  emit('send-message', inputContent.value);

  // 주의
  inputContent.value = '';
};
</script>

<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-sheet class="flex-grow-1 overflow-hidden mb-2" border rounded>
      <div class="fill-height overflow-y-auto pa-1" style="scrollbar-gutter: stable">
        <ChatMessage
          v-for="(message, index) in props.messages"
          :key="index"
          :nickname="message.senderNickname"
          :content="message.content"
        />
      </div>
    </v-sheet>

    <div class="flex-shrink-0">
      <v-textarea
        v-model="inputContent"
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
  </div>
</template>

<style scoped></style>
