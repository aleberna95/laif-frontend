<template>
  <div class="flex flex-col h-full w-full">
    <router-view />
  </div>
</template>

<script setup>
  import { useGlobalStore } from '@/store/global';
  import { onMounted, onUpdated } from 'vue';
  import { useI18n } from 'vue-i18n';

  const globalStore = useGlobalStore();
  const { t } = useI18n();

  onMounted(() => {
    globalStore.setAppTitle(t('settingsTitle'));
  });
  onUpdated(() => {
    globalStore.setAppTitle(t('settingsTitle'));
  });
</script>
