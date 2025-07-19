<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import authApi from '@/apis/authApi';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref<string>('');
const password = ref<string>('');

const handleLogin = async () => {
  try {
    const response = await authApi.signIn(username.value, password.value);

    if (!response.ok) {
      return;
    }

    authStore.signIn();

    router.push('/space');
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <v-container fluid class="fill-height d-flex align-center justify-center">
    <v-card title="Sign In" min-width="340">
      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-text-field v-model="username" label="Username" required />
          <v-text-field v-model="password" label="Password" type="password" required />
          <v-btn type="submit" color="primary" block>Sign In</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped></style>
