<template>
  <div class="slider-volume">
    <div class="slider-volume__control-wrapper">
      <button
        :data-playing="isSound"
        role="switch"
        aria-checked="false"
        @click="soundSwitch"
      >
        <VolumeSoundIcon v-if="isSound" />
        <VolumeSoundOffIcon v-else />
      </button>
    </div>
    <div class="slider-volume__slider">
      <VSlider v-model:model-value="volume" :max-value="1" :step="0.01" />
    </div>
    <!-- <figure class="audio">
      <figcaption>Listen to the T-Rex:</figcaption>
      <audio ref="audioElement" controls src="allthat.mp3" type="audio/mpeg">
        <a href="src/app/assets/dreams.mp3"> Download audio </a>
      </audio>
    </figure> -->
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, watch } from 'vue';
import type { Ref } from 'vue';
import { audioContextService } from '@/entities/music';
import VolumeSoundIcon from '@/shared/ui/icons/VolumeSoundIcon.vue';
import VolumeSoundOffIcon from '@/shared/ui/icons/VolumeSoundOffIcon.vue';
import VSlider from '@/shared/ui/VSlider.vue';

const audioState = {
  suspended: 'suspended',
};

export default defineComponent({
  name: 'MusicPlayerSliderVolume',
  components: {
    VSlider,
    VolumeSoundIcon,
    VolumeSoundOffIcon,
  },
  setup() {
    const isSoundOff = ref(false);
    const isSound = ref(true);
    const volume = ref(0);
    const hashSoundVolume = ref(0);
    const audioContext: AudioContext = audioContextService.getAudioContext();
    const gainNode = audioContextService.getGain();
    const track = audioContextService.getTrack();

    track.connect(gainNode).connect(audioContext.destination);

    volume.value = gainNode.gain.value;

    function soundOff() {
      gainNode.gain.value = 0;
      volume.value = 0;
    }
    function soundOn() {
      gainNode.gain.value = 1;
    }
    function soundSwitch() {
      if (isSound.value) {
        gainNode.gain.value = 0;
        hashSoundVolume.value = volume.value;
        volume.value = 0;
      } else {
        gainNode.gain.value = 1;
        volume.value = hashSoundVolume.value;
      }

      isSound.value = !isSound.value;
    }

    watch(
      () => volume.value,
      newVolume => {
        if (newVolume === 0) {
          isSound.value = false;
        } else {
          isSound.value = true;
        }
        gainNode.gain.value = newVolume;
      },
    );

    return {
      isSoundOff,
      hashSoundVolume,
      soundOff,
      soundOn,
      soundSwitch,
      // play,
      // audioElement,
      volume,
      isSound,
    };
  },
});
</script>

<style>
.audio {
  display: none;
}
.slider-volume {
  display: flex;
  justify-content: space-between;
}
.slider-volume__control-wrapper {
  margin-right: 15px;
}

.slider-volume__slider {
  min-width: 260px;
}

.slider-volume__control {
  > svg {
    > path {
      &:last-child {
        /* stroke-dasharray: 22; */
      }
    }
  }
}

/* .slider-volume__control--on {
  > svg {
    > path {
      &:last-child {
        stroke: blue;
        stroke-dashoffset: 45;
        stroke-dasharray: 30;
        animation: draw-back 0.7s linear forwards;
      }
    }
  }
}

.slider-volume__control--off {
  > svg {
    > path {
      &:last-child {
        stroke: red;
        stroke-dashoffset: 45;
        stroke-dasharray: 40;
        animation: dash 0.5s linear infinite;
      }
    }
  }
} */
</style>
