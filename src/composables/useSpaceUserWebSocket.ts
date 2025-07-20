import type { Client, IMessage } from '@stomp/stompjs';
import { ref } from 'vue';

import type { MoveUserRequest } from '@/types/space/user/request/moveUserRequest';
import type { MoveUserResponse } from '@/types/space/user/response/moveUserResponse';

// Player 타입 정의 필요
// TODO: 분리
interface Player {
  id: number;
  nickname: string;
  x: number;
  y: number;
}

export const useSpaceUserWebSocket = (client: Client) => {
  // TODO: rename
  const users = ref<Map<number, Player>>(new Map());
  const myId = ref<number>(0);

  const subscribe = () => {
    client.subscribe('/topic/spaces/users/move', (message: IMessage) => {
      const body = JSON.parse(message.body) as MoveUserResponse;

      // TODO: 해당 부분은 백엔드에서 처리해야 함
      // 자신의 움직임은 무시 (myPlayerId와 비교)
      // 임시 조치
      if (body.userId === myId.value) {
        return;
      }

      const user = users.value.get(body.userId);

      if (user) {
        user.id = body.userId;
        user.nickname = body.userNickname;
        user.x = body.x;
        user.y = body.y;
      }
    });
  };

  const joinUser = () => {};

  const moveUser = (x: number, y: number) => {
    if (!client.connected) {
      return;
    }

    const request: MoveUserRequest = {
      x: x,
      y: y,
    };

    client.publish({
      destination: '/app/spaces/users/move',
      body: JSON.stringify(request),
    });
  };

  return {
    users,
    myId,
    subscribe,
    joinUser,
    moveUser,
  };
};
