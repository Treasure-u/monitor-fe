import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "hash",
  base: process.env.BASE_URL,

  routes: [
    {
      path: "/",
      redirect: () => {
        return {
          name: 'FutAndIndexPage'
        }
      },
      component: () => import("@/layouts/FullLayout"),
      children: [
        {
          name: "ConnectionPage",
          path: "/connection",
          component: () => import("@/views/ConnectionPage"),
        },
        {
          name: "FutAndIndexPage",
          path: "/fut_and_index_price",
          component: () => import("@/views/depth/FutAndIndexPage"),
        },
        {
          name: "FutAndIndexGridPage",
          path: "/fut_and_index",
          component: () => import("@/views/depth/FutAndIndexGridPage"),
        },
      ],
    },
    {
      path: "*",
      redirect: () => {
        return {
          name: 'FutAndIndexPage'
        }
      },
    },
  ],
});
const originalPush = Router.prototype.push;

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
export default router;
