<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
        block
        class="details-btn ma-0"
        v-bind="attrs"
        v-on="on"
        :disabled="!isAvailable"
      >
        Booking Now
      </v-btn>
    </template>

    <v-card class="dialog-card">
      <v-toolbar flat class="dialog-toolbar">
        <v-toolbar-title>Booking - {{ room.name }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="dialog-content-area pa-5">
        <p class="mb-6 grey--text text--darken-2">
          ກະລຸນາຕື່ມຂໍ້ມູນການຈອງຂອງທ່ານໃຫ້ຄົບຖ້ວນ.
        </p>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.name" label="ຊື່" outlined dense :rules="[v => !!v || 'ກະລຸນາປ້ອນຊື່']" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.email" label="ອີເມວ" outlined dense :rules="[v => /.+@.+\..+/.test(v) || 'ອີເມວບໍ່ຖືກ']" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.phone" label="ເບີໂທ" outlined dense :rules="[v => !!v || 'ກະລຸນາປ້ອນເບີໂທ']" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.guests" label="ຈຳນວນຜູ້ໃຊ້ບໍລິການ" outlined dense type="number" :rules="[v => v > 0 || 'ຂໍ້ມູນບໍ່ຖືກ']" />
            </v-col>

            <v-col cols="12">
              <v-file-input
                v-model="form.imageFile"
                @change="handleImageUpload"
                label="ອັບໂຫລດຮູບບັດປະຈຳຕົວ"
                outlined
                dense
                accept="image/*"
                prepend-icon="mdi-camera"
              ></v-file-input>
              <v-img
                v-if="form.imageBase64"
                :src="form.imageBase64"
                max-height="200"
                contain
                class="mt-2"
                style="border: 1px dashed #ccc; border-radius: 4px;"
              ></v-img>
            </v-col>

            <v-col cols="12" class="py-0 my-2">
              <v-divider />
            </v-col>

            <v-col cols="12" sm="6">
              <v-menu v-model="menuIn" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template #activator="{ on, attrs }">
                  <v-text-field v-model="form.checkIn" label="Check In" prepend-inner-icon="mdi-calendar" readonly outlined dense v-bind="attrs" v-on="on" :rules="[v => !!v || 'ກະລຸນາເລືອກວັນທີ']"></v-text-field>
                </template>
                <v-date-picker v-model="form.checkIn" @input="menuIn = false" :min="minDate" no-title></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6">
              <v-menu v-model="menuOut" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template #activator="{ on, attrs }">
                  <v-text-field v-model="form.checkOut" label="Check Out" prepend-inner-icon="mdi-calendar" readonly outlined dense v-bind="attrs" v-on="on" :rules="[v => !!v || 'ກະລຸນາເລືອກວັນທີ']"></v-text-field>
                </template>
                <v-date-picker v-model="form.checkOut" @input="menuOut = false" :min="form.checkIn || minDate" no-title></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn text @click="dialog = false" large>ຍົກເລີກ</v-btn>
        <v-btn class="dialog-btn" :disabled="!valid" @click="submit" large depressed>
          <v-icon left>mdi-check-circle-outline</v-icon>
          ຢືນຢັນການຈອງ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'BookingDialog',
  props: {
    room: { type: Object, required: true },
    isAvailable: { type: Boolean, default: true }
  },
  data() {
    return {
      dialog: false,
      valid: false,
      menuIn: false,
      menuOut: false,
      minDate: new Date().toISOString().substr(0, 10),
      form: {
        name: '',
        email: '',
        phone: '',
        guests: 1,
        checkIn: '',
        checkOut: '',
        imageFile: null,
        imageBase64: '',
      }
    }
  },
  methods: {
    handleImageUpload(file) {
      if (!file) {
        this.form.imageBase64 = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.form.imageBase64 = e.target.result;
        console.log('--- Image Encoded to Base64 ---');
        console.log(this.form.imageBase64);
        console.log('-------------------------------');
      };
      reader.onerror = (error) => console.error('Error reading file:', error);
      reader.readAsDataURL(file);
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$emit('book', {
          room: this.room,
          details: this.form
        });
        this.dialog = false;
        this.$nextTick(() => {
          this.$refs.form.reset();
          this.form.imageBase64 = ''; // Also clear the preview
          this.$refs.form.resetValidation();
        });
      }
    }
  }
}
</script>

<style scoped>
/* All the dialog-specific styles are now contained here */
.details-btn {
  background: linear-gradient(45deg, #F5B93F, #f7b023) !important;
  color: white !important;
  font-weight: bold !important;
  text-transform: none !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  border-bottom-left-radius: 15px !important;
  border-bottom-right-radius: 0px !important;
}
.ma-0 { margin: 0 !important; }
.dialog-card {
  border-radius: 16px !important;
  font-family: 'Noto Sans Lao', sans-serif !important;
  overflow: hidden;
}
.dialog-toolbar {
  background: linear-gradient(45deg, #F5B93F, #f7b023) !important;
  color: white !important;
  font-weight: bold !important;
}
.dialog-content-area { background-color: #FBFBFB; }
.dialog-btn {
  background: linear-gradient(45deg, #F5B93F, #f7b023) !important;
  color: white !important;
  font-weight: bold !important;
  text-transform: none !important;
}
</style>