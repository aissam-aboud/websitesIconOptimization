import Vue from "vue";
import VueRouter from "vue-router";

import colorsView from "../views/colorsView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/colorsView",
    name: "colorsView",
    component: colorsView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
