<template>
  <div class="w-full p-4 h-full">Tips</div>
</template>

<script setup>
  import { useGlobalStore } from '@/store/global';
  import { onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  const globalStore = useGlobalStore();
  const { t } = useI18n();

  onMounted(() => {
    globalStore.setAppTitle(t('tipsTitle'));
  });
</script>
