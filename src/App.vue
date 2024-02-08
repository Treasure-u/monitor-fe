<template>
  <div
    id="main-wrapper"
    data-layout="horizontal"
    data-theme="light"
    data-navbarbg="skin6"
    data-sidebartype="full"
    data-boxed-layout="fluid"
    data-sidebar-position="absolute"
    data-header-position="fixed"
  >
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",

  mounted() {
    var setsidebartype = function () {
      var width = window.innerWidth > 0 ? window.innerWidth : this.screen.width;
      const wrapper = document.getElementById("main-wrapper");
      if (width < 1170) {
        wrapper.setAttribute("data-sidebartype", "mini-sidebar");
        wrapper.classList.add("mini-sidebar");
      } else {
        wrapper.setAttribute("data-sidebartype", "full");
        wrapper.classList.remove("mini-sidebar");
      }
    };
    document.ready = setsidebartype;
    window.addEventListener("resize", setsidebartype);
  },
};
</script>

<style scoped>
#main-wrapper {
  overflow-x: scroll !important;
}
</style>
