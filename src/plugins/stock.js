export function is_cb(symbol_id) {
    let t = Math.floor((Number(symbol_id) / 1000))
    return t == 110 || t == 113 || t == 123 || t == 127 || t == 128;
}

export default {is_cb}
