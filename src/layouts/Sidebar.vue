<template>
  <aside class="left-sidebar" data-sidebarbg="skin6">
    <!-- Sidebar scroll-->
    <div>
      <!-- Sidebar navigation-->

      <!-- <Menu mode="horizontal" theme="light" :active-name="active_name">
        <MenuItem name="Dashboard" :to="{ name: 'Dashboard' }">
          <Icon type="ios-construct" />
          首页
        </MenuItem>
        <Submenu name="haitong">
          <template slot="title">
            <Icon type="ios-stats" />
            海通
          </template>
          <MenuItem
            name="Stock_210"
            :to="{ name: 'Stock', query: { account_id: 210 } }"
          >
            实时
          </MenuItem>
          <MenuItem
            name="OrderPage_210"
            :to="{ name: 'OrderPage', query: { account_id: 210 } }"
          >
            历史订单
          </MenuItem>
          <MenuItem
            name="MarginPage_210"
            :to="{ name: 'MarginPage', query: { account_id: 210 } }"
          >
            融资融券
          </MenuItem>
          <MenuItem
            name="AccountPage_210"
            :to="{ name: 'AccountPage', query: { account_id: 210 } }"
          >
            账户图表
          </MenuItem>
          <MenuItem
            name="StockDailySummary_210"
            :to="{ name: 'StockDailySummary', query: { account_id: 210 } }"
            >每日汇总</MenuItem
          >
          <MenuItem
            name="StockDailyMarginSummary_210"
            :to="{
              name: 'StockDailyMarginSummary',
              query: { account_id: 210 },
            }"
            >融券汇总</MenuItem
          >
        </Submenu>
        <Submenu name="xtp">
          <template slot="title">
            <Icon type="ios-stats" />
            中泰
          </template>
          <MenuItem
            name="Stock_110"
            :to="{ name: 'Stock', query: { account_id: 110 } }"
            >实时
          </MenuItem>
          <MenuItem
            name="OrderPage_110"
            :to="{ name: 'OrderPage', query: { account_id: 110 } }"
            >历史订单
          </MenuItem>
          <MenuItem
            name="MarginPage_110"
            :to="{ name: 'MarginPage', query: { account_id: 110 } }"
          >
            融资融券
          </MenuItem>
          <MenuItem
            name="AccountPage_110"
            :to="{ name: 'AccountPage', query: { account_id: 110 } }"
          >
            账户图表
          </MenuItem>
          <MenuItem
            name="StockDailySummary_110"
            :to="{ name: 'StockDailySummary', query: { account_id: 110 } }"
          >
            每日汇总
          </MenuItem>
          <MenuItem
            name="StockDailyMarginSummary_110"
            :to="{
              name: 'StockDailyMarginSummary',
              query: { account_id: 110 },
            }"
            >融券汇总
          </MenuItem>
        </Submenu>
        <MenuItem name="ControlPanel" :to="{ name: 'ControlPanel' }">
          <Icon type="ios-construct" />
          交易开关
        </MenuItem>
        <MenuItem name="QuotationPage" :to="{ name: 'QuotationPage' }">
          <Icon type="ios-construct" />
          行情监控
        </MenuItem>
        <Submenu name="ProfitChartPage">
          <template slot="title">
            <Icon type="ios-stats" />
            收益图表
          </template>
          <MenuItem name="ProfitChartPage" :to="{ name: 'ProfitChartPage' }">
            实盘
          </MenuItem>
        </Submenu>
      </Menu> -->
      <!-- End Sidebar navigation -->
    </div>
    <!-- End Sidebar scroll-->
  </aside>
</template>

<script>
export default {
  name: "AppSidebar",
  computed: {
    active_name: function () {
      if (this.$route.query && this.$route.query.account_id) {
        return `${this.$route.name}_${this.$route.query.account_id}`;
      } else {
        return `${this.$route.name}`;
      }
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>
