<template>
  <div ref="kakao-map" class="w-100 h-100"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';

const kakaoMapTr = useTemplateRef<HTMLDivElement>('kakao-map');

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
});

onBeforeUnmount(() => {
  document.querySelector('script[src*="dapi.kakao.com"]')?.remove();
});
</script>

<style scoped></style>
