import url from "../api";
import { request } from "../requestTwo.js";
import { Message } from "element-ui";
let messageTips = function(res) {
    if (res.code !== 2000) {
        Message.error(res.msg);
    }
};
export default new class HomeRequst {
    RequesHomeList(obj) {
        return request(url.homeCount, { data: obj }).then(res => {
            return res.data;
        });
    };
    RequesHomeChart(obj) {
        return request(url.countIndex, { data: obj }).then(res => {
            return res.data;
        });
    };
    //用户统计
    RequesCountUser(obj) {
        return request(url.countUser, { data: obj }).then(res => {
            messageTips(res);
            return res;
        });
    };
    //页面功能统计
    RequesCountModule(obj) {
        return request(url.countModule, { data: obj }).then(res => {
            return res.data;
        });
    };
    //资讯统计
    RequesCountNews(obj) {
        return request(url.countNews, { data: obj }).then(res => {
            return res;
        });
    };
    //地区统计
    RequesCountArea(obj) {
        return request(url.countArea, { data: obj }).then(res => {
            return res;
        });
    };
    // 活动统计
    RequesCountActivity(obj) {
        return request(url.countActivity, { data: obj }).then(res => {
            messageTips(res);
            return res;
        });
    };
    //功能页面点击次数统计
    RequesCountModule(obj) {
        return request(url.countModule, { data: obj }).then(res => {
            messageTips(res);
            return res;
        });
    };
    //工具点击情况
    RequesCountTools(obj) {
        return request(url.countTools, { data: obj }).then(res => {
            messageTips(res);
            return res;
        });
    };
    // 页面功能统计详情
    RequesCountModuleDetail(obj) {
        return request(url.countModuleDetail, { data: obj }).then(res => {
            messageTips(res);
            return res;
        });
    }
}();