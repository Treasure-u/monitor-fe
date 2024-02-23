<template>
  <Row>
    <Col span="24">
      <futAndIndexTable />
    </Col>
  </Row>
</template>

<script>
import futAndIndexTable from "./depth-components/futAndIndexTable.vue";
export default {
  name: "FutAndIndexPage",
  components: { futAndIndexTable },
  data() {
    return {
      items: [],
      time: " ",
    };
  },
};
</script>

<style scoped>
.legend {
  width: 1rem;
  height: 1rem;
  display: inline-block;
}
</style>
