import Vue from 'vue'
const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;
const TB = 1024 * GB;
const PB = 1024 * TB;
Vue.mixin({
    methods: {
        format_timestamp_to_datetime(value) {
            let datetime = new Date(value);
            return `${
                datetime.getFullYear()
            }-${
                (datetime.getMonth() + 1).toString().padStart(2, 0)
            }-${
                datetime.getDate().toString().padStart(2, 0)
            } 

          ${
                datetime.getHours().toString().padStart(2, 0)
            }:${
                datetime.getMinutes().toString().padStart(2, 0)
            }:${
                datetime.getSeconds().toString().padStart(2, 0)
            }`
        },

        format_timestamp_to_date(value) {
            let datetime = new Date();
            if (value != null && value != undefined && value != "") {
                datetime = new Date(value);
            }
            return `${
                datetime.getFullYear()
            }-${
                (datetime.getMonth() + 1).toString().padStart(2, 0)
            }-${
                datetime.getDate().toString().padStart(2, 0)
            }`
        },
        format_money(val, precision) {
            if (val === "" || val === 0) 
                return "0.00";
            val = Number(val);
            if (isNaN(val)) 
                return "";
            return val.toFixed(precision).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        },
        format_bytes(val, precision=2) {
            if (val < KB) {
                return val.toFixed(precision) + " B"
            } else if (val < MB) {
                return (val / KB).toFixed(precision) + " KB"
            } else if (val < GB) {
                return (val / MB).toFixed(precision) + " MB"
            } else if (val < TB) {
                return (val / GB).toFixed(precision) + " GB"
            } else if (val < PB) {
                return (val / TB).toFixed(precision) + " TB"
            }
            return val
        }
    }
})
