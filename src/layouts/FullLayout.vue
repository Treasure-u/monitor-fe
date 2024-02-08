<template>
  <div style="min-width: 1440px">
    <transition name="fade">
      <div class="preloader" v-if="!loaded">
        <div class="lds-ripple">
          <div class="lds-pos"></div>
          <div class="lds-pos"></div>
        </div>
      </div>
    </transition>
    <Header />
    <Sidebar />
    <div class="page-wrapper d-block">
      <router-view class="container-fluid" :key="$route.fullPath" />
    </div>
  </div>
</template>

<script>
import Header from "./Header";
import Sidebar from "./Sidebar";
export default {
  name: "FullLayout",
  components: {
    Header,
    Sidebar,
  },
  data() {
    return {
      loaded: false,
    };
  },
  mounted() {
    window.dispatchEvent(new Event("resize"));
    this.$router.onReady(() => (this.loaded = true));
  },
};
</script>

<style scoped>
@media screen and (max-width: 766px) {
  .page-wrapper {
    padding-top: 64px;
  }
}
</style>
