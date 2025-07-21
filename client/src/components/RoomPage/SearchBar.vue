<template>
  <v-container class="search-bar" fluid>
    <v-row no-gutters align="center">
      <v-col cols="12" sm="4">
        <v-menu
          v-model="menuIn"
          :close-on-content-click="false"
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="filters.checkIn"
              label="Check In"
              prepend-icon="mdi-calendar"
              readonly
              dense
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="filters.checkIn"
            @input="menuIn = false"
            :min="minDate"
          />
        </v-menu>
      </v-col>

      <v-col cols="12" sm="4">
        <v-menu
          v-model="menuOut"
          :close-on-content-click="false"
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="filters.checkOut"
              label="Check Out"
              prepend-icon="mdi-calendar"
              readonly
              dense
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="filters.checkOut"
            @input="menuOut = false"
            :min="filters.checkIn || minDate"
          />
        </v-menu>
      </v-col>

      <v-col cols="12" sm="3">
        <v-select
          v-model="filters.guests"
          :items="guestOptions"
          label="Guests / Rooms"
          dense
        />
      </v-col>

      <v-col cols="12" sm="1" class="text-right">
        <v-btn block color="primary" @click="$emit('search')">
          ຄົ້ນຫາ
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    filters: { type: Object, required: true },
    minDate:  { type: String, required: true },
    guestOptions: { type: Array, default: () => [] }
  },
  data() {
    return {
      menuIn: false,
      menuOut: false
    }
  }
}
</script>

<style scoped>
.search-bar {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  margin-top: -48px;    /* pull up under the banner if you like */
  position: relative;
  z-index: 2;
}
</style>
