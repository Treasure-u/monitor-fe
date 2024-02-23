<template>
  <div>
    <div>
      <Card class="mb-4" dis-hover style="width: 820px">
        <div
          slot="title"
          class="d-flex justify-content-between align-items-center"
        >
          <div class="d-inline-block d-flex align-items-center header">
            <div>
              <h4 class="card-title">实时价格</h4>
              <h6 class="card-subtitle font-weight-normal text-muted">
                基差= 现货价格 - 期货价格
              </h6>
            </div>
          </div>
        </div>

        <vxe-table
          show-overflow
          size="mini"
          border
          stripe
          align="center"
          :data="items"
          :auto-resize="true"
          :span-method="mergeServerRowMethod"
          :row-config="{ isHover: true }"
          :radio-config="{ reserve: true }"
        >
          <vxe-column field="name" title="" width="100px"></vxe-column>
          <vxe-column field="hs300_price" title="hs300">
            <template #default="{ row }">
              <span style="align: left">
                {{ row.hs300_price == null ? "/" : row.hs300_price.toFixed(2) }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="hs300_base_price" title="hs300基差">
            <template #default="{ row }">
              <span style="align: left">
                {{
                  row.hs300_base_price == null
                    ? "/"
                    : row.hs300_base_price.toFixed(2)
                }}
              </span>
            </template>
          </vxe-column>

          <vxe-column field="zz500_price" title="zz500">
            <template #default="{ row }">
              <span style="align: left">
                {{ row.zz500_price == null ? "/" : row.zz500_price.toFixed(2) }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="zz500_base_price" title="zz500基差">
            <template #default="{ row }">
              <span style="align: left">
                {{
                  row.zz500_base_price == null
                    ? "/"
                    : row.zz500_base_price.toFixed(2)
                }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="zz1000_price" title="zz1000">
            <template #default="{ row }">
              <span style="align: left">
                {{
                  row.zz1000_price == null ? "/" : row.zz1000_price.toFixed(2)
                }}
              </span>
            </template>
          </vxe-column>
          <vxe-column
            field="zz1000_base_price"
            title="zz1000基差"
            width="100px"
          >
            <template #default="{ row }">
              <span style="align: left">
                {{
                  row.zz1000_base_price == null
                    ? "/"
                    : row.zz1000_base_price.toFixed(2)
                }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="sz50_price" title="sz50">
            <template #default="{ row }">
              <span style="align: left">
                {{ row.sz50_price == null ? "/" : row.sz50_price.toFixed(2) }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="sz50_base_price" title="sz50基差">
            <template #default="{ row }">
              <span style="align: left">
                {{
                  row.sz50_base_price == null
                    ? "/"
                    : row.sz50_base_price.toFixed(2)
                }}
              </span>
            </template>
          </vxe-column>
        </vxe-table>
        <div class="mt-2 font-weight-bold" v-if="!chartShow">
          数据更新时间:
          <span>{{ time }}</span>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { Message } from "view-design";
import Tooltip from "primevue/tooltip";
import {
  getFutPrice,
  getIndexPrice,
  getInstrumentInfo,
  getFastIndexPrice,
} from "../../../api/depth";
import { formatDateTime } from "../../../plugins/time";
export default {
  directives: { tooltip: Tooltip },

  data() {
    return {
      time: "",
      items: [],
      //map<(ex_id,symbol_id),(code_prefix,index_symbol_id)>
      fut_info_map: new Map(),
      //map<(ex_id,symbol_id),(symbol_name,fut_symbol_id)>
      index_info_map: new Map(),
      // 存储期货实时价格和指数实时价格
      hs_300_fut: [[], [], [], []],
      zz_500_fut: [[], [], [], []],
      zz_1000_fut: [[], [], [], []],
      sz_50_fut: [[], [], [], []],
      hs_300_index: [],
      zz_500_index: [],
      zz_1000_index: [],
      sz_50_index: [],
      hs_300_item: {},
      zz_500_item: {},
      zz_1000_item: {},
      sz_50_item: {},
      timer: [],
    };
  },
  components: {},
  created() {
    // this.getPerf();
  },
  mounted() {
    this.fetchItem();
    // this.timer.push(
    //   setInterval(() => {
    //     this.fetchItem();
    //   }, 10000)
    // );
  },

  methods: {
    formatTimestamp(timestampInSeconds) {
      const date = new Date(timestampInSeconds * 1000); // 将秒级别时间戳转换为毫秒级别
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    modify_row(row) {
      if (row.error_send) {
        Message.error("错误状态发送，无法修改");
        return;
      }
      if (this.isTradeTime() == true) {
        Message.error("当前处于交易时间，无法修改");
        return;
      }
      this.showModifyModal = true;
      this.modifyRow = row;
    },
    cancel_del() {
      this.deleteModal = false;
    },

    fetchItem() {
      let data = [];
      getInstrumentInfo()
        .then((response) => {
          let result = response.result;
          result.fut_info.forEach((futInfo) => {
            const key = `${futInfo.ex_id},${futInfo.symbol_id}`;
            const value = {
              code_prefix: futInfo.code_prefix,
              index_symbol_id: futInfo.index_symbol_id,
            };
            this.fut_info_map.set(key, value);
          });
          result.index_info.forEach((indexInfo) => {
            const key = `${indexInfo.ex_id},${indexInfo.symbol_id}`;
            const value = {
              symbol_name: indexInfo.symbol_name,
              fut_symbol_id: indexInfo.fut_symbol_id,
            };
            this.index_info_map.set(key, value);
          });
          return getIndexPrice();
        })
        .then((response) => {
          let result = response.result;
          let index_item = {
            name: null,
            hs300_price: null,
            hs300_base_price: null,
            zz500_price: null,
            zz500_base_price: null,
            zz1000_price: null,
            zz1000_base_price: null,
            sz50_price: null,
            sz50_base_price: null,
          };
          index_item.name = "指数价格";
          for (let i = 0; i < result.length; ++i) {
            let item = result[i];
            let key = `3553,${item.symbol_id}`;
            let symbol_name = this.index_info_map.get(key).symbol_name;

            if (symbol_name == "沪深300") {
              let len = this.hs_300_index.length;
              if (
                len == 0 ||
                this.hs_300_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.hs_300_index.push(item);
              }
              this.hs_300_item = item;
              index_item.hs300_price = item.price;
            } else if (symbol_name == "中证500") {
              let len = this.zz_500_index.length;
              if (
                len == 0 ||
                this.zz_500_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.zz_500_index.push(item);
              }
              this.zz_500_item = item;
              index_item.zz500_price = item.price;
            } else if (symbol_name == "中证1000") {
              let len = this.zz_1000_index.length;
              if (
                len == 0 ||
                this.zz_1000_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.zz_1000_index.push(item);
              }
              this.zz_1000_item = item;
              index_item.zz1000_price = item.price;
            } else if (symbol_name == "上证50") {
              let len = this.sz_50_index.length;
              if (
                len == 0 ||
                this.sz_50_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.sz_50_index.push(item);
              }
              this.sz_50_item = item;
              index_item.sz50_price = item.price;
            }
          }
          data.push(index_item);
          return getFastIndexPrice();
        })
        .then((response) => {
          let result = response.result;
          let fast_index_item = {
            name: "高速指数价格",
            hs300_price: null,
            hs300_base_price: null,
            zz500_price: null,
            zz500_base_price: null,
            zz1000_price: null,
            zz1000_base_price: null,
            sz50_price: null,
            sz50_base_price: null,
          };
          for (let i = 0; i < result.length; ++i) {
            let item = result[i];
            let key = `3553,${item.symbol_id}`;
            let symbol_name = this.index_info_map.get(key).symbol_name;

            if (symbol_name == "沪深300") {
              let len = this.hs_300_index.length;
              if (
                len == 0 ||
                this.hs_300_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.hs_300_index.push(item);
              }
              this.hs_300_item = item;
              fast_index_item.hs300_price = item.price;
            } else if (symbol_name == "中证500") {
              let len = this.zz_500_index.length;
              if (
                len == 0 ||
                this.zz_500_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.zz_500_index.push(item);
              }
              this.zz_500_item = item;
              fast_index_item.zz500_price = item.price;
            } else if (symbol_name == "中证1000") {
              let len = this.zz_1000_index.length;
              if (
                len == 0 ||
                this.zz_1000_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.zz_1000_index.push(item);
              }
              this.zz_1000_item = item;
              fast_index_item.zz1000_price = item.price;
            } else if (symbol_name == "上证50") {
              let len = this.sz_50_index.length;
              if (
                len == 0 ||
                this.sz_50_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.sz_50_index.push(item);
              }
              this.sz_50_item = item;
              fast_index_item.sz50_price = item.price;
            }
          }
          data.push(fast_index_item);
          return getFutPrice();
        })
        .then((response) => {
          let result = response.result;
          result.sort((a, b) => {
            return a.delivery_code - b.delivery_code;
          });
          let ct = 0;
          let fut_item = {
            name: null,
            hs300_price: null,
            hs300_base_price: null,
            zz500_price: null,
            zz500_base_price: null,
            zz1000_price: null,
            zz1000_base_price: null,
            sz50_price: null,
            sz50_base_price: null,
          };
          let ftime = 0;
          for (let i = 0; i < result.length; ++i) {
            if (
              i > 0 &&
              result[i].delivery_code != result[i - 1].delivery_code
            ) {
              ct += 1;
              data.push(fut_item);
              fut_item = {
                name: null,
                hs300_price: null,
                hs300_base_price: null,
                zz500_price: null,
                zz500_base_price: null,
                zz1000_price: null,
                zz1000_base_price: null,
                sz50_price: null,
                sz50_base_price: null,
              };
            }
            let item = result[i];
            if (item.timestamp > ftime) {
              ftime = item.timestamp;
            }
            fut_item.name = item.delivery_code;

            let key = `${item.ex_id},${item.symbol_id}`;
            let index_symbol_id = this.fut_info_map.get(key).index_symbol_id;
            key = `3553,${index_symbol_id}`;
            let symbol_name = this.index_info_map.get(key).symbol_name;
            if (symbol_name == "沪深300") {
              fut_item.hs300_price = item.price;
              fut_item.hs300_base_price = this.hs_300_item.price - item.price;
            } else if (symbol_name == "中证500") {
              fut_item.zz500_price = item.price;
              fut_item.zz500_base_price = this.zz_500_item.price - item.price;
            } else if (symbol_name == "中证1000") {
              fut_item.zz1000_price = item.price;
              fut_item.zz1000_base_price = this.zz_1000_item.price - item.price;
            } else if (symbol_name == "上证50") {
              fut_item.sz50_price = item.price;
              fut_item.sz50_base_price = this.sz_50_item.price - item.price;
            }
          }
          data.push(fut_item);
          this.items = data;
          this.time =
            ftime != 0 ? this.formatTimestamp(new Date(ftime) / 1000) : "-";
        });
    },
    async addRow() {
      if (this.isTradeTime() == true) {
        Message.error("当前处于交易时间，无法修改");
        return;
      }
      this.showModal = true;
    },
    mergeRowMethod({ row, _rowIndex, column, visibleData }) {
      const fields = ["client"];
      const cellValue = row[column.field];
      if (cellValue && fields.includes(column.field)) {
        const prevRow = visibleData[_rowIndex - 1];
        let nextRow = visibleData[_rowIndex + 1];
        if (prevRow && prevRow[column.field] === cellValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          let countRowspan = 1;
          while (nextRow && nextRow[column.field] === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex];
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      }
    },
    mergeServerRowMethod({ row, _rowIndex, column, visibleData }) {
      const fields = ["host"];
      const cellValue = row[column.field];
      if (cellValue && fields.includes(column.field)) {
        const prevRow = visibleData[_rowIndex - 1];
        let nextRow = visibleData[_rowIndex + 1];
        if (prevRow && prevRow[column.field] === cellValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          let countRowspan = 1;
          while (nextRow && nextRow[column.field] === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex];
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      }
    },
    isTradeTime() {
      const date = new Date();
      let day = date.getDay();
      const hours = date.getHours();
      const minute = date.getMinutes();
      if (day >= 1 && day <= 5) {
        if ((hours >= 9 && hours <= 11) || (hours >= 13 && hours <= 14)) {
          if (hours == 9) {
            if (minute >= 30) {
              return true;
            } else {
              return false;
            }
          } else if (hours == 11) {
            if (minute >= 30) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      }
      return false;
    },
    handleSelectHost(values) {
      this.modalParam.server = values;
    },
    validatePort() {
      if (this.modalParam.port !== null) {
        // 限制在minPort和maxPort之间
        if (this.modalParam.port < this.minPort) {
          this.modalParam.port = this.minPort;
        }
        if (this.modalParam.port > this.maxPort) {
          this.modalParam.port = this.maxPort;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 50%;
  height: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.del-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 15%;
  height: 15%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.my-badge .ivu-badge-status-dot {
  width: 30px !important;
  height: 30px !important;
}
.success-badge {
  width: 10px !important;
  height: 10px !important;
  background-color: rgb(56, 218, 31);
}
.connection-cell {
  &,
  & .vxe-cell {
    padding: 0px !important;
  }
  & .vxe-cell .green-row,
  & .vxe-cell .pink-row {
    padding: 9px !important;
    border: 1px solid #ece8ec;
  }
}
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
