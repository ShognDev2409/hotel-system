<template>
  <v-img
    :src="src"
    height="400"
    gradient="to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.4)"
    class="hero-img"
  >
    <div class="hero-content">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
  </v-img>
</template>

<script>
export default {
  name: 'HeroBanner',
  props: {
    src: { type: String, required: true },
    title: { type: String, default: 'ຫ້ອງພັກ' },
    subtitle: { type: String, default: 'ເລືອກຫ້ອງພັກທີ່ທ່ານຕ້ອງການ' }
  }
}
</script>

<style scoped>
.hero-img { position: relative; }
.hero-content {
  position: absolute;
  bottom: 24px;
  left: 24px;
  color: white;
}
.hero-content h1 {
  margin: 0;
  font-size: 2.5rem;
}
.hero-content p {
  margin: 4px 0 0;
  font-size: 1.1rem;
}
</style>
