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
          name: 'ConnectionPage'
        }
      },
      component: () => import("@/layouts/FullLayout"),
      children: [
        {
          name: "ConnectionPage",
          path: "/connection",
          component: () => import("@/views/ConnectionPage"),
        },

      ],
    },
    {
      path: "*",
      redirect: () => {
        return {
          name: 'ConnectionPage'
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
