import { Client, type IMessage } from '@stomp/stompjs';
import { ref } from 'vue';

import type { SendMessageResponse } from '@/types/message/response/SendMessageResponse';

const players = ref<Map<string, Player>>(new Map());
const myPlayerId = ref<string>('');

// Player 타입 정의 필요
interface Player {
  id: string;
  x: number;
  y: number;
  username?: string;
}

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

    // TODO: 로직 수정
    client.subscribe('/topic/space/move', (message: IMessage) => {
      const moveData = JSON.parse(message.body) as {
        playerId: string;
        x: number;
        y: number;
        type: 'join' | 'move' | 'leave';
        username?: string;
      };

      // 자신의 움직임은 무시 (myPlayerId와 비교)
      if (moveData.playerId === myPlayerId.value) {
        return;
      }

      // 나머지 로직은 그대로...
      if (moveData.type === 'join') {
        players.value.set(moveData.playerId, {
          id: moveData.playerId,
          x: moveData.x,
          y: moveData.y,
          username: moveData.username,
        });
      } else if (moveData.type === 'move') {
        const player = players.value.get(moveData.playerId);
        if (player) {
          player.x = moveData.x;
          player.y = moveData.y;
        }
      } else if (moveData.type === 'leave') {
        players.value.delete(moveData.playerId);
      }
    });

    // TODO: refactor
    if (!client.connected) {
      return;
    }

    client.publish({
      destination: '/app/space/move',
      body: JSON.stringify({
        x: 0,
        y: 0,
        type: 'join',
      }),
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

  const sendJoin = () => {
    if (!client.connected) {
      return;
    }

    client.publish({
      destination: '/app/space/move',
      body: JSON.stringify({
        x: 0,
        y: 0,
        type: 'join',
      }),
    });
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
    sendJoin,
    sendMove,
    sendMessage,
  };
};
