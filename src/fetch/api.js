export default {
    login: "api/admin/login", // 用户登录
    //  首页
    homeCount: "api/admin/count", //  首页统计
    countIndex: "api/admin/countIndex", // echart统计
    // 资讯
    weibo: "api/admin/weibo", // 微博列表
    weiboAuth: "api/admin/weiboAuth", //  微博认证
    toutiao: "api/admin/toutiao", // 关联头条号
    toutiaoCaptcha: "api/admin/toutiaoCaptcha", // 头条验证码
    toutiaoAuth: "api/admin/toutiaoAuth", //头条授权
    toutiaoMobileCode: "api/admin/toutiaoMobileCode", // 头条手机验证码
    toutiaoSec: "api/admin/toutiaoSec", // 头条安全认证
    toutiaoLoginByMobile: "api/admin/toutiaoLoginByMobile", // 头条手机登录
    weiboAuthStatus: "api/admin/weiboAuthStatus", // 微博认证是否认证成功状态
    kuaichuan: "api/admin/kuaichuan", //快传列表 新增 编辑、删除
    kuaichuan_captcha: "api/admin/kuaichuan_captcha", // 快传号验证
    kuaichuan_login: "api/admin/kuaichuan_login", //快传登录
    baijia: 'api/admin/BaiJia_list', // 百家号列表,
    baijiaLogin: 'api/admin/BaiJia_login', //  添加 。授权
    baijiaDelete: 'api/admin/BaiJia_del', // 百家号删除
    baijiaCaptcha: 'api/admin/BaiJia_captcha', // 百家号验证码
    news: "api/admin/news", //  资讯列表、资讯发布、编辑资讯、删除资讯、资讯详情
    newsTop: "api/admin/newsTop", // 资讯置顶
    audited: "api/admin/audited", //资讯审核
    news2banner: "api/admin/news2banner", // 资讯投放
    newsVisitorNum: "api/public/newsVisitorNum", //浏览量修改
    comment: "api/admin/comment", // 评论列表
    commentState: "api/admin/commentState", // 评论显示、隐藏
    category: "api/admin/category", // 模块列表、模块添加、模块编辑、模块删除、详情
    categorySort: "api/admin/categorySort", // 栏目排序
    attr: "api/admin/attr", // 分类列表、添加、删除、编辑、详情
    getToken: "api/public/getUploadToken", // 七牛云token获取
    category: "api/admin/category", //资讯模块列表
    newsCategory: "api/admin/newsCategory", // 资讯服务栏目2.0（改）
    newsState: "api/admin/newsState", // 资讯上下线,
    newsTop: "api/admin/newsTop", // 资讯置顶,
    newsAudit: "api/admin/newsAudit", // 审核列表
    uploads: "api/public/uploads", // 上传
    commentState: "api/admin/commentState", //评论显示禁止,
    nav: "api/admin/nav", // 系统模块列表
    navState: "api/admin/navState", // 模块上下线
    banner: "api/admin/banner", //轮播列表
    bannerState: "api/admin/bannerState", //轮播上下线,
    bannerSink: "api/admin/bannerSink", //轮播下沉
    service: "api/admin/adminservice", //服务列表
    publicCategory: "api/public/category",
    categoryStatus: "api/admin/categoryState", //栏目停用启用
    feedback: "api/admin/feedback", //反馈
    question: "api/admin/question", //问题
    questionState: "api/admin/questionState", //问题上下线
    sys: "api/admin/account/sys", //平台账号
    account: "api/admin/account", //个人账号
    role: "api/admin/role", //角色
    roleCopy: "api/admin/roleCopy", //角色复制
    roleUser: "api/admin/roleUser", //用户列表
    menu: "api/admin/menu", //菜单列表
    roleMenu: "api/admin/roleMenu", //角色菜单
    contentConfig: "api/admin/contentConfig", //内容配置列表
    customer: "api/admin/account/customer", //客户账号 列表 添加、删除、编辑、详情
    area: "api/public/area", //省市联动
    previewNews: "api/admin/previewNews", // 资讯预览
    area: "api/public/area", //省市联动
    accountPwd: "api/admin/accountPwd", //修改密码
    area: "api/public/area", //省市联动
    mpactivity: "api/admin/mpActivity", //资讯关联活动列表
    mpnews: "api/admin/mpnews", // 资讯发布（新）
    mapActivity: "api/sspAdmin/mapActivity", // 关联活动列表
    /**
     * 新闻资讯 素材库 、素材分类
     */

    groupMaterial: "api/admin/groupMaterial", // 列表、详情、编辑、添加、删除，
    groupMaterialAttr: "api/admin/groupMaterialAttr", // 列表、详情、编辑、添加、删除，

    /** */
    /**
     * 办事指南与政务公开
     */
    serviceNewsState: "api/zwgkAdmin/newsState", //政务公开上下线
    govAttr: "api/zwgkAdmin/attr",
    govNews: "api/zwgkAdmin/news", // 政务服务列表
    streetGroup: "api/zwgkAdmin/group", // 街道详情
    subAdd: "api/zwgkAdmin/sub", // 社区添加
    group: "api/zwgkAdmin/group", // 街道编辑
    bsznattr: "api/bsznAdmin/attr", //办事指南分类
    event: "api/bsznAdmin/event", //办事指南列表
    /**
     * 随手拍
     */
    case: "api/sspAdmin/case", // s随手怕列表
    caseHandle: "api/sspAdmin/caseHandle", // 办理
    caseSettle: "api/sspAdmin/caseSettle", // 结案
    node: "api/sspAdmin/node", // 节点列表
    sspAttlist: "api/sspAdmin/attr", //主题分类列表
    broke: "api/sspAdmin/comment", //爆料评论
    brokeState: "api/sspAdmin/commentState", //爆料评论正常禁用
    introducation: "api/sspAdmin/introducation", // 随手拍介绍
    /**
     * 社区活动
     */

    activity: "api/activityAdmin/activity", // 社区活动liebia
    activeAttr: "api/activityAdmin/attr", //社区分类
    enlist: "api/activityAdmin/enlist", //报名列表
    volunteer: "api/activityAdmin/volunteer", // 志愿者列表
    activityState: "api/activityAdmin/activityState", // 发布活动,
    attrAdd: "api/activityAdmin/attr", // 活动分类添加
    activityAttr: "api/activityAdmin/attr", //活动分类
    activityTop: "api/activityAdmin/activityTop", //活动置顶
    previewActivity: "api/activityAdmin/previewActivity", //活动预览
    serviceRun: "api/public/serviceRun", //服务投放区域
    serviceIcon: "api/admin/serviceIcon", //服务图标
    serviceIconItem: "api/admin/serviceIconItem", // 服务图标条目
    serviceAdd: "api/public/serviceAdd", //服务新增

    miniUrl: "api/public/third_mini_program", // 小程序列表
    searchGroup: "api/admin/searchGroup", // 单位
    /**
     * 服务
     */
    serviceCategory: "api/admin/category", // 服务类目
    serviceCategoryState: "api/admin/categoryState", // 服务类目状态切换,
    service: "api/admin/service", // 服务
    serviceSort: "api/admin/serviceSort", // 服务排序
    serviceRecom: "api/admin/serviceRecom", // 服务推荐
    serviceState: "api/admin/serviceState", // 服务状态切换（是否显示）
    serviceHome: "api/admin/serviceHome", // 服务状态切换（首页是否显示）
    serviceMenu: "api/admin/serviceMenu", //服务菜单
    publicService: "api/public/service",
    syncNewsServiceToCategory: "api/admin/syncNewsServiceToCategory", //资讯同步
    serviceSink: "api/admin/serviceSink", //服务下沉

    /* 投票评选 */
    vote: "api/voteAdmin/vote", // 投票
    subject: "api/voteAdmin/subject", // 投票评选题目
    voteUser: "api/voteAdmin/voteUser", // 投票评选用户
    voteExport: "api/voteAdmin/voteExport", // 导出评选详情
    voteState: "api/voteAdmin/voteState", // 投票评选状态
    subjectItem: "api/voteAdmin/subjectItem", // 删除题目选项
    subjectFill: "api/voteAdmin/subjectFill", // 某题答题详情
    subjectFillExport: "api/voteAdmin/subjectFillExport", // 导出某题答题
    voteFill: "api/voteAdmin/voteFill", // 某用户答卷详情

    themeList: "api/public/theme", // 主题列表

    /* 问卷调查 */
    questionnaire: "api/questionnaireAdmin/questionnaire", // 问卷调查
    questionnaireState: "api/questionnaireAdmin/questionnaireState", // 调查问卷状态
    questionSubject: "api/questionnaireAdmin/subject", // 调查问卷题目
    questionSubjectItem: "api/questionnaireAdmin/subjectItem", // 删除题目选项
    questionnaireUser: "api/questionnaireAdmin/questionnaireUser", // 调查问卷用户
    questionnaireExport: "api/questionnaireAdmin/questionnaireExport", // 导出问卷详情
    questionnaireSubjectFill: "api/questionnaireAdmin/subjectFill", // 某题答题详情
    questionSubjectFillExport: "api/questionnaireAdmin/subjectFillExport", // 导出某题答题
    questionUserFill: "api/questionnaireAdmin/userFill", // 导出某题答题

    /**
     * 微信公众号
     */
    menuSort: "api/wechatAdmin/menuSort", // 菜单排序
    material: "api/wechatAdmin/material", // 素材
    /**
     * 关联公众号
     */
    mp: "api/admin/mp", // 公众号列表、编辑、新增、删除
    mpState: "api/admin/mpState", // 公众号启用禁用
    /**
     * 单位信息
     */
    groupInfo: "api/admin/groupInfo", // 获取单位、编辑、添加
    /**
     * 地理位置
     */
    district: "api/admin/district", // 位置列表、添加、编辑、删除
    districtState: "api/admin/districtState", // 位置启用禁用
    districtImport: "api/admin/districtImport", // 位置导入

    /**
     * 二期优化
     */
    version: "api/admin/version", // 版本管理
    groupLock: "api/admin/groupLock", // 界面状态
    groupLockState: "api/admin/groupLockState", // 界面锁定
    shareTheme: "api/admin/shareTheme", // 分享样式模板
    formBuilder: "api/public/formBuilder", // 组件列表
    /**
     * 分享设置
     */
    shareActivity: "api/admin/shareActivity", //分享活动列表
    shareActivityItem: "api/admin/shareActivityItem", //分享活动类目
    shareTheme: "api/admin/shareTheme",
    sspShare: "api/sspAdmin/sspShare",

    /** 用户管理 */
    getUsers: "api/admin/getUsers", // 用户管理列表
    exportUsers: "api/admin/exportUsers",
    // 统计
    countUser: "api/admin/countUser", //用户统计
    countModule: "api/admin/countModule", //页面功能统计
    countNews: "api/admin/countNews", //资讯统计
    countArea: "api/admin/countArea", //地区统计
    countActivity: "api/admin/countActivity",
    countModule: "api/admin/countModule", //功能页面点击次数统计
    countModuleDetail: "api/admin/countModuleDetail", //页面功能统计详情
    countTools: "api/admin/countTools", //工具点击情况
    /** 12个模板 */
    formTemplate: "api/public/formTemplate", // 模板列表、详情
    form: "api/admin/form",
    formApply: "api/admin/form/apply", //使用标准模板创建表单
    formState: "api/admin/formState",
    formUser: "api/admin/formUser", //表单用户列表
    formMiniPermanentQr: "api/admin/formMiniPermanentQr", //查看表单二维码
    formFillExport: "api/admin/formFillExport", //表单导出数据

    // 保存草稿
    draft: "api/admin/draft",

    // 定制活动
    pollItem: "api/pollAdmin/pollItem", // 投票项列表
    pollItemFields: "api/pollAdmin/pollItemFields", // 默认字段
    checkItemNo: "api/pollAdmin/checkItemNo", // 投票项列表

    // 慈交会报名
    // 论坛
    forumEnlist: "api/admin/cjh/forumEnlist", //  论坛列表，删除，详情
    forumEnlistExport: "api/admin/cjh/forumEnlistExport", // 论坛导出
    exhibitionEnlist: "api/admin/cjh/exhibitionEnlist", //  参展列表，删除，详情
    exhibitionEnlistExport: "api/admin/cjh/exhibitionEnlistExport", // 参展导出

    //社区报
    newspaperAudit: "api/newspaperAdmin/newspaperAudit", //社区报审核列表
    newspaper: "api/newspaperAdmin/newspaper", //社区报上下线列表
    newspaperGroup: "api/newspaperAdmin/newspaperGroup", //获取所有发布账号（仅限平台端账号）
    newspaperTemplate: "api/newspaperAdmin/newspaperTemplate", //获取所有报刊模板
    chooseTemplate: "api/newspaperAdmin/chooseTemplate", //获取所有报刊模板
    newspaperOnoff: "api/newspaperAdmin/newspaperOnoff", //社区报上下线
    newspaperCheck: "api/newspaperAdmin/newspaperCheck", //社区报提交审核
    newspaperAllRemark: "api/newspaperAdmin/newspaperAllRemark", //社区报获取所有驳回
    newspaperPage: "api/newspaperAdmin/newspaperPage", //获取社区报具体某个版面信息
    newspaperRemark: "api/newspaperAdmin/newspaperRemark", //新增驳回
    newspaperState: "api/newspaperAdmin/newspaperState", //社区报审核通过
    newspaperPageItemStr: "api/newspaperAdmin/newspaperPageItemStr", //版面内容修改（批量）
    newspaperPreview: "api/newspaperAdmin/newspaperPreview", // 生成社区报预览图片
    newspaperISSN: " api/newspaperAdmin/newspaperISSN",
    newspaperRemarkStr: "api/newspaperAdmin/newspaperRemarkStr" //新增批量驳回
};