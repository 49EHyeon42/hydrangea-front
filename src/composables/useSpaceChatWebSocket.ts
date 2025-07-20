import type { Client, IMessage } from '@stomp/stompjs';
import { ref } from 'vue';

import type { SendMessageRequest } from '@/types/space/chat/request/sendMessageRequest';
import type { SendMessageResponse } from '@/types/space/chat/response/sendMessageResponse';

export const useSpaceChatWebSocket = (client: Client) => {
  const messages = ref<SendMessageResponse[]>([]);

  const subscribe = () => {
    client.subscribe('/topic/spaces/chat', (message: IMessage) => {
      const body = JSON.parse(message.body) as SendMessageResponse;
      messages.value.push(body);
    });
  };

  const sendMessage = (content: string) => {
    if (!client.connected) {
      return;
    }

    const request: SendMessageRequest = {
      content: content,
    };

    client.publish({
      destination: '/app/spaces/chat',
      body: JSON.stringify(request),
    });
  };

  return {
    messages,
    subscribe,
    sendMessage,
  };
};
