import { Client, type IMessage } from '@stomp/stompjs';
import { ref } from 'vue';

import type { SendMessageResponse } from '@/types/message/response/SendMessageResponse';

const messages = ref<SendMessageResponse[]>([]);

const client = new Client({
  // brokerURL, reconnectDelay 환경 변수로 분리
  brokerURL: 'ws://localhost:8080/ws',
  reconnectDelay: 5000,
  onConnect: () => {
    client.subscribe('/topic/space/chat', (message: IMessage) => {
      const body = JSON.parse(message.body) as SendMessageResponse;

      messages.value.push(body);
    });

    client.subscribe('/topic/space/move', (message: IMessage) => {
      // TODO: 나중에
      // const body = JSON.parse(message.body) as SendMessageResponse;
      // messages.value.push(body);
    });
  },
  onStompError: (frame) => {
    console.error('STOMP error:', frame);
  },
});

export const useSpaceWebSocket = () => {
  const connect = () => {
    client.activate();
  };

  const disconnect = () => {
    client.deactivate();
  };

  const sendMove = () => {
    if (!client.connected) {
      return;
    }

    console.log('여기');

    client.publish({
      destination: '/app/space/move',
    });
  };

  const sendMessage = (content: string) => {
    if (!client.connected) {
      return;
    }

    client.publish({
      destination: '/app/space/chat',
      body: JSON.stringify({
        content: content,
      }),
    });
  };

  return {
    messages,
    connect,
    disconnect,
    sendMove,
    sendMessage,
  };
};
