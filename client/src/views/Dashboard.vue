<template>
  <div class="dashboard">
    <h2>Welcome to the Admin Dashboard</h2>
    <p>This is your main admin overview page.</p>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
}
</script>

<style scoped>
.dashboard {
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.dashboard h2 {
  color: #2d3748;
  margin-bottom: 10px;
}
</style>
