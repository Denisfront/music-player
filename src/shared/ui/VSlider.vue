<template>
  <div class="v-slider">
    <div ref="sliderTrackElement" class="v-slider__track">
      <div class="v-slider__track-background"></div>
      <div
        class="v-slider__track-fill"
        :style="{ width: `${sliderValueWidth}%` }"
      ></div>
    </div>
    <button
      tabindex="0"
      ref="sliderControlElement"
      @keyup="handleKeyUp"
      @mousedown="draggingMousedown"
      @keydown="onKeydown"
      :class="[
        'v-slider__control',
        isDragging && 'v-slider__control--visible',
        focused && 'v-slider__control--focused',
      ]"
      :style="{
        left: `calc(${sliderValueWidth}% - ${5}px)`,
      }"
    >
      <div></div>
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onUnmounted, watch } from 'vue';

function convertActualValueToSnappedValue(
  actualValue: number,
  maxValue: number,
  step: number,
) {
  const percentage = (actualValue / maxValue) * 100;
  const snappedPercentage = Math.round(percentage / step) * step;
  const snappedValue = (snappedPercentage / 100) * maxValue;
  return snappedValue * 100;
}

function findClosestNumber(target, numbers) {
  let closestNumber = numbers[0];
  let closestDifference = Math.abs(target - closestNumber);

  for (let i = 1; i < numbers.length; i++) {
    const currentNumber = numbers[i];
    const currentDifference = Math.abs(target - currentNumber);

    if (currentDifference < closestDifference) {
      closestNumber = currentNumber;
      closestDifference = currentDifference;
    }
  }

  return closestNumber;
}
// TODO:  Компонент написан буквально на коленке, можно было бы использовать нативный input type="range" с кастомной стилизацией, но за выходные захотелось написать свой, он пока не работает с клавиатурой
export default defineComponent({
  name: 'VSlider',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    maxValue: {
      type: Number,
      default: 100,
    },
    minValue: {
      type: Number,
      default: 1,
    },
    step: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isDragging = ref(false);
    const sliderTrackElement = ref(null);
    const sliderControlElement = ref(null);
    const sliderValueWidth = ref(0);
    const offsetX = ref(0);
    const focused = ref(false);
    let steps: number[] = [];
    let stepCount = props.maxValue / props.step;
    let stepWidth = 100 / stepCount;
    let stepCentral = stepWidth / 2;
    let oldCurrentStepWidth = 0;
    const stepsMap: any = {};
    if (props.step) {
      let newMaxValue = 100;
      let newMaxWidthFill = props.maxValue;

      steps = Array.from(
        { length: props.maxValue / props.step + 1 },
        () => 'value',
      ).reduce((acc: number[], _, index) => {
        if (index === 0) {
          acc.push(newMaxValue);
          stepsMap[newMaxValue] = props.maxValue;

          return acc;
        }

        if (index === props.maxValue / props.step + 1 + 1) {
          acc.push(0);
          return acc;
        }
        if (newMaxValue - props.step === 0) {
          return acc;
        }

        newMaxValue = Number(
          (newMaxValue - 100 / (props.maxValue / props.step)).toFixed(2),
        );
        newMaxWidthFill = newMaxWidthFill = newMaxWidthFill - props.step;
        stepsMap[newMaxValue] = Number(newMaxWidthFill.toFixed(2));

        acc.push(newMaxValue);
        return acc;
      }, []);
    }
    steps = steps.sort((a, b) => a - b);
    console.log(steps);
    console.log(stepsMap);

    const localModelValue = computed({
      get() {
        return props.modelValue;
      },

      set(newValue) {
        emit('update:modelValue', newValue);
      },
    });

    watch(
      () => props.modelValue,
      newValue => {
        if (!isDragging.value) {
          sliderValueWidth.value = convertActualValueToSnappedValue(
            newValue,
            props.maxValue,
            props.step,
          );
        }
      },
    );

    function parseKeydown(e: KeyboardEvent, value: number) {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      let localValue = value;

      e.preventDefault();

      const multiplier = e.shiftKey ? props.step * 3 : props.step;
      console.log(e.key);

      if (e.key === 'ArrowLeft') {
        localValue = localValue - multiplier;
      } else {
        localValue = localValue + multiplier;
      }
      if (localValue > props.maxValue || localValue < props.minValue) {
        return;
      }
      return localValue;
    }

    function onKeydown(e: KeyboardEvent) {
      const newValue = parseKeydown(e, localModelValue.value);

      newValue != null && emit('update:modelValue', newValue);
    }

    function dragging() {
      isDragging.value = false;
      focused.value = false;
    }

    function handleClick(e) {
      const sliderRect = sliderTrackElement.value.getBoundingClientRect();

      let newValue =
        ((e.clientX - sliderRect.left - offsetX.value) / sliderRect.width) *
        100;
      newValue = Math.min(100, Math.max(0, newValue));

      sliderValueWidth.value = newValue + 5;
      const snappedValue = Math.round(newValue / props.step) * props.step;

      const actualValue = (snappedValue / 100) * props.maxValue;

      localModelValue.value = Number(actualValue.toFixed(1));

      isDragging.value = true;
    }

    function handlerangeUpdate(e) {
      if (!isDragging.value) {
        return;
      }
      if (localModelValue.value > props.maxValue) {
        return;
      }
      const sliderRect = sliderTrackElement.value.getBoundingClientRect();

      // let newValue =
      //   ((e.clientX - sliderRect.left - offsetX.value) / sliderRect.width) *
      //   100;
      let newValue = ((e.clientX - sliderRect.left) / sliderRect.width) * 100;
      let snappedValue = 0;

      newValue = Math.min(100, Math.max(0, newValue));

      if (props.step) {
        // console.log(
        //   'clientX',
        //   ((e.clientX - sliderRect.left) / sliderRect.width) * 100,
        // );

        let currentStepWidth = findClosestNumber(
          ((e.clientX - sliderRect.left) / sliderRect.width) * 100,
          steps,
        );
        // console.log('currentStepWidth', currentStepWidth);

        // debugger;
        // console.log(
        //   !(
        //     ((e.clientX - sliderRect.left) / sliderRect.width) * 100 >
        //     currentStepWidth
        //   ) &&
        //     currentStepWidth -
        //       Number(
        //         (
        //           ((e.clientX - sliderRect.left) / sliderRect.width) *
        //           100
        //         ).toFixed(0),
        //       ) <
        //       stepCentral &&
        //     props.modelValue !== currentStepWidth,
        // );
        // if (
        //   !(
        //     ((e.clientX - sliderRect.left) / sliderRect.width) * 100 >
        //     currentStepWidth
        //   ) &&
        //   currentStepWidth -
        //     Number(
        //       (
        //         ((e.clientX - sliderRect.left) / sliderRect.width) *
        //         100
        //       ).toFixed(0),
        //     ) <
        //     stepCentral
        // )
        // console.log(
        //   currentStepWidth -
        //     Number(((e.clientX - sliderRect.left) / sliderRect.width) * 100) <
        //     stepCentral && oldCurrentStepWidth !== currentStepWidth,
        // );

        if (
          currentStepWidth -
            Number(((e.clientX - sliderRect.left) / sliderRect.width) * 100) <
            stepCentral &&
          oldCurrentStepWidth !== currentStepWidth
        ) {
          // console.log(((e.clientX - sliderRect.left) / sliderRect.width) * 100);
          // console.log(currentStepWidth);
          oldCurrentStepWidth = currentStepWidth;
          sliderValueWidth.value = Math.round(currentStepWidth);
          // console.log(localModelValue.value + props.step);
          console.log('f');

          localModelValue.value = stepsMap[currentStepWidth];
        }
      } else {
        sliderValueWidth.value = newValue;
        // const snappedValue = Math.round(newValue / props.step) * props.step;
        snappedValue = newValue;

        const actualValue = (snappedValue / 100) * props.maxValue;

        localModelValue.value = actualValue;
      }
    }

    function handleKeyUp(event) {
      if (event.key === 'Tab') {
        focused.value = true;
      }
    }

    function draggingMousedown(e) {
      isDragging.value = true;
      focused.value = true;
      offsetX.value =
        e.clientX - sliderControlElement.value.getBoundingClientRect().left;
    }

    document.addEventListener('mousemove', handlerangeUpdate);
    document.addEventListener('mouseup', dragging);

    onUnmounted(() => {
      document.removeEventListener('mousemove', handlerangeUpdate);
      document.removeEventListener('mouseup', dragging);
    });

    return {
      localModelValue,
      handlerangeUpdate,
      sliderTrackElement,
      sliderValueWidth,
      sliderControlElement,
      dragging,
      handleClick,
      draggingMousedown,
      isDragging,
      focused,
      handleKeyUp,
      onKeydown,
    };
  },
});
</script>

<style lang="scss">
.v-slider {
  $this: &;
  --v-slider-thumb-size: 12px;
  display: flex;
  position: relative;
  align-items: center;
  min-height: 20px;
  width: 100%;
  cursor: pointer;
  transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

  &:hover {
    #{$this}__control {
      opacity: 1;
    }
  }
}

.v-slider__track {
  width: 100%;
  height: 3px;
  border-radius: 8px;
  cursor: pointer;
}

.v-slider__track-background {
  position: absolute;
  border-radius: 8px;
  height: 3px;
  width: 100%;
  background-color: #c5c6c5;
  opacity: 0.7;
}

.v-slider__track-fill {
  position: absolute;
  border-radius: 8px;
  height: 3px;
  width: 0%;
  background-color: #1aaf74;
  opacity: 0.9;
}

.v-slider__control {
  opacity: 0;
  outline: none;
  position: absolute;
  transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  width: var(--v-slider-thumb-size);
  height: var(--v-slider-thumb-size);
  border-radius: 50%;
  user-select: none;
  background-color: #05ac6a;

  &::before {
    content: '';
    display: block;
    width: 20px;
    position: absolute;
    top: -38%;
    left: -34%;
    transform: translate(-50%, -50%);
    height: 20px;
    border-radius: 50%;
    background-color: grey;
    opacity: 0;
    transform: scale(0);
    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    &::before {
      content: '';
      display: block;
      width: 20px;
      position: absolute;
      top: -38%;
      left: -34%;
      height: 20px;
      border-radius: 50%;
      background-color: #05ac6a;
      opacity: 0.1;
      transform: scale(1);
      transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  &--focused {
    &::before {
      content: '';
      display: block;
      width: 20px;
      position: absolute;
      top: -38%;
      left: -34%;
      transform: translate(-50%, -50%);
      height: 20px;
      border-radius: 50%;
      background-color: #05ac6a;
      opacity: 0.37;
      transform: scale(1);
      transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  &:focus {
    opacity: 1;

    &::before {
      content: '';
      display: block;
      width: 20px;
      position: absolute;
      top: -38%;
      left: -34%;
      transform: translate(-50%, -50%);
      height: 20px;
      border-radius: 50%;
      background-color: #05ac6a;
      opacity: 0.37;
      transform: scale(1);
      transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  &--visible {
    opacity: 1;
  }
}
</style>
