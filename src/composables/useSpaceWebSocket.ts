import { Client, type IMessage } from '@stomp/stompjs';
import { ref } from 'vue';

import type { SendMessageResponse } from '@/types/message/response/SendMessageResponse';
import type { JoinUserResponse } from '@/types/space/user/JoinUserResponse';

const players = ref<Map<number, Player>>(new Map());
const myPlayerId = ref<number>(0);

// Player 타입 정의 필요
interface Player {
  id: number;
  x: number;
  y: number;
  username?: string;
}

// TODO: 나중에 space(player, chat)으로 분리 필요할 듯
// TODO: 새로 들어왔을 때, 기존 사용자가 어디에 있는지 모름, 수정 필요
// TODO: 컴포저블 구조 수정

const messages = ref<SendMessageResponse[]>([]);

const client = new Client({
  brokerURL: import.meta.env.VITE_WEB_SOCKET_BASE_URL,
  reconnectDelay: 5000,
  onConnect: () => {
    // 내부 함수로 분리 안되나?
    client.subscribe('/topic/spaces/users/join', (message: IMessage) => {
      const body = JSON.parse(message.body) as JoinUserResponse;

      // 자신의 입장이 아닌 경우만 다른 플레이어로 추가
      if (body.userId !== myPlayerId.value) {
        players.value.set(body.userId, {
          id: body.userId,
          x: body.initialX,
          y: body.initialY,
          username: body.userNickname,
        });
      } else {
        // 자신의 ID 저장
        myPlayerId.value = body.userId;
      }
    });

    client.subscribe('/topic/space/chat', (message: IMessage) => {
      const body = JSON.parse(message.body) as SendMessageResponse;

      messages.value.push(body);
    });

    // TODO: 로직 수정
    client.subscribe('/topic/space/move', (message: IMessage) => {
      const moveData = JSON.parse(message.body) as {
        playerId: string;
        x: number;
        y: number;
        type: 'move' | 'leave';
        username?: string;
      };

      // 자신의 움직임은 무시 (myPlayerId와 비교)
      // 임시 조치
      if (moveData.playerId === myPlayerId.value.toString()) {
        return;
      }

      if (moveData.type === 'move') {
        // 임시 조치
        const player = players.value.get(Number(moveData.playerId));
        if (player) {
          player.x = moveData.x;
          player.y = moveData.y;
        }
      } else if (moveData.type === 'leave') {
        players.value.delete(Number(moveData.playerId));
      }
    });

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

    client.publish({
      destination: '/app/space/move',
      body: JSON.stringify({
        x: x,
        y: y,
        type: 'move',
      }),
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
    players,
    myPlayerId,
    connect,
    disconnect,
    sendMove,
    sendMessage,
  };
};
