<template>
  <div class="controls">
    <button type="button" class="controls__button controls__button--revert">
      <RewindIcon />
    </button>
    <button
      type="button"
      class="controls__button"
      data-playing="false"
      role="switch"
      aria-checked="false"
      @click="play"
    >
      <PlayIcon
        :class="[
          'controls__button-play',
          isPlay && 'controls__button-play--play',
        ]"
      />
    </button>
    <button type="button" class="controls__button">
      <RewindIcon />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import RewindIcon from '@/shared/ui/icons/Rewind.vue';
import PlayIcon from '@/shared/ui/icons/Play.vue';
import { audioContextService } from '@/entities/music';
import { musicPlayerState } from '@/entities/music-player/';

export default defineComponent({
  components: {
    RewindIcon,
    PlayIcon,
  },
  setup() {
    const isPlay = ref(false);
    const audioContext = audioContextService.getAudioContext();
    const audioElement = audioContextService.getAudioElement();
    const musicPlayer = musicPlayerState.useMusicPlayer();
    musicPlayer.changePlayerStatus(isPlay.value);

    function play() {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      if (isPlay.value) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      isPlay.value = !isPlay.value;
      musicPlayer.changePlayerStatus(isPlay.value);
    }

    return {
      play,
      isPlay,
    };
  },
});
</script>

<style lang="scss">
.controls {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.controls__button {
  width: 54px;
  height: 54px;
  background: rgba(5, 172, 106, 0.3);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

  &:hover {
    transform: scale(1.2);
  }

  &:active {
    transform: scale(0.8);
  }
}

.controls__button--revert {
  transform: rotate(180deg);

  &:hover {
    transform: scale(1.2) rotate(180deg);
  }

  &:active {
    transform: scale(0.8) rotate(180deg);
  }
}

.controls__button-play {
  &--play {
    > path {
      &:last-child {
        fill: #1c274c;
      }
    }
  }
}
</style>
