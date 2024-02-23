<template>
  <div>
    <strong v-if="!!title">{{ title }}</strong>
    <v-chart
      :loading="loading"
      :option="chartOption"
      ref="chart"
      :style="chartStyle"
    />
  </div>
</template>

<script>
import "echarts/lib/chart/line";
import ECharts from "vue-echarts";
export default {
  components: {
    "v-chart": ECharts,
  },
  data() {
    return {
      loading: false,
      dataZoom: {
        start: undefined,
        end: 100,
      },
    };
  },
  props: {
    title: String,
    series: Array,
    legend: Array,
    needLoading: {
      type: Boolean,
      default: true,
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
    chartOptionCover: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    series() {
      this.$nextTick(() => {
        this.refreshChart();
      });
    },
  },

  computed: {
    chartStyle() {
      return { height: "400px", ...this.styles };
    },

    am_end() {
      let am_end = new Date(this.date);
      am_end.setHours(11);
      am_end.setMinutes(30);
      am_end.setSeconds(0);
      return am_end;
    },
    pm_start() {
      let pm_start = new Date(this.date);
      pm_start.setHours(13);
      pm_start.setMinutes(0);
      pm_start.setSeconds(0);
      return pm_start;
    },
    chart() {
      return this.$refs.chart.chart;
    },
    chartOption() {
      return {
        animation: false,
        tooltip: {
          trigger: "axis",
          order: "valueDesc",
          position: function (pos, params, dom, rect, size) {
            var obj = { top: 60 };
            obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
            return obj;
          },
          textStyle: {
            fontFamily: "monospace",
          },
        },
        grid: [
          {
            left: "4%",
            right: "3%",
            containLabel: true,
            bottom: 100,
            height: 250,
          },
        ],
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: { lineStyle: { color: "#777" } },
            min: "dataMin",
            max: "dataMax",
            axisPointer: {
              show: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            boundaryGap: [0, "10%"],
          },
        ],
        dataZoom: [
          {
            start: 0,
            end: 100,
          },
          {
            start: 0,
            end: 100,
            type: "inside",
          },
        ],
        ...this.chartOptionCover,
      };
    },
  },
  mounted() {
    this.refreshChart();
    this.chart.on("dataZoom", (event) => {
      if (event.batch) {
        this.dataZoom.start = event.batch[0].start;
        this.dataZoom.end = event.batch[0].end;
      } else {
        this.dataZoom.start = event.start;
        this.dataZoom.end = event.end;
      }
    });
  },
  methods: {
    // async refreshChart() {
    //   if (this.needLoading) this.loading = true;
    //   console.log("legend and series->", this.legend, this.series);
    //   Promise.resolve([this.legend, this.series]).then(([legend, series]) => {
    //     setTimeout(() => {
    //       const dataZoom = this.chart?.getOption()?.dataZoom || [];
    //       if (dataZoom.length) {
    //         const { start, end } = this.dataZoom;
    //         dataZoom[0].start =
    //           start === undefined ? this.chartOption.dataZoom[0].start : start;
    //         dataZoom[0].end = end;
    //       }
    //       this.chart.setOption(
    //         {
    //           legend: {
    //             data: legend,
    //           },
    //           series: series,
    //           dataZoom,
    //         },
    //         false
    //       );
    //       this.loading = false;
    //     }, 500);
    //   });
    // },
    async refreshChart() {
      if (this.needLoading) this.loading = true;
      // 移除 Promise.resolve 和 setTimeout，除非有特别的理由需要它们
      const dataZoom = this.chart?.getOption()?.dataZoom || [];
      const { start, end } = this.dataZoom;
      dataZoom[0].start =
        start === undefined ? this.chartOption.dataZoom[0].start : start;
      dataZoom[0].end = end;
      this.chart.setOption(
        {
          legend: {
            data: this.legend,
          },
          series: this.series,
          dataZoom,
        },
        false
      ); // 第二个参数设置为false，意味着不移除之前的配置项
      this.loading = false;
    },
  },
};
</script>

<style lang="" scoped></style>
