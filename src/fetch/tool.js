// 上传七牛云
import { Message } from "element-ui";
import { getToken } from "./modules/public";
// import { checkURL } from './tool';
export default function RequestQiNiutoken(qiniuToken) {
    return (
        (!qiniuToken &&
            getToken({}).then(res => {
                if (res.data.code == 2000) {
                    return res.data.data.token;
                } else {
                    Message.error(res.data.msg);
                }
            })) ||
        Promise.resolve()
    );
}
export const levelData = [{
        level: 0,
        level_name: "全部"
    },
    {
        level: "5",
        level_name: "省"
    },
    {
        level: "4",
        level_name: "市"
    },
    {
        level: "3",
        level_name: "区"
    },
    {
        level: "2",
        level_name: "街道"
    },
    {
        level: "1",
        level_name: "社区"
    }
];
export const adminData = [{
        role_id: "2",
        role_name: "编辑员"
    },
    {
        role_id: "3",
        role_name: "审核员"
    },
    {
        role_id: "1",
        role_name: "超级管理员"
    }
];
export const state = [{
        state_id: "1",
        state_name: "待审核"
    },
    {
        state_id: "2",
        state_name: "审核中"
    },
    {
        state_id: "3",
        state_name: "待发布"
    },
    {
        state_id: "4",
        state_name: "被驳回"
    }
];

export const options2 = [{
        value: "1",
        label: "登记注册"
    },
    {
        value: "2",
        label: "医疗卫生"
    },
    {
        value: "3",
        label: "公安消防"
    },
    {
        value: "4",
        label: "规划建设"
    },
    {
        value: "5",
        label: "环保安全"
    },
    {
        value: "6",
        label: "土地房产"
    },
    {
        value: "7",
        label: "交通城管"
    },
    {
        value: "8",
        label: "农林业"
    },
    {
        value: "9",
        label: "食品药品"
    },
    {
        value: "10",
        label: "教育体育"
    },
    {
        value: "11",
        label: "科技文化"
    },
    {
        value: "12",
        label: "航运水务"
    }
];
export const options1 = [{
        value: "1",
        label: "惠民政策"
    },
    {
        value: "2",
        label: "公告公示"
    }
];
export const searchGov = [{
        value: "1",
        label: "全部分类"
    },
    {
        value: "3",
        label: "公告公示"
    },
    {
        value: "2",
        label: "惠民政策",
        children: [{
                value: "1",
                label: "登记注册"
            },
            {
                value: "2",
                label: "医疗卫生"
            },
            {
                value: "3",
                label: "公安消防"
            },
            {
                value: "4",
                label: "规划建设"
            },
            {
                value: "5",
                label: "环保安全"
            },
            {
                value: "6",
                label: "土地房产"
            },
            {
                value: "7",
                label: "交通城管"
            },
            {
                value: "8",
                label: "农林业"
            },
            {
                value: "9",
                label: "食品药品"
            },
            {
                value: "10",
                label: "教育体育"
            },
            {
                value: "11",
                label: "科技文化"
            },
            {
                value: "12",
                label: "航运水务"
            }
        ]
    }
];
// 百度引用
export function MapJs(ak) {
    // window.location.reload();
    return new Promise(function(resolve, reject) {
        if (window.onload == null) {
            window.onload = function() {
                resolve(BMap);
                console.log("s1-1");
            };
            resolve(BMap);
        } else {
            console.log("s1-2");
            resolve(BMap);
        }
        console.log("s1 - 3");
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
            "http://api.map.baidu.com/api?v=2.0&ak=" + ak + "&callback=init";
        // script.src = "http://api.map.baidu.com/api?v=1.3&s=1"
        script.onerror = reject;
        document.head.appendChild(script);
    });
}
// 时间转换
export function format(time, format) {
    var t = new Date(time);
    var tf = function(i) {
        return (i < 10 ? "0" : "") + i;
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
            case "yyyy":
                return tf(t.getFullYear());
                break;
            case "MM":
                return tf(t.getMonth() + 1);
                break;
            case "mm":
                return tf(t.getMinutes());
                break;
            case "dd":
                return tf(t.getDate());
                break;
            case "HH":
                return tf(t.getHours());
                break;
            case "ss":
                return tf(t.getSeconds());
                break;
        }
    });
}

//判断日期，时间大小
export function compareTime(startDate, endDate, that) {
    startDate = format(startDate, "yyyy-MM-dd HH:mm:ss");
    endDate = format(endDate, "yyyy-MM-dd HH:mm:ss");
    // if (startDate.length > 0 && endDate.length > 0) {
    var startDateTemp = startDate.split(" ");
    var endDateTemp = endDate.split(" ");

    var arrStartDate = startDateTemp[0].split("-");
    var arrEndDate = endDateTemp[0].split("-");

    var arrStartTime = startDateTemp[1].split(":");
    var arrEndTime = endDateTemp[1].split(":");

    var allStartDate = new Date(
        arrStartDate[0],
        arrStartDate[1],
        arrStartDate[2],
        arrStartTime[0],
        arrStartTime[1],
        arrStartTime[2]
    );
    var allEndDate = new Date(
        arrEndDate[0],
        arrEndDate[1],
        arrEndDate[2],
        arrEndTime[0],
        arrEndTime[1],
        arrEndTime[2]
    );

    if (allStartDate.getTime() >= allEndDate.getTime()) {
        that.$message.error("报名截止时间不能超过活动开始时间");
        return false;
    }
    // } else {
    //     // alert("startTime小于endTime，所以通过了");
    //     return true;
    // }
    // } else {
    //     alert("时间不能为空");
    //     return false;
    // }
}

/**
 * 深度拷贝
 */
function deepClone(currobj) {
    if (typeof currobj !== 'object') {
        return currobj;
    }
    if (currobj instanceof Array) {
        var newobj = [];
    } else {
        var newobj = {}
    }
    for (var key in currobj) {
        if (typeof currobj[key] !== 'object') {
            // 不是引用类型，则复制值
            newobj[key] = currobj[key];
        } else {
            // 引用类型，则递归遍历复制对象
            newobj[key] = deepClone(currobj[key])
        }
    }
    return newobj
}
/**
检查输入的URL地址是否正确
输入:str  字符串
  返回:true 或 flase; true表示格式正确
*/

export function checkURL(str_url) {
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)" +
        "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
        +
        "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
        +
        "|" // 允许IP和DOMAIN（域名）
        +
        "([0-9a-z_!~*'()-]+\.)*" // 域名- www. 
        +
        "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名 
        +
        "[a-z]{2,6})" // first level domain- .com or .museum 
        +
        "(:[0-9]{1,4})?" // 端口- :80 
        +
        "((/?)|" // a slash isn't required if there is no file name 
        +
        "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    //re.test()
    if (re.test(str_url)) {
        return (true);
    } else {
        return (false);
    }
}

export function checkURLTwo(url) {
    let reg = '/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/';
    var re = new RegExp(reg);
    console.log(re.test(url))
    return re.test(url);

}
export function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        " " + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds();
    return currentdate;
}