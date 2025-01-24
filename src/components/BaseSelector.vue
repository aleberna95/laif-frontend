<template>
  <div class="base-selector flex flex-col">
    <label v-if="label" :for="label" class="mb-2 text-sm font-bold text-gray-700">
      {{ parseInt(label) ? label : $t(label) }}
    </label>
    <select
      :id="label"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="border rounded px-3 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ parseInt(option.label) ? option.label : $t(option.label) }}
      </option>
    </select>
  </div>
</template>

<script>
  export default {
    name: 'BaseSelector',
    props: {
      label: {
        type: String,
        required: false,
      },
      options: {
        type: Array,
        required: true,
      },
      modelValue: {
        type: [String, Number],
        default: '',
      },
    },
  };
</script>

<style scoped>
  .base-selector {
    width: 100%;
  }
</style>
