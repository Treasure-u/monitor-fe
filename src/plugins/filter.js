export function tsToDate(value) {
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
}

export function tsToDatetime(value) {
    let datetime = new Date(value);
    if (value != null && value != undefined && value != "") {
        datetime = new Date(value);
    }
    return `${
        datetime.getFullYear()
    }-${
        (datetime.getMonth() + 1).toString().padStart(2, 0)
    }-${
        datetime.getDate().toString().padStart(2, 0)
    } ${
        datetime.getHours().toString().padStart(2, 0)
    }:${
        datetime.getMinutes().toString().padStart(2, 0)
    }:${
        datetime.getSeconds().toString().padStart(2, 0)
    }`
}

export function timeFilter(time_str) {
    return time_str.substr(11, 8)
}

export function floatFilter(val, precision) {
    if(val != undefined && val != null){
        return val.toFixed(precision)
    }
}

export function percentageFilter(val, precision=3) {
    return `${
        (val * 100).toFixed(precision)
    }%`
}
export function permillageFilter(val) {
    return `${
        (val * 1000).toFixed(2)
    }‰`
}

export function accountFilter(val) {
    switch(Number(val)) {
        case 110:
            return "中泰";
        case 130:
            return "华泰";
        case 140:
            return "华宝";
        case 150:
            return "中建信投";
        case 210:
            return "海通";
        default:
            return "券商";
        }
}


export function moneyFilter(val, precision) {
    if (val === '' || val === 0) {
        return '0.00'
    }

    val = Number(val)
    if (isNaN(val)) {
        return ''
    }

    return val.toFixed(precision).replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,')
}

export function sizeFilter(val, precision=0, bit = false) {
    if (!Number.isFinite(val) || val === 0) {
        return 0
    }
    const K = 1024;
    const M = 1024 * K;
    const G = 1024 * M;
    const T = 1024 * G;
    let value = 0
    if (val > T) {
        value = (val / T).toFixed(precision) + ' T'
    } else if (val > G) {
        value = (val / G).toFixed(precision) + ' G'
    } else if (val > M) {
        value = (val / M).toFixed(precision) + ' M'
    } else if (val > K) {
        value = (val / K).toFixed(precision) + ' K'
    } else {
        value = (val).toFixed(precision)
    }

    return value + (bit ? "b" : "B")
}

export function elapsedFilter(second) {
    const minuteSecond = 60;
    const hourSecond = 60 * minuteSecond;
    const daySecond = 24 * hourSecond;
    const day = Math.floor(second / daySecond);
    const hour = Math.floor((second % daySecond) / hourSecond);
    const minute = Math.floor((second % hourSecond) / minuteSecond);
    const sec = Math.floor(second % minuteSecond);
    let res = [];
    if (day > 0 && res.length < 2) res.push(`${day}天`);
    if (hour > 0 && res.length < 2) res.push(`${hour}时`);
    if (minute > 0 && res.length < 2) res.push(`${minute}分`);
    if (sec > 0 && res.length < 2) res.push(`${sec}秒`);
    return res.join("");
}

export default {tsToDate,tsToDatetime, floatFilter, percentageFilter, moneyFilter, accountFilter, sizeFilter, elapsedFilter}
import Vue from 'vue'
Vue.mixin({
    methods: {
        moneyFilter: moneyFilter,
        percentageFilter: percentageFilter,
        floatFilter: floatFilter,
        accountFilter: accountFilter,
        sizeFilter: sizeFilter,
        elapsedFilter: elapsedFilter
    }
})
