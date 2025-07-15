import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isSignedIn: false,
  }),
  actions: {
    signIn() {
      this.isSignedIn = true;
    },
    signOut() {
      this.isSignedIn = false;
    },
  },
});
