<template>
  <div class="home"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
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
