import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/sign-in',
    },
    {
      path: '/sign-in',
      name: 'SignInView',
      component: () => import('@/views/SignInView.vue'),
    },
    {
      path: '/chat',
      name: 'ChatView',
      component: () => import('@/views/ChatView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'PageNotFoundView',
      component: () => import('@/views/PageNotFoundView.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isSignedIn && !(to.name === 'SignInView')) {
    return next({ name: 'SignInView' });
  }

  if (authStore.isSignedIn && to.name === 'SignInView') {
    return next({ name: 'ChatView' });
  }

  next();
});

export default router;
