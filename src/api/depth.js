import request from '@/plugins/request'

export function getFutPrice() {
    return request({ url: `/api/depth/fut_price`, method: 'get' })
}

export function getIndexPrice() {
    return request({ url: `/api/depth/quick_index_price`, method: 'get' })
}

export function getFastIndexPrice() {
    return request({ url: `/api/depth/index_price`, method: 'get' })
}

export function getInstrumentInfo() {
    return request({ url: "/api/depth/instrument_info", method: "get" })
}

export function getAllFutPrice() {
    return request({ url: `api/depth/all_fut_price`, method: "get" })
}

export function getAllIndexPrice() {
    return request({ url: `api/depth/all_index_price`, method: "get" })
}

export function getAllFastIndexPrice() {
    return request({ url: `api/depth/all_quick_index_price`, method: "get" })
}