import Vue from "vue";
import VueRouter from "vue-router";
import api from '@/services/api'

// Import your existing components
import Home from "@/views/Home.vue";
import Login from "@/components/AdminPage/Login.vue";
import Register from "@/views/Register.vue";
import login from "@/views/login.vue";

// Import the main admin layout
import AdminPage from "@/views/Admin.vue";

// Import admin page components
import AdminDashboard from "@/views/Dashboard.vue";
import RoomManagement from "@/views/admin/RoomManagement.vue";
import RoomTypeManagement from "@/views/admin/RoomTypeManagement.vue";
import StaffManagement from "@/views/admin/StaffManagement.vue";
import CustomerManagement from "@/views/admin/CustomerManagement.vue";
import CheckBooking from "@/views/admin/CheckBooking.vue";
import CheckIn from "@/views/admin/CheckIn.vue";
import CheckInStatus from "@/views/admin/CheckInStatus.vue";
import CheckOut from "@/views/admin/CheckOut.vue";
import ConfirmCheckout from "@/views/admin/ConfirmCheckout.vue";
import Report from "@/views/admin/reports/Report.vue";
import Rooms from "@/views/Rooms.vue";
import Booking_list from "@/views/Booking_list.vue";
import Booking from "@/views/Booking.vue";
import Contact from "@/views/contact.vue";

Vue.use(VueRouter);

const routes = [
  
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/Rooms",
    name: "Rooms",
    component: Rooms,
  },
  {
    path: "/Booking",
    name: "BookingList",
    component: Booking_list,
  },
  // {
  //   path: "/booking",
  //   name: "Booking",
  //   component: Booking,
  //   meta: {
  //     requiresAuth: true
  //   }
  // },
  {
      path: "/booking/:roomId",
      name: "Booking",
      component: Booking,
      props: route => ({
        roomId:    route.params.roomId,
        checkIn:   route.query.checkIn,
        checkOut:  route.query.checkOut,
        guests:    route.query.guests
      }),
      meta: { requiresAuth: true }
    },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
  },
  {
    path: "/login",
    name: "login",
    component: login,
  },
  // {
  //   path: "/admin-login",
  //   name: "admin-login",
  //   component: Login,
  // },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/admin",
    component: AdminPage,
    meta: {
      requiresAuth: true,
      title: "ລະບົບຈັດການໂຮງແຮມ",
    },
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      {
        path: "dashboard",
        name: "admin-dashboard",
        component: AdminDashboard,
        meta: {
          title: "ໜ້າຫຼັກ",
          icon: "🏠",
        },
      },
      {
        path: "rooms",
        name: "admin-rooms",
        component: RoomManagement,
        meta: {
          title: "ຈັດການຂໍ້ມູນຫ້ອງ",
          section: "ຈັດການຂໍ້ມູນພື້ນຖານ",
          icon: "🏠",
        },
      },
      {
        path: "room-types",
        name: "admin-room-types",
        component: RoomTypeManagement,
        meta: {
          title: "ຈັດການປະເພດຫ້ອງ",
          section: "ຈັດການຂໍ້ມູນພື້ນຖານ",
          icon: "🏢",
        },
      },
      {
        path: "staff",
        name: "admin-staff",
        component: StaffManagement,
        meta: {
          title: "ຈັດການພະນັກງານ",
          section: "ຈັດການຂໍ້ມູນພື້ນຖານ",
          icon: "👥",
        },
      },
      {
        path: "customers",
        name: "admin-customers",
        component: CustomerManagement,
        meta: {
          title: "ຈັດການລູກຄ້າ",
          section: "ຈັດການຂໍ້ມູນພື້ນຖານ",
          icon: "👤",
        },
      },
      {
        path: "check-booking",
        name: "admin-check-booking",
        component: CheckBooking,
        meta: {
          title: "ກວດສອບການຈອງ",
          section: "ແຈ້ງເຂົ້າ",
          icon: "🔍",
        },
      },
      {
        path: "check-in",
        name: "admin-check-in",
        component: CheckIn,
        meta: {
          title: "ບັນທຶກແຈ້ງເຂົ້າ",
          section: "ແຈ້ງເຂົ້າ",
          icon: "📝",
        },
      },
      {
        path: "check-in-status",
        name: "admin-check-in-status",
        component: CheckInStatus,
        meta: {
          title: "ກວດສອບແຈ້ງເຂົ້າ",
          section: "ແຈ້ງອອກ",
          icon: "📋",
        },
      },
      {
        path: "check-out",
        name: "admin-check-out",
        component: CheckOut,
        meta: {
          title: "ບັນທຶກແຈ້ງອອກ",
          section: "ແຈ້ງອອກ",
          icon: "📤",
        },
      },
      {
        path: "confirm-checkout",
        name: "admin-confirm-checkout",
        component: ConfirmCheckout,
        meta: {
          title: "ຢືນຢັນແຈ້ງອອກ",
          section: "ແຈ້ງອອກ",
          icon: "✅",
        },
      },
      {
        path: "reports",
        name: "admin-reports",
        component: Report,
        meta: {
          title: "ລາຍງານທັງໝົດ",
          section: "ລາຍງານ",
          icon: "📊",
        },
      },
      
    ],
  },
  // Catch all route - redirect to home for unknown routes
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

// Route guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login with the intended destination
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router;