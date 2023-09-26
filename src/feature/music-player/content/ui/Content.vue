<template>
  <div class="content">
    <div
      class="content__img"
      :style="`background-image: url(${musicPlayer.model.currentTrack?.picture})`"
    ></div>
    <h3 class="content__title">{{ musicPlayer.model.currentTrack.title }}</h3>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { musicPlayerState } from '@/entities/music-player/';

export default defineComponent({
  name: 'MusicPlayerContent',
  setup() {
    const musicPlayer = musicPlayerState.useMusicPlayer();

    return {
      musicPlayer,
    };
  },
});
</script>

<style lang="scss">
.content {
  height: 100%;
  position: relative;
  z-index: 1;
}
.content__title {
  color: #000;
  font-size: 24px;
  text-align: center;
  margin: 0;
  padding-top: 20px;
}

.content__img {
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}
</style>
