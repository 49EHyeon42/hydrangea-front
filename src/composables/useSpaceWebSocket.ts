import { Client } from '@stomp/stompjs';

import { useSpaceChatWebSocket } from './useSpaceChatWebSocket';
import { useSpaceUserWebSocket } from './useSpaceUserWebSocket';

// TODO: 나중에 space(player, chat)으로 분리 필요할 듯 (진행 중)
// TODO: 새로 들어왔을 때, 기존 사용자가 어디에 있는지 모름, 수정 필요
// TODO: 컴포저블 구조 수정 (진행 중)

const client = new Client({
  brokerURL: import.meta.env.VITE_WEB_SOCKET_BASE_URL,
  reconnectDelay: 5000,
  onConnect: () => {
    // TODO: 이 구조 다시 고민
    spaceUserWebSocket.subscribeToJoinUser();
    spaceUserWebSocket.subscribeToMoveUser();
    spaceChatWebSocket.subscribe();

    spaceUserWebSocket.joinUser();
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

  const sendMove = (x: number, y: number) => {
    if (!client.connected) {
      return;
    }

    spaceUserWebSocket.moveUser(x, y);
  };

  const sendMessage = (content: string) => {
    if (!client.connected) {
      return;
    }

    spaceChatWebSocket.sendMessage(content);
  };

  return {
    messages: spaceChatWebSocket.messages,
    players: spaceUserWebSocket.users,
    myPlayerId: spaceUserWebSocket.myId,
    connect,
    disconnect,
    sendMove,
    sendMessage,
  };
};

const spaceUserWebSocket = useSpaceUserWebSocket(client);
const spaceChatWebSocket = useSpaceChatWebSocket(client);
