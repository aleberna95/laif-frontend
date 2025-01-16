<template>
  <div class="date-selector flex flex-col">
    <label :for="label" class="mb-2 text-sm font-bold text-gray-700">
      {{ $t(label) }}
    </label>
    <select
      :id="label"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="border rounded px-3 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ $t(option.label) }}
      </option>
    </select>
  </div>
</template>

<script>
  export default {
    name: 'DateSelector',
    props: {
      label: {
        type: String,
        required: true,
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
  .date-selector {
    width: 100%;
  }
</style>
