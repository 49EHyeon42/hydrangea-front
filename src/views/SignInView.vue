<script setup lang="ts">
import { ref } from 'vue';
// import { useRouter } from 'vue-router';

// const router = useRouter();
const username = ref<string>('');
const password = ref<string>('');
</script>

<template>
  <v-container fluid class="fill-height d-flex align-center justify-center">
    <v-card title="Sign In" min-width="340">
      <v-card-text>
        <v-form>
          <v-text-field v-model="username" label="Username" required />
          <v-text-field v-model="password" label="Password" type="password" required />
          <v-btn type="submit" color="primary" block>Sign In</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped></style>
