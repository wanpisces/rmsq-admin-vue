import url from '../api'
import axios from '../request.js'
import { Message } from 'element-ui'
let messageTips = function(res) {
        if (res.code === 2000) {
            Message.success(res.msg);
        } else if (res.code === 4000) {
            Message.error(res.msg);
        } else if (res.code === 4010) {
            Message.warning(res.msg);
        }
    }
    // 反馈列表
export function RequestFeedbackList(obj) {
    return axios.get(url.feedback, obj)
}
//反馈详情
export function RequestFeedbackDetail(obj) {
    return axios.get(url.feedback + '/' + obj.feedback_id, obj)
}
//删除反馈
export function DeleteFeedback(obj) {
    return axios.delete(url.feedback, obj)
}
// 问题列表
export function RequestQuestionList(obj) {
    return axios.get(url.question, obj)
}
//问题删除
export function DeleteQuestion(obj) {
    return axios.delete(url.question, obj)
}
//问题上下线
export function RequestQuestionOnline(obj) {
    return axios.put(url.questionState, obj)
}
//问题详情
export function RequestQuestionDetail(obj) {
    return axios.get(url.question + '/' + obj.question_id, obj)
}
//问题编辑
export function RequestQuestionEdit(obj) {
    return axios.put(url.question, obj)
}
//问题新增
export function RequestQuestionAdd(obj) {
    return axios.post(url.question, obj)
}




    
