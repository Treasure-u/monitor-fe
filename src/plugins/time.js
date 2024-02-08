const moment = require('moment')

export function formatDate(val) {
    return moment(new Date(val)).format("YYYY-MM-DD")
}

export function formatTime(val) {
    return moment(new Date(val)).format("HH:mm")
}

export function formatDateTime(val) {
    return moment(new Date(val)).format("YYYY-MM-DD HH:mm:ss")
}

export default { formatDate, formatTime, formatDateTime }