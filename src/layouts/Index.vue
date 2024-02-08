<template>
  <div class="table-responsive">
    <div>
      <h4 class="card-title">指数详情</h4>
      <h6 class="card-subtitle font-weight-normal text-muted">
        Index
      </h6>
    </div>
    <b-table
      hover
      striped
      small
      sticky-header
      borderless
      show-empty
      id="order-table"
      :fields="fields"
      :items="items"
    >
    </b-table>
  </div>
</template>

<script>
import { getIndex } from "../api/stock";
export default {
  name: "Index",
  data() {
    return {
      items: [],
      fields: [
        { key: "symbol_name", label: "指数名称ID" },
        { key: "last_price", label: "最新价" },
        { key: "open_price", label: "开盘价" },
        { key: "high_price", label: "最高价" },
        { key: "low_price", label: "最低价" },
        { key: "close_price", label: "收盘价" },
        { key: "pre_close_price", label: "昨日收盘价" },
        { key: "time", label: "更新时间" },
      ],
    };
  },
  mounted() {
    getIndex().then((response) => {
      this.items = response.result;
    });
  },
};
</script>
