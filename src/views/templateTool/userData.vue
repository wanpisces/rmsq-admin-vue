<template>
  <div class="info-container">
    <!-- <el-card class="box-card">
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" fill_content="提交用户" v-model="objSearch.q"></el-input>
        </div>
        <div class="search">
          <span>角色：</span>
          <el-select v-model="select" fill_content="角色筛选" @change="selectId">
            <el-option v-for="item in modulesOptions" :key="item.role" :label="item.role_name" :value="item.role">
            </el-option>
          </el-select>
        </div>
        <div class="search">
          <el-button type="primary" icon="el-icon-search" @click="searchKeyword">搜索</el-button>
        </div>
      </div>
    </el-card> -->
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <!-- <div class="table-title clearfix">
          <div style="float:left;">
            <el-button type="danger" plain @click="tabelDelete()" :disabled="deleteMark">删除</el-button>
            <el-button v-for="(item, index) in switchData" :key="index" :type="objSearch.status == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button>
          </div>
          <div style="float:right;">
            <choose-tab add-title="选择模板" @handleAdd="dialogVisible=true" @TimeOn="TimeOn">
            </choose-tab>
          </div>
        </div> -->
        <el-table :data="tableData" border @selection-change="selectionChange" style="width: 100%">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column label="编号" width="100" type="index">
          </el-table-column>
          <el-table-column label="提交时间" prop="create_time">
          </el-table-column>
          <el-table-column label="提交用户" prop="user_nickname">
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="checkDetail(scope.row)">查看</el-button>
              <el-button type="text" @click="FormExport(scope.row)">导出数据</el-button>
              <!-- <el-button type="text" @click="deleteClassfiy(scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="margin-left: 20px;">
            <el-pagination background @current-change="pageChange" :current-page.sync="objSearch.current_page" :page-size="objSearch.page_size" layout="total,prev, pager, next, jumper" :total="total_num">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog title="查看详情" :visible.sync="dialogVisible " width="500px" :close-on-click-modal="false ">
      <!-- <el-form label-width="250px " v-if="formUserDetail">
        <el-form-item v-for="(item,index) in formUserDetail.builder_tr " :key="index " :label="item.list[0].builder_params.title+':' ">
          <p>
            <span v-if="item.list[0].builder_id==1000007">
              <a :href="item.list[0].fill_content" target="_blank" style="color:#39BCF3">{{item.list[0].fill_content}}</a>
            </span>
            <span v-else class="word_wrap"> {{item.list[0].fill_content||'暂无'}}</span>

          </p>
        </el-form-item>
      </el-form> -->

      <!-- <div class="main-hander-title" :style="{ backgroundColor:' #39bcf3',color:'#fff' }">
        {{dataArr.form_name}}
      </div> -->
      <el-scrollbar style="height:70vh;">

        <!-- 表头 -->
        <div class="main-header" v-if="dataArr.form_header">
          <img :src="dataArr.form_header.bg" width="100%" alt="">
          <div :class="[dataArr.form_header.text_align==1?'main-tem-one main-tem-left':dataArr.form_header.text_align==2?'main-tem-one main-tem-center':dataArr.form_header.text_align==3?'main-tem-one main-tem-right':dataArr.form_header.text_align==5?'main-tem-one main-tem-top':dataArr.form_header.text_align==8?'main-tem-one main-tem-bottom':dataArr.form_header.text_align==4?'main-tem-one main-tem-topleft':dataArr.form_header.text_align==6?'main-tem-one main-tem-topright':dataArr.form_header.text_align==7?'main-tem-one main-tem-bottomleft':dataArr.form_header.text_align==9?'main-tem-one main-tem-bottomright':'']">
            <div :style="{color:dataArr.form_header.title_color }"> {{dataArr.form_header.title}}</div>
            <div class="main-tem-one-desc word_wrap" :style="{color:dataArr.form_header.desc_color  }"> {{dataArr.form_header.desc}}</div>
          </div>
        </div>

        <!-- 中间组件 -->
        <div v-for="(dataObject, index) in dataArr.builder_tr" :key="index">
          <!-- <div v-if="dataObject.list[0].builder_id=='3000004'" class='main0'>aaaa</div> -->
          <div style="padding:0px 10px">
            <div v-if="dataObject.tr==0">

              <!-- 基础类组件    -->
              <!--1000001 文本框 1000002	选择  1000003	下拉  1000004	多级下拉 1000005	日期时间  1000006	数字  1000007	附件  1000008	评分  1000009	矩阵  1000010	排序  1000011	货币  1000012	城市  1000013	商品  1000014	按钮  -->
              <!-- 1000001 文本框 -->
              <div v-if="dataObject.list[0].builder_id=='1000001' " class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->

                <!-- {{dataObject.list[0].builder_id,formBuilderId}} -->
                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div :class="[dataObject.list[0].builder_params.input_type==1?'d-input':'d-textarea']">{{dataObject.list[0].fill_content}}</div>
              </div>
              <!-- 1000002 选择 (单选多选下拉) -->
              <div v-if="dataObject.list[0].builder_id=='1000002' " class="d-wrapper">
                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span>
                <span v-if="dataObject.list[0].builder_params.select_type==2">(请选择{{dataObject.list[0].builder_params.select_limit[0]}}-{{dataObject.list[0].builder_params.select_limit[1]}}项)</span>
                <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div v-if="dataObject.list[0].builder_params.select_type==1">
                  <!-- <div v-for="(item,index)  in  dataObject.list[0].builder_params.item" :key="index" style="display:flex;align-items: center; padding: 8px 0;">
                    <div class="d-choose-title" :style="{borderRadius:'50%',backgroundColor:dataObject.list[0].fill_content== index?'#17b1ed':''}"></div>
                    <div style="margin-left:5px;font-size:15px">{{item}}</div>
                  </div> -->
                  <el-radio-group v-model="dataObject.list[0].fill_content">
                    <div v-for="(item,index)  in  dataObject.list[0].builder_params.item" :key="index" style="padding-top:10px">
                      <el-radio :label="index" disabled>{{item}}</el-radio>
                    </div>
                  </el-radio-group>
                </div>
                <div v-if="dataObject.list[0].builder_params.select_type==2">
                  <el-checkbox-group v-model="dataObject.list[0].fill_content">
                    <div v-for="(item,index)  in  dataObject.list[0].builder_params.item" :key="index" style="padding-top:10px">
                      <el-checkbox :label="index" :key="item" disabled>{{item}}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>
                <div v-if="dataObject.list[0].builder_params.select_type==3">
                  <div class="d-choose-select">
                    <p>{{dataObject.list[0].builder_params.item[+dataObject.list[0].fill_content-1]}}</p>
                    <i class="el-icon-arrow-down"></i>
                  </div>
                </div>
              </div>
              <!-- 1000003  (下拉) -->
              <div v-if="dataObject.list[0].builder_id=='1000003' " class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <div v-if="dataObject.list[0].builder_params.select_type!=3">
                  <div v-for="(item,index)  in  dataObject.list[0].builder_params.item" :key="index" style="display:flex;align-items: center; padding: 8px 0;">
                    <div class="d-choose-title" :style="{borderRadius:dataObject.list[0].builder_params.select_type==1?'50%':'0%'}"></div>
                    <div style="margin-left:5px;font-size:15px">{{item}}</div>
                  </div>
                </div>
                <div v-else>
                  <div class="d-choose-select">
                    <p>{{ dataObject.list[0].builder_params.item[+dataObject.list[0].fill_content -1]}}</p>
                    <i class="el-icon-arrow-down"></i>
                  </div>
                </div>
              </div>
              <!-- 1000004  (多级下拉) -->
              <div v-if="dataObject.list[0].builder_id=='1000004' " class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <div class="d-more-select">

                  <div class="d-choose-select d-select-left" v-if="dataObject.list[0].builder_params.select_level>=1">
                    <p>{{dataObject.list[0].fill_content[0] || "暂无数据"}} </p>
                    <i class="el-icon-arrow-down"></i>
                  </div>
                  <div class="d-choose-select d-select-left" v-if="dataObject.list[0].builder_params.select_level>=2">
                    <p>{{dataObject.list[0].fill_content[1] || "暂无数据"}} </p>
                    <i class="el-icon-arrow-down"></i>
                  </div>
                  <div class="d-choose-select d-select-left" v-if="dataObject.list[0].builder_params.select_level>=3">
                    <p>{{dataObject.list[0].fill_content[2] || "暂无数据"}} </p>
                    <i class="el-icon-arrow-down"></i>
                  </div>
                  <div class="d-choose-select d-select-left" v-if="dataObject.list[0].builder_params.select_level>=4">
                    <p>{{dataObject.list[0].fill_content[3] || "暂无数据"}} </p>
                    <i class="el-icon-arrow-down"></i>
                  </div>

                </div>
              </div>

              <!-- 日期组件 -->
              <div v-if="dataObject.list[0].builder_id=='1000005' " class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div class="d-input">{{dataObject.list[0].fill_content}}</div>
              </div>
              <!-- 1000006 数字 -->
              <div v-if="dataObject.list[0].builder_id=='1000006' " class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->

                <!-- {{dataObject.list[0].builder_id,formBuilderId}} -->
                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div>
                  <div class="d-input" style="display:flex;align-items:center;font-size:14px;justify-content: space-between">
                    <span style="width:50%;">{{dataObject.list[0].fill_content}}</span>
                    <span style="width:50%;text-align:right" class="word_wrap">{{dataObject.list[0].builder_params.unit}}</span>
                  </div>
                  <!-- <div style="width:20%"></div> -->
                </div>

              </div>
              <!-- 附件组件 -->
              <div v-if="dataObject.list[0].builder_id=='1000007' " class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div class="d-input">
                  <a :href="dataObject.list[0].fill_content" target="_blank" style="color:#39bcf3">{{dataObject.list[0].fill_content}}</a>
                </div>
              </div>
              <!-- 1000008 评分 -->
              <div v-if="dataObject.list[0].builder_id=='1000008' " class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div class="d-rate">
                  <i class="el-icon-star-on" v-if="dataObject.list[0].fill_content>=1"></i>
                  <i class="el-icon-star-on" v-if="dataObject.list[0].fill_content>=2"></i>
                  <i class="el-icon-star-on" v-if="dataObject.list[0].fill_content>=3"></i>
                  <i class="el-icon-star-on" v-if="dataObject.list[0].fill_content>=4"></i>
                  <i class="el-icon-star-on" v-if="dataObject.list[0].fill_content>=5"></i>
                </div>
                <div class="d-rate-agree">
                  <span>不满意</span>
                  <span>满意</span>
                </div>
              </div>

              <!-- 货币组件 -->
              <div v-if="dataObject.list[0].builder_id=='1000011'" class="d-wrapper">
                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <article class="d-input">{{dataObject.list[0].builder_params.mony_type==1?'￥':'$'}}{{dataObject.list[0].fill_content}}</article>
                <div></div>
              </div>

              <!-- 联系人组件    -->
              <!-- 4000001	姓名  4000002	手机   4000003	邮箱   4000004	公司  4000005	部门  4000006	职位  4000007	头像   4000008	称谓  4000009	性别  4000010	生日  4000011	所在地  4000012	地址  4000013	网址  4000014	座机  4000015	传真 -->
              <!-- 姓名组件 -->
              <div v-if="dataObject.list[0].builder_id=='4000001'" class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <article class="d-input">{{dataObject.list[0].fill_content}}</article>
                <div></div>
              </div>
              <div v-if="dataObject.list[0].builder_id=='4000002'" class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div class="d-input">{{dataObject.list[0].fill_content}}</div>
              </div>
              <!-- 邮箱 -->
              <div v-if="dataObject.list[0].builder_id=='4000003' " class="d-wrapper">

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div class="d-input">{{dataObject.list[0].fill_content}}</div>
              </div>
              <!-- 公司 -->
              <div v-if="dataObject.list[0].builder_id=='4000004' " class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->

                <!-- {{dataObject.list[0].builder_id,formBuilderId}} -->
                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div :class="[dataObject.list[0].builder_params.input_type==1?'d-input':'d-textarea']">{{dataObject.list[0].fill_content}}</div>
              </div>

              <!-- 部门 -->
              <div v-if="dataObject.list[0].builder_id=='4000005' " class="d-wrapper">

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div class="d-input">{{dataObject.list[0].fill_content}}</div>
              </div>
              <!-- 职位 -->
              <div v-if="dataObject.list[0].builder_id=='4000006' " class="d-wrapper">

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div class="d-input">{{dataObject.list[0].fill_content}}</div>
              </div>
              <!-- 性别 -->
              <div v-if="dataObject.list[0].builder_id=='4000009' " class="d-wrapper">

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <div style="display:flex;align-items: center;">
                  <div v-for="(item,index)  in  dataObject.list[0].builder_params.item_list" :key="index" class="d-sex">
                    <div class="d-choose-title" :style="{borderRadius:'50%',backgroundColor:dataObject.list[0].fill_content==item.key?'#17b1ed':''}"></div>
                    <div style="margin-left:5px;font-size:15px">{{item.desc}}</div>
                  </div>
                </div>

              </div>
              <!-- 图片类组件 2000001	图片选择  2000002	图片上传  2000003	图片展示  2000004	图片轮播 -->
              <!-- 图片类组件 2000001 -->
              <div v-if="dataObject.list[0].builder_id=='2000001' " class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span>
                <span v-if="dataObject.list[0].builder_params.select_type==2">(请选择{{dataObject.list[0].builder_params.select_limit[0]}}-{{dataObject.list[0].builder_params.select_limit[1]}}项)</span>
                <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div v-if="dataObject.list[0].builder_params.item && dataObject.list[0].builder_params.select_type==2" class="d-detail-group">
                  <el-checkbox-group v-model="dataObject.list[0].fill_content">
                    <div class="d-select-img">
                      <div v-for="(item,index)  in  dataObject.list[0].builder_params.item" :key="index" style="padding-top:10px">
                        <div class="d-img-bg-box" :style="{backgroundImage: 'url(' + item.images + ')'}" v-if="item.images">
                        </div>
                        <div v-else class="d-img-bg-box d-img-center">
                          <!-- <i class="xiao-icon-zanwutupian"></i> -->
                          <img src="https://img.sqydt.darongshutech.com/token_file_201811070921432268.jpg" width="30px" style="margin-top:23px" alt="">
                        </div>
                        <el-checkbox :label="index" :key="index" disabled>{{item.name}}</el-checkbox>
                      </div>
                    </div>
                  </el-checkbox-group>
                </div>
                <div v-if="dataObject.list[0].builder_params.item && dataObject.list[0].builder_params.select_type==1" class="d-detail-group">
                  <el-radio-group v-model="dataObject.list[0].fill_content">
                    <div class="d-select-img">
                      <div v-for="(item,index)  in  dataObject.list[0].builder_params.item" :key="index" style="padding-top:10px">
                        <div class="d-img-bg-box" :style="{backgroundImage: 'url(' + item.images + ')'}">
                        </div>
                        <el-radio :label="index" :key="index" disabled>{{item.name}}</el-radio>
                      </div>
                    </div>

                  </el-radio-group>
                </div>
              </div>
              <!-- 2000002  图片上传-->
              <div v-if="dataObject.list[0].builder_id=='2000002' " class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->

                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div class="d-upload" v-if="!dataObject.list[0].fill_content">
                  <div style="margin-top:20px">暂未上传图片</div>
                </div>
                <div class="d-upload" v-else style="padding:0px;overflow: hidden">
                  <img :src="dataObject.list[0].fill_content" width="100%" v-if="dataObject.list[0].fill_content" alt="">
                </div>
              </div>
              <!-- 图片展示 -->
              <div v-if="dataObject.list[0].builder_id=='2000003' " class="d-wrapper">
                <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
                <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
                <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
                <div v-for="(item,index) in dataObject.list[0].builder_params.item" :key="index">
                  <img :src="item" width="100%" alt="">
                </div>
              </div>

              <!-- 辅助类组件 -->
              <!-- 3000001	文本描述   3000002	分割线  3000003	分页   3000004	静态地图  3000005	视频播放 -->
              <!-- 3000001 文本描述 -->
              <div v-if="dataObject.list[0].builder_id=='3000001' " class="d-wrapper">

                <div class="word_wrap " style="margin-bottom:5px" v-html="dataObject.list[0].builder_params.title" :style="{textAlign:dataObject.list[0].builder_params.title_align==1?'left':dataObject.list[0].builder_params.title_align==2?'center':'right',color:dataObject.list[0].builder_params.title_color}"></div>
                <p class="word_wrap d-desc" v-html="dataObject.list[0].builder_params.desc" :style="{textAlign:dataObject.list[0].builder_params.desc_align==1?'left':dataObject.list[0].builder_params.desc_align==2?'center':'right',color:dataObject.list[0].builder_params.desc_color}"></p>
              </div>
              <!--  3000002	分割线 -->
              <div v-if="dataObject.list[0].builder_id=='3000002' " class="d-wrapper">
                <div class="word_wrap " v-html="dataObject.list[0].builder_params.title" :style="{textAlign:dataObject.list[0].builder_params.title_align==1?'left':dataObject.list[0].builder_params.title_align==2?'center':'right',color:dataObject.list[0].builder_params.title_color,lineHeight:'23px'}"></div>
                <hr class="main-hr" :style="{borderStyle:dataObject.list[0].builder_params.hr_type==1?'dotted':dataObject.list[0].builder_params.hr_type==2?'dashed':dataObject.list[0].builder_params.hr_type==3?'':'double',borderTopWidth:dataObject.list[0].builder_params.hr_type==4?'3px':''}" />
                <p class="word_wrap d-desc" v-html="dataObject.list[0].builder_params.desc" :style="{textAlign:dataObject.list[0].builder_params.desc_align==1?'left':dataObject.list[0].builder_params.desc_align==2?'center':'right',color:dataObject.list[0].builder_params.desc_color,lineHeight:'23px'}"></p>
              </div>

              <!--  3000004	静态地图 -->
              <div v-if="dataObject.list[0].builder_id=='3000004' " class="d-wrapper">
                <p class="word_wrap " v-html="dataObject.list[0].builder_params.title" style="padding:10px 0"></p>
                <div id="mainMap" class="mainMap" style="width:100%;height:300px;" v-if="dataObject.list[0].builder_id=='3000004' ">啊啊啊</div>
              </div>

            </div>
          </div>
        </div>
      </el-scrollbar>

    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import FromRequst from "@/fetch/modules/formTemplate.js";
import ChooseTab from "@/components/ChooseTab/ChooseTab.vue";
import coordtransform from "coordtransform";
export default {
  components: { ChooseTab },
  data() {
    return {
      codeVisible: false,
      dialogVisible: false,
      curTemplateId: "",
      dataArr: [],
      tableData: [],
      formLabelWidth: "120px",
      // 批量选中
      selectionValues: [],
      deleteMark: true,
      total_num: 0,
      switchData: [{ name: "已读反馈", active: "1" }, { name: "未读反馈", active: "2" }], // 上线下线,
      objSearch: {
        status: 1,
        q: "",
        current_page: 1,
        form_id: "",
        page_size: 10
      },
      formUserDetail: null,
      builder_params: {
        form_header: {
          bg: "",
          layout: 1, // 组件布局方式:1 上下布局 2左右布局
          text_align: 1, // 文字布局方式 1居左 2居中 3居右
          isShow: false
        },
        form_submit: {
          title: ""
        }
      }
    };
  },
  created() {
    this.objSearch.form_id = this.$route.query.form_id;
    this.getTemplate();
    this.getData();
  },
  computed: {},
  methods: {
    getData() {
      var args = this.objSearch;
      FromRequst.RequesFormUserList(args).then(res => {
        this.total_num = res.total_num;
        this.tableData = res.list;
      });
    },
    //编辑信息
    handEditor(row) {
      const form_id = row.form_id;
      this.$router.push({ name: "workDaily", query: { form_id: form_id } });
    },
    getTemplate() {
      FromRequst.RequesTemplateList({}).then(res => {
        this.curTemplateId = res[0].template_id;
        this.dataArr = res;
      });
    },
    changeTemplate(template_id) {
      this.curTemplateId = template_id;
    },
    // 查看详情
    checkDetail(row) {
      var args = {
        user_id: row.user_id,
        form_id: row.form_id
      };
      FromRequst.RequesFormUserDetail(args).then(res => {
        // this.formUserDetail = res;
        res.builder_tr.map((item, index) => {
          if (item.list[0].builder_id == "1000002" && item.list[0].builder_params.select_type == 2) {
            item.list[0].fill_content = item.list[0].fill_content.split(",");
            for (let i in item.list[0].fill_content) {
              item.list[0].fill_content[i] = +item.list[0].fill_content[i] - 1;
            }
          } else if (item.list[0].builder_id == "1000002" && item.list[0].builder_params.select_type == 1) {
            item.list[0].fill_content = +item.list[0].fill_content - 1;
          }

          if (item.list[0].builder_id == "1000004") {
            if (item.list[0].fill_content == null) {
              item.list[0].fill_content = [];
            }
            if (typeof item.list[0].fill_content == "string" && item.list[0].fill_content != null) {
              item.list[0].fill_content = item.list[0].fill_content.split(",");
              for (let i in item.list[0].fill_content) {
                item.list[0].fill_content[i] = +item.list[0].fill_content[i] - 1;
              }
            }
          }
          if (item.list[0].builder_id == "2000001" && item.list[0].builder_params.select_type == 2) {
            item.list[0].fill_content = item.list[0].fill_content.split(",");
            for (let i in item.list[0].fill_content) {
              item.list[0].fill_content[i] = +item.list[0].fill_content[i] - 1;
            }
          } else if (item.list[0].builder_id == "2000001" && item.list[0].builder_params.select_type == 1) {
            item.list[0].fill_content = +item.list[0].fill_content - 1;
          }
        });
        this.dataArr = res;
        res.builder_tr.map((item, index) => {
          if (item.list[0].builder_id == "3000004") {
            this.mapInit(item.list[0]);
          }
        });
        this.dialogVisible = true;
      });
    },
    //表单导出数据
    FormExport(row) {
      var args = {
        user_id: row.user_id,
        form_id: row.form_id
      };
      // var userAgent = navigator.userAgent.toLowerCase();
      //  if (userAgent != null && userAgent.indexOf("Firefox") >= 0 || userAgent.indexOf("Chrome") >= 0
      // 		 || userAgent.indexOf("Safari") >= 0) {
      // 	 fileName= new String((fileName).getBytes(), "ISO8859-1");
      //      } else {
      //     	 fileName=URLEncoder.encode(fileName,"UTF8"); //其他浏览器
      //      }
      window.location.href = "api/admin/formFillExport" + "?token=" + getToken() + "&user_id=" + row.user_id + "&form_id=" + row.form_id;
    },
    switchTemplate() {
      FromRequst.RequestFormApply({ template_id: this.curTemplateId }).then(res => {
        this.$router.push({
          name: "workDaily",
          query: { form_id: res.form_id }
        });
      });
    },
    // 上下线
    handleOnline(row) {
      FromRequst.RequesFormState({ form_id: row.form_id }).then(res => {
        this.getData();
      });
    },
    switchFn(active) {
      this.current_page = 1;
      this.objSearch.status = active;
      this.getData();
    },

    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      this.getData();
    },
    // 搜索关键词
    searchKeyword() {
      this.objSearch.current_page = 1;
      this.getData();
    },
    //排序
    TimeOn(sort) {
      this.objSearch.order_time = sort;
      this.getData();
    },
    // 批量选中
    selectionChange(vals) {
      this.selectionValues = vals;
      if (vals.length <= 0) {
        this.deleteMark = true;
      } else {
        this.deleteMark = false;
      }
    },
    //删除
    deleteClassfiy(row) {
      var form_id = row.form_id;
      this.deleteFn(form_id);
    },
    //  批量删除
    tabelDelete() {
      const selectionValues = this.selectionValues;
      var form_id = "";
      for (var i = 0; i < selectionValues.length; i++) {
        form_id += selectionValues[i].form_id + ",";
      }
      this.deleteFn(form_id);
    },
    //删除请求
    deleteFn(form_id) {
      this.$confirm("是否永久删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          FromRequst.RequesFormDelete({ form_id: form_id }).then(res => {
            this.getData();
            this.$Message({
              type: "success",
              text: "删除成功!"
            });
          });
        })
        .catch(() => {});
    },
    mapInit(item) {
      let th = this;
      // this.$nextTick(function() {

      // });
      this.$nextTick(function() {
        // MapJs("iyUj8juV15MB8qGwiM6BfwebPs3cUMOm").then(BMap => {
        // 创建Map实例
        var map = new BMap.Map("mainMap");
        var maker = [];
        let langLatArr = [];
        if (item.builder_params.lat && item.builder_params.lng) {
          langLatArr = coordtransform.gcj02tobd09(item.builder_params.lng, item.builder_params.lat);
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
        // var ac = new BMap.Autocomplete({
        //   //建立一个自动完成的对象
        //   input: "suggestId",
        //   location: map
        // });
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
        if (!item.builder_params.lng) {
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
        // ac.addEventListener("onconfirm", function(e) {
        //   //鼠标点击下拉列表后的事件
        //   var _value = e.item.value;
        //   myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        //   // console.log(myValue);
        //   th.mapTitle = myValue;
        //   th.userlocation.lng = e.target.yd.src.Oe.lng;
        //   th.userlocation.lat = e.target.yd.src.Oe.lat;
        //   setPlace();
        // });

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
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-footer {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .search-box {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .box-card {
    margin-bottom: 30px;
  }
  .search {
    //   width: 30%;
    display: flex;
    margin-right: 2%;
    align-items: center;
  }
}
.btn-wrap {
  text-align: center;
  margin-top: 30px;
}
.table-title {
  margin: 20px 0;
}
.panel-group {
  margin: 40px auto auto;
  text-align: center;
  font-size: 0;
}
.card-panel {
  display: inline-block;
  margin: 0 8px 20px;
  width: 300px;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border: 2px solid #efebeb;
  border-radius: 10px;
  .template-pic {
    width: 100%;
    height: 185px;
  }
  h2 {
    text-align: center;
    font-size: 20px;
    font-weight: normal;
  }
  &:hover,
  &.active {
    border: 2px solid #39bcf3;
    cursor: pointer;
  }
  .icon-people {
    color: #40c9c6;
  }
  .icon-message {
    color: #36a3f7;
  }
  .icon-money {
    color: #f4516c;
  }
  .icon-shoppingCard {
    color: #34bfa3;
  }
  .card-panel-icon-wrapper {
    float: left;
    margin: 25px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }
  .card-panel-icon {
    float: left;
    font-size: 58px;
  }
  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 40px 26px 26px;
    margin-left: 0px;
    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 18px;
      margin-bottom: 12px;
    }
    .card-panel-num {
      font-size: 26px;
    }
  }
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
  background: url("./../../../static/images/preview.png");
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

.inpt-fill_content {
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
  border: 1px #17b1ed solid;
  color: #848484;
  padding: 10px !important;
  font-size: 14px;
  margin-top: 10px;
  word-break: break-all; /* 支持IE和chrome，FF不支持*/
  word-wrap: break-word; /* 以上三个浏览器均支持 */
}
.d-input {
  width: 100%;
  // height: 30px;
  color: #848484;
  font-size: 14px;
  border-bottom: 1px #ebeef5 solid;
  /* border-bottom: 1px #17b1ed solid; */
  margin-top: 10px;
  padding: 10px 0px;
  word-break: break-all; /* 支持IE和chrome，FF不支持*/
  word-wrap: break-word; /* 以上三个浏览器均支持 */
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
  height: 160px;
  background-size: cover;
  background-clip: content-box;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  overflow: hidden;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 10px;
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
</style>
<style>
.d-detail-group .el-radio-group {
  width: 100%;
}
</style>

