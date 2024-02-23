<template>
  <Row>
    <Col span="16" class="mt-3">
      <FutAndIndexGrid />
    </Col>
  </Row>
</template>

<script>
import FutAndIndexGrid from "./depth-components/futAndIndexGrid.vue";
export default {
  components: {
    FutAndIndexGrid,
  },
  methods: {
    onDepthConfigUpdate() {
      this.$refs["LockList"].fetchItem();
    },
  },
};
</script>

<style lang="sass" scoped></style>
