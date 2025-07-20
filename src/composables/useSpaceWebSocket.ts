import { Client, type IMessage } from '@stomp/stompjs';

import type { JoinUserResponse } from '@/types/space/user/joinUserResponse';

import { useSpaceChatWebSocket } from './useSpaceChatWebSocket';
import { useSpaceUserWebSocket } from './useSpaceUserWebSocket';

// TODO: 나중에 space(player, chat)으로 분리 필요할 듯 (진행 중)
// TODO: 새로 들어왔을 때, 기존 사용자가 어디에 있는지 모름, 수정 필요
// TODO: 컴포저블 구조 수정 (진행 중)

const client = new Client({
  brokerURL: import.meta.env.VITE_WEB_SOCKET_BASE_URL,
  reconnectDelay: 5000,
  onConnect: () => {
    // TODO: 분리
    client.subscribe('/topic/spaces/users/join', (message: IMessage) => {
      const body = JSON.parse(message.body) as JoinUserResponse;

      // 자신의 입장이 아닌 경우만 다른 플레이어로 추가
      if (body.userId !== spaceUserWebSocket.myId.value) {
        spaceUserWebSocket.users.value.set(body.userId, {
          id: body.userId,
          nickname: body.userNickname,
          x: body.initialX,
          y: body.initialY,
        });
      } else {
        // 자신의 ID 저장
        spaceUserWebSocket.myId.value = body.userId;
      }
    });

    spaceUserWebSocket.subscribe();
    spaceChatWebSocket.subscribe();

    if (!client.connected) {
      return;
    }

    client.publish({
      destination: '/app/spaces/users/join',
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
