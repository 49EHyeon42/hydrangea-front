import { Client, type IMessage } from '@stomp/stompjs';
import { ref } from 'vue';

import type { SendMessageResponse } from '@/types/message/response/SendMessageResponse';

const messages = ref<SendMessageResponse[]>([]);
const newMessage = ref('');

const client = new Client({
  // brokerURL, reconnectDelay 환경 변수로 분리
  brokerURL: 'ws://localhost:8080/ws',
  reconnectDelay: 5000,
  onConnect: () => {
    client.subscribe('/topic/message', (message: IMessage) => {
      const body = JSON.parse(message.body) as SendMessageResponse;

      messages.value.push(body);
    });
  },
  onStompError: (frame) => {
    console.error('STOMP error:', frame);
  },
});

export const useChatWebSocket = () => {
  const connect = () => {
    client.activate();
  };

  const disconnect = () => {
    client.deactivate();
  };

  const sendMessage = () => {
    if (!newMessage.value.trim() || !client.connected) {
      return;
    }

    client.publish({
      destination: '/app/message',
      body: JSON.stringify({
        content: newMessage.value,
      }),
    });

    newMessage.value = '';
  };

  return {
    messages,
    newMessage,
    connect,
    disconnect,
    sendMessage,
  };
};
