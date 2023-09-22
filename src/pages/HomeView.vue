<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <MusicPlayer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MusicPlayer from '@/shared/MusicPlayer.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    MusicPlayer,
  },
});
</script>
