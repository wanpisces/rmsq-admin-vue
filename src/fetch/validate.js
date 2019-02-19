import { RequestClassfiyList } from "./modules/service";
import { format } from "@/fetch/tool.js";
// 手机号验证
function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  return reg.test(str);
}
let validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
    // } else if (!isvalidPhone(value)) {
    //   callback(new Error("请输入正确的11位手机号码"));
    // } else {
  } else {
    callback();
  }
};
let validatorPassword = (rule, value, callback) => {
  var reg = /^[A-Za-z0-9]{6,20}$/;
  if (!value) {
    callback(new Error("请输入密码"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入6-20位字母数字"));
  } else {
    callback();
  }
};

let validNumber = (rule, value, callback) => {
  var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
  if (!reg.test(value)) {
    callback(new Error("请输入大于0的数"));
  } else {
    callback();
  }
};
export const rules = {
  inst: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
  nickname: [{ required: true, message: "请输入单位简称", trigger: "blur" }],
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [
    {
      required: true,
      trigger: "blur",
      validator: validatorPassword
    }
  ],
  tel: [{ required: true, trigger: "blur", validator: validPhone }],
  level: [{ required: true, message: "请输入行政级别", trigger: "blur" }],
  province: [{ required: true, message: "请选择地址", trigger: "blur" }],
  address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
  category_id: [{ required: true, message: "请选择服务类型", trigger: "blur" }],
  role: [{ required: true, message: "请选择账号角色", trigger: "blur" }]
};

//办事rule验证
export const ruleGuid = {
  event_name: [
    { required: true, message: "请输入事项的名称", trigger: "blur" },
    { min: 1, max: 60, message: "长度在 1 到 60 个字符", trigger: "blur" }
  ],
  event_department: [
    { required: true, message: "请输入办理此业务的部门", trigger: "blur" },
    { min: 1, max: 60, message: "长度在 1 到 60 个字符", trigger: "blur" }
  ],
  event_service: [
    { required: true, message: "请输入办理此业务的窗口", trigger: "blur" },
    { min: 1, max: 60, message: "长度在 1 到 60 个字符", trigger: "blur" }
  ],
  event_blck: [
    { required: true, message: "请输入办理此业务的窗口", trigger: "blur" },
    { min: 1, max: 60, message: "长度在 1 到 60 个字符", trigger: "blur" }
  ],
  event_basis: [
    { required: true, message: "请输入此事项的法律依据", trigger: "blur" }
  ],
  event_free: [
    { required: true, message: "请输入此事项的办理费用", trigger: "blur" },
    { min: 1, max: 60, message: "长度在 1 到 60 个字符", trigger: "blur" },
    { required: true, trigger: "blur", validator: validNumber }
  ],
  event_deadline: [
    { required: true, message: "请输入此事项的承诺时限", trigger: "blur" },
    { min: 1, max: 60, message: "长度在 1 到 60 个字符", trigger: "blur" },
    { required: true, trigger: "blur", validator: validNumber }
  ],
  event_mark: [
    {
      required: true,
      message: "请输入办理此项业务需要携带的材料",
      trigger: "blur"
    }
  ],
  event_flow: [
    { required: true, message: "请输入此项业务的办理流程", trigger: "blur" }
  ],
  attr_id: [{ required: true, message: "请输入事项分类", trigger: "blur" }]
};

//办事指南分类
export function GetClassfiyList() {
  var optionsGuid = [
    {
      value: "0",
      label: "全部"
    }
  ];
  return RequestClassfiyList().then(res => {
    for (var i = 0; i < res.length; i++) {
      var obj1 = {};
      var childArr1 = res[i].child;
      obj1.value = res[i].attr_id;
      obj1.label = res[i].attr_value;
      obj1.children = [];
      for (var j = 0; j < childArr1.length; j++) {
        var obj2 = {};
        var childArr2 = childArr1[j].child;
        obj2.value = childArr1[j].attr_id;
        obj2.label = childArr1[j].attr_value;
        obj2.children = [];
        for (var n = 0; n < childArr2.length; n++) {
          var obj3 = {};
          obj3.value = childArr2[n].attr_id;
          obj3.label = childArr2[n].attr_value;
          obj2.children.push(obj3);
        }
        obj1.children.push(obj2);
      }
      optionsGuid.push(obj1);
    }
    return optionsGuid;
  });
}

//办事指南分类
export const optionsGuid = [
  {
    value: "shejiyuanze",
    label: "全部"
  },
  {
    value: "zhinan",
    label: "个人办事",
    children: [
      {
        value: "shejiyuanze",
        label: "按主题",
        children: [
          {
            value: "yizhi",
            label: "婚姻收养"
          },
          {
            value: "fankui",
            label: "教育服务"
          },
          {
            value: "xiaolv",
            label: "就业创业"
          },
          {
            value: "kekong",
            label: "医疗卫生"
          },
          {
            value: "kekong",
            label: "证件办理"
          },
          {
            value: "kekong",
            label: "其他"
          }
        ]
      },
      {
        value: "daohang",
        label: "按人生事件",
        children: [
          {
            value: "cexiangdaohang",
            label: "生育"
          },
          {
            value: "dingbudaohang",
            label: "婚姻"
          },
          {
            value: "dingbudaohang",
            label: "考证"
          },
          {
            value: "dingbudaohang",
            label: "学籍"
          },
          {
            value: "dingbudaohang",
            label: "招生"
          },
          {
            value: "dingbudaohang",
            label: "社保"
          },
          {
            value: "dingbudaohang",
            label: "评职称"
          },
          {
            value: "dingbudaohang",
            label: "办证"
          },
          {
            value: "dingbudaohang",
            label: "经营"
          },
          {
            value: "dingbudaohang",
            label: "宴请"
          }
        ]
      }
    ]
  },
  {
    value: "zujian",
    label: "法人办事",
    children: [
      {
        value: "basic",
        label: "按主题",
        children: [
          {
            value: "layout",
            label: "注册登记"
          },
          {
            value: "color",
            label: "医疗卫生"
          },
          {
            value: "typography",
            label: "公安消防"
          },
          {
            value: "icon",
            label: "规划建设"
          },
          {
            value: "button",
            label: "环保安全"
          },
          {
            value: "button",
            label: "土地房产"
          },
          {
            value: "button",
            label: "交通城管"
          },
          {
            value: "button",
            label: "农林业"
          },
          {
            value: "button",
            label: "食品药品"
          },
          {
            value: "button",
            label: "教育体育"
          },
          {
            value: "button",
            label: "科技文化"
          },
          {
            value: "button",
            label: "航运水务"
          }
        ]
      }
    ]
  }
];

/**
 * 1. 社区活动添加编辑的正则
 */

// 数字验证
let checkNum = (rule, value, callback) => {
  var re = /^[1-9]+[0-9]*]*$/;
  if (!value) {
    console.log("dddd");
    callback(new Error("请填写报名人数"));
  } else {
    if (parseInt(value) != value) {
      callback(new Error("参与人数不能为小数"));
    } else {
      if (value <= 0) {
        callback(new Error("参与人数不能小于等于0"));
      } else if (value > 1000) {
        callback(new Error("参与人数不能大于1000"));
      } else {
        callback();
      }
    }
  }
};
let checkNumVolunteer = (rule, value, callback) => {
  console.log("ssssss", value);
  if (!value) {
    callback(new Error("请填写志愿者人数"));
  } else {
    if (parseInt(value) != value) {
      callback(new Error("志愿者人数不能为小数"));
    } else {
      if (value <= 0) {
        callback(new Error("志愿者人数不能小于等于0"));
      } else if (value > 1000) {
        callback(new Error("志愿者人数不能大于1000"));
      } else {
        callback();
      }
    }
  }
};
let checkTime = (rule, value, callback) => {
  //    console.log(value)
  if (value != null) {
    let startTime = format(value[0], "yyyy-MM-dd HH:mm:ss");
    let endTime = format(value[1], "yyyy-MM-dd HH:mm:ss");
    if (value.length == 0) {
      callback(new Error("请选择活动时间"));
    } else {
      if (startTime == endTime) {
        callback(new Error("开始时间不能等于结束时间"));
      } else {
        callback();
      }
    }
  } else {
    callback(new Error("请选择活动时间"));
  }
};
export const activeRules = {
  activity_title: [
    { required: true, message: "请输入活动标题", trigger: "blur" }
  ],
  activity_pic: [
    { required: true, message: "请上传活动封面", trigger: "blur" }
  ],
  dataTime: [
    { type: "date", required: true, trigger: "blur", validator: checkTime }
  ],
  time: [
    {
      type: "date",
      required: true,
      message: "请选择活动报名截止时间",
      trigger: "blur"
    }
  ],
  address: [{ required: true, message: "请选取活动地点", trigger: "blur" }],
  sponsor_name: [
    { required: true, message: "请填写活动主办方", trigger: "blur" }
  ],
  sponsor_desc: [
    { required: true, message: "请填写活动主办方简介", trigger: "blur" }
  ],
  activity_content: [
    { required: true, message: "请填写活动简介", trigger: "blur" }
  ],
  need_volunteer: [
    { required: true, message: "请选择是否需要自愿者", trigger: "blur" }
  ],
  attr_id: [{ required: true, message: "请选择活动分类", trigger: "blur" }],
  share_pic: [{ required: true, message: "请上传分享封面图", trigger: "blur" }],
  enlist_max_general_num: [
    {
      type: "number",
      required: true,
      // message: "请填写报名人数",
      trigger: "blur",
      validator: checkNum
    },
    { type: "number", message: "报名人数必须为数字值" }
  ],
  enlist_max_volunteer_num: [
    {
      required: true,
      // message: "请填写志愿者人数",
      trigger: "blur",
      validator: checkNumVolunteer
    },
    { type: "number", message: "志愿者人数必须为数字值" }
  ]
};
