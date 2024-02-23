<template>
  <header class="topbar" data-navbarbg="skin1">
    <nav class="navbar top-navbar navbar-expand-md navbar-dark">
      <div class="navbar-header" data-logobg="skin1">
        <!-- This is for the sidebar toggle which is visible on mobile only -->
        <a
          class="nav-toggler waves-effect waves-light d-block d-md-none"
          href="javascript:void(0)"
          ><i class="ti-menu ti-close"></i
        ></a>
        <!-- ============================================================== -->
        <!-- Logo -->
        <!-- ============================================================== -->
        <router-link class="navbar-brand" to="/">
          <!-- Logo icon -->
          <b class="logo-icon">
            <!--You can put here icon as well // <i class="wi wi-sunset"></i> //-->
            <!-- Dark Logo icon -->
            <!-- <img src="../../../assets/images/logo-icon.png" alt="homepage" class="dark-logo" /> -->
            <!-- Light Logo icon -->
            <img
              src="../assets/images/logo-white.png"
              alt="homepage"
              class="light-logo"
            />
          </b>
          <!--End Logo icon -->
        </router-link>
        <a
          class="topbartoggler d-block d-md-none waves-effect waves-light"
          href="javascript:void(0)"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          ><i class="ti-more"></i
        ></a>
      </div>
      <div
        class="navbar-collapse collapse"
        id="navbarSupportedContent"
        data-navbarbg="skin1"
      >
        <!-- ============================================================== -->
        <!-- toggle and nav items -->
        <!-- ============================================================== -->
        <ul class="navbar-nav float-left mr-auto">
          <li class="nav-item d-none d-md-block">
            <a
              class="nav-link sidebartoggler waves-effect waves-light"
              href="javascript:void(0)"
              data-sidebartype="mini-sidebar"
              ><i class="mdi mdi-menu font-24"></i
            ></a>
          </li>
          <!-- ============================================================== -->
          <!-- mega menu -->
          <!-- ============================================================== -->

          <Menu mode="horizontal" theme="dark" :active-name="active_name">
            <MenuItem name="ConnectionPage" :to="{ name: 'FutAndIndexPage' }">
              <Icon type="md-timer" />
              历史价格曲线（测试中）
            </MenuItem>
            <MenuItem
              name="FutAndIndexGridPage"
              :to="{ name: 'FutAndIndexGridPage' }"
            >
              <Icon type="md-trending-up" />
              指数&期货实时价格（测试中）
            </MenuItem>
          </Menu>
          <!-- ============================================================== -->
          <!-- End mega menu -->
          <!-- ============================================================== -->
          <!-- ============================================================== -->
          <!-- create new -->
          <!-- ============================================================== -->
        </ul>
        <!-- ============================================================== -->
        <!-- Right side toggle and nav items -->
        <!-- ============================================================== -->
        <ul class="navbar-nav float-right">
          <!-- ============================================================== -->
          <!-- create new -->
          <!-- ============================================================== -->

          <!-- ============================================================== -->
          <!-- User profile and search -->
          <!-- ============================================================== -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle text-muted waves-effect waves-dark pro-pic"
              href=""
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              ><img
                src="../assets/images/users/1.jpg"
                alt="user"
                class="rounded-circle"
                width="31"
            /></a>
            <div class="dropdown-menu dropdown-menu-right user-dd">
              <span class="with-arrow"><span class="bg-primary"></span></span>
              <div
                class="d-flex no-block align-items-center p-15 bg-primary text-white m-b-10"
              >
                <div class="">
                  <img
                    src="../assets/images/users/1.jpg"
                    alt="user"
                    class="img-circle"
                    width="60"
                  />
                </div>
                <div class="m-l-10">
                  <h4 class="m-b-0">Steave Jobs</h4>
                  <p class="m-b-0">varun@gmail.com</p>
                </div>
              </div>
              <a class="dropdown-item" href="javascript:void(0)"
                ><i class="ti-user m-r-5 m-l-5"></i> My Profile</a
              >
              <a class="dropdown-item" href="javascript:void(0)"
                ><i class="ti-wallet m-r-5 m-l-5"></i> My Balance</a
              >
              <a class="dropdown-item" href="javascript:void(0)"
                ><i class="ti-email m-r-5 m-l-5"></i> Inbox</a
              >
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="javascript:void(0)"
                ><i class="ti-settings m-r-5 m-l-5"></i> Account Setting</a
              >
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="javascript:void(0)"
                ><i class="fa fa-power-off m-r-5 m-l-5"></i> Logout</a
              >
              <div class="dropdown-divider"></div>
              <div class="p-l-30 p-10">
                <a
                  href="javascript:void(0)"
                  class="btn btn-sm btn-success btn-rounded"
                  >View Profile</a
                >
              </div>
            </div>
          </li>
          <!-- ============================================================== -->
          <!-- User profile and search -->
          <!-- ============================================================== -->
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  components: {},
  data() {
    return {
      filter_env: process.env.VUE_APP_VITE_ENV === "XZ01" ? true : false,
      account_list: [
        {
          account_id: 210,
          name: "haitong",
          title: "海通",
        },
        {
          account_id: 110,
          name: "zhongtai",
          title: "中泰",
        },
        {
          account_id: 130,
          name: "huatai",
          title: "华泰",
        },
        {
          account_id: 140,
          name: "huabao",
          title: "华宝",
        },
        {
          account_id: 150,
          name: "csci",
          title: "中建信投",
        },
      ],
    };
  },
  computed: {
    active_name: function () {
      if (this.$route.query && this.$route.query.account_id) {
        return `${this.$route.name}_${this.$route.query.account_id}`;
      } else {
        return `${this.$route.name}`;
      }
    },
  },
};
</script>

<style lang="scss">
.light-logo {
  height: 50px;
}

.ivu-menu {
  background-color: unset;
}

.ivu-menu-submenu-title span > i,
.ivu-menu-submenu-title > i {
  margin-right: 0 !important;
}

.ivu-menu-horizontal .ivu-menu-item,
.ivu-menu-horizontal .ivu-menu-submenu {
  padding: 0 10px;
}
</style>
