<template>
  <div class="home">
    <MusicPlayerCard>
      <template #controls>
        <MusicPlayerControls />
      </template>
      <template #slider-volume>
        <MusicPlayerSliderVolume />
      </template>
      <template #content>
        <MusicPlayerContent />
      </template>
      <template #progress-bar v-if="musicPlayer.model.isPlay">
        <MusicPlayerProgressBar />
      </template>
      <template #append>
        <div
          :class="[
            'vinyl-record-img',
            musicPlayer.model.isPlay && 'vinyl-record-img--play',
          ]"
        >
          <img src="../app/assets/icons/music-plate.svg" alt="" />
        </div>
      </template>
    </MusicPlayerCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { MusicPlayerCard } from '@/entities/music-player';
import { MusicPlayerSliderVolume } from '@/feature/music-player/slider-volume';
import { MusicPlayerControls } from '@/feature/music-player/controls';
import { MusicPlayerContent } from '@/feature/music-player/content';
import { MusicPlayerProgressBar } from '@/feature/music-player/progress-bar';
import { audioContextService } from '@/entities/music';
import { musicPlayerState } from '@/entities/music-player';
import { getMusicList } from '@/shared/lib/musicList';

export default defineComponent({
  name: 'Player',
  components: {
    MusicPlayerCard,
    MusicPlayerSliderVolume,
    MusicPlayerControls,
    MusicPlayerContent,
    MusicPlayerProgressBar,
  },
  setup() {
    console.log(getMusicList());
    const tracks = getMusicList();

    const musicPlayer = musicPlayerState.useMusicPlayer();
    musicPlayer.addCurrentTrack(tracks[1]);

    const audioElement = new Audio(musicPlayer.model.currentTrack?.track);
    const audioContext = audioContextService.createAudioContext();
    audioContextService.addAudioElement(audioElement);

    audioContextService.createGain(audioContext);
    audioContextService.createMediaElementSource(audioContext, audioElement);

    return {
      audioElement,
      musicPlayer,
    };
  },
});
</script>

<style lang="scss">
.home {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../app/assets/icons/bg.svg') center center / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vinyl-record-img {
  &--play {
    animation: rotate 3s linear infinite;
  }
}
</style>
