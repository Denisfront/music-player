<template>
  <div class="home">
    <MusicPlayerCard>
      <template #append>
        <img src="../app/assets/icons/music-plate.svg" alt="" />
      </template>
    </MusicPlayerCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MusicPlayerCard } from '@/entities/music-player';

export default defineComponent({
  name: 'HomeView',
  components: {
    MusicPlayerCard,
  },
  setup() {
    return {};
  },
});
</script>

<style>
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
</style>
