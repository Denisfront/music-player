import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';

type Track = {
  title: string;
  track: any;
  picture: any;
};

type PlayerState = {
  isPlay: boolean;
  currentTrack?: Track | null;
};

export const useMusicPlayer = defineStore('musicPlayer', () => {
  const model: Ref<PlayerState> = ref({
    isPlay: false,
    currentTrack: null,
  });

  function changePlayerStatus(value: boolean) {
    model.value.isPlay = value;
  }

  function addCurrentTrack(track: Track) {
    model.value.currentTrack = track;
  }

  return {
    model,
    changePlayerStatus,
    addCurrentTrack,
  };
});
