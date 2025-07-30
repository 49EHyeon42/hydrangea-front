export {};

declare global {
  interface Window {
    kakao: typeof kakao;
  }

  namespace kakao {
    namespace maps {
      function load(callback: () => void): void;

      class LatLng {
        constructor(lat: number, lng: number);
      }

      interface MapOptions {
        center: LatLng;
        level: number;
      }

      class Map {
        constructor(container: HTMLElement, options: MapOptions);
      }
    }
  }
}
