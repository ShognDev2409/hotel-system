import Vue from "vue";
import VueRouter from "vue-router";

// Public components
import Booking from "@/views/Booking.vue";
import Booking_list from "@/views/Booking_list.vue";
import Contact from "@/views/contact.vue";
import Home from "@/views/Home.vue";
import Login from "@/views/login.vue";
import Register from "@/views/Register.vue";
import Rooms from "@/views/Rooms.vue";

// Admin layout & components
import AdminPage from "@/views/Admin.vue";
import AdminLogin from "@/views/admin/AdminLogin.vue";
import CheckBooking from "@/views/admin/CheckBooking.vue";
import CheckIn from "@/views/admin/CheckIn.vue";
import CheckInStatus from "@/views/admin/CheckInStatus.vue";
import CheckOut from "@/views/admin/CheckOut.vue";
import ConfirmCheckout from "@/views/admin/ConfirmCheckout.vue";
import CustomerManagement from "@/views/admin/CustomerManagement.vue";
import Report from "@/views/admin/reports/Report.vue";
import RoomManagement from "@/views/admin/RoomManagement.vue";
import RoomTypeManagement from "@/views/admin/RoomTypeManagement.vue";
import StaffManagement from "@/views/admin/StaffManagement.vue";
import AdminDashboard from "@/views/Dashboard.vue";

Vue.use(VueRouter);

const routes = [
  // --- Public ---
  { path: "/",             name: "home",           component: Home },
  { path: "/rooms",        name: "Rooms",          component: Rooms },
  { path: "/booking",      name: "BookingList",    component: Booking_list },
  {
    path: "/booking/:roomId",
    name: "Booking",
    component: Booking,
    props: route => ({
      roomId:   route.params.roomId,
      checkIn:  route.query.checkIn,
      checkOut: route.query.checkOut,
      guests:   route.query.guests,
    }),
    meta: { requiresAuth: true },
  },
  { path: "/contact",      name: "Contact",        component: Contact },
  { path: "/login",        name: "login",          component: Login },
  { path: "/register",     name: "register",       component: Register },

  // --- Admin login (open to anyone) ---
  {
    path: "/admin-login",
    name: "admin-login",
    component: AdminLogin,
    meta: { guest: true }
  },

  // --- Protected Admin area ---
  {
    path: "/admin",
    component: AdminPage,
    children: [
      { path: "",               redirect: "/admin/dashboard" },
      {
        path: "dashboard",
        name: "admin-dashboard",
        component: AdminDashboard,
        meta: { title: "ໜ້າຫຼັກ", icon: "🏠" }
      },
      {
        path: "rooms",
        name: "admin-rooms",
        component: RoomManagement,
        meta: { title: "ຈັດການຂໍ້ມູນຫ້ອງ", section: "ຈັດການຂໍ້ມູນພື້ນຖານ", icon: "🏠" }
      },
      {
        path: "room-types",
        name: "admin-room-types",
        component: RoomTypeManagement,
        meta: { title: "ຈັດການປະເພດຫ້ອງ", section: "ຈັດການຂໍ້ມູນພື້ນຖານ", icon: "🏢" }
      },
      {
        path: "staff",
        name: "admin-staff",
        component: StaffManagement,
        meta: { title: "ຈັດການພະນັກງານ", section: "ຈັດການຂໍ້ມູນພື້ນຖານ", icon: "👥" }
      },
      {
        path: "customers",
        name: "admin-customers",
        component: CustomerManagement,
        meta: { title: "ຈັດການລູກຄ້າ", section: "ຈັດການຂໍ້ມູນພື້ນຖານ", icon: "👤" }
      },
      {
        path: "check-booking",
        name: "admin-check-booking",
        component: CheckBooking,
        meta: { title: "ກວດສອບການຈອງ", section: "ແຈ້ງເຂົ້າ", icon: "🔍" }
      },
      {
        path: "check-in",
        name: "admin-check-in",
        component: CheckIn,
        meta: { title: "ບັນທຶກແຈ້ງເຂົ້າ", section: "ແຈ້ງເຂົ້າ", icon: "📝" }
      },
      {
        path: "check-in-status",
        name: "admin-check-in-status",
        component: CheckInStatus,
        meta: { title: "ກວດສອບແຈ້ງເຂົ້າ", section: "ແຈ້ງອອກ", icon: "📋" }
      },
      {
        path: "check-out",
        name: "admin-check-out",
        component: CheckOut,
        meta: { title: "ບັນທຶກແຈ້ງອອກ", section: "ແຈ້ງອອກ", icon: "📤" }
      },
      {
        path: "confirm-checkout",
        name: "admin-confirm-checkout",
        component: ConfirmCheckout,
        meta: { title: "ຢືນຢັນແຈ້ງອອກ", section: "ແຈ້ງອອກ", icon: "✅" }
      },
      {
        path: "reports",
        name: "admin-reports",
        component: Report,
        meta: { title: "ລາຍງານທັງໝົດ", section: "ລາຍງານ", icon: "📊" }
      }
    ]
  },

  // Fallback
  { path: "*", redirect: "/" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});

// ————— Global Guard —————
// Protect _all_ admin routes (and only /admin-login is open)
router.beforeEach((to, from, next) => {
  const isAdminRoute = to.matched.some(r => r.path.startsWith("/admin"));
  if (!isAdminRoute || to.name === "admin-login") {
    return next();
  }

  const token = localStorage.getItem("token");
  let user = {};
  try { user = JSON.parse(localStorage.getItem("user") || "{}"); } catch {}

  if (!token || user.role !== "admin") {
    // not logged in as admin → send to admin-login
    return next({
      name: "admin-login",
      query: { redirect: to.fullPath }
    });
  }

  next();
});

export default router;
