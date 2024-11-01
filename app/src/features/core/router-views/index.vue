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
  <div class="relative">
    <div class="w-40 h-40 border"></div>
    <div class="absolute top-100 left-20 h-40 w-4 border"></div>
    <BoxToBoxArrow
      class="absolute left-0 top-0"
      :from="{ x: 0, y: 0, width: 160, height: 160 }"
      :to="{ x: 80, y: 400, width: 16, height: 160 }"
    />
  </div>
</template>
