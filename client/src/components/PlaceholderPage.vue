<template>
  <div class="placeholder-page">
    <div class="icon" v-if="icon">{{ icon }}</div>
    <h2>{{ title }}</h2>
    <p class="desc">{{ description }}</p>
    <div v-if="functionality" class="functionality">{{ functionality }}</div>
  </div>
</template>

<script>
export default {
  name: 'PlaceholderPage',
  props: {
    title: String,
    description: String,
    icon: String,
    functionality: String
  }
}
</script>

<style scoped>
.placeholder-page {
  max-width: 600px;
  margin: 60px auto;
  padding: 40px 30px;
  background: #fffbe7;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  text-align: center;
}
.icon {
  font-size: 3rem;
  margin-bottom: 18px;
}
h2 {
  color: #8B4513;
  margin-bottom: 12px;
}
.desc {
  color: #555;
  margin-bottom: 18px;
}
.functionality {
  color: #444;
  font-size: 1.1rem;
  background: #fffde4;
  border-radius: 8px;
  padding: 12px 18px;
  margin-top: 10px;
  display: inline-block;
}
</style>
