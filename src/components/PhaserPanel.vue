<script setup lang="ts">
import Phaser from 'phaser';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface Player {
  id: number;
  x: number;
  y: number;
  username?: string;
}

const props = defineProps<{
  players: Map<number, Player>;
}>();

const emit = defineEmits<{
  (e: 'send-move', x: number, y: number): void;
}>();

const gameContainer = ref<HTMLDivElement>();

let game: Phaser.Game | null = null;

let gameScene: GameScene | null = null;

// TODO: 화면이랑 로직 분리
class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private currentX = 0;
  private currentY = 0;
  private otherPlayers: Map<number, Phaser.Physics.Arcade.Sprite> = new Map();

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // 간단한 픽셀 스퀘어 생성 (임시)
    this.add.graphics().fillStyle(0x00ff00).fillRect(0, 0, 32, 32).generateTexture('player', 32, 32);

    // 배경 타일 생성 (임시)
    this.add.graphics().fillStyle(0x228b22).fillRect(0, 0, 32, 32).generateTexture('grass', 32, 32);
  }

  create() {
    // 512px 화면 기준 → 16 x 16 격자
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        this.add.image(x * 32 + 16, y * 32 + 16, 'grass'); // 중심 위치로 offset 16 추가
      }
    }

    this.player = this.physics.add.sprite(0, 0, 'player');
    this.currentX = 0;
    this.currentY = 0;
    this.updatePlayerPosition();

    this.setupMovement();
  }

  private updatePlayerPosition() {
    this.player.setPosition(this.currentX * 32 + 16, this.currentY * 32 + 16); // 중심 offset
  }

  setupMovement() {
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.currentY--;
          break;
        case 's':
        case 'arrowdown':
          this.currentY++;
          break;
        case 'a':
        case 'arrowleft':
          this.currentX--;
          break;
        case 'd':
        case 'arrowright':
          this.currentX++;
          break;
        default:
          return;
      }

      this.updatePlayerPosition();
      emit('send-move', this.player.x, this.player.y);
    });
  }

  updateOtherPlayers(players: Map<number, Player>) {
    // 기존 플레이어들 제거
    this.otherPlayers.forEach((sprite, playerId) => {
      if (!players.has(playerId)) {
        sprite.destroy();
        this.otherPlayers.delete(playerId);
      }
    });

    // 플레이어들 업데이트/추가
    players.forEach((playerData, playerId) => {
      let otherPlayer = this.otherPlayers.get(playerId);

      if (!otherPlayer) {
        // 새 플레이어 생성
        otherPlayer = this.physics.add.sprite(playerData.x * 32 + 16, playerData.y * 32 + 16, 'player');
        otherPlayer.setTint(0xff0000); // 빨간색으로 구분
        this.otherPlayers.set(playerId, otherPlayer);
      } else {
        // 위치 업데이트
        otherPlayer.setPosition(playerData.x * 32 + 16, playerData.y * 32 + 16);
      }
    });
  }
}

onMounted(() => {
  if (gameContainer.value) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 512,
      height: 512,
      parent: gameContainer.value,
      backgroundColor: '#000000',
      scene: GameScene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
    };

    game = new Phaser.Game(config);

    // 씬이 준비된 후 참조 저장
    setTimeout(() => {
      gameScene = game?.scene.getScene('GameScene') as GameScene;
    }, 100);
  }
});

watch(
  () => props.players,
  (newPlayers) => {
    if (gameScene) {
      gameScene.updateOtherPlayers(newPlayers);
    }
  },
  { deep: true },
);

onBeforeUnmount(() => {
  if (game) {
    game.destroy(true);
    game = null;
  }
});
</script>

<template>
  <div ref="gameContainer"></div>
</template>

<style scoped>
:deep(canvas) {
  margin: 0 !important;
}
</style>
