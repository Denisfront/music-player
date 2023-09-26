<template>
  <div class="player-card">
    <div class="player-card__wrapper">
      <div class="player-card__controls">
        <slot name="controls"></slot>
      </div>
      <div class="player-card__content">
        <slot name="content"></slot>
      </div>
      <div class="player-card__slider">
        <slot name="slider-volume"></slot>
      </div>
      <div class="player-card__progress-bar">
        <slot name="progress-bar"></slot>
      </div>
    </div>
    <div class="player-card__append">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MusicPlayerCard',
  setup() {
    return {};
  },
});
</script>

<style lang="scss">
@keyframes rotate {
  from {
    transform: rotate(-360deg);
  }
}

.player-card {
  position: relative;
  background: var(--background-player-card);
  border-radius: 8px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  width: 580px;
  height: 200px;
  padding: 6px 18px;
  display: flex;
  align-items: center;
}

.player-card__wrapper {
  display: grid;
  grid-template-areas:
    'controls slider'
    'controls content '
    'controls progress-bar';
  height: 100%;
  grid-template-columns: 64px 313px;
  grid-template-rows: 54px 1fr 54px;
  margin-right: 35px;
  column-gap: 25px;
}

.player-card__controls {
  grid-area: controls;
}

.player-card__slider {
  grid-area: slider;
  align-self: center;
}

.player-card__progress-bar {
  grid-area: progress-bar;
  align-self: center;
}

.player-card__append {
}
</style>
