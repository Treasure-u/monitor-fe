<template>
  <Card dis-hover>
    <div slot="title">
      <h4 class="card-title">实时行情价格图表</h4>
      <h6 class="card-subtitle font-weight-normal text-muted">
        基差 = 现货价格 - 期货价格
      </h6>
    </div>
    <Row :gutter="20">
      <Col span="5">
        <RadioGroup
          v-model="type"
          type="button"
          button-style="solid"
          @on-change="onTypeChange"
        >
          <Radio label="0">当月</Radio>
          <Radio label="1">下月</Radio>
          <Radio label="2">下季</Radio>
          <Radio label="3">隔季</Radio>
        </RadioGroup>
      </Col>
    </Row>
    <Row class="my-3" :key="component_key">
      <Col flex="1" class="text-center">
        <DelayChart
          title="沪深300 IF"
          :legend="hs_300_chart[typeIndex][0]"
          :series="hs_300_chart[typeIndex][1]"
          :needLoading="false"
          :chartOptionCover="priceChartOpt"
        />
      </Col>
      <Col flex="1" class="text-center">
        <DelayChart
          title="上证50 IH"
          :legend="sz_50_chart[typeIndex][0]"
          :series="sz_50_chart[typeIndex][1]"
          :needLoading="false"
          :chartOptionCover="priceChartOpt"
        />
      </Col>
    </Row>
    <Row class="my-3" :key="component_key_2">
      <Col flex="1" class="text-center">
        <DelayChart
          title="中证500 IC"
          :legend="zz_500_chart[typeIndex][0]"
          :series="zz_500_chart[typeIndex][1]"
          :needLoading="false"
          :chartOptionCover="priceChartOpt"
        />
      </Col>
      <Col flex="1" class="text-center">
        <DelayChart
          title="中证1000 IM"
          :legend="zz_1000_chart[typeIndex][0]"
          :series="zz_1000_chart[typeIndex][1]"
          :needLoading="false"
          :chartOptionCover="priceChartOpt"
        />
      </Col>
    </Row>
  </Card>
</template>

<script>
import moment from "moment";
import {
  getFutPrice,
  getIndexPrice,
  getInstrumentInfo,
  getAllFutPrice,
  getAllIndexPrice,
} from "../../../api/depth";
import DelayChart from "../Chart";
export default {
  name: "StockDelayChart",
  components: {
    DelayChart,
  },
  data() {
    return {
      symbol_id: 0,
      type: "0",
      component_key: false,
      component_key_2: false,
      //map<(ex_id,symbol_id),(code_prefix,index_symbol_id)>
      fut_info_map: new Map(),
      //map<(ex_id,symbol_id),(symbol_name,fut_symbol_id)>
      index_info_map: new Map(),
      typeIndex: 0,
      hs_300_fut: [[], [], [], []],
      zz_500_fut: [[], [], [], []],
      zz_1000_fut: [[], [], [], []],
      sz_50_fut: [[], [], [], []],
      hs_300_index: [],
      zz_500_index: [],
      zz_1000_index: [],
      sz_50_index: [],
      hs_300_chart: [[], [], [], []],
      zz_500_chart: [[], [], [], []],
      zz_1000_chart: [[], [], [], []],
      sz_50_chart: [[], [], [], []],
      timer: [],
      delivery_code_list: [],
      fetchAllTag: false,
      priceChartOpt: null,
    };
  },
  mounted() {
    this.fetchAllData();
    this.priceChartOpt = this.PriceChartOptionCover();
    this.updateData();
    this.timer.push(
      setInterval(() => {
        this.updateData();
      }, 50000)
    );
  },
  beforeDestroy() {
    this.timer.forEach((timer) => clearInterval(timer));
    this.timer = [];
  },
  methods: {
    checkTimeValid(ts) {
      const date = new Date(ts);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      if (hours >= 9 && hours <= 11) {
        if (hours == 9 && minutes >= 30) {
          return true;
        }
        if (hours == 11 && minutes <= 30) {
          return true;
        }
        if (hours == 10) {
          return true;
        }
        return false;
      }
      if (hours >= 13 && hours <= 14) {
        return true;
      }
      return false;
    },
    onTypeChange() {
      this.typeIndex = this.type;
    },
    fetchAllData() {
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
          return getAllFutPrice();
        })
        .then((response) => {
          let result = response.result;
          result.sort((a, b) => {
            if (a.delivery_code != b.delivery_code) {
              return a.delivery_code - b.delivery_code;
            } else {
              return a.depth_timestamp - b.depth_timestamp;
            }
          });
          let ct = 0;
          let ff = true;
          for (let i = 0; i < result.length; ++i) {
            if (
              i > 0 &&
              result[i].delivery_code != result[i - 1].delivery_code
            ) {
              if (ct == 0) {
                this.delivery_code_list.push(result[i - 1].delivery_code);
              }
              ct += 1;
              this.delivery_code_list.push(result[i].delivery_code);
            }
            let item = result[i];
            if (ff) {
              ff = false;
            }
            if (this.checkTimeValid(item.timestamp) == false) {
              continue;
            }
            // if (
            //   item.delivery_code == 2403 &&
            //   item.depth_timestamp == 1708500299800000000 &&
            //   item.ex_id == 3691 &&
            //   item.price == 3455.0 &&
            //   ff
            // ) {
            //   // console.log("item!!!!!", item);
            //   ff = false;
            // }
            let key = `${item.ex_id},${item.symbol_id}`;
            let index_symbol_id = this.fut_info_map.get(key).index_symbol_id;
            key = `3553,${index_symbol_id}`;
            let symbol_name = this.index_info_map.get(key).symbol_name;
            if (symbol_name == "沪深300") {
              let len = this.hs_300_fut[ct].length;
              if (
                len == 0 ||
                this.hs_300_fut[ct][len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.hs_300_fut[ct].push(item);
              }
            } else if (symbol_name == "中证500") {
              let len = this.zz_500_fut[ct].length;
              if (
                len == 0 ||
                this.zz_500_fut[ct][len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.zz_500_fut[ct].push(item);
              }
            } else if (symbol_name == "中证1000") {
              let len = this.zz_1000_fut[ct].length;
              if (
                len == 0 ||
                this.zz_1000_fut[ct][len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.zz_1000_fut[ct].push(item);
              }
            } else if (symbol_name == "上证50") {
              let len = this.sz_50_fut[ct].length;
              if (
                len == 0 ||
                this.sz_50_fut[ct][len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.sz_50_fut[ct].push(item);
              }
              this.sz_50_fut[ct].push(item);
            }
          }
          return getAllIndexPrice();
        })
        .then((response) => {
          let result = response.result;
          result.sort((a, b) => {
            return a.depth_timestamp - b.depth_timestamp;
          });
          for (let i = 0; i < result.length; ++i) {
            let item = result[i];
            let key = `3553,${item.symbol_id}`;
            let symbol_name = this.index_info_map.get(key).symbol_name;
            if (this.checkTimeValid(item.timestamp) == false) {
              continue;
            }
            if (symbol_name == "沪深300") {
              let len = this.hs_300_index.length;
              if (
                len == 0 ||
                this.hs_300_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.hs_300_index.push(item);
              }
            } else if (symbol_name == "中证500") {
              let len = this.zz_500_index.length;
              if (
                len == 0 ||
                this.zz_500_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.zz_500_index.push(item);
              }
            } else if (symbol_name == "中证1000") {
              let len = this.zz_1000_index.length;
              if (
                len == 0 ||
                this.zz_1000_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.zz_1000_index.push(item);
              }
            } else if (symbol_name == "上证50") {
              let len = this.sz_50_index.length;
              if (
                len == 0 ||
                this.sz_50_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.sz_50_index.push(item);
              }
            }
          }
          // console.log(
          //   "hs300 fut->",
          //   this.hs_300_fut[0].length,
          //   this.hs_300_index.length
          // );
          for (let i = 0; i < 4; ++i) {
            this.hs_300_chart[i] = this.parseData(i, "hs300");
            this.zz_500_chart[i] = this.parseData(i, "zz500");
            this.zz_1000_chart[i] = this.parseData(i, "zz1000");
            this.sz_50_chart[i] = this.parseData(i, "sz50");
          }
          this.fetchAllTag = true;
          this.component_key = !this.component_key;
          this.component_key_2 = !this.component_key_2;
        });
    },
    fetchDelayData() {
      if (this.fetchAllTag == false) {
        return;
      }
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
          return getFutPrice();
        })
        .then((response) => {
          let result = response.result;
          result.sort((a, b) => {
            return a.delivery_code - b.delivery_code;
          });
          let ct = 0;
          for (let i = 0; i < result.length; ++i) {
            if (
              i > 0 &&
              result[i].delivery_code != result[i - 1].delivery_code
            ) {
              ct += 1;
            }
            // "delivery_code":2403,"depth_timestamp":1708500299800000000,"ex_id":3691,"price":3455.0,"symbol_id":3693,
            let item = result[i];
            if (this.checkTimeValid(item.timestamp) == false) {
              continue;
            }
            let key = `${item.ex_id},${item.symbol_id}`;
            let index_symbol_id = this.fut_info_map.get(key).index_symbol_id;
            key = `3553,${index_symbol_id}`;
            let symbol_name = this.index_info_map.get(key).symbol_name;
            if (symbol_name == "沪深300") {
              let len = this.hs_300_fut[ct].length;
              if (
                len == 0 ||
                this.hs_300_fut[ct][len - 1].depth_timestamp != item.timestamp
              ) {
                this.hs_300_fut[ct].push(item);
              }
            } else if (symbol_name == "中证500") {
              let len = this.zz_500_fut[ct].length;
              if (
                len == 0 ||
                this.zz_500_fut[ct][len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.zz_500_fut[ct].push(item);
              }
            } else if (symbol_name == "中证1000") {
              let len = this.zz_1000_fut[ct].length;
              if (
                len == 0 ||
                this.zz_1000_fut[ct][len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.zz_1000_fut[ct].push(item);
              }
            } else if (symbol_name == "上证50") {
              let len = this.sz_50_fut[ct].length;
              if (
                len == 0 ||
                this.sz_50_fut[ct][len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.sz_50_fut[ct].push(item);
              }
              this.sz_50_fut[ct].push(item);
            }
          }
          // console.log(
          //   "hs300 fut->",
          //   this.hs_300_fut[this.hs_300_fut.length - 1]
          // );
          return getIndexPrice();
        })
        .then((response) => {
          let result = response.result;
          for (let i = 0; i < result.length; ++i) {
            let item = result[i];
            let key = `3553,${item.symbol_id}`;
            let symbol_name = this.index_info_map.get(key).symbol_name;
            if (this.checkTimeValid(item.timestamp) == false) {
              continue;
            }
            if (symbol_name == "沪深300") {
              let len = this.hs_300_index.length;
              if (
                len == 0 ||
                this.hs_300_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.hs_300_index.push(item);
              }
            } else if (symbol_name == "中证500") {
              let len = this.zz_500_index.length;
              if (
                len == 0 ||
                this.zz_500_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.zz_500_index.push(item);
              }
            } else if (symbol_name == "中证1000") {
              let len = this.zz_1000_index.length;
              if (
                len == 0 ||
                this.zz_1000_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.zz_1000_index.push(item);
              }
            } else if (symbol_name == "上证50") {
              let len = this.sz_50_index.length;
              if (
                len == 0 ||
                this.sz_50_index[len - 1].depth_timestamp !=
                  item.depth_timestamp
              ) {
                this.sz_50_index.push(item);
              }
            }
          }
          for (let i = 0; i < 4; ++i) {
            this.hs_300_chart[i] = this.parseData(i, "hs300");
            this.zz_500_chart[i] = this.parseData(i, "zz500");
            this.zz_1000_chart[i] = this.parseData(i, "zz1000");
            this.sz_50_chart[i] = this.parseData(i, "sz50");
          }
          // console.log("this is 4 chart", this.hs_300_chart, this.zz_500_chart);
        });
    },
    updateData() {
      this.fetchDelayData();
      this.component_key = !this.component_key;
      this.component_key_2 = !this.component_key_2;
    },
    getXAxis(generate_time) {
      return moment(generate_time).format("HH:mm:ss");
    },
    parseData(index = 0, tag = "hs300") {
      let series = [];
      let legend = [];
      let show = true;
      let origin_index_series = [];
      let origin_fut_series = [];
      let fut_name = "";
      if (tag == "hs300") {
        origin_index_series = this.hs_300_index;
        origin_fut_series = this.hs_300_fut[index];
        fut_name = "IF";
      } else if (tag == "zz500") {
        origin_index_series = this.zz_500_index;
        origin_fut_series = this.zz_500_fut[index];
        fut_name = "IC";
      } else if (tag == "zz1000") {
        origin_index_series = this.zz_1000_index;
        origin_fut_series = this.zz_1000_fut[index];
        fut_name = "IM";
      } else {
        origin_index_series = this.sz_50_index;
        origin_fut_series = this.sz_50_fut[index];
        fut_name = "IH";
      }
      let push_index_series = [];
      let push_fut_series = [];
      let push_base_series = [];
      let fut_step = 0;
      if (origin_index_series.length > 0) {
        fut_step = Math.ceil(
          origin_fut_series.length / origin_index_series.length
        );
      }
      origin_index_series.sort((a, b) => {
        return a.depth_timestamp - b.depth_timestamp;
      });
      origin_fut_series.sort((a, b) => {
        return a.depth_timestamp - b.depth_timestamp;
      });
      //####### index base
      // let fut_len = origin_fut_series.length;
      // let fut_index = 0;
      // for (let i = 0; i < origin_index_series.length; ++i) {
      //   let index_item = origin_index_series[i];
      //   let fut_item = null;
      //   let min_diff = Infinity;
      //   while (fut_index < fut_len) {
      //     let temp_item = origin_fut_series[fut_index];
      //     let diff = Math.abs(
      //       temp_item.depth_timestamp - index_item.depth_timestamp
      //     );
      //     if (diff <= 100) {
      //       if (diff < min_diff) {
      //         min_diff = diff;
      //         fut_item = temp_item;
      //       }
      //       fut_index++;
      //     } else if (
      //       temp_item.depth_timestamp >
      //       index_item.depth_timestamp + 100
      //     ) {
      //       break;
      //     } else {
      //       fut_index++;
      //     }
      //     // if (temp_item.depth_timestamp < index_item.depth_timestamp - 100) {
      //     //   fut_index++;
      //     // } else if (
      //     //   temp_item.depth_timestamp >= index_item.depth_timestamp - 100 &&
      //     //   temp_item.depth_timestamp <= index_item.depth_timestamp + 100
      //     // ) {
      //     //   if (
      //     //     fut_item == null ||
      //     //     Math.abs(temp_item.depth_timestamp - index_item.depth_timestamp) <
      //     //       Math.abs(fut_item.depth_timestamp - index_item.depth_timestamp)
      //     //   ) {
      //     //     fut_item = temp_item;
      //     //   }
      //     //   fut_index++;
      //     // } else {
      //     //   break;
      //     // }
      //   }
      //   if (fut_item == null) {
      //     // console.log(
      //     //   "this is index->",
      //     //   index_item,
      //     //   orign_index_series[i - 1],
      //     //   fut_index,
      //     //   fut_len,
      //     //   fut_item,
      //     //   origin_fut_series[fut_index]
      //     // );
      //     if (fut_index < fut_len) {
      //       fut_item = origin_fut_series[fut_index];
      //     } else {
      //       fut_item = origin_fut_series[Math.min(fut_len - 1, i * fut_step)];
      //     }
      //   }
      //   let generate_time = index_item.depth_timestamp;
      //   push_index_series.push([
      //     this.getXAxis(generate_time),
      //     index_item.price.toFixed(2),
      //   ]);
      //   push_fut_series.push([
      //     this.getXAxis(generate_time),
      //     fut_item.price.toFixed(2),
      //   ]);
      //   push_base_series.push([
      //     this.getXAxis(generate_time),
      //     (index_item.price - fut_item.price).toFixed(2),
      //   ]);
      // }
      // #### index base

      // ##### fut base
      let idx_index = 0;
      const idx_len = origin_index_series.length;
      for (
        let fut_index = 0;
        fut_index < origin_fut_series.length;
        ++fut_index
      ) {
        let fut_item = origin_fut_series[fut_index];
        let best_match = null;
        let min_diff = Infinity;

        while (idx_index < idx_len) {
          let index_item = origin_index_series[idx_index];
          let diff = Math.abs(
            index_item.depth_timestamp - fut_item.depth_timestamp
          );

          if (diff < min_diff) {
            min_diff = diff;
            best_match = index_item;
          }

          if (index_item.depth_timestamp < fut_item.depth_timestamp) {
            idx_index++;
          } else {
            break;
          }
        }
        let index_item = null;
        if (idx_index < origin_index_series.length) {
          index_item = origin_index_series[idx_index];
        } else {
          let gap = Math.floor(
            origin_index_series.length / origin_fut_series.length
          );
          index_item =
            origin_index_series[
              Math.min(gap * fut_index, origin_index_series.length - 1)
            ];
        }
        let generate_time = fut_item.depth_timestamp;
        push_index_series.push([
          this.getXAxis(generate_time),
          index_item.price.toFixed(2),
        ]);
        push_fut_series.push([
          this.getXAxis(generate_time),
          fut_item.price.toFixed(2),
        ]);
        push_base_series.push([
          this.getXAxis(generate_time),
          (index_item.price - fut_item.price).toFixed(2),
        ]);
      }
      // ##### fut base

      let tooltipFormatter = (val) => `${val}`;
      fut_name += " " + this.delivery_code_list[index];

      series.push({
        name: "指数价格",
        type: "line",
        symbol: "none",
        emphasis: {
          focus: "series",
        },
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: tooltipFormatter,
        },
        data: push_index_series,
      });

      series.push({
        name: fut_name,
        type: "line",
        symbol: "none",
        connectNulls: true,
        yAxisIndex: 0,
        emphasis: {
          focus: "series",
        },
        tooltip: {
          valueFormatter: tooltipFormatter,
        },
        data: push_fut_series,
      });
      series.push({
        name: "基差",
        type: "line",
        symbol: "none",
        connectNulls: true,
        yAxisIndex: 1,
        emphasis: {
          focus: "series",
        },
        tooltip: {
          valueFormatter: tooltipFormatter,
        },
        data: push_base_series,
      });
      legend = ["指数价格", fut_name, "基差"];

      return [legend, series, show];
    },
    getYAxis(name, align = "center") {
      return {
        name,
        type: "value",
        nameTextStyle: {
          fontSize: 10,
          lineHeight: 5,
          fontWeight: "bolder",
          align,
        },
      };
    },
  },
  computed: {
    commonChartOption() {
      return {
        grid: [
          {
            left: "2%",
            right: "2%",
            containLabel: true,
            bottom: 22,
            height: 250,
          },
        ],
      };
    },
    PriceChartOptionCover() {
      return () => {
        return {
          yAxis: [
            {
              ...this.getYAxis(`price`, "left"),
              scale: true,
              boundaryGap: "5%",
            },
            this.getYAxis(`基差`, "right"),
          ],
          // start !== 0 是因为初始时数值极高，影响坐标轴范围
          dataZoom: [
            {
              start: 0,
              height: 20,
              bottom: 0,
              showDetail: false,
              brushSelect: false,
            },
          ],
          ...this.commonChartOption,
        };
      };
    },
  },
};
</script>

<style>
</style>
