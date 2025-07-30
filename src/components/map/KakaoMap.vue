<template>
  <div v-if="showKakaoMap" ref="kakao-map" class="w-100 h-100"></div>
  <div v-else class="d-flex align-center justify-center w-100 h-100">
    <h1>위치 권한이 필요합니다</h1>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';

const kakaoMapTr = useTemplateRef<HTMLDivElement>('kakao-map');

const showKakaoMap = ref<boolean>(false);

const loadKakaoScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;
    script.onload = () => resolve();
    script.onerror = reject;

    document.head.appendChild(script);
  });
};

onMounted(async () => {
  await loadKakaoScript();

  window.kakao.maps.load(() => {
    const mapOption = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    if (!kakaoMapTr.value) {
      return;
    }

    new window.kakao.maps.Map(kakaoMapTr.value, mapOption);
  });

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      showKakaoMap.value = true;

      await loadKakaoScript();

      window.kakao.maps.load(async () => {
        await nextTick();

        if (!kakaoMapTr.value) {
          return;
        }

        const kakaoMap = new window.kakao.maps.Map(kakaoMapTr.value, {
          center: new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude),
          level: 3,
        });

        // 현재 위치 마커 생성
        new window.kakao.maps.Marker({
          map: kakaoMap,
          position: new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude),
        });
      });
    },
    () => {
      showKakaoMap.value = false;
    },
  );
});

onBeforeUnmount(() => {
  document.querySelector('script[src*="dapi.kakao.com"]')?.remove();
});
</script>

<style scoped></style>
