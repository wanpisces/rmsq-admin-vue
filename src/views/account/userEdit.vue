<template>
  <div class="info-container">
    <el-card>
      <div class="info-title">编辑区域</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="width:700px;align:center;margin:0 auto">
        <el-form-item label="账号类别：" prop="group" :label-width="formLabelWidth">
          <el-radio-group v-model="ruleForm.group">
            <el-radio label="1" :disabled="true">普通账号</el-radio>
            <el-radio label="2" :disabled="true">单位账号</el-radio>
            <el-radio label="3" :disabled="true">代理商</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="行政级别：" prop="level" :label-width="formLabelWidth">
          <el-select v-model="ruleForm.level" placeholder="请选择行政级别" disabled size="small">
            <el-option v-for="item in levelData" :key="item.level" :label="item.level_name" :value="item.level">
            </el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item label="选择地址：" prop="province" :label-width="formLabelWidth">
            <el-select size="small" v-model="ruleForm.province" placeholder="请选择省" @change="chooseAddress" disabled>
              <el-option v-for="item in provinceData" :key="item.id" :label="item.region_name_c" :value="item.id">
              </el-option>
            </el-select>
            <el-select size="small" v-model="ruleForm.city" placeholder="请选择市" v-if="ruleForm.level&&ruleForm.level<=4" @change="chooseAddress" disabled>
              <el-option v-for="item in cityData" :key="item.id" :label="item.region_name_c" :value="item.id">
              </el-option>
            </el-select>
            <el-select size="small" v-model="ruleForm.area" placeholder="请选择区" v-if="ruleForm.level&&ruleForm.level<=3" @change="chooseAddress" disabled>
              <el-option v-for="item in areaData" :key="item.id" :label="item.region_name_c" :value="item.id">
              </el-option>
            </el-select>
            <el-select size="small" v-model="ruleForm.street" placeholder="请选择街道" v-if="ruleForm.level&&ruleForm.level<=2" @change="chooseAddress" disabled>
              <el-option v-for="item in streetData" :key="item.id" :label="item.region_name_c" :value="item.id">
              </el-option>
            </el-select>
            <el-select size="small" v-model="ruleForm.community" placeholder="请选择社区" v-if="ruleForm.level&&ruleForm.level<=1" disabled @change="chooseAddress">
              <el-option v-for="item in communityData" :key="item.id" :label="item.region_name_c" :value="item.id">
              </el-option>
            </el-select>

          </el-form-item>
        </div>

        <el-form-item label="账号：" :label-width="formLabelWidth" prop="account">
          <el-input v-model="ruleForm.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位名称：" :label-width="formLabelWidth" prop="inst">
          <el-input v-model="ruleForm.inst" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位简称：" :label-width="formLabelWidth" prop="nickname">
          <el-input v-model="ruleForm.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设置密码：" :label-width="formLabelWidth" prop="password">
          <el-input v-model="ruleForm.password" auto-complete="off" @change="changePsw" placeholder="请输入密码，格式为6-20位字母数字"></el-input>
        </el-form-item>
        <!-- <el-form-item label="确认密码：" :label-width="formLabelWidth" prop="news_title">
                <el-input v-model="ruleForm.news_title" auto-complete="off" ></el-input>
            </el-form-item> -->
        <el-form-item label="联系方式：" :label-width="formLabelWidth" prop="tel">
          <el-input v-model="ruleForm.tel" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="账号角色：" :label-width="formLabelWidth" prop="role">
                <el-select v-model="ruleForm.role" placeholder="请选择账号角色">
                    <el-option
                    v-for="item in rolesData"
                    :key="item.role_id"
                    :label="item.role_name"
                    :value="item.role_id">
                    </el-option>
                </el-select>
            </el-form-item> -->
        <!-- <el-form-item label="行政级别：" prop="level" :label-width="formLabelWidth">
          <el-select v-model="ruleForm.level" placeholder="请选择行政级别" disabled size="small">
            <el-option v-for="item in levelData" :key="item.level" :label="item.level_name" :value="item.level">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择地址：" prop="province" :label-width="formLabelWidth">
          <el-select size="small" v-model="ruleForm.province" placeholder="请选择省" @change="chooseAddress" disabled>
            <el-option v-for="item in provinceData" :key="item.id" :label="item.region_name_c" :value="item.id">
            </el-option>
          </el-select>
          <el-select size="small" v-model="ruleForm.city" placeholder="请选择市" v-if="ruleForm.level&&ruleForm.level<=4" @change="chooseAddress" disabled>
            <el-option v-for="item in cityData" :key="item.id" :label="item.region_name_c" :value="item.id">
            </el-option>
          </el-select>
          <el-select size="small" v-model="ruleForm.area" placeholder="请选择区" v-if="ruleForm.level&&ruleForm.level<=3" @change="chooseAddress" disabled>
            <el-option v-for="item in areaData" :key="item.id" :label="item.region_name_c" :value="item.id">
            </el-option>
          </el-select>
          <el-select size="small" v-model="ruleForm.street" placeholder="请选择街道" v-if="ruleForm.level&&ruleForm.level<=2" @change="chooseAddress" disabled>
            <el-option v-for="item in streetData" :key="item.id" :label="item.region_name_c" :value="item.id">
            </el-option>
          </el-select>
          <el-select size="small" v-model="ruleForm.community" placeholder="请选择社区" v-if="ruleForm.level&&ruleForm.level<=1" disabled @change="chooseAddress">
            <el-option v-for="item in communityData" :key="item.id" :label="item.region_name_c" :value="item.id">
            </el-option>
          </el-select>

        </el-form-item> -->
        <el-form-item label="详细地址：" prop="address" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.address" auto-complete="off" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="选择服务：" prop="service" :label-width="formLabelWidth">
          <div v-for="(items,index) in servicesData" :key="index">
            <h4>{{items.category_name}}：</h4>
            <el-checkbox-group v-model="ruleForm.service" @change="handleCheckedCitiesChange">
              <span>
                <el-checkbox v-for="item in items.list" :label="item.service_id" :key="item.service_id">{{item.service_title}}</el-checkbox>
              </span>
            </el-checkbox-group>
          </div>

        </el-form-item>

        <el-form-item label="服务限制设置：" :label-width="formLabelWidth" v-if="ruleForm.group==1 || ruleForm.group==3">
          <div>
            <div class="service-setting">
              <span>下沉轮播图：</span>
              <el-input-number v-model="ruleForm.slink_banner_num" :min="0" label="描述文字"></el-input-number>
              张
            </div>
            <div class="service-setting">
              <span>下沉服务按钮：</span>
              <el-input-number v-model="ruleForm.slink_service_num" :min="0" label="描述文字"></el-input-number>
              个
            </div>
            <div class="service-setting">
              <span>自有栏目置顶条数：</span>
              <el-input-number v-model="ruleForm.self_recom_news_top_num" :min="0" label="描述文字"></el-input-number>
              条
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="跨级推荐栏目资讯置顶：" :label-width="formLabelWidth">
          <div class="news-top-item">
            <span>省：</span>
            <el-input-number v-model="ruleForm.cross_recom_news_top_conf.province.num" :min="0" label="描述文字"></el-input-number>
            条
            <label>使用时限：
              <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.province.expiredate" align="right" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </label>
          </div>
          <div class="news-top-item">
            <span>市：</span>
            <el-input-number v-model="ruleForm.cross_recom_news_top_conf.city.num" :min="0" label="描述文字"></el-input-number>
            条
            <label>使用时限：
              <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.city.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="date" placeholder="选择日期">
              </el-date-picker>
            </label>
          </div>
          <div class="news-top-item">
            <span>区/县：</span>
            <el-input-number v-model="ruleForm.cross_recom_news_top_conf.area.num" :min="0" label="描述文字"></el-input-number>
            条
            <label>使用时限：
              <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.area.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="date" placeholder="选择日期">
              </el-date-picker>
            </label>
          </div>
          <div class="news-top-item">
            <span>街道：</span>
            <el-input-number v-model="ruleForm.cross_recom_news_top_conf.street.num" :min="0" label="描述文字"></el-input-number>
            条
            <label>使用时限：
              <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.street.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="date" placeholder="选择日期">
              </el-date-picker>
            </label>
          </div>
          <div class="news-top-item">
            <span>社区：</span>
            <el-input-number v-model="ruleForm.cross_recom_news_top_conf.community.num" :min="0" label="描述文字"></el-input-number>
            条
            <label>使用时限：
              <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.community.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="date" placeholder="选择日期">
              </el-date-picker>
            </label>
          </div>
        </el-form-item> -->
        <!-- <el-form-item label="跨级推荐栏目资讯置顶：" :label-width="formLabelWidth" v-if="ruleForm.level!=5">
          <div class="news-top-item" v-if="ruleForm.level<=4">
            <span>省：</span>
            <el-input-number v-model="ruleForm.cross_recom_news_top_conf.province.num" :min="0" label="描述文字"></el-input-number>
            条
            <label>使用时限：
              <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.province.expiredate" align="right" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </label>
          </div>
          <div class="news-top-item" v-if="ruleForm.level<=3">
            <span>市：</span>
            <el-input-number v-model="ruleForm.cross_recom_news_top_conf.city.num" :min="0" label="描述文字"></el-input-number>
            条
            <label>使用时限：
              <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.city.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期">
              </el-date-picker>
            </label>
          </div>
          <div class="news-top-item" v-if="ruleForm.level<=2">
            <span>区/县：</span>
            <el-input-number v-model="ruleForm.cross_recom_news_top_conf.area.num" :min="0" label="描述文字"></el-input-number>
            条
            <label>使用时限：
              <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.area.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期">
              </el-date-picker>
            </label>
          </div>
          <div class="news-top-item" v-if="ruleForm.level<=1">
            <span>街道：</span>
            <el-input-number v-model="ruleForm.cross_recom_news_top_conf.street.num" :min="0" label="描述文字"></el-input-number>
            条
            <label>使用时限：
              <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.street.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期">
              </el-date-picker>
            </label>
          </div>
          <div class="news-top-item" v-if="ruleForm.level<=0">
            <span>社区：</span>
            <el-input-number v-model="ruleForm.cross_recom_news_top_conf.community.num" :min="0" label="描述文字"></el-input-number>
            条
            <label>使用时限：
              <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.community.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期">
              </el-date-picker>
            </label>
          </div>
        </el-form-item> -->
        <div v-if="ruleForm.group==1 ">
          <el-form-item label="跨级推荐栏目资讯置顶：" :label-width="formLabelWidth">
            <div class="news-top-item" v-if="ruleForm.level<=5">
              <span>省：</span>
              <el-input-number v-model="ruleForm.cross_recom_news_top_conf.province.num" :min="0" label="描述文字"></el-input-number>
              条
              <label>使用时限：
                <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.province.expiredate" align="right" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </label>
            </div>
            <div class="news-top-item" v-if="ruleForm.level<=4">
              <span>市：</span>
              <el-input-number v-model="ruleForm.cross_recom_news_top_conf.city.num" :min="0" label="描述文字"></el-input-number>
              条
              <label>使用时限：
                <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.city.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期">
                </el-date-picker>
              </label>
            </div>
            <div class="news-top-item" v-if="ruleForm.level<=3">
              <span>区/县：</span>
              <el-input-number v-model="ruleForm.cross_recom_news_top_conf.area.num" :min="0" label="描述文字"></el-input-number>
              条
              <label>使用时限：
                <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.area.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期">
                </el-date-picker>
              </label>
            </div>
            <div class="news-top-item" v-if="ruleForm.level<=2">
              <span>街道：</span>
              <el-input-number v-model="ruleForm.cross_recom_news_top_conf.street.num" :min="0" label="描述文字"></el-input-number>
              条
              <label>使用时限：
                <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.street.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期">
                </el-date-picker>
              </label>
            </div>
            <div class="news-top-item" v-if="ruleForm.level<1">
              <span>社区：</span>
              <el-input-number v-model="ruleForm.cross_recom_news_top_conf.community.num" :min="0" label="描述文字"></el-input-number>
              条
              <label>使用时限：
                <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.community.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期">
                </el-date-picker>
              </label>
            </div>
          </el-form-item>
        </div>
        <div v-if=" ruleForm.group==3">
          <el-form-item label="跨级推荐栏目资讯置顶：" :label-width="formLabelWidth">
            <div class="news-top-item" v-if="ruleForm.level==5">
              <span>省：</span>
              <el-input-number v-model="ruleForm.cross_recom_news_top_conf.province.num" :min="0" label="描述文字"></el-input-number>
              条
              <label>使用时限：
                <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.province.expiredate" align="right" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </label>
            </div>
            <div class="news-top-item" v-if="ruleForm.level==4">
              <span>市：</span>
              <el-input-number v-model="ruleForm.cross_recom_news_top_conf.city.num" :min="0" label="描述文字"></el-input-number>
              条
              <label>使用时限：
                <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.city.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期">
                </el-date-picker>
              </label>
            </div>
            <div class="news-top-item" v-if="ruleForm.level==3">
              <span>区/县：</span>
              <el-input-number v-model="ruleForm.cross_recom_news_top_conf.area.num" :min="0" label="描述文字"></el-input-number>
              条
              <label>使用时限：
                <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.area.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期">
                </el-date-picker>
              </label>
            </div>
            <div class="news-top-item" v-if="ruleForm.level==2">
              <span>街道：</span>
              <el-input-number v-model="ruleForm.cross_recom_news_top_conf.street.num" :min="0" label="描述文字"></el-input-number>
              条
              <label>使用时限：
                <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.street.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期">
                </el-date-picker>
              </label>
            </div>
            <div class="news-top-item" v-if="ruleForm.level==1">
              <span>社区：</span>
              <el-input-number v-model="ruleForm.cross_recom_news_top_conf.community.num" :min="0" label="描述文字"></el-input-number>
              条
              <label>使用时限：
                <el-date-picker v-model="ruleForm.cross_recom_news_top_conf.community.expiredate" value-format="yyyy-MM-dd HH:mm:ss" align="right" type="datetime" placeholder="选择日期">
                </el-date-picker>
              </label>
            </div>
          </el-form-item>
        </div>
        <el-form-item label="账号到期时间：" :label-width="formLabelWidth" prop="expiredate" :rules="[ { required: true, message: '添加到期时间' }]">
          <el-date-picker v-model="ruleForm.expiredate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="账号到期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button type="primary" @click="submitForm('ruleForm')" style="width:100px" :loading="btnLoading"> 编辑保存 </el-button>

          <el-button icon="el-icon-arrow-left" @click="cancleBack"> 返回客户账号 </el-button>

        </el-form-item>
      </el-form>
      <!-- <div class="info-footer">
            <el-button type="primary"  @click="submitForm('ruleForm')">确定</el-button>
        </div> -->
    </el-card>
  </div>
</template>
<script>
//  数据service接口
import { RequestCategory } from "@/fetch/modules/service.js";
import { RequestArea, RequestService } from "@//fetch/modules/public.js";
import { RequestQiNiutoken, adminData } from "@/fetch/tool";
import { RequestCustomerAdd, RequestCustomerEditor, RequestCustomerDetail } from "@/fetch/modules/account.js";
import { RequestPlatLimitsList } from "@/fetch/modules/account";
const levelData = [
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
// 手机号验证
function isvalidPhone(str) {
  const reg = /^13\d{9}$|^14\d{9}$|^15\d{9}$|^17\d{9}$|^18\d{9}$|^19\d{9}$/;
  return reg.test(str);
}
let validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的手机号码"));
  } else {
    callback();
  }
};
const rules = {
  inst: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  inst: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  tel: [{ required: true, trigger: "blur", validator: validPhone }],
  level: [{ required: true, message: "请输入行政级别", trigger: "blur" }],
  province: [{ required: true, message: "请输入地址", trigger: "blur" }],
  address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
  category_id: [{ required: true, message: "请选择服务类型", trigger: "blur" }],
  role: [{ required: true, message: "请选择账号角色", trigger: "blur" }]
};
const rules1 = {
  inst: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [
    {
      required: true,
      trigger: "blur",
      validator: validatorPassword
    }
  ],
  inst: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  tel: [{ required: true, trigger: "blur", validator: validPhone }],
  level: [{ required: true, message: "请输入行政级别", trigger: "blur" }],
  province: [{ required: true, message: "请输入地址", trigger: "blur" }],
  address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
  category_id: [{ required: true, message: "请选择服务类型", trigger: "blur" }],
  role: [{ required: true, message: "请选择账号角色", trigger: "blur" }]
};
export default {
  data() {
    return {
      rules: rules,
      checkedServices: [],
      ruleForm: {
        group: "1",
        account: "",
        nickname: "",
        inst: "",
        password: "",
        role: 1,
        tel: "",
        level: "",
        province: "",
        city: "",
        area: "",
        street: "",
        community: "",
        service: [],
        address: "",
        group_name: "",
        expiredate: "", // 到期时间，
        slink_banner_num: "", // 下沉轮播数
        slink_service_num: "", // 下沉服务数量
        self_recom_news_top_num: "", // 自由栏目置顶条数,
        cross_recom_news_top_conf: {
          province: {
            // 省
            num: 0, // 数量
            expiredate: ""
          },
          city: {
            //  市
            num: 0,
            expiredate: ""
          },
          area: {
            //  区
            num: 0,
            expiredate: ""
          },
          street: {
            //  街道
            num: 0,
            expiredate: ""
          },
          community: {
            //  社区
            num: 0,
            expiredate: ""
          }
        } // 跨级栏目推荐配置
      },
      // 行政级别
      levelData: levelData,
      rolesData: adminData,
      moduleData: [],
      servicesData: [],
      formLabelWidth: "180px",
      provinceData: [], //省
      cityData: [], // 市
      areaData: [], // 区
      streetData: [], //街道
      communityData: [], // 社区,
      area_show: 1,
      btnLoading: false,
      limitData: [], // 权限配置,
      SINK_ALL_SERVICE: {}, //全平台服务按钮下沉
      SINK_ALL_BANNER: {}, //全平台轮播下沉

      SINK_AGENT_SERVICE: {}, // "代理商服务按钮下沉"
      SINK_AGENT_BANNER: {}, //"代理商轮播下沉"

      TOP_SELF_NEWS: {}, //自有栏目资讯置顶
      TOP_RECOM_NEWS: {} //范围内推荐资讯置顶
    };
  },
  watch: {
    // "ruleForm.level"(){
    //    this.ruleForm. province='';
    //    this.ruleForm.city='';
    //    this.ruleForm. area='';
    //    this.ruleForm.street='';
    //    this.ruleForm.community='';
    // },
    "ruleForm.province"() {
      if (this.area_show != 1) {
        this.ruleForm.area = "";
        this.ruleForm.city = ""; // 市
        this.ruleForm.street = ""; //街道
        this.ruleForm.community = ""; // 社区
      }
      //  this.ruleForm.area="";
      //  this.ruleForm.city=""; // 市
      //  this.ruleForm.street= "";//街道
      //  this.ruleForm.community= "" // 社区
      if (this.ruleForm.province) {
        this.getArea({ upper_region: this.ruleForm.province });
      }
    },
    "ruleForm.city"() {
      if (this.area_show != 1) {
        this.ruleForm.area = "";
        this.ruleForm.street = ""; //街道
        this.ruleForm.community = ""; // 社区
      }
      if (this.ruleForm.city != "") {
        this.getArea({ upper_region: this.ruleForm.city });
      }
    },
    "ruleForm.area"() {
      if (this.area_show != 1) {
        this.ruleForm.street = ""; //街道
        this.ruleForm.community = ""; // 社区
      }
      if (this.ruleForm.area) {
        this.getArea({ upper_region: this.ruleForm.area });
      }
    },
    "ruleForm.street"() {
      if (this.area_show != 1) {
        this.ruleForm.community = ""; // 社区
      }
      if (this.ruleForm.street) {
        this.getArea({ upper_region: this.ruleForm.street });
      }
    },
    "ruleForm.community"() {
      if (this.ruleForm.community) this.getArea({ upper_region: this.ruleForm.community });
    }
  },
  created() {
    console.log("aaaaa___");
    const query = this.$route.query;
    if (query.admin_id) {
      this.admin_id = query.admin_id;
      this.ruleForm.id = query.admin_id;
      this.handEditor(query.admin_id);
    }
    this.getService();
    // this.getDataLimitsList();
    this.getArea({ upper_region: 0 });
  },
  methods: {
    changePsw() {
      this.rules = rules1;
    },
    // 获取服务
    getService() {
      RequestService({}).then(res => {
        if (res) {
          this.servicesData = res;
        }
      });
    },
    //获取资讯权限设置
    // getDataLimitsList(res) {
    //   let _args = { current_page: 1, page_size: 100 };
    //   RequestPlatLimitsList(_args).then(res => {
    //     this.limitData = res.list;
    //     res.list.forEach((item, index) => {
    //       if (item.key == "SINK_ALL_BANNER") {
    //         this.SINK_ALL_BANNER = item;
    //       } else if (item.key == "SINK_ALL_SERVICE") {
    //         this.SINK_ALL_SERVICE = item;
    //       } else if (item.key == "SINK_AGENT_SERVICE") {
    //         this.SINK_AGENT_SERVICE = item;
    //       } else if (item.key == "SINK_AGENT_BANNER") {
    //         this.SINK_AGENT_BANNER = item;
    //       } else if (item.key == "TOP_SELF_NEWS") {
    //         this.TOP_SELF_NEWS = item;
    //       } else if (item.key == "TOP_RECOM_NEWS") {
    //         this.TOP_RECOM_NEWS = item;
    //       }
    //     });
    //     // if (this.ruleForm.level == 5 && this.ruleForm.group == 1) {
    //     //   this.ruleForm.slink_banner_num = +this.SINK_ALL_BANNER.province;
    //     //   this.ruleForm.slink_service_num = +this.SINK_ALL_SERVICE.province;
    //     //   this.ruleForm.self_recom_news_top_num = +this.TOP_SELF_NEWS.province;
    //     // }
    //     this.ruleForm.slink_banner_num = +res.slink_banner_num;
    //     this.ruleForm.slink_service_num = +res.slink_service_num;
    //     this.ruleForm.self_recom_news_top_num = +res.self_recom_news_top_num;
    //     if (!res.cross_recom_news_top_conf) {
    //       for (let i in this.ruleForm.cross_recom_news_top_conf) {
    //         if (i) {
    //           this.ruleForm.cross_recom_news_top_conf[i].num = +this.TOP_RECOM_NEWS[i];
    //         }
    //       }
    //     } else {
    //       this.ruleForm.cross_recom_news_top_conf = res.cross_recom_news_top_conf;
    //     }
    //   });
    // },
    //  下沉服务限制条件
    // chooseSink(group, level) {
    //   let _attr = { 1: "community", 2: "street", 3: "area", 4: "city", 5: "province" }[level];
    //   if (group == 1) {
    //     this.ruleForm.slink_banner_num = +this.SINK_ALL_BANNER[_attr];
    //     this.ruleForm.slink_service_num = +this.SINK_ALL_SERVICE[_attr];
    //   } else if (group == 3) {
    //     this.ruleForm.slink_banner_num = +this.SINK_AGENT_BANNER[_attr];
    //     this.ruleForm.slink_service_num = +this.SINK_AGENT_SERVICE[_attr];
    //   }
    //   this.ruleForm.self_recom_news_top_num = +this.TOP_SELF_NEWS[_attr];
    // },
    //编辑信息
    handEditor(admin_id) {
      this.formTitle = "编辑账号";
      RequestCustomerDetail({ admin_id: admin_id }).then(res => {
        this.ruleForm.account = res.admin_account;
        this.ruleForm.nickname = res.admin_nickname;
        this.ruleForm.inst = res.group_name;
        this.ruleForm.tel = res.admin_tel;
        this.ruleForm.role = res.role_type;
        this.ruleForm.id = res.admin_id;
        this.ruleForm.province = res.province_id || "";
        this.ruleForm.city = res.city_id || "";
        this.ruleForm.area = res.area_id || "";
        this.ruleForm.street = res.street_id || "";
        this.ruleForm.community = res.community_id || "";
        this.ruleForm.level = res.group_type;
        this.ruleForm.address = res.group_location;
        this.ruleForm.service = res.service;
        this.ruleForm.expiredate = res.expiredate;
        this.ruleForm.slink_banner_num = +res.slink_banner_num;
        this.ruleForm.slink_service_num = +res.slink_service_num;
        this.ruleForm.self_recom_news_top_num = +res.self_recom_news_top_num;
        this.ruleForm.cross_recom_news_top_conf = res.cross_recom_news_top_conf ? res.cross_recom_news_top_conf : this.ruleForm.cross_recom_news_top_conf;
        if (typeof res.group == "number") {
          this.ruleForm.group = JSON.stringify(res.group);
        } else {
          this.ruleForm.group = res.group;
        }
        // this.getDataLimitsList(res);

        //
        // console.log(this.ruleForm.group);
        // this.area_show=
        // this.ruleForm.role_type=
      });
    },

    // // 获取服务
    // getService() {
    //   RequestCategory({ category_type: 2 }).then(res => {
    //     if (res) {
    //       this.servicesData = res;
    //     }
    //   });
    // },

    getArea(obj) {
      let args = obj;
      RequestArea(args).then(res => {
        //  console.log(res);
        if (res) {
          !!res.map &&
            res.map((item, index) => {
              if (item.is_open == 1) {
                res[index]["is_show"] = false;
              } else {
                res[index]["is_show"] = true;
              }
            });
          if (res[0].level == 1) {
            this.provinceData = res;
          } else if (res[0].level == 2) {
            this.cityData = res;
          } else if (res[0].level == 3) {
            this.areaData = res;
          } else if (res[0].level == 4) {
            this.streetData = res;
          } else if (res[0].level == 5) {
            this.communityData = res;
          }
        }
      });
    },
    handleCheckedCitiesChange(value) {
      this.category_id = value;
      // console.log(this.category_id);
    },
    chooseAddress(value) {
      console.log("ssssssssssssssssssssssssss", value);
      RequestArea({ upper_region: value }).then(res => {
        //  console.log(res);
        if (res.length != 0) {
          !!res.map &&
            res.map((item, index) => {
              if (item.is_open == 1) {
                res[index]["is_show"] = false;
              } else {
                res[index]["is_show"] = true;
              }
            });
          if (res[0].level == 1) {
            this.provinceData = res;
            // console.log('ddddd')
            this.ruleForm.city = "";
            this.ruleForm.area = "";
            this.ruleForm.community = "";
            this.ruleForm.street = "";
          } else if (res[0].level == 2) {
            this.cityData = res;
            this.areaData = [];
            this.streetData = [];
            this.communityData = [];
            this.ruleForm.city = "";
            this.ruleForm.area = "";
            this.ruleForm.community = "";
            this.ruleForm.street = "";
            console.log("sssss");
          } else if (res[0].level == 3) {
            this.areaData = res;
            console.log("执行");
            this.streetData = [];
            this.communityData = [];
            this.ruleForm.area = "";
            this.ruleForm.community = "";
            this.ruleForm.street = "";
          } else if (res[0].level == 4) {
            this.streetData = res;
            this.communityData = [];
            this.ruleForm.community = "";
            this.ruleForm.street = "";
          } else if (res[0].level == 5) {
            this.communityData = res;
            this.ruleForm.community = "";
          }
        }
      });
    },
    // 提交审核
    submitForm(formName) {
      var _this = this;
      if (_this.ruleForm.level == 1) {
      } else if (_this.ruleForm.level == 2) {
        this.ruleForm.community = "";
      } else if (_this.ruleForm.level == 3) {
        _this.ruleForm.street = "";
        _this.ruleForm.community = "";
      } else if (_this.ruleForm.level == 4) {
        _this.ruleForm.street = "";
        _this.ruleForm.community = "";
        _this.ruleForm.area = "";
      } else if (_this.ruleForm.level == 5) {
        _this.ruleForm.street = "";
        _this.ruleForm.community = "";
        _this.ruleForm.area = "";
        _this.ruleForm.city = "";
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          this.btnMark = true;
          let args = this.ruleForm;
          // args.password == "" ? (args.password = "123456") : "";
          RequestCustomerEditor(args).then(res => {
            this.btnLoading = false;
            if (res.code == 2000) {
              setTimeout(function() {
                _this.$router.push({ name: "userAccount" });
                _this.$store.dispatch("delVisitedViews", {
                  path: "/account/userEdit"
                });
              }, 1000);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancleBack() {
      this.$router.push({ path: "userAccount" });
      this.$store.dispatch("delVisitedViews", { path: "/account/userEdit" });
    }
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .info-footer {
    margin-left: 120px;
    padding: 50px 0;
    // text-align: center;
  }
  .news-top-item {
    margin-bottom: 25px;
  }
  .news-top-item > span {
    display: inline-block;
    width: 50px;
    text-align: right;
  }
  .news-top-item > label {
    margin-left: 20px;
  }
  .service-setting {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .el-tag + .el-tag {
    margin-right: 10px;
  }
  .button-new-tag {
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-right: 10px;
    vertical-align: bottom;
  }
  .info-title {
    padding: 10px;
    margin-bottom: 30px;
    font-size: 16px;
    color: #1890ff;
    border-bottom: 5px solid rgb(247, 246, 252);
  }
  .avatar-uploader,
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 178px;
    width: 178px;
    overflow: hidden;
  }
  .avatar-uploader,
  .el-upload:hover {
    border-color: #409eff;
  }
  .el-upload,
  .el-upload--text {
    border: 1px dashed #d9d9d9 !important;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
