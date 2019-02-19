import url from "../api";
import { request } from "../requestTwo.js";
import { Message } from "element-ui";
let messageTips = function(res) {
    if (res.code === 4000) {
        Message.error(res.msg);
    }
};
export default new class FromRequst {
    // 论坛报名列表
    RequestForumEnlist(obj) {
            return request(url.forumEnlist, { data: obj }).then(res => {
                return res.data;
            });
        }
        // 论坛报名模板详情
    RequestForumEnlistDetail(obj) {
            return request(`${url.forumEnlist}/${obj.enlist_id}`, {
                data: obj
            }).then(res => {
                return res;
            });
        }
        //论坛报名数据导出
    RequestForumEnlistExport(obj) {
            return request(url.forumEnlistExport, { data: obj, method: "GET" }).then(res => {
                return res.data;
            });
        }
        //论坛报名删除
    RequestForumEnlistDelete(obj) {
        return request(url.forumEnlist, { data: obj, method: "DELETE" }).then(res => {
            messageTips(res);
            return res.data;
        });
    }

    // 参展报名列表
    RequestExhibitionEnlist(obj) {
            return request(url.exhibitionEnlist, { data: obj }).then(res => {
                return res.data;
            });
        }
        // 参展报名模板详情
    RequestExhibitionEnlistDetail(obj) {
            return request(`${url.exhibitionEnlist}/${obj.enlist_id}`, {
                data: obj
            }).then(res => {
                return res;
            });
        }
        //参展报名数据导出
    RequestExhibitionEnlistExport(obj) {
            return request(url.exhibitionEnlistExport, { data: obj, method: "GET" }).then(res => {
                return res.data;
            });
        }
        //参展报名删除
    RequestExhibitionEnlistDelete(obj) {
        return request(url.exhibitionEnlist, { data: obj, method: "DELETE" }).then(res => {
            messageTips(res);
            return res.data;
        });
    }
}();