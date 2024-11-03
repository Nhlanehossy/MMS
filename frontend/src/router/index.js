import { createRouter, createWebHistory } from "vue-router";

//imported components 
import Dashboard from "../components/portal/dashboards/dashboard_renderer.vue";
import LayoutRenderer from "@/components/portal/layouts/layout_renderer.vue";
import ResourceDetails from "@/components/portal/render_modes/crud/resource_details.vue";
import ResourceRender from "@/components/portal/resource_renderer.vue";
import ProfileSettings from "@/components/portal/profile_settings.vue";
import register from "../pages/auth_pages/register/register.vue";
import privacy_policy from "../pages/legal_pages/privacy_policy.vue";
import terms_and_conditions from "../pages/legal_pages/terms_and_conditions.vue";
import forgot_password from "../pages/auth_pages/password_reset/forgot_password.vue";
import password_reset from "../pages/auth_pages/password_reset/password_reset.vue";

//system configuration
import { systemConfig } from "../data/system.config";

//imported pages
import Login from "@/pages/auth_pages/login/login.vue";
import NotFound from "@/pages/error_pages/not_found.vue";
import Stage from "@/pages/Stage.vue";
import product from "../components/portal/render_modes/shop/product.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path:"/register",
    name:"register",
    component: register
  },

  {
    path:"/terms-and-conditions",
    name:"terms-and-conditions",
    component: terms_and_conditions
  },
  {
    path:"/privacy-policy",
    name:"provacy-policy",
    component:privacy_policy
  },
  {
    path:"/forgot-password",
    name:"forgot-password",
    component:forgot_password
  },
  {
    path:"/reset-password",
    name:"reset-password",
    component:password_reset
  },
  // Dynamically generate routes for each portal
  ...systemConfig.portals.map((portal) => ({
    path: portal.url,
    component: LayoutRenderer,
    children: [
      {
        path: "",
        name: `${portal.name}Default`,
        component: Dashboard,
        props: (route) => ({
          dashboardType:portal.dashboardType
        })
      },
      {
        path: `product/:id`,
        name: `${portal.name}-product`,
        component: product,
        props: true
      },
      // Resource Detail Route
      ...portal.resources.map((resource) => ({
        path: `${portal.url}/:resourceName/:id/:mode`,
        name: `${portal.name}-${resource.path}Detail`,
        component: ResourceDetails,
      })),
      // Dynamically generate routes for resources
      ...portal.resources.map((resource) => ({
        path: `${portal.url}/${resource.path}`,
        name: `${portal.name}-${resource.path}`,
        component: ResourceRender,
        props: (route) => ({
          resource,
          currentPage: parseInt(route.query.page) || 1,
          itemsPerPage: parseInt(route.query.limit) || 30,
          searchQuery: route.query.search || "",
          sortBy: route.query.sortBy || "",
          sortOrder: route.query.order || "asc",
          item_id: route.params.item_id,          
          showbreadcrumbs: true,
        }),
      })),
      {
        path: `${portal.url}/profile`,
        name: `${portal.name}-profile-settings`,
        component: ProfileSettings,
      },
    ],
    props: (route) => ({
      layout: route.query.layout || portal.type,
    }),
  })),

  //if route is just "/", fall back to the default page
  {
    path: "/",
    redirect: systemConfig.defaultUrl,
  },

  {
    path: "/stage",
    name: "stage",
    component: Stage,

  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

console.log(routes);

export default router;
