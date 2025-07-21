<template>
  <div class="login-page">
    <v-container fluid class="fill-height bg-gradient">
      <v-row align="center" justify="center" class="fill-height ma-0">
        <v-col
          cols="12"
          sm="8"
          md="6"
          lg="4"
          xl="3"
          class="login-container pa-0 d-flex align-center justify-center"
        >
          <v-card class="login-card mx-auto" elevation="24" rounded="xl">
            <v-card-text class="px-8 pt-8 pb-8">
              <div class="text-center mb-8">
                <div class="logo-container mb-4">
                  <v-avatar size="90" class="primary lighten-4 elevation-3">
                    <v-img src="@/assets/image/logohotel.png" contain></v-img>
                  </v-avatar>
                </div>
                <h1 class="text-h4 font-weight-bold primary--text mb-2 gradient-title">
                  ເຂົ້າສູ່ລະບົບ
                </h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                  ຍິນດີຕອນຮັບເຂົ້າສູ່ລະບົບຈັດການຫ້ອງແຖວ
                </p>
              </div>
              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="mb-4 error-alert"
                closable
                @click:close="errorMessage = ''"
                density="comfortable"
              >
                <div class="d-flex align-center">
                  <v-icon class="me-2">mdi-alert-circle</v-icon>
                  {{ errorMessage }}
                </div>
              </v-alert>
              <v-form
                @submit.prevent="submitLogin"
                ref="loginForm"
                v-model="isFormValid"
              >
                <v-text-field
                  v-model="username"
                  label="ຊື່ຜູ້ໃຊ້"
                  prepend-inner-icon="mdi-account"
                  type="text"
                  color="primary"
                  variant="outlined"
                  class="mb-4 username-field custom-input"
                  :error-messages="usernameError"
                  required
                  :rules="usernameRules"
                  density="comfortable"
                  clearable
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="ລະຫັດຜ່ານ"
                  prepend-inner-icon="mdi-lock"
                  color="primary"
                  variant="outlined"
                  class="mb-2 password-field custom-input"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  :error-messages="passwordError"
                  required
                  :rules="passwordRules"
                  density="comfortable"
                ></v-text-field>
                <div class="d-flex align-center justify-space-between mb-6">
                  <v-checkbox
                    v-model="rememberMe"
                    label="ຈົດຈຳການເຂົ້າສູ່ລະບົບ"
                    color="primary"
                    hide-details
                    density="compact"
                  ></v-checkbox>
                  <a
                    href="#"
                    class="text-decoration-none text-caption primary--text"
                    @click.prevent="showForgotPasswordDialog = true"
                  >
                    ລືມລະຫັດຂ່ານ?
                  </a>
                </div>
                <v-btn
                  color="primary"
                  size="large"
                  block
                  type="submit"
                  :loading="loading"
                  :disabled="loading || !isFormValid"
                  class="mb-4 font-weight-bold text-white login-btn gradient-btn"
                  elevation="4"
                  rounded
                >
                  <v-icon left class="me-2">mdi-login</v-icon>
                  ເຂົ້າສູ່ລະບົບ
                </v-btn>
              </v-form>
              <div class="text-center mt-4">
                <p class="text-caption text-medium-emphasis">
                  ສຳລັບຜູ້ເບິ່ງແຍງລະບົບເທົ່ານັ້ນ
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="showForgotPasswordDialog" max-width="400px">
      <v-card rounded="xl">
        <v-card-title class="text-h6 text-center pa-6">
          ລືມລະຫັດຜ່ານ
        </v-card-title>
        <v-card-text class="text-center pb-6">
          <p>ກະລຸນາຕິດຕໍ່ຜູ້ເບິ່ງແຍງລະບົບເພື່ອຂໍຕັ້ງລະຫັດຜ່ານໃໝ່</p>
        </v-card-text>
        <v-card-actions class="justify-center pb-6">
          <v-btn
            color="primary"
            @click="showForgotPasswordDialog = false"
            class="text-white forgot-password-btn"
            rounded
          >
            ປິດ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="animated-bg">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminLogin",
  data: () => ({
    username: "",
    password: "",
    showPassword: false,
    rememberMe: false,
    loading: false,
    errorMessage: "",
    usernameError: "",
    passwordError: "",
    isRedirecting: false,
    isFormValid: false,
    showForgotPasswordDialog: false,
    usernameRules: [
      (v) => !!v || "ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້",
      (v) => v?.length >= 3 || "ຊື່ຜູ້ໃຊ້ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ",
    ],
    passwordRules: [
      (v) => !!v || "ກະລຸນາໃສ່ລະຫັດຜ່ານ",
      (v) => v?.length >= 4 || "ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 4 ຕົວອັກສອນ",
    ],
  }),

  created() {
    console.log("AdminLogin component created");
    // ກວດສອບວ່າມີການ login ຢູ່ແລ້ວຫຼືບໍ່
    this.checkExistingAuth();
  },

  mounted() {
    console.log("AdminLogin component mounted");
    this.hideNavigationElements();
    this.loadRememberedCredentials();
    this.animatePageLoad();
  },

  beforeDestroy() {
    this.showNavigationElements();
  },

  methods: {
    // ກວດສອບການ login ທີ່ມີຢູ່ແລ້ວ
    checkExistingAuth() {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      console.log(
        "Checking existing auth - Token:",
        !!token,
        "IsLoggedIn:",
        isLoggedIn
      );

      if (token || isLoggedIn) {
        console.log("User already authenticated, redirecting to dashboard");
        this.$router.replace("/Dashboard").catch((err) => {
          console.error("Redirect error:", err);
        });
      }
    },

    hideNavigationElements() {
      const elements = [".v-app-bar", ".v-footer", ".v-navigation-drawer"];
      elements.forEach((selector) => {
        const element = document.querySelector(selector);
        if (element) element.style.display = "none";
      });
    },

    showNavigationElements() {
      const elements = [".v-app-bar", ".v-footer", ".v-navigation-drawer"];
      elements.forEach((selector) => {
        const element = document.querySelector(selector);
        if (element) element.style.display = "";
      });
    },

    loadRememberedCredentials() {
      const storedUsername = localStorage.getItem("rememberedUsername");
      const storedPassword = localStorage.getItem("rememberedPassword");
      if (storedUsername && storedPassword) {
        this.username = storedUsername;
        this.password = atob(storedPassword);
        this.rememberMe = true;
      }
    },

    animatePageLoad() {
      this.$nextTick(() => {
        setTimeout(() => {
          const card = document.querySelector(".login-card");
          if (card) {
            card.classList.add("animate-in");
          }
        }, 100);
      });
    },

    submitLogin() {
      if (this.loading || this.isRedirecting) return;
      this.login();
    },

    async login() {
      this.resetErrors();

      if (!this.$refs.loginForm.validate()) return;

      this.loading = true;
      console.log("Starting login process...");

      try {
        const response = await axios.post(
          "http://localhost:3001/authen/login",
          {
            username: this.username.trim(),
            password: this.password,
          },
          {
            timeout: 10000,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          console.log("Login successful:", response.data);

          // ເກັບຂໍ້ມູນໃນ storage
          this.storeUserData(response.data);

          // ຈັດການ Remember Me
          this.handleRememberMe();

          // ແຈ້ງໃຫ້ App.vue ຮູ້ວ່າມີການ login
          this.notifyAppOfLogin(response.data);

          // Success notification
          this.$emit("show-snackbar", {
            message: "ເຂົ້າສູ່ລະບົບສຳເລັດ!",
            color: "success",
          });

          console.log("Login completed successfully");

          // ໃຫ້ 500ms ເພື່ອໃຫ້ storage events ແລະ auth state ອັບເດດ
          setTimeout(() => {
            // ຖ້າຍັງຢູ່ໃນໜ້າ login ຫຼັງຈາກ storage ອັບເດຕແລ້ວ
            // router guards ຄວນຈະ redirect ໄປ dashboard ຂອງອັດຕະໂນມັດ
            if (this.$route.path === "/AdminLogin") {
              console.log("Still on login page, triggering manual redirect");
              this.$router.replace("/Dashboard").catch((err) => {
                // ຖ້າມີ navigation error ໃຫ້ ignore ເພາະວ່າ router guards ອາດຈະ redirect ກ່ອນແລ້ວ
                if (
                  err.name === "NavigationDuplicated" ||
                  err.message.includes("Navigation cancelled")
                ) {
                  console.log("Navigation handled by router guards");
                } else {
                  console.error("Unexpected navigation error:", err);
                }
              });
            }
          }, 500);
        }
      } catch (error) {
        console.error("Login error:", error);

        // ຖ້າເປັນ navigation error ໃຫ້ບໍ່ສະແດງ error ໃຫ້ຜູ່ໃຊ້
        if (error.message && error.message.includes("Navigation cancelled")) {
          console.log("Navigation cancelled - this is expected behavior");
          return; // ບໍ່ສະແດງ error
        }

        this.handleLoginError(error);
        this.shakeForm();
      } finally {
        // Reset loading state
        this.loading = false;
        this.isRedirecting = false;
      }
    },

    storeUserData(data) {
      console.log("💾 Storing user data:", data);

      const { token, user } = data;
      const storage = this.rememberMe ? localStorage : sessionStorage;
      try {
        // ✅ Store token and user data
        if (token) {
          storage.setItem("token", token);
          console.log(
            "✅ Token stored in",
            this.rememberMe ? "localStorage" : "sessionStorage"
          );
        }
        if (user) {
          storage.setItem("user", JSON.stringify(user));
          console.log("✅ User data stored:", user);
        }
        // ✅ Always set login status and role in localStorage for guards
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "admin");
        sessionStorage.setItem("role", "admin");
        console.log("✅ Login flag set to true and role set to admin");
        // ✅ Set axios default header
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          console.log("✅ Axios authorization header set");
        }
        // ✅ Verify data was stored correctly
        const verifyToken =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const verifyLogin = localStorage.getItem("isLoggedIn");
        const verifyRole = localStorage.getItem("role");
        console.log("🔍 Verification:");
        console.log("  - Token exists:", !!verifyToken);
        console.log("  - Login flag:", verifyLogin);
        console.log("  - Role:", verifyRole);
        console.log(
          "  - Auth header set:",
          !!axios.defaults.headers.common["Authorization"]
        );
      } catch (error) {
        console.error("💥 Error storing user data:", error);
      }
    },

    // ✅ ແກ້ໄຂ method notifyAppOfLogin()
    notifyAppOfLogin(data) {
      console.log("📢 Notifying app of login...");

      // ✅ ໃຫ້ເວລາ storage ອັບເດຕກ່ອນ
      setTimeout(() => {
        try {
          // ສົ່ງ custom event ໄປຫາ App.vue
          const loginEvent = new CustomEvent("userLoggedIn", {
            detail: data.user,
          });
          window.dispatchEvent(loginEvent);
          console.log("✅ userLoggedIn event dispatched");

          // ສົ່ງ storage event ເພື່ອ trigger watch ໃນ App.vue
          const storageEvent = new StorageEvent("storage", {
            key: "isLoggedIn",
            newValue: "true",
            oldValue: "false",
            storageArea: localStorage,
          });
          window.dispatchEvent(storageEvent);
          console.log("✅ storage event dispatched");

          // ✅ Force trigger Vue reactivity
          this.$forceUpdate();
        } catch (error) {
          console.error("💥 Error notifying app:", error);
        }
      }, 200); // ເພີ່ມເວລາໃຫ້ມາກຂຶ້ນ
    },

    resetErrors() {
      this.errorMessage = "";
      this.usernameError = "";
      this.passwordError = "";
    },

    handleLoginError(error) {
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 401:
            if (data.message?.includes("User not found")) {
              this.usernameError = "ບໍ່ພົບຊື່ຜູ້ໃຊ້ນີ້ໃນລະບົບ";
            } else if (data.message?.includes("Incorrect password")) {
              this.passwordError = "ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ";
            } else {
              this.errorMessage = "ຊື່ຜູ້ໃຊ້ຫຼືລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ";
            }
            break;
          case 500:
            this.errorMessage = "ເກີດຂໍ້ຜິດພາດໃນເຊີບເວີ ກະລຸນາລອງໃໝ່";
            break;
          default:
            this.errorMessage = data.message || "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ";
        }
      } else if (error.request) {
        this.errorMessage =
          "ບໍ່ສາມາດເຊື່ອມຕໍ່ເຊີບເວີໄດ້ ກະລຸນາກວດສອບການເຊື່ອມຕໍ່ອິນເຕີເນັດ";
      } else {
        this.errorMessage = "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ ກະລຸນາລອງໃໝ່";
      }
    },

    handleRememberMe() {
      if (this.rememberMe) {
        localStorage.setItem("rememberedUsername", this.username);
        localStorage.setItem("rememberedPassword", btoa(this.password));
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
      }
    },

    shakeForm() {
      const card = document.querySelector(".login-card");
      if (card) {
        card.classList.add("shake");
        setTimeout(() => {
          card.classList.remove("shake");
        }, 500);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-gradient {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4472ca 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  overflow: hidden;
  transform: translateY(50px);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  &.shake {
    animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
}

.gradient-title {
  background: linear-gradient(90deg, #f5b93f 0%, #f7b023 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.custom-input :deep(.v-field) {
  border-radius: 16px !important;
  background: rgba(245, 185, 63, 0.07);
}

.gradient-btn {
  background: linear-gradient(90deg, #f5b93f 0%, #f7b023 100%) !important;
  color: #fff !important;
  font-weight: bold;
  border-radius: 16px !important;
  box-shadow: 0 4px 16px 0 rgba(245, 185, 63, 0.15);
  letter-spacing: 1px;
  text-transform: none;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.gradient-btn:hover {
  filter: brightness(1.08);
  box-shadow: 0 8px 24px 0 rgba(245, 185, 63, 0.22);
}

// Animated Background
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;

  &.shape-1 {
    width: 100px;
    height: 100px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  &.shape-2 {
    width: 150px;
    height: 150px;
    top: 60%;
    right: 10%;
    animation-delay: 2s;
  }

  &.shape-3 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 30%;
    animation-delay: 4s;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(20px) rotate(240deg);
  }
}

// Form Styling
:deep(.v-field) {
  border-radius: 16px !important;

  &.v-field--focused {
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }
}

:deep(.v-btn) {
  letter-spacing: 0.5px;
  text-transform: none;
  font-size: 1rem;
  height: 48px !important;
}

// Custom form field styles
.username-field,
.password-field {
  :deep(.v-field) {
    border-radius: 12px !important;
  }
}

// Custom button styles
.login-btn {
  border-radius: 12px !important;
}

.forgot-password-btn {
  border-radius: 8px !important;
}

// Custom alert styles
.error-alert {
  border-radius: 8px !important;
}

:deep(.v-input--density-comfortable) {
  --v-input-control-height: 52px;
}

:deep(.v-alert) {
  border-left: 4px solid currentColor !important;
}

// Responsive Design
@media only screen and (max-width: 600px) {
  .login-card {
    border-radius: 16px;
    max-width: calc(100% - 24px);
    width: calc(100% - 24px);
    margin: 12px;
  }

  :deep(.v-card-text) {
    padding: 24px 20px !important;
  }

  .bg-gradient {
    padding: 20px;
  }
}

@media only screen and (min-width: 601px) and (max-width: 960px) {
  .login-card {
    max-width: 480px;
    width: 90%;
  }
}

@media only screen and (min-width: 961px) {
  .login-card {
    max-width: 480px;
    width: 480px;
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .login-card {
    background: rgba(30, 30, 30, 0.95);
    color: white;
  }
}
</style>