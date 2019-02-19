<template>
  <!-- :style="{background:dataArr.theme_color||'#2B3948'}" -->
  <div class="main-theme">
    <!-- <div class="main-theme" :style="{background:dataArr.theme_bg?'url(' +dataArr.theme_bg  + ')':dataArr.theme_color||'#2B3948'}"> -->
    <div class="panel-group clearfix">
      <!-- 内容部分 -->

      <div class="main-left">

        <div class="main-hander-title" :style="{ backgroundColor:' #39bcf3',color:'#fff' }">
          {{dataArr.form_name}}
        </div>
        <el-scrollbar style="height:70vh;">

          <!-- 表头 -->
          <div :class="[!isShow?'main-header ':'main-header d-choose-active']" @click="handleHeader(dataArr.form_header)">
            <img :src="dataArr.form_header.bg" width="100%" alt="">
            <div :class="[dataArr.form_header.text_align==1?'main-tem-one main-tem-left':dataArr.form_header.text_align==2?'main-tem-one main-tem-center':dataArr.form_header.text_align==3?'main-tem-one main-tem-right':dataArr.form_header.text_align==5?'main-tem-one main-tem-top':dataArr.form_header.text_align==8?'main-tem-one main-tem-bottom':dataArr.form_header.text_align==4?'main-tem-one main-tem-topleft':dataArr.form_header.text_align==6?'main-tem-one main-tem-topright':dataArr.form_header.text_align==7?'main-tem-one main-tem-bottomleft':dataArr.form_header.text_align==9?'main-tem-one main-tem-bottomright':'']">
              <div :style="{color:dataArr.form_header.title_color }"> {{dataArr.form_header.title}}</div>
              <div class="main-tem-one-desc word_wrap" :style="{color:dataArr.form_header.desc_color  }"> {{dataArr.form_header.desc}}</div>
            </div>
          </div>
          <!-- <input type="text" id="suggestId" name="address_detail" placeholder="点击地图获取地址" class="input_style"> -->
          <!-- <div id="mainMap" style="width:100%;height:300px;">啊啊啊</div> -->

          <!-- 中间组件 -->
          <div v-for="(dataObject, index) in dataArr.builder_tr" :key="index">
            <!-- <div v-if="dataObject.list[0].builder_id=='3000004'" class='main0'>aaaa</div> -->
            <div style="padding:0px 10px">
              <div v-if="dataObject.tr==0">

                <!-- 基础类组件    -->
                <!--1000001 文本框 1000002	选择  1000003	下拉  1000004	多级下拉 1000005	日期时间  1000006	数字  1000007	附件  1000008	评分  1000009	矩阵  1000010	排序  1000011	货币  1000012	城市  1000013	商品  1000014	按钮  -->
                <!-- 1000001 文本框 -->
                <div v-if="dataObject.list[0].builder_id=='1000001' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <!-- {{dataObject.list[0].builder_id,formBuilderId}} -->
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div :class="[dataObject.list[0].builder_params.input_type==1?'d-input':'d-textarea']">{{dataObject.list[0].builder_params.placeholder}}</div>
                </div>
                <!-- 1000002 选择 (单选多选下拉) -->
                <div v-if="dataObject.list[0].builder_id=='1000002' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span>
                  <span v-if="dataObject.list[0].builder_params.select_type==2">(请选择{{dataObject.list[0].builder_params.select_limit[0]}}-{{dataObject.list[0].builder_params.select_limit[1]}}项)</span>
                  <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div v-if="dataObject.list[0].builder_params.select_type!=3">
                    <div v-for="(item,index)  in  dataObject.list[0].builder_params.item" :key="index" style="display:flex;align-items: center; padding: 8px 0;">
                      <div class="d-choose-title" :style="{borderRadius:dataObject.list[0].builder_params.select_type==1?'50%':'0%'}"></div>
                      <div style="margin-left:5px;font-size:15px">{{item}}</div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="d-choose-select">
                      <p>{{dataObject.list[0].builder_params.placeholder}}</p>
                      <i class="el-icon-arrow-down"></i>
                    </div>
                  </div>
                </div>
                <!-- 1000003  (下拉) -->
                <div v-if="dataObject.list[0].builder_id=='1000003' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <div v-if="dataObject.list[0].builder_params.select_type!=3">
                    <div v-for="(item,index)  in  dataObject.list[0].builder_params.item" :key="index" style="display:flex;align-items: center; padding: 8px 0;">
                      <div class="d-choose-title" :style="{borderRadius:dataObject.list[0].builder_params.select_type==1?'50%':'0%'}"></div>
                      <div style="margin-left:5px;font-size:15px">{{item}}</div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="d-choose-select">
                      <p>{{dataObject.list[0].builder_params.placeholder}}</p>
                      <i class="el-icon-arrow-down"></i>
                    </div>
                  </div>
                </div>
                <!-- 1000004  (多级下拉) -->
                <div v-if="dataObject.list[0].builder_id=='1000004' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <div class="d-more-select">

                    <div class="d-choose-select d-select-left" v-if="dataObject.list[0].builder_params.select_level>=1">
                      <p>{{dataObject.list[0].builder_params.placeholder}}</p>
                      <i class="el-icon-arrow-down"></i>
                    </div>
                    <div class="d-choose-select d-select-left" v-if="dataObject.list[0].builder_params.select_level>=2">
                      <p>{{dataObject.list[0].builder_params.placeholder}}</p>
                      <i class="el-icon-arrow-down"></i>
                    </div>
                    <div class="d-choose-select d-select-left" v-if="dataObject.list[0].builder_params.select_level>=3">
                      <p>{{dataObject.list[0].builder_params.placeholder}}</p>
                      <i class="el-icon-arrow-down"></i>
                    </div>
                    <div class="d-choose-select d-select-left" v-if="dataObject.list[0].builder_params.select_level>=4">
                      <p>{{dataObject.list[0].builder_params.placeholder}}</p>
                      <i class="el-icon-arrow-down"></i>
                    </div>
                  </div>
                </div>

                <!-- 日期组件 -->
                <div v-if="dataObject.list[0].builder_id=='1000005' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div class="d-input">{{dataObject.list[0].builder_params.placeholder}}</div>
                </div>
                <!-- 1000006 数字 -->
                <div v-if="dataObject.list[0].builder_id=='1000006' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <!-- {{dataObject.list[0].builder_id,formBuilderId}} -->
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div>
                    <div class="d-input" style="display:flex;align-items:center;font-size:14px;justify-content: space-between">
                      <span style="width:50%;">{{dataObject.list[0].builder_params.placeholder}}</span>
                      <span style="width:50%;text-align:right" class="word_wrap">{{dataObject.list[0].builder_params.unit}}</span>
                    </div>
                    <!-- <div style="width:20%"></div> -->
                  </div>

                </div>
                <!-- 附件组件 -->
                <div v-if="dataObject.list[0].builder_id=='1000007' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div class="d-input">{{ dataObject.list[0].builder_params.allow_file_size==0?'上传文件（无限制）':`上传文件 （需小于${dataObject.list[0].builder_params.allow_file_size}M）`}}</div>
                </div>
                <!-- 1000008 评分 -->
                <div v-if="dataObject.list[0].builder_id=='1000008' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div class="d-rate">
                    <i class="el-icon-star-on"></i>
                    <i class="el-icon-star-on"></i>
                    <i class="el-icon-star-on"></i>
                    <i class="el-icon-star-on"></i>
                    <i class="el-icon-star-on"></i>
                  </div>
                  <div class="d-rate-agree">
                    <span>不满意</span>
                    <span>满意</span>
                  </div>
                </div>
                <!-- 货币组件 -->
                <div v-if="dataObject.list[0].builder_id=='1000011'" :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <article class="d-input">{{dataObject.list[0].builder_params.mony_type==1?'￥':'$'}}{{dataObject.list[0].builder_params.placeholder}}</article>
                  <div></div>
                </div>

                <!-- 联系人组件    -->
                <!-- 4000001	姓名  4000002	手机   4000003	邮箱   4000004	公司  4000005	部门  4000006	职位  4000007	头像   4000008	称谓  4000009	性别  4000010	生日  4000011	所在地  4000012	地址  4000013	网址  4000014	座机  4000015	传真 -->
                <!-- 姓名组件 -->
                <div v-if="dataObject.list[0].builder_id=='4000001'" :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <article class="d-input">{{dataObject.list[0].builder_params.placeholder}}</article>
                  <div></div>
                </div>
                <div v-if="dataObject.list[0].builder_id=='4000002'" :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div class="d-input">{{dataObject.list[0].builder_params.placeholder}}</div>
                </div>
                <!-- 邮箱 -->
                <div v-if="dataObject.list[0].builder_id=='4000003' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div class="d-input">{{dataObject.list[0].builder_params.placeholder}}</div>
                </div>
                <!-- 公司 -->
                <div v-if="dataObject.list[0].builder_id=='4000004' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <!-- {{dataObject.list[0].builder_id,formBuilderId}} -->
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div :class="[dataObject.list[0].builder_params.input_type==1?'d-input':'d-textarea']">{{dataObject.list[0].builder_params.placeholder}}</div>
                </div>

                <!-- 部门 -->
                <div v-if="dataObject.list[0].builder_id=='4000005' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div class="d-input">{{dataObject.list[0].builder_params.placeholder}}</div>
                </div>
                <!-- 职位 -->
                <div v-if="dataObject.list[0].builder_id=='4000006' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div class="d-input">{{dataObject.list[0].builder_params.placeholder}}</div>
                </div>
                <!-- 性别 -->
                <div v-if="dataObject.list[0].builder_id=='4000009' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <div style="display:flex;align-items: center;">
                    <div v-for="(item,index)  in  dataObject.list[0].builder_params.item_list" :key="index" class="d-sex">
                      <div class="d-choose-title" :style="{borderRadius:'50%'}"></div>
                      <div style="margin-left:5px;font-size:15px">{{item.desc}}</div>
                    </div>
                  </div>

                </div>
                <!-- 图片类组件 2000001	图片选择  2000002	图片上传  2000003	图片展示  2000004	图片轮播 -->
                <!-- 图片类组件 2000001 -->
                <div v-if="dataObject.list[0].builder_id=='2000001' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span>
                  <span v-if="dataObject.list[0].builder_params.select_type==2">(请选择{{dataObject.list[0].builder_params.select_limit[0]}}-{{dataObject.list[0].builder_params.select_limit[1]}}项)</span>
                  <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div v-if="dataObject.list[0].builder_params.item" class="d-select-img">
                    <div v-for="(item,index) in dataObject.list[0].builder_params.item" :key="index">
                      <div class="d-img-bg-box" :style="{backgroundImage: 'url(' + item.images + ')'}" v-if="item.images">
                      </div>
                      <div v-else class="d-img-bg-box d-img-center">
                        <!-- <i class="xiao-icon-zanwutupian"></i> -->
                        <img src="https://img.sqydt.darongshutech.com/token_file_201811070921432268.jpg" width="30px" style="margin-top:23px" alt="">
                      </div>
                      <div class="d-select-img-desc">
                        <div class="d-choose-title" :style="{borderRadius:dataObject.list[0].builder_params.select_type==1?'50%':'0%'}"></div>
                        <div style="margin-left:5px;font-size:15px" class="word_wrap">{{item.name}}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 2000002  图片上传-->
                <div v-if="dataObject.list[0].builder_id=='2000002' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div class="d-upload">
                    <i class="el-icon-upload"></i>
                    <div>点击选择图片</div>
                    <div>（文件需小于500M）</div>
                  </div>
                </div>
                <!--2000003 图片展示 -->
                <div v-if="dataObject.list[0].builder_id=='2000003' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                  <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                  <div v-for="(item,index) in dataObject.list[0].builder_params.item" :key="index">
                    <img :src="item" width="100%" alt="">
                  </div>
                </div>

                <!-- 辅助类组件 -->
                <!-- 3000001	文本描述   3000002	分割线  3000003	分页   3000004	静态地图  3000005	视频播放 -->
                <!-- 3000001 文本描述 -->
                <div v-if="dataObject.list[0].builder_id=='3000001' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <div class="word_wrap " style="margin-bottom:5px" v-html="dataObject.list[0].builder_params.title" :style="{textAlign:dataObject.list[0].builder_params.title_align==1?'left':dataObject.list[0].builder_params.title_align==2?'center':'right',color:dataObject.list[0].builder_params.title_color}"></div>
                  <p class="word_wrap d-desc" v-html="dataObject.list[0].builder_params.desc" :style="{textAlign:dataObject.list[0].builder_params.desc_align==1?'left':dataObject.list[0].builder_params.desc_align==2?'center':'right',color:dataObject.list[0].builder_params.desc_color}"></p>
                </div>
                <!--  3000002	分割线 -->
                <div v-if="dataObject.list[0].builder_id=='3000002' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <div class="word_wrap " v-html="dataObject.list[0].builder_params.title" :style="{textAlign:dataObject.list[0].builder_params.title_align==1?'left':dataObject.list[0].builder_params.title_align==2?'center':'right',color:dataObject.list[0].builder_params.title_color,lineHeight:'23px'}"></div>
                  <hr class="main-hr" :style="{borderStyle:dataObject.list[0].builder_params.hr_type==1?'dotted':dataObject.list[0].builder_params.hr_type==2?'dashed':dataObject.list[0].builder_params.hr_type==3?'':'double',borderTopWidth:dataObject.list[0].builder_params.hr_type==4?'3px':''}" />
                  <p class="word_wrap d-desc" v-html="dataObject.list[0].builder_params.desc" :style="{textAlign:dataObject.list[0].builder_params.desc_align==1?'left':dataObject.list[0].builder_params.desc_align==2?'center':'right',color:dataObject.list[0].builder_params.desc_color,lineHeight:'23px'}"></p>
                </div>

                <!--  3000004	静态地图 -->
                <div v-if="dataObject.list[0].builder_id=='3000004' " :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
                  <img :class="[dataObject.list[0].form_builder_id==formBuilderId ?'d-delete-icon d-delete-active':'d-delete-icon']" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
                  <div id="mainMap" class="mainMap" style="width:100%;height:300px;" v-if="dataObject.list[0].builder_id=='3000004' ">啊啊啊</div>
                </div>

              </div>

              <!-- <div v-if="dataObject.tr==1">
           


            </div> -->
            </div>
          </div>
          <!-- 表尾 -->
          <div :class="[!isShowFooter?'main-footer d-wrapper':'main-footer d-wrapper d-choose-active']" @click="handleFooter(dataArr.form_submit)">
            <div style="background-color:#39bcf3">
              {{dataArr.form_submit.title}}
            </div>
          </div>

        </el-scrollbar>
        <!-- <Contact :data="item" v-for="(item, index) in dataArr.builder_tr" :tr="item.tr" :index='index' :key="index" @handleBg="handleBg" @handleDelete="handleDelete"></Contact> -->
      </div>
      <div class="main-right">

        <div class="main-rigth-bg">

          <el-collapse v-model="activeName">
            <!-- <el-collapse-item title="设置/外观" name="1">
              <div class="main-content">
                <p class="main-title-name"> 外观样式：</p>
                <div style="height:130px;padding: 0 5px 8px;">
                  <el-tabs value="first">
                    <el-tab-pane style="height:120px;overflow-x:hide;overflow-y:auto;" label="主题颜色" name="first">
                      <checkCard ref="themeColor" :id="'themeColor'" @change="changeTheme" :showType="1" :row="6" :dataKey="{desc: '',value:'theme_color'}" :iconSize="40" :padTop="0" :componentColor="'#fff'" :itemColor="'#fbfbfb'" :padding="5" :checkArrP="checkThemeColor"></checkCard>
                    </el-tab-pane>
                    <el-tab-pane style="height:245px;overflow-x:hide;overflow-y:auto;" label="主题背景" name="second">
                      <checkCard ref="themeImg" :id="'themeImg'" @change="changeTheme" :row="2" :dataKey="{desc: '',value:'theme_bg'}" :iconSize="106" :space="3" :padTop="0" :componentColor="'#fff'" :itemColor="'#fbfbfb'" :padding="5" :checkArrP="checkThemeImg"></checkCard>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </el-collapse-item> -->
            <el-collapse-item title="表单" name="2">
              <div class="main-content">
                <p class="main-title-name"> 表单名：</p>
                <input type="text" v-model="dataArr.form_name" maxlength="8" class="main-input">
                <p class="main-title-name"> 置顶/关注 ：</p>
                <div class="main-title-name">
                  <el-checkbox v-model="dataArr.is_top" :true-label='1' :false-label="2">是否置顶</el-checkbox>
                  <el-checkbox v-model="dataArr.is_focus" :true-label='1' :false-label="2">是否关注</el-checkbox>
                </div>

              </div>
            </el-collapse-item>
          </el-collapse>

          <!-- 表头 -->
          <div v-if="isShow==true && !isShowFooter&&!isContentShow" style="padding-bottom:30px;">
            <div class="main-title">表头</div>
            <div class="main-content">
              <p class="main-title-name">标题：</p>
              <input type="text" v-model="builderHeader.title" class="main-input">
              <!-- <div-model :value="builderHeader.title" @inputChangeText="inputChangeText"></div-model> -->
              <p class="main-title-name">描述：</p>
              <input type="text" v-model="builderHeader.desc" class="main-input">
              <p class="main-title-name">对齐方式：</p>
              <div>
                <ul class="main-align-ul">
                  <li v-for="(item,index) in  alignData" :key="index" :class="builderHeader.text_align==item.id?' bgColor':false" @click="tabAlign(item.id)" style="width:44px">{{item.name}}</li>
                </ul>
              </div>
              <p class="main-title-name">表头背景图：</p>

              <div>
                <!-- <upload @handleSuccess="handleSuccess" :image-url="builderHeader.bg">
                  <img v-if="builderHeader.bg" :src="builderHeader.bg" alt="" class="avatar">
                  <div slot="suggestion" style="font-size:12px;">建议上传750*420，仅支持上传：".png", ".jpg", ".jpeg"等格式文件)，且不超过2MB</div>
                </upload> -->
                <uploadFile class="uploadClick" @change="handleChange" :acceptString="'.png,.jpg,.jpeg'" :maxSize="5">
                  <el-button plain size="mini" v-if="!builderHeader.bg" icon="el-icon-upload">上传背景图</el-button>
                  <img style="width:100%" class="ellipsos " :src="builderHeader.bg" v-else />
                </uploadFile>
                <div style="font-size:12px;color:#848484">建议上传750*420，仅支持上传：".png", ".jpg", ".jpeg"等格式文件)，且不超过5MB</div>
                <!-- <img :src="builderHeader.bg" width="100%" alt=""> -->
              </div>

              <!-- <div-model :value="dataArr.form_header.desc" @inputChangeText="inputChangeTextDesc"></div-model> -->
            </div>
          </div>
          <!-- <div>{{builderHeader.isShow}}</div>
          <div>{{builderFooter.isShowFooter,'-----------'}}</div> -->

          <div v-show="!isShow&&!isShowFooter&& isContentShow==true">
            <!-- <el-scrollbar style="width:100%;height:30vh;"> -->
            <!-- 基础类组件    -->
            <!--1000001 文本框 1000002	选择  1000003	下拉  1000004	多级下拉 1000005	日期时间  1000006	数字  1000007	附件  1000008	评分  1000009	矩阵  1000010	排序  1000011	货币  1000012	城市  1000013	商品  1000014	按钮  -->
            <div v-if="builder.builder_id==1000001  ">
              <div class="main-title">文本框</div>
              <div class="main-content">
                <p class="main-title-name">切换组件类型：
                  <span class="main-time">
                    <el-select v-model="builder.builder_params.input_type" placeholder="请选择">
                      <el-option :key="1" label="单行文本" :value="1"></el-option>
                      <el-option :key="2" label="多行文本" :value="2"></el-option>
                    </el-select>
                  </span>
                </p>
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc || ' '" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <p class="main-title-name">描述：</p>
                <input type="text" v-model="builder.builder_params.desc" class="main-input">
                <p class="main-title-name">提示文字：</p>
                <!-- <div-model :value="builder.builder_params.placeholder" @inputChangeText="inputChangeTextPalce"></div-model> -->
                <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
              </div>
            </div>
            <!-- 1000002 （多选、单选、下拉）-->
            <div v-if="builder.builder_id==1000002  ">
              <div class="main-title">{{{1:'单选',2:'多选',3:'下拉'}[builder.builder_params.select_type]}}</div>

              <div class="main-content">
                <p class="main-title-name">切换组件类型：
                  <span class="main-time">
                    <el-select v-model="builder.builder_params.select_type" placeholder="请选择">
                      <el-option :key="1" label="单选" :value="1"></el-option>
                      <el-option :key="2" label="多选" :value="2"></el-option>
                      <el-option :key="3" label="下拉" :value="3"></el-option>
                    </el-select>
                  </span>
                </p>
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <p class="main-title-name">描述：</p>
                <input type="text" v-model="builder.builder_params.desc" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc || ' '" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <span v-if="builder.builder_params.select_type==3">
                  <p class="main-title-name">提示文字：</p>
                  <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                </span>
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
                <div v-if="builder.builder_params.select_type==2">
                  <div class="main-title-name">
                    多选限制：
                    <el-select style="width:80px" size="mini" @change="handleLimitMax" v-model="builder.builder_params.select_limit[0]" placeholder="至少选几项">
                      <el-option v-for="(item3,index3) in builder.builder_params.item.length" :key="index3+1" :value="index3+1" :label="index3+1">
                      </el-option>
                    </el-select> 项~
                    <el-select style="width:80px" size="mini" v-model="builder.builder_params.select_limit[1]" placeholder="最多选几项">
                      <el-option v-for="(item4,index4) in builder.builder_params.item.length" :key="index4+1" :disabled="index4 < +builder.builder_params.select_limit[0]-1" :value="index4+1" :label="index4+1">
                      </el-option>
                    </el-select>
                    项
                  </div>
                </div>
                <el-scrollbar style="height:30vh">
                  <p class="main-title-name">选项内容：</p>
                  <div v-for=" (item,index) in  builder.builder_params.item" :key="index" class="main-choose-content">
                    <input type="text" v-model="builder.builder_params.item[index]" class="main-input main-input-top">
                    <img src="../../../../static/images/deleteIcon.png" width="20" class="main-choose-img" @click="handleSelectDelete(index)" alt="">
                  </div>
                  <el-button style="width:100%;margin-top:10px" icon="el-icon-plus" @click="handleSelectAdd()">添加选项</el-button>
                </el-scrollbar>

              </div>

            </div>

            <div v-if="builder.builder_id==1000003  ">
              <div class="main-title">下拉</div>
              <el-scrollbar style="height:43vh">
                <div class="main-content">
                  <p class="main-title-name">标题：</p>
                  <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                  <input type="text" v-model="builder.builder_params.title" class="main-input">
                  <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc || ' '" @inputChangeText="inputChangeTextDesc"></div-model> -->
                  <span v-if="builder.builder_params.select_type==3">
                    <p class="main-title-name">提示文字：</p>
                    <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                  </span>
                  <div class="main-title-name">
                    <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                  </div>
                  <p class="main-title-name">选项内容：</p>
                  <div v-for=" (item,index) in  builder.builder_params.item" :key="index" class="main-choose-content">
                    <input type="text" v-model="builder.builder_params.item[index]" class="main-input main-input-top">
                    <img src="../../../../static/images/deleteIcon.png" width="20" class="main-choose-img" @click="handleSelectDelete(index)" alt="">
                  </div>
                  <el-button style="width:100%;margin-top:10px" icon="el-icon-plus" @click="handleSelectAdd()">添加选项</el-button>
                </div>
              </el-scrollbar>
            </div>
            <div v-if="builder.builder_id==1000004  ">
              <div class="main-title">多级下拉</div>

              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc || ' '" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <span v-if="builder.builder_params.select_type==3">
                  <p class="main-title-name">提示文字：</p>
                  <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                </span>
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
                <div class="main-tab">
                  <div class="">
                    <div :class="[selectTabActive==index?'main-tab-title main-tab-active':'main-tab-title']" v-for="(item,index) in selectTab" :key="index" @click="handleSelectTab(index)">{{item+' 级'}}</div>
                  </div>
                  <!-- <div style="margin-right:10px">
                    <el-button type="text" size="mini"> <span style="border:1px  solid"><i class="el-icon-minus"></i></span></el-button>
                    <el-button disabled="" type="text" size="mini"><span style="border:1px  solid"><i class="el-icon-plus"></i></span></el-button>
                  </div> -->
                </div>
                <el-scrollbar style="height:30vh">
                  <div v-if="selectTabActive==0">
                    <p class="main-title-name" style="margin-top:10px">选项内容：</p>
                    <div v-for=" (item,index) in  builder.builder_params.select_params" :key="index" class="main-choose-content">
                      <input type="text" v-model="builder.builder_params.select_params[index].v" class="main-input main-input-top">
                      <img src="../../../../static/images/deleteIcon.png" width="20" class="main-choose-img" @click="handleSelectMoreDelete(index,1)" alt="">
                    </div>
                    <el-button style="width:100%;margin-top:10px" icon="el-icon-plus" @click="handleSelectMoreAdd(1)">添加选项</el-button>
                  </div>
                  <div v-if="selectTabActive==1">
                    <p class="main-title-name" style="margin-top:10px">当一级选择：</p>
                    <el-select v-model="selectLevelOne" placeholder="请选择" @change="handleSelectMore">
                      <el-option v-for="item in builder.builder_params.select_params" :key="item.v" :label="item.v" :value="item.id">
                      </el-option>
                    </el-select>
                    <div v-if="selectLevelOne">
                      <p class="main-title-name" style="margin-top:10px">选项内容：</p>
                      <div v-for=" (item,index) in  builder.builder_params.select_params[selectLevelOneIndex].c" :key="index" class="main-choose-content">
                        <input type="text" v-model="builder.builder_params.select_params[selectLevelOneIndex].c[index].v" class="main-input main-input-top">
                        <img src="../../../../static/images/deleteIcon.png" width="20" class="main-choose-img" @click="handleSelectMoreDelete(index,2)" alt="">
                      </div>
                      <el-button style="width:100%;margin-top:10px" icon="el-icon-plus" @click="handleSelectMoreAdd(2)">添加选项</el-button>
                    </div>
                  </div>
                </el-scrollbar>
                <!-- <el-button style="width:100%;margin-top:10px" icon="el-icon-plus" @click="handleSelectAdd()">添加选项</el-button> -->
              </div>

            </div>
            <div v-if="builder.builder_id==1000005">
              <div class="main-title">时间</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc || ' '" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <p class="main-title-name">提示文字：</p>
                <!-- <div-model :value="builder.builder_params.placeholder" @inputChangeText="inputChangeTextPalce"></div-model> -->
                <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
                <p class="main-title-name">数据类型：
                  <span class="main-time">
                    <el-select v-model="builder.builder_params.date_format" placeholder="请选择">
                      <el-option :key="1" label="日期+时间" :value="1"></el-option>
                      <el-option :key="2" label="日期" :value="2"></el-option>
                      <el-option :key="3" label="时间" :value="3"></el-option>
                    </el-select>
                  </span>
                </p>
                <p class="main-title-name">日期限制：
                  <span class="main-time">
                    <el-select v-model="builder.builder_params.date_limit" placeholder="请选择">
                      <el-option :key="1" label="无限制" :value="0"></el-option>
                      <el-option :key="2" label="只能选择大于当前的日期" :value="1"></el-option>
                      <el-option :key="3" label="只能选择小于当前的日期" :value="2"></el-option>
                    </el-select>
                  </span>
                </p>
              </div>
            </div>
            <!--  数字 -->
            <div v-if="builder.builder_id==1000006 ">
              <div class="main-title">数字</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <p class="main-title-name">提示文字：</p>
                <!-- <div-model :value="builder.builder_params.placeholder" @inputChangeText="inputChangeTextPalce"></div-model> -->
                <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
                <div>
                  <p class="main-title-name">请输入右侧文字：</p>
                  <input type="text" class="main-input" v-model="builder.builder_params.unit">
                </div>
              </div>
            </div>
            <div v-if="builder.builder_id==1000007">
              <div class="main-title">附件</div>
              <div class="main-content">
                <!-- <p class="main-title-name">切换组件类型：
                  <span class="main-time">
                    <el-select v-model="builder.builder_params.input_type" placeholder="请选择">
                      <el-option :key="1" label="单行文本" :value="1"></el-option>
                      <el-option :key="2" label="多行文本" :value="2"></el-option>
                    </el-select>
                  </span>
                </p> -->
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc " @inputChangeText="inputChangeTextDesc"></div-model> -->
                <!-- <p class="main-title-name">提示文字：</p>
                <div-model :value="builder.builder_params.placeholder" @inputChangeText="inputChangeTextPalce"></div-model> -->
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.allow_file_size" :true-label='builder.builder_params.allow_file_size!=0?+builder.builder_params.allow_file_size:500' :false-label="0">限制上传文件大小</el-checkbox>
                  <div style="margin:10px 0" v-if="builder.builder_params.allow_file_size>0">
                    最大 <el-input v-model.number="builder.builder_params.allow_file_size" style="width:100px;text-align:center" :precision="0" @change="setViews(builder.builder_params.allow_file_size,$event)"></el-input> M
                  </div>
                </div>
              </div>
            </div>
            <div v-if="builder.builder_id==1000008  ">
              <div class="main-title">评分</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc || ' '" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <!-- <p class="main-title-name">提示文字：</p> -->
                <!-- <div-model :value="builder.builder_params.placeholder" @inputChangeText="inputChangeTextPalce"></div-model> -->
                <!-- <input type="text" v-model="builder.builder_params.placeholder" class="main-input"> -->
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
              </div>
            </div>
            <div v-if="builder.builder_id==1000011  ">
              <div class="main-title">货币</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <p class="main-title-name">提示文字：</p>
                <!-- 
                <div-model :value="builder.builder_params.desc || ' '" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <!-- <p class="main-title-name">提示文字：</p> -->
                <!-- <div-model :value="builder.builder_params.placeholder" @inputChangeText="inputChangeTextPalce"></div-model> -->
                <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                <p class="main-title-name">货币符号：
                  <span class="main-time">
                    <el-select v-model="builder.builder_params.mony_type" placeholder="请选择">
                      <el-option :key="1" label="￥人民币" value="1"></el-option>
                      <el-option :key="2" label="$美元" value="2"></el-option>
                    </el-select>
                  </span>
                </p>

                <!-- <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.allow_float_len" :true-label='builder.builder_params.allow_float_len!=0?+builder.builder_params.allow_float_len:2' :false-label="0">允许小数</el-checkbox>
                  <div style="margin:10px 0" v-if="builder.builder_params.allow_float_len>0">
                    保留N位小数 <el-input v-model.number="builder.builder_params.allow_float_len" style="width:100px;text-align:center" :precision="0" @change="setViewsCount(builder.builder_params.allow_float_len,$event)"></el-input>
                  </div>
                </div> -->
                <!-- <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.allow_float_len" :true-label='builder.builder_params.allow_float_len!=0?+builder.builder_params.allow_float_len:2' :false-label="0">允许小数</el-checkbox>
                  <div style="margin:10px 0" v-if="builder.builder_params.allow_float_len>0">
                    保留N位小数 <el-input v-model.number="builder.builder_params.allow_float_len" style="width:100px;text-align:center" :precision="0" @change="setViewsCount(builder.builder_params.allow_float_len,$event)"></el-input>
                  </div>
                </div> -->
                <span class="main-title-name">限定数值范围:</span>
                <el-input v-model="builder.builder_params.number_limit[0]" style="width:100px;text-align:center" :precision="0" @change="setViewsCountLimit(builder.builder_params.number_limit[0],$event)"></el-input> ~
                <el-input v-model="builder.builder_params.number_limit[1]" style="width:100px;text-align:center" :precision="0" @change="setViewsCountLimitLast(builder.builder_params.number_limit[1],$event)"></el-input>
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
                <!-- <div>
                  <p class="main-title-name">关联显示：</p>
                  <el-checkbox v-model="builder.builder_params.display_when.display_default" :true-label='2' :false-label="1">是否显示关联</el-checkbox>
                  <div class="main-title-name" v-if="builder.builder_params.display_when.display_default==2">
                    <p class="main-title-name">关联组件：</p>
                    <el-select v-model="builder.builder_params.display_when.targetVal" @change="handleRelation" placeholder="请选择关联" style="width:400px">
                      <el-option :key="index" :label="item.builder_params.title" :value="item.form_builder_id" v-for="(item,index)  in relationData"></el-option>
                    </el-select>
                    <p class="main-title-name">选择关联值：</p>
                    <el-select v-model="builder.builder_params.display_when.value" placeholder="请选择关联值" style="width:400px">
                      <el-option :key="index" :label="item" :value="index+1" v-for="(item,index)  in targetData"></el-option>
                    </el-select>
                  </div>
                </div> -->

              </div>
            </div>
            <!-- 联系人组件    -->
            <!-- 4000001	姓名  4000002	手机   4000003	邮箱   4000004	公司  4000005	部门  4000006	职位  4000007	头像   4000008	称谓  4000009	性别  4000010	生日  4000011	所在地  4000012	地址  4000013	网址  4000014	座机  4000015	传真 -->
            <div v-if="builder.builder_id==4000001 ">
              <div class="main-title">姓名</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <p class="main-title-name">提示文字：</p>
                <!-- <div-model :value="builder.builder_params.placeholder" @inputChangeText="inputChangeTextPalce"></div-model> -->
                <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
              </div>
            </div>
            <div v-if="builder.builder_id==4000002">
              <div class="main-title">手机</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <p class="main-title-name">提示文字：</p>
                <!-- <div-model :value="builder.builder_params.placeholder" @inputChangeText="inputChangeTextPalce"></div-model> -->
                <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
              </div>
            </div>

            <div v-if="builder.builder_id== 4000003 ">
              <div class="main-title">邮箱</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <p class="main-title-name">提示文字：</p>
                <!-- <div-model :value="builder.builder_params.placeholder " @inputChangeText="inputChangeTextPalce"></div-model> -->
                <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
              </div>
            </div>
            <div v-if="builder.builder_id==4000004  ">
              <div class="main-title">公司</div>
              <div class="main-content">
                <p class="main-title-name">切换组件类型：
                  <span class="main-time">
                    <el-select v-model="builder.builder_params.input_type" placeholder="请选择">
                      <el-option :key="1" label="单行文本" :value="1"></el-option>
                      <el-option :key="2" label="多行文本" :value="2"></el-option>
                    </el-select>
                  </span>
                </p>
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc || ' '" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <!-- <p class="main-title-name">描述：</p>
                <input type="text" v-model="builder.builder_params.desc" class="main-input"> -->

                <p class="main-title-name">提示文字：</p>
                <!-- <div-model :value="builder.builder_params.placeholder" @inputChangeText="inputChangeTextPalce"></div-model> -->
                <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
              </div>
            </div>
            <div v-if="builder.builder_id==4000005">
              <div class="main-title">部门</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <p class="main-title-name">提示文字：</p>
                <!-- <div-model :value="builder.builder_params.placeholder " @inputChangeText="inputChangeTextPalce"></div-model> -->
                <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
              </div>
            </div>
            <div v-if="builder.builder_id==4000006">
              <div class="main-title">职位</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <p class="main-title-name">提示文字：</p>
                <!-- <div-model :value="builder.builder_params.placeholder " @inputChangeText="inputChangeTextPalce"></div-model> -->
                <input type="text" v-model="builder.builder_params.placeholder" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
              </div>
            </div>
            <div v-if="builder.builder_id==4000007">头像</div>
            <div v-if="builder.builder_id==4000008">称谓</div>
            <div v-if="builder.builder_id==4000009">
              <div class="main-title">性别</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
                <p class="main-title-name">选项内容：</p>
                <div v-for=" (item,index) in  builder.builder_params.item_list" :key="index" class="main-choose-content">
                  <input type="text" v-model="builder.builder_params.item_list[index].desc" class="main-input main-input-top">
                  <img src="../../../../static/images/deleteIcon.png" width="20" class="main-choose-img" @click="handleSexDelete(index)" alt="">
                </div>
                <el-button style="width:100%;margin-top:10px" icon="el-icon-plus" @click="handleSexAdd()" :disabled="builder.builder_params.item_list.length==3">添加选项</el-button>
              </div>
            </div>
            <div v-if="builder.builder_id==4000010">生日</div>
            <div v-if="builder.builder_id==4000011">所在地</div>
            <div v-if="builder.builder_id==4000012">地址</div>
            <div v-if="builder.builder_id==4000013">网址</div>
            <div v-if="builder.builder_id==4000014">座机</div>
            <div v-if="builder.builder_id==4000015">传真</div>

            <!--图片类组件 -->
            <!-- 2000001	图片选择 2000002	图片上传 2000003	图片展示 2000004	图片轮播 -->
            <div v-if="builder.builder_id==2000001">
              <div class="main-title">图片选择</div>

              <div class="main-content">
                <p class="main-title-name">切换组件类型：
                  <span class="main-time">
                    <el-select v-model="builder.builder_params.select_type" placeholder="请选择">
                      <el-option :key="1" label="图片单选" :value="1"></el-option>
                      <el-option :key="2" label="图片多选" :value="2"></el-option>
                    </el-select>
                  </span>
                </p>
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc || ' '" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <p class="main-title-name">描述：</p>
                <input type="text" v-model="builder.builder_params.desc" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
                <div v-if="builder.builder_params.select_type==2">
                  <div class="main-title-name">
                    多选限制：
                    <el-select style="width:80px" size="mini" @change="handleLimitMax" v-model="builder.builder_params.select_limit[0]" placeholder="至少选几项">
                      <el-option v-for="(item3,index3) in builder.builder_params.item.length" :key="index3+1" :value="index3+1" :label="index3+1">
                      </el-option>
                    </el-select> 项~
                    <el-select style="width:80px" size="mini" v-model="builder.builder_params.select_limit[1]" placeholder="最多选几项">
                      <el-option v-for="(item4,index4) in builder.builder_params.item.length" :key="index4+1" :disabled="index4 <1 +builder.builder_params.select_limit[0]-1" :value="index4+1" :label="index4+1">
                      </el-option>
                    </el-select>
                    项
                  </div>
                </div>
                <el-scrollbar style="height:30vh">
                  <p class="main-title-name">选项内容：</p>
                  <div v-if="builder.builder_params.item.length!=0">
                    <div v-for=" (item,index) in  builder.builder_params.item" :key="index" class="main-select-img">
                      <div style="width:90%;padding-left:10px;" class="main-select-img-content">
                        <!-- <img :src="builder.builder_params.item[index].images" alt=""> -->
                        <uploadFile class="uploadClick avatar-uploader" @change="handleChangeSelectImg" :uploadSelf="false" :maxSize="5" :paramsObj="{indexs:index}">
                          <el-button v-if="!builder.builder_params.item[index].images" plain size="mini" icon="el-icon-picture">上传图片</el-button>
                          <div v-if="builder.builder_params.item[index].images" class="img-bg-box" :style="{backgroundImage: 'url(' + builder.builder_params.item[index].images + ')'}">
                          </div>
                        </uploadFile>
                        <input type="text" id="suggestId" name="address_detail" placeholder="请输入选项内容" v-model="builder.builder_params.item[index].name" class="main-input" style="margin-top:10px">
                      </div>
                      <img src="../../../../static/images/deleteIcon.png" width="20" class="main-choose-img" @click="handleSelectImgDelete(index)" alt="">
                    </div>
                  </div>
                  <el-button style="width:100%;margin-top:10px" icon="el-icon-plus" @click="handleSelectImgAdd()">添加选项</el-button>
                </el-scrollbar>

              </div>
            </div>
            <div v-if="builder.builder_id==2000002  ">
              <div class="main-title">图片上传</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc || ' '" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <p class="main-title-name">描述：</p>
                <input type="text" v-model="builder.builder_params.desc" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
              </div>
            </div>
            <div v-if="builder.builder_id==2000003">
              <div class="main-title">图片展示</div>

              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <!-- <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model> -->
                <input type="text" v-model="builder.builder_params.title" class="main-input">
                <!-- <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc || ' '" @inputChangeText="inputChangeTextDesc"></div-model> -->
                <p class="main-title-name">描述：</p>
                <input type="text" v-model="builder.builder_params.desc" class="main-input">
                <div class="main-title-name">
                  <el-checkbox v-model="builder.builder_params.is_required" :true-label='1' :false-label="2">这个是必填项</el-checkbox>
                </div>
                <el-scrollbar style="height:30vh">
                  <p class="main-title-name">选项内容：</p>
                  <div v-if="builder.builder_params.item.length!=0">
                    <div v-for=" (item,index) in  builder.builder_params.item" :key="index">
                      <div>
                        <!-- <img :src="builder.builder_params.item[index].images" alt=""> -->
                        <uploadFile class="uploadClick avatar-uploader" @change="handleChangeSelectImgShow" :uploadSelf="true" :maxSize="100" :paramsObj="{indexs:index}">
                          <el-button v-if="!builder.builder_params.item[index]" plain size="mini" icon="el-icon-picture">上传图片</el-button>
                          <!-- <div v-if="builder.builder_params.item[index]" :style="{backgroundImage: 'url(' + builder.builder_params.item[index] + ')'}"> </div>-->
                          <img :src="builder.builder_params.item[index]" width="100%" alt="" v-if="builder.builder_params.item[index]" />
                        </uploadFile>
                      </div>
                      <!-- <img src="../../../../static/images/deleteIcon.png" width="20" class="main-choose-img" @click="handleSelectImgDelete(index)" alt=""> -->
                    </div>
                    <div style="font-size:12px;color:#848484">建议上传750*420，仅支持上传：".png", ".jpg", ".jpeg"等格式文件)</div>
                  </div>
                  <!-- <el-button style="width:100%;margin-top:10px" icon="el-icon-plus" @click="handleSelectImgAdd()">添加选项</el-button> -->
                </el-scrollbar>
              </div>
            </div>
            <div v-if="builder.builder_id==2000004">图片轮播</div>

            <!-- 辅助类组件 -->
            <!-- 3000001	文本描述   3000002	分割线  3000003	分页   3000004	静态地图  3000005	视频播放 -->
            <div v-if="builder.builder_id==3000001">
              <div class="main-title">文本描述</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model>
                <!-- <input type="text" v-model="builder.builder_params.title" class="main-input"> -->
                <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc" @inputChangeText="inputChangeTextDesc"></div-model>
                <!-- <input type="text" v-model="builder.builder_params.desc" class="main-input"> -->

                <!-- <p class="main-title-name">提示文字：</p>
                <div-model :value="builder.builder_params.placeholder " @inputChangeText="inputChangeTextPalce"></div-model> -->
                <p class="main-title-name">标题对齐方式：</p>
                <div>
                  <ul class="main-align-ul">
                    <li v-for="(item,index) in  titleData" :key="index" :class="builder.builder_params.title_align==item.id?' bgColor':false" @click="titleAlign(item.id)" :title="item.name">{{item.name}}</li>
                  </ul>
                </div>
                <p class="main-title-name">描述对齐方式：</p>
                <div>
                  <ul class="main-align-ul">
                    <li v-for="(item,index) in  titleData" :key="index" :class="builder.builder_params.desc_align==item.id?' bgColor':false" @click="descAlign(item.id)" :title="item.name">{{item.name}}</li>
                  </ul>
                </div>
                <p class="main-title-name">标题颜色：</p>
                <el-color-picker v-model="builder.builder_params.title_color" @change="handleTilteColor"></el-color-picker>
                <p class="main-title-name">描述颜色：</p>
                <el-color-picker v-model="builder.builder_params.desc_color"></el-color-picker>
              </div>
            </div>
            <div v-if="builder.builder_id==3000002">
              <div class="main-title">分割线</div>
              <div class="main-content">
                <p class="main-title-name">标题：</p>
                <div-model :value="builder.builder_params.title" @inputChangeText="inputChangeText"></div-model>
                <!-- <input type="text" v-model="builder.builder_params.title" class="main-input"> -->
                <p class="main-title-name">描述：</p>
                <div-model :value="builder.builder_params.desc" @inputChangeText="inputChangeTextDesc"></div-model>
                <!-- <input type="text" v-model="builder.builder_params.desc" class="main-input"> -->

                <!-- <p class="main-title-name">提示文字：</p>
                <div-model :value="builder.builder_params.placeholder " @inputChangeText="inputChangeTextPalce"></div-model> -->
                <p class="main-title-name">分割线样式：</p>
                <div>
                  <ul class="main-align-ul">
                    <li v-for="(item,index) in  lineData" :key="index" :class="builder.builder_params.hr_type==item?' bgColor':false" @click="tabLine(item)" style="padding:8px 8px;width:60px;height:30px" :title="item==1?'点线':item==2?'虚线':item==3?'实线':'双实线'">
                      <hr class="main-hr" :style="{borderStyle:item==1?'dotted':item==2?'dashed':item==3?'':'double' ,borderColor:builder.builder_params.hr_type==item?'#fff':'#000',borderTopWidth:item==4?'3px':''}" />
                      <!-- {{item}} -->
                    </li>
                  </ul>
                </div>
                <p class="main-title-name">标题对齐方式：</p>
                <div>
                  <ul class="main-align-ul">
                    <li v-for="(item,index) in  titleData" :key="index" :class="builder.builder_params.title_align==item.id?' bgColor':false" @click="titleAlign(item.id)" :title="item.name">{{item.name}}</li>
                  </ul>
                </div>
                <p class="main-title-name">描述对齐方式：</p>
                <div>
                  <ul class="main-align-ul">
                    <li v-for="(item,index) in  descData" :key="index" :class="builder.builder_params.desc_align==item.id?' bgColor':false" @click="descAlign(item.id)" :title="item.name">{{item.name}}</li>
                  </ul>
                </div>
                <p class="main-title-name">标题颜色：</p>
                <el-color-picker v-model="builder.builder_params.title_color" @change="handleTilteColor"></el-color-picker>
                <p class="main-title-name">描述颜色：</p>
                <el-color-picker v-model="builder.builder_params.desc_color"></el-color-picker>
              </div>
            </div>
            <div v-if="builder.builder_id==3000003">分页</div>
            <div v-show="builder.builder_id==3000004">
              <div class="main-title">静态地图</div>
              <div class="main-content">
                <p class="main-title-name">位置搜索：</p>
                <input type="text" id="suggestId" name="address_detail" placeholder="搜索地理位置" v-model="mapTitle" class="main-input">
              </div>

            </div>
            <div v-if="builder.builder_id==3000005">视频播放</div>
            <!-- </el-scrollbar> -->
          </div>

          <!-- 表尾巴 -->
          <div v-if="!isShow &&!isContentShow&& isShowFooter==true">
            <div class="main-title">操作按钮</div>
            <div class="main-content">
              <p class="main-title-name">标题：</p>
              <input type="text" v-model="builderFooter.title" class="main-input">
            </div>
          </div>

          <!-- 发布按钮 -->
          <div style="background:#fff">
            <div class="main-title">发布</div>
            <div align="center">
              <el-button style="width:300px;margin:30px 0 20px  0" type="primary" @click="handleSubmit" :disabled="btnMark">提交发布</el-button>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!-- 图片剪裁 -->
    <!-- <el-dialog title="提示" :visible.sync="dialogVisible" width="750px">
      <div style="height:500px">
        <vueCropper ref="cropper" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="true" :full="option.full" :canMove="option.canMove" :fixedNumber="option.fixedNumber" :canMoveBox="option.canMoveBox" :fixedBox="option.fixedBox" :original="option.original" @realTime="realTime"></vueCropper>
      </div>
      <div>
        <label class="btn" for="uploads">upload</label>
        <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import Vue from "vue";
import FromRequst from "@/fetch/modules/formTemplate";
import { RequestThemeList } from "@/fetch/modules/service.js";

import Contact from "./contact";
import divModel from "./divComponent";
import checkCard from "@/components/checkCard";
// 自定义组件
import upload from "@/components/upload.vue";
import uploadFile from "@/components/uploadFile.vue";
import coordtransform from "coordtransform";

Vue.use(coordtransform);
//  图片剪裁组件
// import vueCropper from "vue-cropper";
export default {
  components: { divModel, Contact, checkCard, upload, uploadFile },
  data() {
    return {
      dataArr: {
        form_header: {
          bg: "",
          layout: 1, // 组件布局方式:1 上下布局 2左右布局
          text_align: 1, // 文字布局方式 1居左 2居中 3居右
          isShow: false
        },
        form_submit: {
          title: ""
        }
      },
      // "居左", "居中", "居右",'居上','居下'
      alignData: [{ id: 1, name: "居左" }, { id: 2, name: "居中" }, { id: 3, name: "居右" }, { id: 5, name: "居上" }, { id: 8, name: "居下" }, { id: 4, name: "左上角" }, { id: 6, name: "右上角" }, { id: 7, name: "左下角" }, { id: 9, name: "右下角" }],
      titleData: [{ id: 1, name: "居左" }, { id: 2, name: "居中" }, { id: 3, name: "居右" }],
      descData: [{ id: 1, name: "居左" }, { id: 2, name: "居中" }, { id: 3, name: "居右" }],
      lineData: [1, 2, 3, 4],
      selectTab: [],
      selectTabActive: 0,
      selectLevelOne: "", // 一级下拉值,
      selectLevelOneIndex: null, // 一级索引值
      showAlign: "",
      sexSave: {
        key: "",
        desc: ""
      },
      // 获取数组长度
      length: "",
      //  地图金纬度存放；
      userlocation: { lng: "", lat: "" }, // 地图存放
      mapTitle: "",
      builder: {
        builder_id: 1, // 组件ID
        builder_name: "姓名", // 组件名称
        builder_params: {
          // 组件配置
          type: 1, //类型 1-文本框；2-单选框；3-多选框；4-文件上传；5-所在地；6-地址
          title: "1", //标题
          desc: "1", //描述
          item_list: [], //选项列表 [[key:1,desc:先生],...]
          file_ext: [], //文件扩展后缀  [jpg,png,...]
          file_size: 5, //文件上传大小限制  MB
          is_required: 1, //1必填 2非必填
          submit_content_type: 1, //提交类型 1-string;2-json arr
          submit_content_keys: [], //提交的键 [province_region,city_region,...]
          other: [], //补充扩展
          submit_content: "", //提交的内容
          lng: "",
          lat: "",
          number_limit: [1, 1000],
          title_color: "",
          display_when: {
            display_default: 1,
            target: "",
            value: ""
          }
        }
      },
      relationData: [], // 关联
      targetData: [],
      builderHeader: {
        bg: "https://img.sqydt.darongshutech.com/image_201810121422371092.png",
        desc: "DAILY REPORT",
        layout: 1,
        text_align: 2,
        title: "工作日报",
        width: 100
      },
      builderFooter: {
        title: "",
        width: 100
      },
      // activeIndex: null,
      activeName: "2",
      checkThemeColor: [], // 颜色
      checkThemeImg: [], //  图片背景
      baseUrl: "https://img.sqydt.darongshutech.com/", //  基础地址
      isShowFooter: false, //  尾部字段赛选
      isShow: false, //    头部字段赛选
      isContentShow: false, //  内容部分赛选
      formBuilderId: "", //  form_build_id
      btnMark: false,
      // 图片剪裁
      dialogVisible: true,
      option: {
        img: "https://fengyuanchen.github.io/cropper/images/picture.jpg",
        size: 1,
        full: true,
        outputType: "png",
        canMove: true,
        fixedBox: true,
        original: true,
        canMoveBox: true,
        autoCropWidth: 300,
        autoCropHeight: 250,
        fixedNumber: [4, 3]
      },
      crap: false,
      previews: {},
      lists: [
        {
          img: "https://fengyuanchen.github.io/cropper/images/picture.jpg"
        },
        {
          img: "http://ofyaji162.bkt.clouddn.com/touxiang.jpg"
        }
      ]
    };
  },
  created() {
    this.getThemeList();
  },
  mounted() {
    //
    this.getData();
  },
  methods: {
    //  表单提交
    handleSubmit() {
      let _this = this;
      let _args = JSON.parse(JSON.stringify(this.dataArr));
      for (let i = 0; i < _args.builder_tr.length; i++) {
        if (_args.builder_tr[i].list[0].builder_id == 3000004) {
          if (this.userlocation.lng && this.userlocation.lat) {
            //百度经纬度坐标转国测局坐标
            let langLatArr = coordtransform.bd09togcj02(this.userlocation.lng, this.userlocation.lat);
            _args.builder_tr[i].list[0].builder_params.lat = langLatArr[1];
            _args.builder_tr[i].list[0].builder_params.lng = langLatArr[0];
            _args.builder_tr[i].list[0].builder_params.title = this.mapTitle;
          }
        }
      }
      // _args["form_name"] = _args.form_header.title;
      //  数组/对象转 json数据，去除null字段
      for (let i in _args) {
        typeof _args[i] == "object" ? (_args[i] = JSON.stringify(_args[i])) : "";
        _args[i] == null ? (_args[i] = "") : "";
      }
      _args["status"] = 1;

      this.btnMark = true;
      // console.log("_a", _args);
      // return false;
      FromRequst.RequesFromEditor(_args).then(res => {
        if (res.code == 2000) {
          this.btnMark = false;
          // FromRequst.RequestFormMiniPermanentQr({ form_id: this.$route.query.form_id }).then(success => {
          //   console.log(success);
          // });
          this.$message.success("操作成功");
          setTimeout(() => {
            _this.$router.push({
              path: "templateTool",
              query: { active: 1 }
              // params: {}
            });
            _this.$store.dispatch("delVisitedViews", {
              path: "/workDaily"
            });
          }, 1000);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 表单列表
    getData() {
      this.btnMark = true;
      let _this = this;
      FromRequst.RequesFromDetail({ form_id: this.$route.query.form_id || "512039742196416512" }).then(res => {
        this.btnMark = false;
        if (res) {
          try {
            res.form_header.isShow = false;
            // this.showAlign=

            // res.builder_tr.map((item, index) => {
            //   if (item.list[0].builder_id == 1000011) {
            //     let _u = item.list[0].builder_params.display_when;
            //     if (_u == undefined) {
            //       console.log("zzz");
            //       item.list[0].builder_params["display_when"] = {
            //         display_default: 1, // 默认显示设置 1显示 2不显示
            //         target: "", // 表单组件ID,【注意是form_builder_id】
            //         targetVal: "",
            //         value: "" // 当前组件等于该值的时候
            //       };
            //     } else {
            //       try {
            //         item.list[0].builder_params.display_when.value = +item.list[0].builder_params.display_when.value;
            //         item.list[0].builder_params["display_when"]["targetVal"] = item.list[0].builder_params["display_when"]["target"][0];
            //       } catch (error) {
            //         item.list[0].builder_params["display_when"]["targetVal"] = "";
            //       }
            //     }
            //     for (let i = 0; i < res.builder_tr.length; i++) {
            //       if (res.builder_tr[i].list[0].builder_id == 1000002 && res.builder_tr[i].list[0].form_builder_id == item.list[0].builder_params.display_when.target[0]) {
            //         this.relationData.push(res.builder_tr[i].list[0]);
            //         console.log(this.relationData);
            //       }
            //     }
            //   }

            // });
            this.dataArr = res;
            for (let i = 0; i < res.builder_tr.length; i++) {
              if (res.builder_tr[i].list[0].builder_id == 3000004) {
                this.builder.builder_params.lat = res.builder_tr[i].list[0].builder_params.lat;
                this.builder.builder_params.lng = res.builder_tr[i].list[0].builder_params.lng;
                setTimeout(function() {
                  _this.mapInit();
                }, 100);
              }
            }
          } catch (error) {}
        }
      });
    },
    // 上传回调
    handleSuccess(val, item, file) {
      this.builderHeader.bg = this.baseUrl + val.key;
    },
    handleChange(status, _file, params, resp) {
      const _baseUrl = params.baseUrl; // 上传文件存放地址
      let imageInfo = this.builderHeader;
      if (status === "startUpload") {
        // imageInfo.material_desc = "上传中···";
      } else if (status === "uploading") {
        // imageInfo.material_desc = "文件已上传" + resp; // 当为状态上传中时，resp为上传进度
      } else if (status === "uploadSuccess") {
        // imageInfo.url = resp.key;
        imageInfo.bg = _baseUrl + resp.key;
        // imageInfo.material_desc = _file.name;
        // this.fileName = _file.name;
        // console.log("uploadSuccess", resp);
      } else {
        // imageInfo.material_desc = "！";
        this.$message.error("上传失败，点击重试");
      }
    },
    //  主题 颜色列表
    getThemeList() {
      RequestThemeList().then(res => {
        // console.log("主题", res);
        if (res.code === 2000) {
          let _colorArr = [],
            _imgArr = [];
          res.data.forEach(item => {
            if (item.theme_type == "1") {
              _colorArr.push(item);
            } else if (item.theme_type == "2") {
              _imgArr.push(item);
            }
          });

          this.checkThemeColor = _colorArr;
          this.checkThemeImg = _imgArr;
        }
      });
    },
    // 主题  图片
    changeTheme(index, data, params) {
      this.dataArr.theme_color = data.theme_color;
      // console.log(index, this.checkThemeColor[index[0]]);
    },
    //  删除组件
    handleDelete(data) {
      this.dataArr.builder_tr.map((item, index) => {
        item.list.map((itemChildren, val) => {
          if (itemChildren.form_builder_id == data.form_builder_id) {
            this.dataArr.builder_tr.splice(index, 1);
            // delete this.dataArr.builder_tr[index];
            if (itemChildren.form_builder_id == this.builder.form_builder_id) {
              this.isContentShow = false;
            }
          }
        });
      });
      this.dataArr.builder_tr.map((item, index) => {
        item.list.map((itemChildren, val) => {
          if (itemChildren.builder_id == 3000004) {
            try {
              this.mapInit();
            } catch (error) {}
          }
        });
      });
      // this.$nextTick(function() {
      //   let parent = document.querySelectorAll(".BMap_cpyCtrl");
      //   for (let i = 0; i < parent.length; i++) {
      //     if (parent[i].parentNode.className != "mainMap") {
      //       parent[i].parentNode.style.background = "none";
      //       parent[i].parentNode.style.color = "#848484";
      //       parent[i].parentNode.innerHTML = this.dataArr.builder_tr[3].list[0].builder_params.placeholder;
      //     }
      //   }
      // });
    },
    //  获取每个组件的值
    handleBg(val) {
      this.activeName = "2";
      this.isContentShow = true;
      this.isShowFooter = false;
      this.isShow = false;
      this.formBuilderId = JSON.parse(JSON.stringify(val.form_builder_id));
      this.builder = val;

      // 处理 获取 数组长度 运用于 添加选项
      if (val.builder_params.item) {
        this.length = val.builder_params.item.length;
      }
      // 获取 当前地图的title ，防止 input  重复赋值，产生bug
      if (val.builder_id == 3000004) {
        !this.mapTitle ? (this.mapTitle = val.builder_params.title) : "";
      }
      // 多级联动获取 level selectData
      if (val.builder_id == 1000004) {
        this.selectTabActive = 0;
        this.selectLevelOne = "";
        this.selectTab = [];
        for (let i = 0; i < val.builder_params.select_level; i++) this.selectTab.push(i + 1);
      }
      //  处理货币 关联显示
      // if (val.builder_id == 1000011) {
      //   for (let i = 0; i < this.dataArr.builder_tr.length; i++) {
      //     if (this.dataArr.builder_tr[i].list[0].form_builder_id == val.builder_params.display_when.target[0]) {
      //       this.targetData = this.dataArr.builder_tr[i].list[0].builder_params.item;
      //     }
      //   }
      // }
    },

    inputChangeText(val) {
      this.builder.builder_params.title = val.value;
    },
    inputChangeTextDesc(val) {
      this.builder.builder_params.desc = val.value;
    },
    inputChangeTextPalce(val) {
      this.builder.builder_params.placeholder = val.value;
    },
    // handleCommand() {},
    // 表头
    handleHeader(val) {
      this.isShowFooter = false;
      this.isShow = true;
      this.isContentShow = false;
      this.formBuilderId = "";
      this.builderHeader = val;
    },
    // 切换 对齐方式
    tabAlign(val) {
      this.builderHeader.text_align = val;
    },
    // 切换 对齐方式
    tabLine(val) {
      this.builder.builder_params.hr_type = val;
    },
    // 切换 标题对齐方式
    titleAlign(val) {
      this.builder.builder_params.title_align = val;
    },
    textAlign(val) {
      this.builder.builder_params.title_align = val;
    },
    // 描述居中
    descAlign(val) {
      console.log(val);
      this.builder.builder_params.desc_align = val;
    },

    // 标题颜色筛选
    handleTilteColor(val) {
      console.log(val);
      // this.builder.builder_params.title_color = val;
      console.log(this.builder.builder_params);
    },
    //  下拉选择（多选单选） 删除
    handleSelectDelete(index) {
      if (this.builder.builder_params.item.length > 1) {
        this.builder.builder_params.item.splice(index, 1);
      } else {
        this.$message.error("至少有1个选项");
      }
    },
    //下拉选择（多选单选） 添加
    handleSelectAdd() {
      this.builder.builder_params.item.push(`选项${this.length + 1}`);
      this.length += 1;
    },
    //  性别 删除
    handleSexDelete(index) {
      if (this.builder.builder_params.item_list.length == 3) {
        this.sexSave = this.builder.builder_params.item_list[index];
        this.builder.builder_params.item_list.splice(index, 1);
      } else {
        this.$message.error("默认两个选项");
      }
    },
    handleSexAdd() {
      this.builder.builder_params.item_list.push(this.sexSave);
    },
    /**
     * 多级下拉函数
     */
    // 多级下拉选择
    handleSelectTab(val) {
      this.selectTabActive = val;
    },
    handleSelectMore(val) {
      this.builder.builder_params.select_params.forEach((item, index) => {
        if (val == item.id) {
          // console.log("执行", index);
          this.selectLevelOneIndex = index;
        }
      });
    },
    // 多级下拉删除
    handleSelectMoreDelete(index, val) {
      if (val == 1) {
        if (this.builder.builder_params.select_params.length > 1) {
          this.builder.builder_params.select_params.splice(index, 1);
        } else {
          this.$message.error("至少有1个选项");
        }
      } else if (val == 2) {
        if (this.builder.builder_params.select_params[this.selectLevelOneIndex].c.length > 1) {
          this.builder.builder_params.select_params[this.selectLevelOneIndex].c.splice(index, 1);
        } else {
          this.$message.error("至少有1个选项");
        }
      } else {
      }
    },
    // 多级下拉添加
    handleSelectMoreAdd(val) {
      let arr = [];
      let indexVal = 1;

      if (val == 1) {
        this.builder.builder_params.select_params.length != 0 &&
          this.builder.builder_params.select_params.forEach((item, index) => {
            arr.push(+item.id);
          });
        arr = arrSort(arr);
        indexVal = arr.length != 0 ? +(arr[arr.length - 1] + 1) : 1;
        this.builder.builder_params.select_params.push({ id: indexVal, c: [], v: "选项1" + indexVal });
      } else if (val == 2) {
        this.builder.builder_params.select_params[this.selectLevelOneIndex].c.lnegth != 0 &&
          this.builder.builder_params.select_params[this.selectLevelOneIndex].c.forEach((item, index) => {
            arr.push(item.id);
          });
        arr = arrSort(arr);
        indexVal = arr.length != 0 ? arr[arr.length - 1] + 1 : 1;
        this.builder.builder_params.select_params[this.selectLevelOneIndex].c.push({ id: indexVal, c: [], v: "选项2" + indexVal });
      }
      function arrSort(arr) {
        var t;
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
              t = arr[i];
              arr[i] = arr[j];
              arr[j] = t;
            }
          }
        }
        return arr;
      }
    },
    //  图片选择 删除

    handleSelectImgDelete(index) {
      if (this.builder.builder_params.item.length > 1) {
        this.builder.builder_params.item.splice(index, 1);
      } else {
        this.$message.error("至少有1个选项");
      }
    },
    // 图片选择
    handleSelectImgAdd() {
      let attr = {
        name: `选项${this.length + 1}`, // 名称
        images: "", // 图片
        desc: "" //描述
      };
      this.builder.builder_params.item.push(attr);
      this.length += 1;
    },
    //  图片选择  图片上传

    handleChangeSelectImg(status, _file, params, resp) {
      const _baseUrl = params.baseUrl; // 上传文件存放地址
      let imageInfo = this.builder.builder_params.item[params.indexs];
      if (status === "startUpload") {
      } else if (status === "uploading") {
      } else if (status === "uploadSuccess") {
        imageInfo.images = _baseUrl + resp.key;
      } else {
        this.$message.error("上传失败，点击重试");
      }
      // console.log("aaaaa", status, imageInfo);
    },
    // 图片展示 图片上传
    handleChangeSelectImgShow(status, _file, params, resp) {
      const _baseUrl = params.baseUrl; // 上传文件存放地址
      let imageInfo = this.builder.builder_params.item;
      if (status === "startUpload") {
      } else if (status === "uploading") {
      } else if (status === "uploadSuccess") {
        imageInfo.splice(params.indexs, 1, _baseUrl + resp.key);
      } else {
        this.$message.error("上传失败，点击重试");
      }
      // console.log("aaaaa", status, imageInfo);
    },

    /** 限定条件*/

    // 多选限定
    handleLimitMax(val) {
      if (val > this.builder.builder_params.select_limit[1]) this.builder.builder_params.select_limit.splice(1, 1, this.builder.builder_params.item.length);
    },

    //  数字限定
    setViews(e) {
      const self = this;
      let n = /^[1-9]\d*$/;
      if (!n.test(e)) {
        this.$message.error("请输入正确的文件大小");
        this.builder.builder_params.allow_file_size = 500;
        return false;
      } else {
        if (+e < 500) {
          this.builder.builder_params.allow_file_size = +e;
        } else {
          this.builder.builder_params.allow_file_size = 500;
          this.$message.error("请输入小于500的大小");
        }
      }
    },
    setViewsCount(e) {
      const self = this;
      let n = /^[1-9]\d*$/;
      if (!n.test(e)) {
        this.$message.error("请输入正确的小数");
        this.builder.builder_params.allow_float_len = 2;
        return false;
      } else {
        if (+e < 10) {
          this.builder.builder_params.allow_float_len = +e;
        } else {
          this.builder.builder_params.allow_float_len = 2;
          this.$message.error("请输入小于10小数");
        }
      }
    },
    setViewsCountLimit(e) {
      const self = this;
      let n = /^[1-9]\d*$/;
      if (!n.test(e)) {
        this.$message.error("请输入正确的数字");
        this.builder.builder_params.number_limit.splice(0, 1, 1);
        console.log(this.builder.builder_params.number_limit[0], "1___________");
        return false;
      } else {
        if (+e < this.builder.builder_params.number_limit[1]) {
          this.builder.builder_params.number_limit.splice(0, 1, +e);
        } else {
          this.builder.builder_params.number_limit.splice(0, 1, 1);

          this.$message.error("不能大于已设上限");
        }
      }
    },
    setViewsCountLimitLast(e) {
      const self = this;
      let n = /^[1-9]\d*$/;
      if (!n.test(e)) {
        this.$message.error("请输入正确的数字");
        this.builder.builder_params.number_limit.splice(1, 1, 1000);
        return false;
      } else {
        if (+e > this.builder.builder_params.number_limit[0]) {
          this.builder.builder_params.number_limit.splice(1, 1, +e);
        } else {
          this.builder.builder_params.number_limit.splice(1, 1, 1000);
          this.$message.error("不能小于已设上限");
        }
      }
    },
    //  题目关联
    handleRelation(val) {
      let _arr = [];
      _arr.push(val);
      this.builder.builder_params.display_when.target = _arr;
    },
    handleFooter(val) {
      this.isShowFooter = true;
      this.isShow = false;
      this.isContentShow = false;
      this.formBuilderId = "";
      this.builderFooter = val;
    },
    mapInit() {
      let th = this;
      // this.$nextTick(function() {

      // });
      this.$nextTick(function() {
        // MapJs("iyUj8juV15MB8qGwiM6BfwebPs3cUMOm").then(BMap => {
        // 创建Map实例
        var map = new BMap.Map("mainMap");
        var maker = [];
        let langLatArr = [];
        if (th.builder.builder_params.lat && th.builder.builder_params.lng) {
          langLatArr = coordtransform.gcj02tobd09(th.builder.builder_params.lng, th.builder.builder_params.lat);
          let markers = new BMap.Marker({
            lng: langLatArr[0],
            lat: langLatArr[1]
          });
          maker.push(markers);
          map.addOverlay(markers);
          var point = new BMap.Point(langLatArr[0], langLatArr[1]);
          map.centerAndZoom(new BMap.Point(langLatArr[0], langLatArr[1]), 15);
        } else {
          // 初始化地图,设置中心点坐标，
          var point = new BMap.Point(104.07, 30.67);
          map.centerAndZoom(new BMap.Point(104.07, 30.67), 15);
        }

        map.enableScrollWheelZoom(false);
        var geolocation = new BMap.Geolocation();
        var geocoder = new BMap.Geocoder();
        var ac = new BMap.Autocomplete({
          //建立一个自动完成的对象
          input: "suggestId",
          location: map
        });
        /**
      定位控件
      */
        // var navigationControl = new BMap.NavigationControl({
        //   // 靠左上角位置
        //   anchor: BMAP_ANCHOR_TOP_LEFT,
        //   // LARGE类型
        //   type: BMAP_NAVIGATION_CONTROL_LARGE,
        //   // 启用显示定位
        //   enableGeolocation: true
        // });
        // map.addControl(navigationControl);
        // // 添加定位控件
        // var geolocationControl = new BMap.GeolocationControl();

        // geolocationControl.addEventListener("locationSuccess", function(e) {
        //   // // 定位成功事件
        //   // var address = "";
        //   // address += e.addressComponent.province;
        //   // address += e.addressComponent.city;
        //   // address += e.addressComponent.district;
        //   // address += e.addressComponent.street;
        //   // address += e.addressComponent.streetNumber;
        //   // alert("当前定位地址为：" + address);
        // });
        // geolocationControl.addEventListener("locationError", function(e) {
        //   // 定位失败事件
        //   alert(e.message);
        // });
        // map.addControl(geolocationControl);
        /**
         * 1.地图点击事件
         */
        // function showInfo(e) {
        //   geocoder.getLocation(e.point, function(rs) {
        //     let title = "";
        //     if (rs.surroundingPois.length != 0) {
        //       title = rs.surroundingPois[0].title;
        //     }
        //     var mk = new BMap.Marker(rs.point); //创建一个覆盖物
        //     maker.push(mk);
        //     for (var i = 0; i < maker.length; i++) {
        //       map.removeOverlay(maker[i]);
        //     }
        //     map.clearOverlays(); //清除地图上所有覆盖物
        //     map.addOverlay(mk); //增加一个标示到地图上
        //     th.builder.builder_params.address = rs.address + title;
        //     th.userlocation.lng = e.point.lng;
        //     th.userlocation.lat = e.point.lat;
        //     // map.enableCloseOnClick();
        //     /**
        //      * 信息窗口
        //      */
        //     var opts = {
        //       width: 150, // 信息窗口宽度
        //       height: 100, // 信息窗口高度
        //       title: "您当前选择位置：", // 信息窗口标题
        //       enableCloseOnClick: true
        //     };
        //     var infoWindow = new BMap.InfoWindow(rs.address + title, opts); // 创建信息窗口对象
        //     map.openInfoWindow(infoWindow, rs.point); // 打开信息窗口
        //   });
        // }
        // map.addEventListener("click", showInfo);
        /**
         * 1.地图地理位置获取
         */
        if (!this.builder.builder_params.lng) {
          geolocation.getCurrentPosition(
            function(r) {
              if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var mk = new BMap.Marker(r.point);
                maker.push(mk);
                map.addOverlay(mk);
                map.panTo(r.point);
                //   alert("您的位置：" + r.point.lng + "," + r.point.lat);
              } else {
                alert("failed" + this.getStatus());
              }
            },
            { enableHighAccuracy: true }
          );
        }

        /**
         * 1.地图搜索
         */
        var myValue;
        ac.addEventListener("onconfirm", function(e) {
          //鼠标点击下拉列表后的事件
          var _value = e.item.value;
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
          // console.log(myValue);
          th.mapTitle = myValue;
          th.userlocation.lng = e.target.yd.src.Oe.lng;
          th.userlocation.lat = e.target.yd.src.Oe.lat;
          setPlace();
        });

        function setPlace() {
          map.clearOverlays(); //清除地图上所有覆盖物
          function myFun() {
            th.userlocation = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            map.centerAndZoom(th.userlocation, 18);
            map.addOverlay(new BMap.Marker(th.userlocation)); //添加标注
          }

          var local = new BMap.LocalSearch(map, {
            //智能搜索
            onSearchComplete: myFun
          });
          local.search(myValue);

          //测试输出坐标（指的是输入框最后确定地点的经纬度）
          // map.addEventListener("click", function(e) {
          //   //经度
          //   console.log(th.userlocation.lng);
          //   //维度
          //   console.log(th.userlocation.lat);
          // });
        }
      });
      // 百度地图初始化

      // });
      // });
      // window.location.reload();
    },

    /**
     * 图片上传
     */
    // 实时预览函数
    realTime(data) {
      this.previews = data;
    },
    uploadImg(e, num) {
      //上传图片
      // this.option.img
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        } else if (num === 2) {
          this.example2.img = data;
        }
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
    }

    // handleHeaderDesc() {
    //   cons;
    // }
  }
};
</script>

<style >
.main-rigth-bg .el-collapse-item__header {
  background: #267dc5;
  color: #fff;
  height: 35px;
  line-height: 35px;
  padding-left: 10px;
}
.main-tem-one-desc {
  font-size: 12px;
}
.main-rigth-bg .el-collapse-item__arrow {
  line-height: 35px;
}
.main-left > .el-scrollbar__wrap {
  overflow-x: hidden;
}
.main-header {
  position: relative;
  min-height: 249px;
  height: 100%;
  width: 100%;
}
.main-hander-title {
  background: url("./../../../../static/images/preview.png");
  width: 498px;
  height: 80px;
  line-height: 80px;
  padding: 12px 130px 0 25px;
  /* overflow: hidden; */
  background-size: 500px;
  text-align: center;
}
.main-hander-title div {
  /* background: #267dc5; */
  /* margin-top: 50px; */
  /* border: 1px solid red; */
  /* text-align: center; */
  width: 100%;
}
.main-tem-one {
  word-wrap: break-word;
  word-break: break-all;
}
.main-tem-left {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90%;
  transform: translate(-50%, -50%);
  text-align: left;
}
.main-tem-right {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90%;
  transform: translate(-50%, -50%);
  text-align: right;
}
.main-tem-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90%;
  transform: translate(-50%, -50%);
  text-align: center;
  /* margin: 0 auto; */
}
.main-tem-top {
  position: absolute;
  top: 15%;
  left: 50%;
  width: 90%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.main-tem-topleft {
  position: absolute;
  top: 15%;
  left: 50%;
  width: 90%;
  transform: translate(-50%, -50%);
  text-align: left;
}
.main-tem-topright {
  position: absolute;
  top: 15%;
  left: 50%;
  width: 90%;
  transform: translate(-50%, -50%);
  text-align: right;
}
.main-tem-bottom {
  position: absolute;
  bottom: 0%;
  left: 50%;
  width: 90%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.main-tem-bottomleft {
  position: absolute;
  bottom: 0%;
  left: 50%;
  width: 90%;
  transform: translate(-50%, -50%);
  text-align: left;
}
.main-tem-bottomright {
  position: absolute;
  bottom: 0%;
  left: 50%;
  width: 90%;
  transform: translate(-50%, -50%);
  text-align: right;
}
.main-tem-one div:nth-child(1) {
  color: #5d7297;
  font-size: 23px;
  font-weight: 600;
  letter-spacing: 5px;
  /* font-family: "Courier New", Courier, monospace; */
}
.main-tem-one div:nth-child(2) {
  margin-top: 5px;
  color: #7587aa;
  font-weight: 600;
}
.main-choose-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38px;
}
/* .main-choose-content:hover {
  background: rgba(0, 0, 0, 0.1);
} */
.main-choose-content img {
  cursor: pointer;
}
.main-choose-img {
  display: none;
}
.main-choose-content:hover > .main-choose-img {
  display: block;
}

.main-select-img {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}
.main-select-img:hover {
  background: #f6f9fb;
}
.main-select-img:hover > .main-select-img-content input {
  background: #f6f9fb;
}
.main-select-img img {
  cursor: pointer;
}
.main-choose-img {
  display: none;
}
.main-select-img:hover > .main-choose-img {
  display: block;
}

.main-input {
  width: 100%;
  height: 30px;
  /* color: #848484; */
  outline: none;
  border: none;
  font-size: 14px;
  border-bottom: 1px #ebeef5 solid;
  /* border-bottom: 1px #17b1ed solid; */
  /* margin-top: 10px; */
}
.main-input-top {
  margin-top: 5px;
  width: 370px;
  background: none;
}
</style>
<style rel="stylesheet/scss" lang="scss"  scoped>
.main-align-ul {
  list-style: none;
  //  width: 100%;
  height: 30px;
  padding: 0;
  // margin-bottom: 10px;
  font-size: 0;
  //  margin-right: 10px
  li {
    line-height: 30px;
    display: inline-block;
    width: 60px;
    text-align: center;
    font-size: 10px;
    cursor: pointer;
    background: #fff;
    border: 1px #dcdfe6 solid;
  }
  li + li {
    border-left: none;
  }

  .bgColor {
    background-color: #267dc5;
    color: #fff;
  }
}
.main-address-detail {
  width: 80%;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  display: inline-block;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  outline: none;
  padding: 0 15px;
}
.main-hr {
  border: 0 none;
  border-top: 1px solid #848484;
}
.delete-wrap {
  position: absolute;
  top: -7px;
  right: -7px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background: #39bcf3;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.template-title {
  margin: 10px auto;
  font-size: 20px;
  color: #101010;
}

.inpt-placeholder {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #adadad;
}

.hy-main {
  margin: 20px;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 0px 3px 3px #eee;
  border-radius: 10px;
  height: 200px;
}

.text-wrap {
  position: relative;
  border-bottom: 1px solid #f2f2f2;
}

.edite-title {
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
  background: #39bcf3;
  color: #fff;
  font-size: 16px;
  margin-bottom: 30px;
}

.panel-group {
  margin: 18px auto auto;
  padding-top: 20px;
  width: 950px;
  font-family: "微软雅黑";
  .active-style {
    border: 1px dotted #39bcf3;
  }
  .avatar {
    width: 100%;
    height: 100%;
  }
  .main-left {
    border: 1px #e2e2e2 solid;
    -moz-box-shadow: 0px 0px 5px #e2e2e2;
    -webkit-box-shadow: 0px 0px 5px #e2e2e2;
    box-shadow: 0px 0px 5px #e2e2e2;
    float: left;
    width: 500px;
    padding-bottom: 10px;
    background: #fff;
    .main-theme {
      padding: 15px 5px;
      cursor: pointer;
      border: 1px red solid;
      margin: 15px 0;
    }
    .banner-wrap {
      position: relative;
      width: 100%;
      height: 250px;
      .hy-img {
        width: 100%;
        height: 100%;
      }
      .banner-main {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 10px;
        width: 240px;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        text-align: center;
        color: #fff;
        font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
        .title {
          margin: 80px auto 10px;
          font-size: 24px;
        }
        .title-info {
          display: inline;
          padding: 3px 10px;
          font-size: 12px;
          background: rgb(81, 75, 90);
          border-radius: 15px;
        }
      }
    }
  }
  .main-right {
    // border-radius: 5px;
    float: right;
    width: 440px;
    border: 1px #e2e2e2 solid;
    -moz-box-shadow: 0px 0px 5px #e2e2e2;
    -webkit-box-shadow: 0px 0px 5px #e2e2e2;
    box-shadow: 0px 0px 5px #e2e2e2;
    .main-rigth-bg {
      background: #fff;
      padding: 10px;
    }
    .main-title {
      background: #267dc5;
      color: #fff;
      font-size: 14px;
      height: 35px;
      line-height: 35px;
      padding-left: 10px;
      margin-top: 10px;
    }
  }
  .main-content {
    padding: 0 10px 10px 10px;
  }
  .main-title-name {
    color: #848484;
    font-size: 14px;
    padding: 10px 0;
  }
  .main-time .el-select {
    width: 120px;
  }
}
.main-footer {
  padding: 10px 5px;
  background-color: rgb(248, 248, 248);
  display: flex;
  justify-content: center;
}
.main-footer div {
  padding: 5px 10px;
  text-align: center;
  color: #fff;
  // border: 1px red solid;
}
.main-header {
  cursor: pointer;
  border: 1px #fff solid;
}

.main-theme {
  // background: #2B3948;
  padding-bottom: 20px;
  min-height: calc(100vh - 120px);
}
.main-tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #267dc5;
  border: 1px solid #267dc5;
  padding-top: 10px;
  border-bottom: none;
}
.main-tab > div:nth-child(1) {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.main-tab-title {
  padding: 5px 10px;
  // border: 1px #848484 solid;
  color: #fff;
  cursor: pointer;
}
.main-tab-title + .main-tab-title {
  border-left: none;
}
.main-tab-title:first-child {
  margin-left: 10px;
}
.main-tab-active {
  background: #fff;
  color: #000;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.input {
  /* width: 200px; */
  border-radius: 8px;
  outline: none;
  /* line-height: 30px; */
  height: 25px;
  border: 1px solid #eee;
  background: #fff;
  text-indent: 5px;
}
.d-wrapper {
  position: relative;
  padding: 10px 5px;
  margin: 15px 0;
  cursor: pointer;
  border: 1px #fff solid;
}
.d-wrapper:hover {
  border: 1px #ccc dotted;
}
.d-desc {
  color: #848484;
  font-size: 14px;
}
.d-rate {
  margin-top: 10px;
  font-size: 22px;
  color: #17b1ed;
}
.d-rate-agree {
  width: 130px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}
.d-sex {
  display: flex;
  align-items: center;
  padding: 8px 0;
}
.d-sex + .d-sex {
  margin-left: 20px;
}
.d-upload {
  width: 130px;
  height: 130px;
  line-height: 20px;
  border-radius: 15px;
  background: #e8f8ff;
  margin-top: 10px;
  padding: 30px 5px;
  text-align: center;
  color: #b1b1b1;
}
.d-upload i {
  font-size: 20px;
}
.d-upload div {
  font-size: 12px;
}

.d-delete-icon {
  display: none;
}
.d-wrapper:hover > .d-delete-icon {
  position: absolute;
  top: -10px;
  right: -10px;
  display: block;
}
.d-delete-icon:after {
  font-family: "iconfont";
  content: "\e7b7";
  color: #d24e46;
  font-size: 25px;
}
.d-delete-active {
  position: absolute;
  top: -10px;
  right: -10px;
  display: block;
}
.d-choose-active {
  background: #fff8dc;
  border: 1px #ccc dotted;
}
.d-textarea {
  width: 100%;
  height: 80px;
  border: 1px #17b1ed solid;
  color: #848484;
  padding: 10px 0 0 10px;
  font-size: 14px;
  margin-top: 10px;
}
.d-input {
  width: 100%;
  height: 30px;
  color: #848484;
  font-size: 14px;
  border-bottom: 1px #ebeef5 solid;
  /* border-bottom: 1px #17b1ed solid; */
  margin-top: 10px;
}
.d-start {
  margin-left: 2px;
  color: rgb(218, 40, 36);
}
.d-choose-title {
  border: 1px #17b1ed solid;
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
.d-choose-select {
  margin-top: 15px;
  width: 100%;
  height: 30px;
  border: 1px #17b1ed solid;
  padding: 0px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  // border-radius: 10px;
}
.d-choose-select i {
  color: #17b1ed;
}
.d-choose-select p {
  color: #999;
}
.d-more-select {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.d-more-select > div {
  width: 24%;
}
.d-select-left + .d-select-left {
  margin-left: 1%;
}
.d-select-img {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 95%;
  margin: 0 auto;
}
.img-bg-box {
  width: 100px;
  height: 80px;
  background-size: cover;
  background-clip: content-box;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  overflow: hidden;
  border: 1px solid #eee;
}
.d-img-bg-box {
  width: 100%;
  height: 130px;
  background-size: cover;
  background-clip: content-box;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  overflow: hidden;
  // border: 1px solid #eee;
  border-radius: 6px;
}
.d-img-center {
  line-height: 130px;
  text-align: center;
}
.d-select-img > div {
  width: 40%;
  margin-top: 15px;
}
.d-select-img img {
  text-align: center;
  width: 50%;
}
.d-select-img-desc {
  margin-top: 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
}
// icon
.xiao-icon-zanwutupian {
  font-size: 80px;
  color: #e9e9e9;
}
</style>
