<template>
  <div class="login-container">
    <div class="login-card">
      <div class="card-header">
        <h2>Admin Portal</h2>
        <p>Please log in to continue</p>
      </div>

      <form @submit.prevent="onSubmit" class="login-form">
        <div v-if="error" class="error-message">
          <span class="error-icon">⚠️</span>
          <p>{{ error }}</p>
        </div>

        <div class="input-group">
          <label for="username">Username</label>
          <span class="input-icon">👤</span>
          <input
            id="username"
            v-model="username"
            placeholder="Enter your username"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <span class="input-icon">🔒</span>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" :disabled="loading" class="submit-btn">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Log In</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      error: null,
      loading: false,
    };
  },
  methods: {
    async onSubmit() {
      this.error = null;
      this.loading = true;
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: this.user,
            password: this.password,
          }),
        });

        // Use the error message from the API if available, otherwise a generic one
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({})); // Catch cases where response is not valid JSON
            throw new Error(errorData.message || "Invalid username or password.");
        }

        const { token, role } = await res.json();
        if (role !== "admin") {
          throw new Error("You do not have administrator privileges.");
        }

        // Store credentials and redirect
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ role }));

        const dest = this.$route.query.redirect || "/admin/dashboard";
        this.$router.replace(dest);

      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* General Container */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  font-family: 'Inter', sans-serif;
}

/* The Login Card */
.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 50, 100, 0.1);
  padding: 40px;
  box-sizing: border-box;
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Card Header */
.card-header {
  text-align: center;
  margin-bottom: 30px;
}
.header-icon {
  font-size: 3rem;
}
.card-header h2 {
  margin: 10px 0 5px;
  color: #1a253c;
  font-weight: 700;
}
.card-header p {
  margin: 0;
  color: #6a738c;
  font-size: 0.9rem;
}

/* Input Fields */
.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 40px;
  color: #a0aec0;
  transition: color 0.2s;
}

.input-group input {
  width: 100%;
  padding: 12px 12px 12px 45px; /* Left padding for icon */
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3748;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-group input::placeholder {
  color: #a0aec0;
}

.input-group input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.input-group input:focus + .input-icon {
  color: #4a90e2;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background-color: #4a90e2;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:hover:not(:disabled) {
  background-color: #357abd;
}

.submit-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.submit-btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #fc8181;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  animation: shake 0.3s;
}
.error-icon {
    margin-right: 10px;
    font-size: 1.2rem;
}
.error-message p {
    margin: 0;
}


@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}


/* Loading Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>