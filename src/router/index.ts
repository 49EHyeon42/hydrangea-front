import { createRouter, createWebHistory } from 'vue-router';

import { useAuth } from '@/composables/useAuth';

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
      path: '/space',
      name: 'SpaceView',
      component: () => import('@/views/SpaceView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'PageNotFoundView',
      component: () => import('@/views/PageNotFoundView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuth();

  if (!to.meta.requiresAuth) {
    if (to.name === 'SpaceView') {
      const isSignedIn = await auth.isSignedIn();

      if (isSignedIn) {
        return next({ name: 'SpaceView' });
      }
    }

    return next();
  }

  const isSignedIn = await auth.isSignedIn();

  if (!isSignedIn) {
    return next({ name: 'SignInView' });
  }

  next();
});

export default router;
