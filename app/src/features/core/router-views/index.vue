<route lang="yaml">
meta:
  public: true # cf. auth/navigationGuards.ts
  layout: HomeLayout
</route>

<script setup lang="ts">
  import { testRequest } from '@FEATURES/core/api-requests/test'

  const router = useRouter()
  const { t } = useI18n()

  const { data, isFinished } = testRequest()
</script>

<template>
  <a @click="router.push('/blueprint')"> {{ t('Go to Blueprint') }} </a>
</template>
