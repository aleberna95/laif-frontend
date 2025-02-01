<template>
  <div class="">
    <router-view />
  </div>
</template>

<script setup>
  import { useGlobalStore } from '@/store/global';
  import { onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  const globalStore = useGlobalStore();
  const { t } = useI18n();

  onMounted(() => {
    globalStore.setAppTitle(t('addOperationTitle'));
  });
</script>