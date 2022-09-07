import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path:'/',
    redirect: '/index'
  },
  {
    path: "/index",
    name: "index",
    component: () => import("../views/Index.vue"),

    //嵌套二级路由
    children: [
      {
        path: "/index/Home",
        name: "/index/Home",
        component: () => import("../views/modules/Home.vue")
      },
      {
        path: "/index/SeedRoundContract",
        name: "/index/SeedRoundContract",
        component: () => import("../views/modules/SeedRoundContract.vue")
      },
      {
        path: "/index/PrivatePlacementContract",
        name: "/index/PrivatePlacementContract",
        component: () => import("../views/modules/PrivatePlacementContract.vue")
      },
      {
        path: "/index/TeamContract",
        name: "/index/TeamContract",
        component: () => import("../views/modules/TeamContract.vue")
      },
      {
        path: "/index/StartRelease",
        name: "/index/StartRelease",
        component: () => import("../views/modules/StartRelease.vue")
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
