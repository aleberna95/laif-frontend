<template>
  <div class="my-6 flex items-center justify-center border border-gray-300 rounded-md shadow-md p-2">
    <!-- Pulsante sinistro: se esiste il mese precedente, emette l'evento per andare a quello precedente -->
    <button v-if="hasPrev" @click="$emit('go-prev')" class="p-2 disabled:opacity-50">&lt;</button>

    <div class="px-4 font-medium w-32 text-center">
      {{ $t(currentItem.label) }}
    </div>

    <!-- Pulsante destro: se esiste il mese successivo, emette l'evento per andare a quello successivo -->
    <button v-if="hasNext" @click="$emit('go-next')" class="p-2 disabled:opacity-50">&gt;</button>
  </div>
</template>

<script setup>
  import { computed, defineProps } from 'vue';

  const props = defineProps({
    // L'array dinamico deve contenere oggetti con almeno { label, value, year }
    items: {
      type: Array,
      required: true,
    },
  });

  // Se l'array contiene almeno due elementi, assumiamo che l'elemento centrale (indice 1) sia il mese corrente
  // altrimenti, se c'è un solo elemento, quello è il corrente
  const currentItem = computed(() => {
    return props.items.length > 1 ? props.items[1] : props.items[0];
  });

  // Se esiste un elemento a sinistra (indice 0), significa che c'è il mese precedente
  const hasPrev = computed(() => {
    return props.items.length > 1;
  });

  // Se esiste un terzo elemento (indice 2) nell'array, vuol dire che il mese successivo è disponibile
  const hasNext = computed(() => {
    return props.items.length === 3;
  });
</script>
