<template>
  <div class="beg-login-bg">
    <!-- <canvas id="canvas">你的浏览器不支持canvas</canvas> -->
    <div class="beg-login-box clearfix">
      <div class="login-box-left">
        <div class="websit-address">官网地址：
          <a href="http://www.rmsqnet.com/" target="_blank">http://www.rmsqnet.com/</a>
        </div>
        <div class="websit-logo-box">
          <img src="../../../static/images/login/logo.png" alt="">
        </div>
        <div class="login-data-footer">
          <h4>单位总数（ 2000 ）个</h4>
          <div class="data-wrapper clearfix">
            <div class="data-item">
              <h2>20</h2>
              <span>省</span>
            </div>
            <div class="data-item">
              <h2>65</h2>
              <span>市</span>
            </div>
            <div class="data-item">
              <h2>36</h2>
              <span>区/县</span>
            </div>
            <div class="data-item">
              <h2>154</h2>
              <span>街道</span>
            </div>
            <div class="data-item">
              <h2>1.2w</h2>
              <span>社区</span>
            </div>
          </div>
        </div>
      </div>
      <div class="login-box-right">
        <header>
          <div>人民社区后台管理系统</div>
        </header>
        <div class="login-main-wrapper" style="margin-top: 95px;" v-if="mark">
          <div class="user-text">用户登陆</div>
          <div class="login-inpt-wrapper">
            <div class="login-inpt-title">账号</div>
            <div class="login-account">
              <input type="text" id="userName" placeholder="请输入登录账号" v-model="loginForm.user_account" />
              <label><img src="../../../static/images/login/manager.png" width="18" alt=""></label>
            </div>
          </div>
          <div class="login-inpt-wrapper">
            <div class="login-inpt-title">密码</div>
            <div class="login-password">
              <input type="password" id="password" placeholder="请输入您的密码" v-model="loginForm.user_pwd" @keyup.enter="handleLogin" />
              <label><img src="../../../static/images/login/mima.png" width="18" alt=""></label>
            </div>
          </div>
          <!-- <div class="drag">
            <div class="drag_bg"></div>
            <div class="drag_text">{{confirmWords}}</div>
            <div @mousedown="mousedownFn($event)" class="handler handler_bg"></div>
          </div> -->
          <div style="margin-top:20px">
            <div style="width:100%" class="l-captcha" data-site-key="cc9864bb9d0d879aaf4c323586911583" data-callback="getResponse"></div>
          </div>
          <div class="login-center">
            <div class="clearfix">
              <div style="float: left">
                <!-- <label><input name="login" type="checkbox" v-model="isAuto" value="" id="ck_rmbUser" />下次自动登录 </label> -->
                <el-checkbox v-model="isAuto" :true-label="1" :false-label="2">记住密码</el-checkbox>
              </div>
              <!-- <div style="float: right;color:rgb(68,185,243)" @click="mark = false">忘记密码</div> -->
            </div>
          </div>

          <div class="login-btn" id="login" @click="handleLogin">
            <div>登录</div>
          </div>
        </div>
        <div class="login-main-wrapper" style="margin-top: 40px;" v-if="!mark">
          <div class="user-text">重置密码</div>
          <div class="login-inpt-wrapper">
            <div class="login-reset-item">
              <label>手机号：</label>
              <input type="text" id="userName" placeholder="请输入手机号" v-model="loginForm.user_account" />
            </div>
          </div>
          <div class="login-inpt-wrapper">
            <div class="login-reset-item">
              <label>验证码：</label>
              <input type="text" id="userName" style="width:120px;" placeholder="请输入验证码" v-model="loginForm.user_account" />
              <div class="verfiy-code">点击获取</div>
            </div>
          </div>
          <div class="login-inpt-wrapper">
            <div class="login-reset-item">
              <label>新密码：</label>
              <input type="text" id="userName" placeholder="请输入新密码" v-model="loginForm.user_account" />
            </div>
          </div>
          <div class="login-inpt-wrapper">
            <div class="login-reset-item">
              <label>确认密码：</label>
              <input type="text" id="userName" placeholder="请再次确认新密码" v-model="loginForm.user_account" />
            </div>
          </div>
          <div class="login-center">
            <div class="clearfix">
              <div style="float: right;color:rgb(68,185,243)" @click="mark = true">登陆</div>
            </div>
          </div>
          <div class="login-btn" id="login" @click="handleLogin">
            <div>提交</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Layout from "../../views/layout/Layout";
// const _import = require("../../router/_import_" + process.env.NODE_ENV);
import { getAccount, setAccount, getPassword, setPassword, removeAccount, removeRole, removePassword } from "@/utils/auth";
import { _throttle } from "@/utils/index";
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        user_account: "",
        user_pwd: ""
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      isAuto: 2,
      mark: true
      // beginClientX: 0 /*距离屏幕左端距离*/,
      // mouseMoveStata: false /*触发拖动状态  判断*/,
      // maxwidth: 280 /*拖动最大宽度，依据滑块宽度算出来的*/,
      // confirmWords: "拖动滑块验证" /*滑块文字*/,
      // confirmSuccess: false
    };
  },
  created() {
    if (getPassword()) {
      this.loginForm.user_account = getAccount();
      this.loginForm.user_pwd = getPassword();
      this.isAuto = 1;
    }
  },
  mounted() {
    const s1 = document.createElement("script"),
      s2 = document.createElement("script"),
      s3 = document.createElement("script");
    s1.type = s2.type = s3.type = "text/javascript";
    s1.src = "//captcha.luosimao.com/static/dist/api.js";
    s2.src = "https://cdn.bootcss.com/jquery/3.3.1/jquery.js";
    s3.src = "//captcha.luosimao.com/static/lib/page.js";
    console.log(s1, s2, s3);
    const head = document.getElementsByTagName("head")[0];
    // head.appendChild(s1);
    // head.appendChild(s2);
    // head.appendChild(s3);
    document.body.appendChild(s1);
    document.body.appendChild(s2);
    document.body.appendChild(s3);
  },
  methods: {
    handleLogin: _throttle(function() {
      // console.log("!!!!!!!!!!");
      if (this.loginForm.user_pwd === "" || this.loginForm.user_account === "") {
        this.$message.error("账号或者密码不能为空");
      } else if (!localStorage.veria) {
        this.$message.error("请点击按钮进行验证");
      } else {
        this.loginForm["captcha"] = localStorage.veria;
        this.$store.dispatch("LoginByUsername", this.loginForm).then(res => {
          if (res.data.code == 2000) {
            if (this.isAuto == 1) {
              setAccount(this.loginForm.user_account);
              setPassword(this.loginForm.user_pwd);
            } else {
              removeAccount();
              removePassword();
            }
            window.location.reload();
            setTimeout(() => {
              this.$router.push({ path: "/" });
            }, 2000);
          } else if (res.data.code == 4020) {
            this.$message.error("验证失败，请重新验证");
            LUOCAPTCHA.reset(); // 刷新验证码
          } else {
            this.loginForm.user_pwd = "";
            this.loginForm.user_account = "";
            localStorage.removeItem("veria");
            LUOCAPTCHA.reset(); // 刷新验证码
          }
        });
      }
    }, 2000)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
header div {
  font-family: Microsoft JhengHei, Roboto, Helvetica, Arial, sans-serif;
  //  font-family: "futura-pt",Helvetica,Arial,"Hiragino Sans GB","Hiragino Sans GB W3",Microsoft JhengHei,WenQuanYi Micro Hei,"Microsoft YaHei",sans-serif
}
.drag {
  position: relative;
  background-color: #e8e8e8;
  width: 320px;
  height: 34px;
  // margin-left: 30px;
  margin-top: 30px;
  line-height: 34px;
  text-align: center;
}
.handler {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 40px;
  height: 34px;
  border: 1px solid #ccc;
  cursor: move;
}
.handler_bg {
  background: #fff
    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==")
    no-repeat center;
}
.handler_ok_bg {
  background: #fff
    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==")
    no-repeat center;
}
.drag_bg {
  background-color: #7ac23c;
  height: 34px;
  width: 0px;
}
.drag_text {
  position: absolute;
  top: 0px;
  width: 320px;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  -o-user-select: none;
  -ms-user-select: none;
}
.beg-login-bg {
  background: url("../../../static/images/login/loginbg.png") no-repeat;
  height: 100vh;
  min-height: 670px;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  background-position: 0px 0px;
  overflow: hidden;
  position: relative;
  /*-moz-background-size:100% 100%;*/
}
.verfiy-code {
  display: inline;
  margin-left: 10px;
  font-size: 20px;
  font-weight: bold;
  color: rgb(58, 187, 243);
}
.beg-login-box {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 650px;
  width: 1024px;
  margin: auto;
  /*margin:0 auto;*/
  /*background-color: rgba(255, 255, 255, 0.2);*/
  /*border-radius: 10px;*/
  /*border: 1px rgba(255,255,255,.5);*/
  /*margin-left: 50%;*/
  /*margin-top: 15%;*/
  color: aliceblue;
  /*border: 1px red solid;*/
  // margin-left: -512px;
  // border: 1px red solid;
}
.login-box-left,
.login-box-right {
  float: left;
  height: 100%;
}
.login-box-right {
  width: 40%;
  background: #fff;
  border-radius: 0 5px 5px 0;
}
.login-box-left {
  width: 60%;
  background: url("../../../static/images/login/login-left-bg.png") left center no-repeat;
  background-size: cover;
}
.login-data-footer {
  margin-top: 130px;
  padding: 0 25px;
}
.data-wrapper {
  margin-top: 30px;
  padding-left: 20px;
}
.user-text {
  margin-bottom: 50px;
  padding-bottom: 10px;
  letter-spacing: 5px;
  font-weight: 500;
  font-family: "微软雅黑";
  font-size: 20px;
  text-align: center;
  background: url("../../../static/images/login/row-line.png") center bottom no-repeat;
}
.data-item {
  text-align: center;
  float: left;
  width: 100px;
  height: 95px;
  background: url("../../../static/images/login/line-white.png") right center no-repeat;
}
.data-wrapper .data-item:nth-last-of-type(1) {
  background: none;
}
.data-item h2 {
  // padding: 0;
  margin: 15px;
}
.data-item > span {
  font-size: 15px;
}
.websit-address {
  margin: 30px 25px auto;
  font-size: 14px;
}
.websit-logo-box {
  margin-top: 130px;
  text-align: center;
}
.login-box-right {
  color: #333;
}
.login-box-right > header {
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0 20px 35px;
}
.login-box-right > header > div {
  height: 39px;
  padding-top: 10px;
  letter-spacing: 2px;
  /*line-height: 39px;*/
  /*border-bottom: 1px solid aliceblue;*/
}

.beg-login-box .beg-login-main {
  height: 185px;
  padding: 5px 90px 0;
}

.beg-login-main .layui-form-item {
  position: relative;
}

.beg-login-main .layui-form-item .beg-login-icon {
  position: absolute;
  color: #cccccc;
  top: 18px;
  left: 10px;
}

.beg-login-main .layui-form-item input {
  padding-left: 34px;
}
.beg-login-main {
  /*width: 250%;*/
  margin-top: 40px;
  /*border: 1px red solid;*/
}

.beg-login-box footer {
  height: 35px;
  padding: 10px 10px 0 10px;
}

.beg-login-box footer p {
  line-height: 35px;
  text-align: center;
}

.beg-pull-right {
  float: left !important;
}

.beg-clear {
  clear: both;
}

.beg-login-remember {
  line-height: 38px;
}

.beg-login-remember .layui-form-switch {
  margin-top: 0px;
}

.beg-login-code-box {
  position: relative;
  padding: 10px;
}

.beg-login-code-box input {
  position: absolute;
  width: 100px;
}

.beg-login-code-box img {
  cursor: pointer;
  position: absolute;
  left: 115px;
  height: 38px;
}
.layui-btn2 {
  color: #003991;
  display: inline-block;
  border-radius: 5px;
  height: 45px;
  width: 370px;
  line-height: 45px;
  padding: 0 18px;
  white-space: nowrap;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.9;
}
.layui-btn2:hover {
  color: #003991;
}
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #b3b3b3;
}
　　:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #b3b3b3;
}
　　::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #b3b3b3;
}
　　:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #b3b3b3;
}
.beg_border {
  height: 6px;
  border: 1px rgba(255, 255, 255, 0.5) solid;
  border-radius: 10px;
  width: 150px;
  margin: 39px auto;
}
.beg-logo {
  position: absolute;
  top: 5%;
  left: 250px;
  width: 40%;
  /*border: 1px red solid;*/
  color: #fff;
  overflow: hidden;
}
.beg-logo > div {
  font-size: 23px;
  margin-left: 10px;
  letter-spacing: 5px;
}
.beg-logo > div,
.beg-logo > img {
  float: left;
}
.beg-logo > div > p {
  font-size: 12px;
  letter-spacing: 0px;
}
.login-main-wrapper {
  width: 78%;
  margin: 0 auto;
}
.login-account {
  border: 1px #fff solid;
  border-bottom: #efefef solid 1px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  line-height: 50px;
  height: 50px;
  background-color: white;
  text-align: left;
}
.login-account img {
  position: relative;
  top: 10px;
}
.login-inpt-wrapper {
  // width: 58%;
  margin: 0 auto;
}
.login-inpt-title {
  margin: 30px 0 5px;
  color: rgb(87, 85, 85);
  font-family: "微软雅黑";
}
.login-account label,
.login-password label {
  margin-left: 10px;
}
.login-account input,
.login-password input {
  border: none;
  height: 35px;
  position: relative;
  top: 3px;
  line-height: 45px;
  width: 85%;
  margin-left: 1%;
  color: #000;
  outline: none;
  font-family: "微软雅黑";
}
.login-reset-item {
  margin: 30px 0;
  color: #575555;
}
.login-reset-item label {
  display: inline-block;
  width: 80px;
  text-align: right;
}
.login-reset-item input {
  border: none;
  height: 35px;
  line-height: 35px;
  width: 220px;
  margin-left: 1%;
  color: #000;
  outline: none;
  font-family: "微软雅黑";
  border-bottom: #efefef solid 1px;
}
.login-password {
  border: 1px #fff solid;
  border-bottom: #efefef solid 1px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  line-height: 50px;
  height: 50px;
  text-align: left;
}
.login-password img {
  position: relative;
  top: 10px;
}
.login-center {
  text-align: left;
  margin: 10px auto auto;
  color: rgb(94, 93, 93);
}
.login-center > div > label > input {
  // border: 1px red solid;
  background-color: #fff;
  position: relative;
  top: 2px;
}
.login-btn {
  width: 200px;
  margin: 30px auto auto;
  clear: both;
}
.login-btn > div {
  border-radius: 5px;
  width: 100%;
  height: 45px;
  line-height: 45px;
  text-align: center;
  cursor: pointer;
  background: #39bcf3;
  // background: -webkit-linear-gradient(
  //   left,
  //   rgb(96, 177, 245),
  //   rgb(41, 192, 242)
  // );
  // background: -webkit-gradient(left, rgb(96, 177, 245), rgb(41, 192, 242));
  // background: -o-linear-gradient(
  //   left,
  //   rgb(96, 177, 245),
  //   rgb(41, 192, 242)
  // ); /* Opera 11.1 - 12.0 */
  // background: -moz-linear-gradient(
  //   left,
  //   rgb(96, 177, 245),
  //   #34b0d6
  // ); /* Firefox 3.6 - 15 */
  // background: linear-gradient(
  //   left,
  //   rgb(96, 177, 245),
  //   rgb(41, 192, 242)
  // ); /* 标准的语法 */
  // filter: progid:DXImageTransform.Microsoft.Gradient(gradientType=0,startColorStr= rgb(96,177,245),endColorStr=rgb(41,192,242)); /* IE 6 7 8 */
  border-radius: 20px;
  color: #fff;
  font-family: "微软雅黑";
}
</style>
