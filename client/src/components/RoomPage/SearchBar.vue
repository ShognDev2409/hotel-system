<template>
  <v-card class="search-card" elevation="8" rounded="lg">
    <v-card-text>
      <v-row no-gutters align="center">
        <v-col cols="12" md="3" class="pa-1">
          <v-menu
            v-model="menuIn"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="filters.checkIn"
                label="Check In"
                prepend-inner-icon="mdi-calendar"
                readonly
                solo
                flat
                hide-details
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="filters.checkIn"
              @input="menuIn = false"
              :min="minDate"
              no-title
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" md="3" class="pa-1">
          <v-menu
            v-model="menuOut"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="filters.checkOut"
                label="Check Out"
                prepend-inner-icon="mdi-calendar"
                readonly
                solo
                flat
                hide-details
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="filters.checkOut"
              @input="menuOut = false"
              :min="filters.checkIn || minDate"
              no-title
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" md="4" class="pa-1">
          <v-select
            v-model="filters.guests"
            :items="guestOptions"
            label="Guests / Rooms"
            prepend-inner-icon="mdi-account-group"
            solo
            flat
            hide-details
          ></v-select>
        </v-col>

        <v-col cols="12" md="2" class="pa-1">
          <v-btn
            class="search-btn"
            block
            x-large
            depressed
            @click="$emit('search')"
          >
            ຄົ້ນຫາ
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    filters: { type: Object, required: true },
    minDate:  { type: String, default: () => new Date().toISOString().substr(0, 10) },
    // Added some example options for demonstration
    guestOptions: { type: Array, default: () => ['1 Guest, 1 Room', '2 Guests, 1 Room', '3 Guests, 1 Room', '2 Guests, 2 Rooms'] }
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
.search-card {
  /* This can be adjusted if it sits on a colored background */
  margin-top: -48px;
  position: relative;
  z-index: 10;
  border: 1px solid #E0E0E0;
}

.search-btn {
  background: linear-gradient(45deg, #F5B93F, #f7b023) !important;
  color: white !important;
  font-weight: bold !important;
  font-family: 'Noto Sans Lao', sans-serif;
  height: 56px !important; /* Match height of solo text fields */
}

/* Deep selector to style the solo fields inside the component */
::v-deep .v-text-field.v-text-field--solo .v-input__control {
  min-height: 56px;
}
</style>