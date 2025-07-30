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

      interface MarkerOptions {
        map: Map;
        position: LatLng;
      }

      class Marker {
        constructor(options: MarkerOptions);
        setMap(map: Map | null): void;
        setPosition(position: LatLng): void;
      }
    }
  }
}
