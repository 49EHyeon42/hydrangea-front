import { Client } from '@stomp/stompjs';

import { useSpaceChatWebSocket } from './useSpaceChatWebSocket';

// TODO: 새로 들어왔을 때, 기존 사용자가 어디에 있는지 모름, 수정 필요

export const useSpaceWebSocket = () => {
  const client = new Client({
    brokerURL: import.meta.env.VITE_WEB_SOCKET_BASE_URL,
    reconnectDelay: 5000,

    onStompError: (frame) => {
      console.error('STOMP error:', frame);
    },
  });

  const spaceChatWebSocket = useSpaceChatWebSocket(client);

  client.onConnect = () => {
    spaceChatWebSocket.subscribe();
  };

  return {
    messages: spaceChatWebSocket.messages,
    connect: () => client.activate(),
    disconnect: () => client.deactivate(),
    sendMessage: spaceChatWebSocket.sendMessage,
  };
};
