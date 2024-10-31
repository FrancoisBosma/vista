<route lang="yaml">
meta:
  public: true # cf. auth/navigationGuards.ts
  layout: HomeLayout
</route>

<script setup lang="ts">
  const router = useRouter()
  const { t } = useI18n()
</script>

<template>
  <a @click="router.push('/blueprint')"> {{ t('Go to Blueprint') }} </a>
  <PointToPointArrow :from="{ x: 20, y: 20 }" :to="{ x: 100, y: 250 }" />
</template>
