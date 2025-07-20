import type { Client, IMessage } from '@stomp/stompjs';
import { ref } from 'vue';

import type { MoveUserRequest } from '@/types/space/user/request/moveUserRequest';
import type { JoinUserResponse } from '@/types/space/user/response/joinUserResponse';
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

  const subscribeToJoinUser = () => {
    client.subscribe('/topic/spaces/users/join', (message: IMessage) => {
      const body = JSON.parse(message.body) as JoinUserResponse;

      // TODO: 해당 부분은 백엔드에서 처리해야 함
      // 자신의 입장이 아닌 경우만 다른 플레이어로 추가
      if (body.userId !== myId.value) {
        users.value.set(body.userId, {
          id: body.userId,
          nickname: body.userNickname,
          x: body.initialX,
          y: body.initialY,
        });
      } else {
        // 자신의 ID 저장
        myId.value = body.userId;
      }
    });
  };

  const subscribeToMoveUser = () => {
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

  const joinUser = () => {
    if (!client.connected) {
      return;
    }

    client.publish({
      destination: '/app/spaces/users/join',
    });
  };

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

  const leaveUser = () => {
    if (!client.connected) {
      return;
    }
  };

  return {
    users,
    myId,
    subscribeToJoinUser,
    subscribeToMoveUser,
    joinUser,
    moveUser,
    leaveUser,
  };
};
