<template>
  <div>
    <VSlider v-model:model-value="progress" :max-value="duration" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VSlider from '@/shared/ui/VSlider.vue';
import { audioContextService } from '@/entities/music';

export default defineComponent({
  name: 'MusicPlayerProgressBar',
  components: {
    VSlider,
  },
  setup() {
    const progress = ref(0);
    const track: MediaElementAudioSourceNode = audioContextService.getTrack();
    const analyser: AnalyserNode = audioContextService.createAnalyser();
    const audioElement: HTMLMediaElement =
      audioContextService.getAudioElement();
    const duration = audioElement.duration;
    track.connect(analyser);

    audioElement.addEventListener('timeupdate', () => {
      const currentTime = audioElement.currentTime;

      progress.value = (currentTime / duration) * 100;
    });

    // const frequencyArray = new Uint8Array(analyser.frequencyBinCount);

    return {
      progress,
      duration,
    };
  },
});
</script>

<style></style>
