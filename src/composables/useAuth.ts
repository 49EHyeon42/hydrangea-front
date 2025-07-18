import authApi from '@/apis/authApi';
import { useAuthStore } from '@/stores/auth';

export const useAuth = () => {
  const authStore = useAuthStore();

  const isSignedIn = async () => {
    if (authStore.isSignedIn) {
      return authStore.isSignedIn;
    }

    const response = await authApi.me();

    if (response.ok) {
      authStore.signIn();
    } else {
      authStore.signOut();
    }

    return authStore.isSignedIn;
  };

  return { isSignedIn };
};
