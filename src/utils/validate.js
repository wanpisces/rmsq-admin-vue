/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}


/**
 * 检查是否为网址
 *
 * @param {}
 * str_url
 * @return {Boolean}true：是网址，false:<b>不是</b>网址;
 */
export function isUrl(str_url) { // 验证url
    // var strRegex = "^((https|http|ftp|rtsp|mms)?://)" +
    //     "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
    //     +
    //     "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
    //     +
    //     "|" // 允许IP和DOMAIN（域名）
    //     +
    //     "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
    //     +
    //     "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
    //     +
    //     "[a-z]{2,6})" // first level domain- .com or .museum
    //     +
    //     "(:[0-9]{1,4})?" // 端口- :80
    //     +
    //     "((/?)|" // a slash isn't required if there is no file name
    //     +
    //     "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var strRegex = /(http:\/\/)|(https:\/\/)/i
    var re = new RegExp(strRegex);
    return re.test(str_url);
}