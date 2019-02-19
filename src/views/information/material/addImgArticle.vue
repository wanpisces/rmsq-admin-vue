<template>
  <div v-loading="loading" class="page_box">
    <div class="form_header form_bottom">
      <div class="form_header_title">
        <div>同步选择</div>
      </div>
      <div style="width:500px;margin:20px auto">
        <el-form :model="oridary" ref="addItemData" label-width="170px" class="demo-ruleForm">
          <el-form-item label="是否同步至微信公众号:" prop="to_mp" :rules="[ { required: true, message: '请选择活动资源', trigger: 'change' }]">
            <el-radio-group v-model="oridary.to_mp" @change="handleWeixinRadio">
              <el-radio label="2" :disabled="news_id?true:false">否</el-radio>

              <el-radio label="1" :disabled="news_id?true:false">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="oridary.to_mp==1  ">
            <!-- <el-form-item label="已选择:">
              <ol class="">
                <li v-for="(item,index) in oridary.mp_list" :key="index">{{ item.app_name || item.title}}</li>
              </ol>
            </el-form-item> -->
            <!-- <el-form-item> -->
            <div style="margin-bottom:10px" v-if="!news_id">
              <el-input v-model="search.m" placeholder="请输入公众号" style="width:200px"></el-input>
              <el-button @click="handleSearch(1)" type="primary"> 搜索</el-button>
            </div>
            <el-table ref="mpDataTable" :data="mpData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeMp">
              <el-table-column type="selection" width="55" v-if="!news_id">
              </el-table-column>
              <el-table-column type="index" width="50">
              </el-table-column>
              <el-table-column prop="name" label="类型" width="120">
                <template slot-scope="scope">{{{1:'服务号',2:'订阅号'}[scope.row.type] }}</template>
              </el-table-column>
              <el-table-column prop="app_name" label="公众号名称" show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <div class="form_tips" style="margin:10px 0" v-if="oridary.to_mp==1">温馨提示:公众号每个月发文次数有限，服务号一个月仅可发布4次，订阅号一天只能发1次，未发布成功，说明次数已用完</div>
          </div>
          <el-form-item label="是否同步至微博:" prop="to_weibo" :rules="[ { required: true, message: '请选择活动资源', trigger: 'change' }]">
            <el-radio-group v-model="oridary.to_weibo" @change="handleWeiboRadio">
              <el-radio label="2" :disabled="news_id?true:false">否</el-radio>
              <el-radio label="1" :disabled="news_id?true:false">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="oridary.to_weibo==1 ">
            <el-table ref="mpDataTable" :data="weiboData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeWeibo">
              <el-table-column type="selection" width="55" v-if="!news_id">
              </el-table-column>
              <el-table-column type="index" width="50">
              </el-table-column>
              <el-table-column prop="screen_name" label="微博名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="55">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handAuthor(scope.row)" :disabled="scope.row.need_auth==2">{{{2:'正常',1:'授权'}[scope.row.need_auth]}}</el-button>

                </template>
              </el-table-column>
            </el-table>
            <div class="form_tips" style="margin:10px 0" v-if="oridary.to_weibo==1">温馨提示:操作状态为“授权”时，说明账号授权已过期，需点击重新授权，资讯标题需在5~30字之间</div>
          </div>
          <el-form-item label="是否同步至头条:" prop="to_toutiao" :rules="[ { required: true, message: '请选择活动资源', trigger: 'change' }]">
            <el-radio-group v-model="oridary.to_toutiao" @change="handleToutiaoRadio">
              <el-radio label="2" :disabled="news_id?true:false">否</el-radio>
              <el-radio label="1" :disabled="news_id?true:false">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="oridary.to_toutiao==1 ">
            <el-table ref="mpDataTable" :data="toutiaoData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeToutiao">
              <el-table-column type="selection" width="55" v-if="!news_id">
              </el-table-column>
              <el-table-column type="index" width="50">
              </el-table-column>
              <el-table-column prop="toutiao_account" label="头条名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="55">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handToutiaoAuthor(scope.row)" :disabled="scope.row.need_auth==2">{{{2:'正常',1:'授权'}[scope.row.need_auth]}}</el-button>

                </template>
              </el-table-column>
            </el-table>
            <div class="form_tips" style="margin:10px 0" v-if="oridary.to_toutiao==1">温馨提示:操作状态为“授权”时，说明账号授权已过期，需点击重新授权,资讯标题需在5~30字之间</div>
          </div>
          <el-form-item label="是否同步至快传:" prop="to_kuaichuan" :rules="[ { required: true, message: '请选择快传', trigger: 'change' }]">
            <el-radio-group v-model="oridary.to_kuaichuan" @change="handleKuaichuanRadio">
              <el-radio label="2" :disabled="news_id?true:false">否</el-radio>
              <el-radio label="1" :disabled="news_id?true:false">是</el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-if="oridary.to_kuaichuan==1 ">
            <el-table ref="mpDataTable" :data="kuaichuanData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeKuaichuan">
              <el-table-column type="selection" width="55" v-if="!news_id">
              </el-table-column>
              <el-table-column type="index" width="50">
              </el-table-column>
              <el-table-column prop="kuaichuan_account" label="快传名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="55">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handKuaichuanAuthor(scope.row)" :disabled="scope.row.kuaichuan_login_state==2">{{{2:'正常',1:'授权'}[scope.row.kuaichuan_login_state]}}</el-button>

                </template>
              </el-table-column>
            </el-table>
            <div class="form_tips" style="margin:10px 0" v-if="oridary.to_kuaichuan==1">温馨提示:操作状态为“授权”时，说明账号授权已过期，需点击重新授权,资讯标题需在5~30字之间</div>
          </div>

          <el-form-item label="是否同步至百家号:" prop="to_baijia" :rules="[ { required: true, message: '请选择快传', trigger: 'change' }]">
            <el-radio-group v-model="oridary.to_baijia" @change="handleBaijiaRadio">
              <el-radio label="2" :disabled="news_id?true:false">否</el-radio>
              <el-radio label="1" :disabled="news_id?true:false">是</el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-if="oridary.to_baijia==1 ">
            <el-table ref="mpDataTable" :data="baijiaData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeBaijia">
              <el-table-column type="selection" width="55" v-if="!news_id">
              </el-table-column>
              <el-table-column type="index" width="50">
              </el-table-column>
              <el-table-column prop="baijia_account" label="百家号名称" show-overflow-tooltip>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="55">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handBaijiaAuthor(scope.row)" :disabled="scope.row.baijia_login_state==2">{{{2:'正常',1:'授权'}[scope.row.baijia_login_state]}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="form_tips" style="margin:10px 0" v-if="oridary.to_baijia==1">温馨提示:操作状态为“授权”时，说明账号授权已过期，需点击重新授权,资讯标题需在8~30字之间</div>
          </div>

        </el-form>

      </div>

    </div>
    <div class="form_header form_bottom">
      <div class="form_header_title">
        <div>资讯编辑</div>
      </div>
    </div>

    <section>
      <div class="img_article_box">
        <div style="z-index:999" class="img_article_list" :class="searchBarFixed == true ? 'isFixed' :''">
          <h4 class="img_article_list_title">图文列表</h4>
          <div class="list_box">
            <div v-for="(item,index) in addItemData" :key="index">

              <!-- 列表第一项 -->
              <div @click.stop="changeActive(index)" v-if="index == 0" class="list_item" :class="{ active_item: index == activeItem}">
                <!-- :style="{backgroundImage: 'url(' + item.news_pic + ')'}" -->
                <div class="list_mask">
                  <img :src="item.showBaseUrl?baseUrl +item.news_pic:item.news_pic" width="214px" v-if="item.news_pic" height="120px" alt="">
                  <div class="list_title">
                    <p class="line_ellipsis_2">{{item.news_title == '' ? '标题' : item.news_title}}</p>
                  </div>
                </div>
                <div class="list_sort">
                  <i v-if="index != addItemData.length -1" @click="sortDown(index)" class="wx-manage-jiantou icon_down"></i>
                  <i @click.stop="listDel(index)" class="wx-manage-delete icon_del"></i>
                </div>
              </div>
              <!-- 列表其他项 -->
              <div @click.stop="changeActive(index)" v-else class="list_item2" :class="{ active_item: index == activeItem}">
                <p class="ellipsos">{{item.news_title == '' ? '标题' : item.news_title }}</p>
                <!-- :style="{backgroundImage: 'url(' + item.news_pic  + ')'}" -->
                <div class="item2_Thumbnail">
                  <img :src="baseUrl +item.news_pic" alt="" v-if="item.news_pic" width="48px" height="48px">
                </div>
                <div class="list_sort">
                  <i v-if="index != 0" @click="sortUp(index)" class="wx-manage-jiantou1 icon_up"></i>
                  <i v-if="index != addItemData.length -1" @click="sortDown(index)" class="wx-manage-jiantou icon_down"></i>
                  <i @click.stop="listDel(index)" class="wx-manage-delete icon_del"></i>
                </div>
              </div>
            </div>
            <div v-if="addItemData.length < (oridary.to_mp == 1? numMp:5) && !news_id " class="list_item3">
              <div @click="addImgArticle" class="add_icon">
                <i class="wx-manage-tianjia"></i>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="editor_container">
        <div style="border:1px #eee solid">
          <div class="message_footer">
            <el-form label-position="top" :model="addItemData[activeItem]" ref="addItemData">
              <el-form-item label="选择资讯类型" prop="news_type" :rules="[ { required: true, message: '请选择活动资源', trigger: 'change' }]">
                <el-radio-group v-model="addItemData[activeItem].news_type">
                  <el-radio label="1">图文资讯</el-radio>
                  <el-radio label="2" :disabled="(oridary.to_mp==1|| oridary.to_weibo==1 || oridary.to_toutiao==1 || oridary.to_kuaichuan==1 || oridary.to_baijia==1)?true:false">图片资讯</el-radio>
                  <el-radio label="3" :disabled="(oridary.to_mp==1|| oridary.to_weibo==1 || oridary.to_toutiao==1 || oridary.to_kuaichuan==1  || oridary.to_baijia==1)?true:false">视频资讯</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="资讯名称" prop="news_title" :rules="[ { required: true, message: '请选填写资讯名称', trigger: 'blur' }]">
                <el-input size="mini" placeholder="请输入资讯名称" v-model="addItemData[activeItem].news_title" style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="资讯来源" prop="news_source">
                <el-input size="mini" placeholder="请输入资讯来源" v-model="addItemData[activeItem].news_source" style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="原文链接" prop="news_link" v-if="oridary.to_mp==1">
                <el-input size="mini" placeholder="请输入链接地址,若没有链接地址默认为http://rmsqnet.com/" v-model="addItemData[activeItem].news_link" style="width:400px"></el-input>
              </el-form-item>
              <!-- 图片资源 -->
              <div v-if="addItemData[activeItem].news_type==2">
                <el-form-item label="资讯正文" prop="news_link" :rules="[ { required: true, message: '请上传图片', trigger: 'blur' }]">
                  <el-button @click="selectContent(3)" size="mini">从图片库选择</el-button>
                  <div class="img-flex">
                    <!-- <div v-for="(items,index) in addItemData[activeItem].content_url" v-if="addItemData[activeItem].content_url.length!=0" :key="index">
                      <img :src="items" width="100px" height="100px" v-if="items" alt="">
                    </div> -->
                    <!-- :style="{backgroundImage: 'url(' +items  + ')'}" -->
                    <div v-for="(items,index) in addItemData[activeItem].content_url" v-if="addItemData[activeItem].content_url.length!=0" :key="index" class="cover_img" style="width:214px;height:120px">
                      <img :src="baseUrl +items" v-if="items" alt="" width="214px" height="120px">
                      <div class="cover_img_mask" style="width:214px;height:120px">
                        <i @click="handleDeleteContentUrl(index)" class="wx-manage-delete icon_del"></i>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </div>
              <div v-if="addItemData[activeItem].news_type==3">
                <el-form-item label="资讯正文" prop="" :rules="[ { required: true, message: '请上传图片', trigger: 'blur' }]">
                  <el-button @click="selectContent(4)" size="mini">从视频库选择</el-button>
                  <div class="img-flex">
                    <!-- <div v-for="(items,index) in addItemData[activeItem].content_url" v-if="addItemData[activeItem].content_url.length!=0" :key="index">
                      <img :src="items" width="100px" height="100px" v-if="items" alt="">
                    </div> -->
                    <div>
                      <video :src="this.baseUrl +addItemData[activeItem].video_url" v-if="addItemData[activeItem].video_url" controls="controls" width="400px"></video>
                    </div>
                  </div>

                </el-form-item>
              </div>
              <div v-if="addItemData[activeItem].news_type!=1">
                <el-form-item label="资讯描述" prop="news_intro">
                  <el-input size="mini" type="textarea" placeholder="请输入资讯描述" v-model="addItemData[activeItem].news_intro" style="width:400px"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <!-- 图文信息 -->
        <div v-if="addItemData[activeItem].news_type==1" style="position:relative">
          <UE @changeCover="selectContent(0)" :placeholderMsg="placeholderMsg" :dataObject="addItemData[activeItem]" :config="config" :id="activeItem+''" ref="ue"></UE>
        </div>
        <div style="border:1px rgb(238, 238, 238) solid">
          <div class="message_footer">
            <el-form label-position="top" :model="addItemData[activeItem]" ref="addItemData">
              <el-form-item label="小程序展示位置：">
                <div class="category_name" style="width:400px">
                  <el-radio-group v-model="addItemData[activeItem].run_in">
                    <el-radio label="1">栏目资讯</el-radio>
                    <el-radio label="5">服务资讯</el-radio>
                    <el-radio label="2">轮播</el-radio>
                    <el-radio label="3" v-if="adminType==0">官方快报</el-radio>
                    <el-radio label="4">推荐</el-radio>
                    <el-radio label="6" v-if="adminType==0">最热</el-radio>
                    <el-radio label="7" v-if="adminType==0">新时代</el-radio>
                    <el-radio label="8" v-if="adminType==0">全视界</el-radio>
                    <el-radio label="9" v-if="adminType==0">洞鉴</el-radio>
                    <!-- <el-radio :key="items.run_in" :label="items.run_name" :value="items.run_in" v-for="(items,index) in runInData"> </el-radio> -->
                    <!-- <el-radio label="5">栏目</el-radio> -->
                    <!-- <el-radio :label="5">按钮</el-radio> -->
                  </el-radio-group>
                </div>

                <!-- {{addItemData[activeItem].run_in}} -->
              </el-form-item>
              <el-form-item label="投放服务：" v-if="addItemData[activeItem].run_in==5" prop="category_id" :rules="[{ required: true, message:'请选择投放模块', trigger: 'blur'}]">
                <el-select v-model="addItemData[activeItem].category_id" placeholder="请选择" style="width:200px" @change="hanldeCategory">
                  <el-option v-for="item in moduleData" :key="item.category_id" :label="item.category_name" :value="item.category_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="投放分类：" v-if="addItemData[activeItem].run_in==5">
                <el-select v-model="addItemData[activeItem].attr_id" placeholder="请选择" style="width:200px">
                  <el-option v-for="item in classificationData" :key="item.attr_id" :label="item.attr_value" :value="item.attr_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="投放栏目：" v-if="addItemData[activeItem].run_in==1" prop="category_id" :rules="[{ required: true, message:'请选择投放模块', trigger: 'blur'}]">
                <el-select v-model="addItemData[activeItem].module_category_id" placeholder="请选择" style="width:200px">
                  <el-option v-for="item in moduleCateoryData" :key="item.category_id" :label="item.category_name" :value="item.category_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <div v-if="addItemData[activeItem].run_in==1 ||addItemData[activeItem].run_in==3 ||addItemData[activeItem].run_in==4 || addItemData[activeItem].run_in==6 || addItemData[activeItem].run_in==7 || addItemData[activeItem].run_in==8 || addItemData[activeItem].run_in==9">
                <el-form-item label="是否置顶：">
                  <el-radio-group v-model="addItemData[activeItem].is_top">
                    <el-radio label="1">否</el-radio>
                    <el-radio label="2">是</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div v-if="adminType!=2 && adminType!=3">
                  <el-form-item label="投放置顶：" prop="to_top_type" v-if="addItemData[activeItem].is_top==2 && addItemData[activeItem].run_in==4" :rules="[{ required: true, message:'请选择投放置顶', trigger: 'blur'}]">
                    <el-radio-group v-model="addItemData[activeItem].to_top_type">
                      <div class="is_top">
                        <el-radio label="0">
                          当前{{{1:'社区',2:'街道',3:'区县',4:'市',5:'省'}[role]}} </el-radio>
                      </div>
                      <div v-if="adminType==0">
                        <el-radio label="1">
                          全国
                        </el-radio>
                      </div>
                      <!-- <div class="is_top">
                      <el-radio label="2" v-if="role<=5 || role==0">
                        全国
                        <span v-if="newsTop.province.expiredate "> 剩余时间： {{newsTop.province.expiredate || ''}} </span>
                      </el-radio>

                    </div> -->
                      <div class="is_top" v-if="role<=5  && role!=0">
                        <el-radio label="2" :disabled="newsTopActive.province">
                          省
                          <span v-if="newsTop.province.expiredate "> 到期时间： {{newsTop.province.expiredate || ''}} </span>
                          <!-- <span v-if="newsTop.area.expiredate"> 剩余条数： {{newsTop.city.num || ''}} </span> -->
                        </el-radio>
                      </div>
                      <div class="is_top" v-if="role<=4  && role!=0">
                        <el-radio label="3" :disabled="newsTopActive.city">
                          市
                          <span v-if="newsTop.city.expiredate"> 到期时间： {{newsTop.city.expiredate || ''}} </span>
                          <!-- <span v-if="newsTop.area.expiredate"> 剩余条数： {{newsTop.area.num || ''}} </span> -->
                        </el-radio>

                      </div>

                      <div class="is_top" v-if="role<=3  && role!=0">
                        <el-radio label="4" :disabled="newsTopActive.area">
                          区县
                          <span v-if="newsTop.area.expiredate "> 到期时间： {{newsTop.area.expiredate || ''}}</span>
                          <!-- <span v-if="newsTop.area.expiredate"> 剩余条数： {{newsTop.street.num || ''}} </span> -->
                        </el-radio>
                      </div>
                      <div class="is_top" v-if="role<=2 && role!=0">
                        <el-radio label="5" :disabled="newsTopActive.street">
                          街道/乡/镇
                          <span v-if="newsTop.street.expiredate "> 到期时间： {{newsTop.street.expiredate || ''}}</span>
                          <!-- <span v-if="newsTop.area.expiredate"> 剩余条数： {{newsTop.street.num || ''}} </span> -->
                        </el-radio>
                      </div>

                    </el-radio-group>
                  </el-form-item>
                </div>
                <div v-if="adminType==3">
                  <el-form-item label="投放置顶：" prop="to_top_type" v-if="addItemData[activeItem].is_top==2 && addItemData[activeItem].run_in==4" :rules="[{ required: true, message:'请选择投放置顶', trigger: 'blur'}]">
                    <el-radio-group v-model="addItemData[activeItem].to_top_type">
                      <div class="is_top">
                        <el-radio label="0">
                          当前{{{1:'社区',2:'街道',3:'区县',4:'市',5:'省'}[role]}} </el-radio>
                      </div>
                      <div v-if="adminType==0">
                        <el-radio label="1">
                          全国
                        </el-radio>
                      </div>
                      <!-- <div class="is_top">
                      <el-radio label="2" v-if="role<=5 || role==0">
                        全国
                        <span v-if="newsTop.province.expiredate "> 剩余时间： {{newsTop.province.expiredate || ''}} </span>
                      </el-radio>

                    </div> -->
                      <div class="is_top" v-if="role==5  && role!=0">
                        <el-radio label="2" :disabled="newsTopActive.province">
                          省
                          <span v-if="newsTop.province.expiredate "> 到期时间： {{newsTop.province.expiredate || ''}} </span>
                          <!-- <span v-if="newsTop.area.expiredate"> 剩余条数： {{newsTop.city.num || ''}} </span> -->
                        </el-radio>
                      </div>
                      <div class="is_top" v-if="role==4  && role!=0">
                        <el-radio label="3" :disabled="newsTopActive.city">
                          市
                          <span v-if="newsTop.city.expiredate"> 到期时间： {{newsTop.city.expiredate || ''}} </span>
                          <!-- <span v-if="newsTop.area.expiredate"> 剩余条数： {{newsTop.area.num || ''}} </span> -->
                        </el-radio>

                      </div>

                      <div class="is_top" v-if="role==3  && role!=0">
                        <el-radio label="4" :disabled="newsTopActive.area">
                          区县
                          <span v-if="newsTop.area.expiredate "> 到期时间： {{newsTop.area.expiredate || ''}}</span>
                          <!-- <span v-if="newsTop.area.expiredate"> 剩余条数： {{newsTop.street.num || ''}} </span> -->
                        </el-radio>
                      </div>
                      <!-- <div class="is_top" v-if="role==2 && role!=0">
                        <el-radio label="5" :disabled="newsTopActive.street">
                          街道/乡/镇
                          <span v-if="newsTop.street.expiredate "> 到期时间： {{newsTop.street.expiredate || ''}}</span>
                        </el-radio>
                      </div> -->
                    </el-radio-group>
                  </el-form-item>
                </div>

              </div>

              <div v-if="addItemData[activeItem].run_in==2">
                <el-form-item label="轮播标题：" prop="banner_title" :rules="[{ required: true, message:'轮播标题', trigger: 'blur'}]">
                  <el-input v-model="addItemData[activeItem].banner_title" style="width:500px" controls-position="right"></el-input>
                </el-form-item>
                <el-form-item label="轮播上传：" prop="banner_pic" :rules="[{ required: true, message:'上传轮播图片', trigger: 'blur'}]">
                  <!-- <el-upload class="avatar-uploader" action="...." :show-file-list="false" :before-upload="beforeUploadImage">
                    <img v-if="addItemData[activeItem].banner_pic" :src="baseUrl+addItemData[activeItem].banner_pic" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload> -->
                  <vue-cropper @change="callBackImg" :fixedRatio='[2,1]' :cropWidth="400" :cropHeight="200">
                  </vue-cropper>
                  <div v-if="addItemData[activeItem].banner_pic" style="margin-top:8px">
                    <img :src="baseUrl+addItemData[activeItem].banner_pic" width="240" height="120" alt="">
                  </div>

                </el-form-item>
                <el-form-item label="排序：">
                  <el-input-number v-model="addItemData[activeItem].bsort" controls-position="right" :min="1" :max="10"></el-input-number>
                </el-form-item>
              </div>
              <div v-if=" addItemData[activeItem].run_in!=2 ">
                <el-form-item label="资讯封面类型">
                  <el-radio-group v-model="addItemData[activeItem].news_pic_type">
                    <el-radio label="0" :disabled="(oridary.to_mp==1|| oridary.to_weibo==1 || oridary.to_toutiao==1 || oridary.to_kuaichuan==1 || oridary.to_baijia==1)?true:false">无图</el-radio>
                    <el-radio label="1">小图</el-radio>
                    <el-radio label="2">大图</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="资讯封面" v-if="addItemData[activeItem].news_pic_type!=0 ">
                  <div class="i_upload">
                    <el-button @click="selectContent(0)" size="mini" style="margin-right:10px">从图片库选择</el-button>
                    <!-- <vue-cropper @change="callBackImgNews" :fixedRatio='[4,3]' :cropWidth="fixedRatio[0]*100" :cropHeight="fixedRatio[1]*100">
                    </vue-cropper> -->
                  </div>
                  <!-- :style="{backgroundImage: 'url(' + addItemData[activeItem].news_pic  + ')'}" -->
                  <div v-if="addItemData[activeItem].news_pic" class="cover_img-1">
                    <img :src="addItemData[activeItem].showBaseUrl?baseUrl+addItemData[activeItem].news_pic:addItemData[activeItem].news_pic" v-if="addItemData[activeItem].news_pic" width="214px" height="120px" alt="">
                    <div class="cover_img_mask" style="width:214px">
                      <i @click="addItemData[activeItem].news_pic = ''" class="wx-manage-delete icon_del"></i>
                    </div>
                  </div>
                </el-form-item>
              </div>
              <el-form-item label="是否在文章头部显示封面：" v-if="oridary.to_mp==1">
                <el-radio-group v-model="addItemData[activeItem].show_pic">
                  <el-radio label="2">否</el-radio>
                  <el-radio label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="img_article_box" style="width:200px" v-if="addItemData[activeItem].news_type==1">
        <div style="width:115px;" class="img_article_multimedia" :class="searchBarFixed == true ? 'isFixed' :''">
          <h4 class="img_article_list_title">多媒体</h4>
          <div class="multimedia_box">
            <!-- <ul> -->
            <p @click="selectContent(1)">
              <i class="wx-manage-tupian"></i>
              插入图片
            </p>
            <p @click="selectContent(2)">
              <i class="wx-manage-shipin4"></i>
              插入视频
            </p>
            <!-- </ul> -->
          </div>
        </div>
      </div>
    </section>
    <div class="form_header" style="min-height:450px; margin:8px auto ;margin-bottom:150px;padding-bottom:20px">
      <div class="form_header_title">
        <div>其他设置</div>
      </div>
      <div style="width:750px;margin:30px  auto">
        <el-form :model="oridary" ref="addItemData" label-width="160px" class="demo-ruleForm">
          <el-form-item label="样式选择:" prop="to_mp" :rules="[ { required: true, message: '请选择活动资源', trigger: 'change' }]">
            <el-radio-group v-model="oridary.show_at">
              <el-radio label="1">原生样式
                <el-tooltip class="item" effect="dark" placement="bottom-start">
                  <div slot="content">温馨提示:原生样式下，您从第三方编辑器（例如：135编辑器、96编辑器等）<br />粘贴过来的内容样式将无法在小程序端内容详情中显示，显示样式为小程序内<br />置较为单一的样式。</div>
                  <img src="https://img.sqydt.darongshutech.com/token_file_201811061628598343.jpg" width="20px" />
                </el-tooltip>
              </el-radio>
              <el-radio label="2">
                h5样式
                <el-tooltip class="item" effect="dark" placement="bottom-start">
                  <div slot="content">温馨提示:您从第三方编辑器例如：135编辑器、96编辑器等）粘贴过来<br />的内容样式将在小程序端内容详情中显示，显示样式较为丰富多彩，但<br />可能会出现加载缓慢等情况。</div>
                  <img src="https://img.sqydt.darongshutech.com/token_file_201811061628598343.jpg" width="20px" />
                </el-tooltip>
              </el-radio>
            </el-radio-group>

            <!--  -->
            <p class="form_tips"></p>
            <p class="form_tips"></p>
          </el-form-item>
          <el-form-item label="是否关联活动:" prop="link_miniprogram" :rules="[ { required: true, message: '请选择活动资源', trigger: 'change' }]">
            <el-radio-group v-model="oridary.link_miniprogram">
              <el-radio label="2">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
            <el-tooltip class="item" effect="dark" placement="bottom-start">
              <div slot="content">温馨提示:同步公众号，关联活动需先关联小程序，如果<br />未关联小程序请联系客服人员。客服电话：028-87750193</div>
              <img src="https://img.sqydt.darongshutech.com/token_file_201811061628598343.jpg" width="20px" />
            </el-tooltip>
          </el-form-item>
          <!-- <el-form-item label="关联活动:" v-if="oridary.link_miniprogram==1" prop="activity_list" :rules="[ { required: true, message: '请选择活动', trigger: 'change' }]">
            <el-select v-model="oridary.activity_list" multiple filterable allow-create default-first-option placeholder="请选择活动" style="width:600px">
              <el-option v-for="item in mpActiveData" :key="item.branch_id" :label="item.service_title" :value="item.branch_id">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="已选择:" v-show="oridary.link_miniprogram==1">
            <ol class="">
              <li v-for="(item,index) in oridary.activity_list" :key="index">{{ item.service_title || item.title}}</li>
            </ol>
          </el-form-item>

          <el-form-item label="关联活动:" v-show="oridary.link_miniprogram==1">
            <div style="margin-bottom:10px">
              <el-input v-model="search.q" placeholder="请输入活动名称" style="width:200px"></el-input>
              <el-button @click="handleSearch(2)" type="primary"> 搜索</el-button>
            </div>

            <el-table ref="mpActiveDataTable" height="200" :data="mpActiveData" tooltip-effect="dark" style="width: 80%" @selection-change="handleSelectionChangeMpActive">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column type="index" width="50">
              </el-table-column>
              <el-table-column prop="name" label="类型" width="120">
                <template slot-scope="scope">{{{1:'社区活动',2:'随手拍（审核）',3:"随手拍（不审核）",4:'投票',5:'评选',6:'问卷调查'}[scope.row.type] }}</template>
              </el-table-column>
              <el-table-column prop="service_title" label="活动名称" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="小程序资讯发布时间:" prop="put_time">
            <el-date-picker v-model="oridary.put_time" type="datetime" placeholder="选择小程序资讯发布时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="微信资讯发布时间:" prop="put_mp_time" v-if="oridary.to_mp!=2">
            <el-date-picker v-model="oridary.put_mp_time" type="datetime" placeholder="选择微信资讯发布时间" :disabled="news_id?true:false">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="微博资讯发布时间:" prop="put_weibo_time" v-if="oridary.to_weibo!=2">
            <el-date-picker v-model="oridary.put_weibo_time" type="datetime" placeholder="选择微博资讯发布时间" :disabled="news_id?true:false">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="头条资讯发布时间:" prop="put_toutiao_time" v-if="oridary.to_toutiao!=2">
            <el-date-picker v-model="oridary.put_toutiao_time" type="datetime" placeholder="选择头条资讯发布时间" :disabled="news_id?true:false">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="快传资讯发布时间:" prop="put_kuaichuan_time" v-if="oridary.to_kuaichuan!=2">
            <el-date-picker v-model="oridary.put_kuaichuan_time" type="datetime" placeholder="选择快传资讯发布时间" :disabled="news_id?true:false">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="百家资讯发布时间:" prop="put_kuaichuan_time" v-if="oridary.to_baijia!=2">
            <el-date-picker v-model="oridary.put_baijia_time" type="datetime" placeholder="选择百家资讯发布时间" :disabled="news_id?true:false">
            </el-date-picker>
          </el-form-item>
          <p class="form_tips">温馨提示：如您不设置时间，系统默认为审核员审核通过后进行发布。</p>
        </el-form>
      </div>

    </div>
    <!-- <div class="form_header" style="min-height:400px; margin: 5px auto 0px;">
      <div style="width:750px;margin:0 auto">
        <el-form :model="oridary" ref="addItemData" label-width="160px" class="demo-ruleForm">
          <el-form-item label="">

          </el-form-item>

        </el-form>
      </div>

    </div> -->

    <div v-if="dialogVisible">
      <el-dialog title="提示" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
        <load-image v-if="imageType != 2 && imageType!=4" :state="2" @onSuccess="changeChoose"></load-image>
        <load-vedio v-else :state="2" @onSuccess="changeVedioChoose"></load-vedio>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleChoose">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div v-if="dialogVisibleIphone">
      <el-dialog title="" :visible.sync="dialogVisibleIphone" width="411px" :show-close="false" style="background:rgba(0,0,0,.4)">
        <iphone-view :value="addItemData"></iphone-view>
      </el-dialog>
    </div>

    <footer>
      <el-row class="foot_box">
        <el-button type="primary" @click="addMaterial(1)">提交审核</el-button>
        <el-button type="primary" @click="addMaterial(2)">保存</el-button>
        <el-button @click="handleView">预览</el-button>
        <el-button @click="returnList($route.query.active)">取消</el-button>
      </el-row>
    </footer>
    <!-- 头条授权 -->
    <el-dialog title="重新授权" :visible.sync="releaseDialog" :before-close="handleCloseCode" :close-on-click-modal="false" width="400px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="账号：" label-width="120px" prop="toutiao_account">
          <el-input v-model="ruleForm.toutiao_account" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码：" label-width="120px" prop="toutiao_pwd">
          <el-input v-model="ruleForm.toutiao_pwd" auto-complete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" label-width="120px" prop="captcha">
          <div class="beg-input">
            <el-input type="text" placeholder="请输入您的验证码" v-model="ruleForm.captcha"></el-input>
            <!-- <el-input v-model="ruleForm.toutiao_account" auto-complete="off"></el-input> -->
            <div class="verify-img" @click="handleVerify"><img :src="captcha_img" alt="验证码"></div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitFormAuth('ruleForm')" :disabled="btnMark">确 定</el-button>
      </div>
      <!-- 头条授权 -->
      <el-dialog width="300px" title="手机安全认证" :visible.sync="TouTiaoInnerVisible" append-to-body :before-close="handleCloseIphone">
        <el-form :model="ruleFormIphone" :rules="rulesFormIphone" ref="ruleFormIphone">
          <el-form-item label="手机号：" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="ruleFormIphone.mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="验证码：" :label-width="formLabelWidth" prop="captcha">
            <div class="beg-input">
              <el-input type="text" placeholder="请输入您的验证码" v-model="ruleFormIphone.captcha"></el-input>
              <div class="verify-img" @click="handleVerifyIphone"><img :src="captcha_imgIphone" alt="验证码"></div>
            </div>
          </el-form-item>
          <el-form-item label="手机验证码：" :label-width="formLabelWidth" prop="code">
            <div class="beg-input" style="display:flex; align-items: center">
              <el-input type="text" placeholder="请输入您的手机验证码" v-model="ruleFormIphone.code" style="width:77%"></el-input>
              <!-- <div class="verify-img-code" ></div> -->
              <el-button @click="handleIphoneCode" size="mini" :disabled="deleteMarkCode">{{codeMsg}}</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <div style="text-align:center">
              <el-button @click="resetFormIphone('ruleFormIphone')">取 消</el-button>
              <el-button type="primary" @click="submitFormIphone('ruleFormIphone')" :disabled="btnMarkIphone">提 交</el-button>
            </div>

          </el-form-item>
        </el-form>
      </el-dialog>
    </el-dialog>
    <!-- 快传授权 -->
    <el-dialog width="300px" title="快传授权" :visible.sync="kuaichuanInnerVisible" append-to-body :before-close="handleCloseKuaichuan">
      <el-form :model="ruleFormKuaichuan" :rules="ruleFormKuaichuanOne" ref="ruleFormKuaichuans">
        <el-form-item label="账号：" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="ruleFormKuaichuan.kuaichuan_account" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码：" label-width="120px" prop="toutiao_pwd">
          <el-input v-model="ruleFormKuaichuan.kuaichuan_pwd" auto-complete="off" type="password" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" :label-width="formLabelWidth" prop="captcha">
          <div class="beg-input">
            <el-input type="text" placeholder="请输入您的验证码" v-model="ruleFormKuaichuan.captcha"></el-input>
            <div class="verify-img" @click="handleVerifyKuaichuan"><img :src="captcha_imgKuaichuan" alt="验证码"></div>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="text-align:center">
            <el-button @click="resetFormKuaichuan('ruleFormKuaichuans')">取 消</el-button>
            <el-button type="primary" @click="submitFormKuaichuan('ruleFormKuaichuans')" :disabled="btnMarkIphone">提 交</el-button>
          </div>

        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 百家号 -->
    <el-dialog title="百家授权" :visible.sync="baijiaInnerVisible" :before-close="handleCloseBaijia" :close-on-click-modal="false" width="400px">
      <el-form :model="ruleFormBaijia" :rules="ruleFormBaijiaOne" ref="ruleFormBaijias">
        <el-form-item label="账号：" :label-width="formLabelWidth" prop="baijia_account">
          <el-input v-model="ruleFormBaijia.baijia_account" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码：" :label-width="formLabelWidth" prop="baijia_pwd">
          <el-input v-model="ruleFormBaijia.baijia_pwd" auto-complete="off" type="password" :disabled="true"></el-input>
        </el-form-item> -->
        <el-form-item label="验证码：" :label-width="formLabelWidth" prop="captcha">
          <!-- <div class="beg-input">
            <el-input type="text" placeholder="请输入您的验证码" v-model="ruleFormBaijia.captcha"></el-input>
            <div class="verify-img" @click="handleVerifyBaijia"><img :src="captcha_imgBaijia" alt="" v-if="captcha_imgBaijia" style="cursor: pointer">
              <span v-else>验证码加载中...</span>
            </div>
          </div> -->
          <div class="beg-input" style="display:flex; align-items: center">
            <el-input type="text" placeholder="请输入您的手机验证码" v-model="ruleFormBaijia.captcha" style="width:77%"></el-input>
            <el-button @click="handleVerifyBaijia" size="mini" :disabled="deleteMarkBaijiaCode">{{baijiaCodeMsg}}</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFormBaijia('ruleFormBaijias')">取 消</el-button>
        <el-button type="primary" @click="submitFormBaijia('ruleFormBaijias')" :disabled="btnMarkBaijia">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// 富文本编译器
import UE from "@/components/ue/ue.vue";
//  图片素材库组件
import loadImage from "@/components/Material/image.vue";
//  视频素材库组件
import loadVedio from "@/components/Material/video.vue";
// 上传组件
import VueCropper from "@/components/uploadImg/uploadCropper";

// import VueCropper from "./../uploadImg/uploadCropper";
// 预览组件
import iphoneView from "./components/iphoneView";
// coolkies
import Cookies from "js-cookie";
import UpLoadImage from "@/components/DeliogImage/index.vue";
// import { RequestMenuDetail, RequestAddMenu, RequestEditMenu } from "@/fetch/modules/material.js";

import { RequestMpList } from "@/fetch/modules/mp";
import { RequestMpActive, RequestUploads, RequestDraftList, RequestDraftfoAdd, RequestWeiboList, RequestWeiboAuth, RequestWeiboAuthStatus, RequestToutiaoList, RequestToutiaoDetail, RequestToutiaoCaptcha, RequestToutiaoAuth, RequestToutiaoIphoneCode, RequestToutiaoSec, RequestToutiaoByMobile, RequestKuaichuanList, RequestKuaichuanDetail, RequestKuaichuanLogin, RequestKuaichuanCaptcha, RequestBaijiaList, RequestBaijiaCaptcha, RequestBaijiaAdd } from "@/fetch/modules/public";
// 存储的cookies
import { getToken, getRole, getAdminType } from "@/utils/auth";
// 工具 检查http 当前时间
import { checkURL, getNowFormatDate } from "@/fetch/tool";
import { isUrl } from "@/utils/validate";

//  数据service接口
import { RequestMpNewsAdd, RequestModuleList, RequestModuleServiceList, RequestClassfiyList, RequestMpNewsEditor, RequestMpNewsDetail } from "@/fetch/modules/info";

// 日期比较
/**
 * d2 到期时间，d1当前时间
 */
function CompareDate(d1, d2) {
  return new Date(d1.replace(/-/g, "/")) > new Date(d2.replace(/-/g, "/"));
}
const rules = {
  toutiao_account: [{ required: true, message: "请输入头条账号", trigger: "blur" }],
  toutiao_pwd: [{ required: true, message: "请输入头条密码", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
};
const rulesFormIphone = {
  mobile: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  code: [{ required: true, message: "请输入手机验证码", trigger: "blur" }]
};
const ruleFormKuaichuanOne = {
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
};
const ruleFormBaijiaOne = {
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
};
function varFilter(arr, obj) {
  for (let i in obj) {
    for (let j = 0; j < arr.length; j++) {
      if (i == arr[j]) {
        obj[i] = "";
      }
    }
  }
  return obj;
}
export default {
  components: { UE, loadImage, loadVedio, UpLoadImage, iphoneView, VueCropper },
  data() {
    return {
      role: getRole() || 0, // 0平台 1社区 2街道 3区 4市 5省
      loading: false,
      dialogVisible: false,
      dialogVisibleIphone: false,
      search: {
        q: "",
        m: ""
      },
      news_id: this.$route.query.news_id,
      placeholderMsg: "从这里开始正文！",
      config: {
        id: "myEditor",
        initialFrameWidth: 750,
        initialFrameHeight: 350,
        wordCount: false,
        elementPathEnabled: false,
        autoClearinitialContent: true
      },
      fixedRatio: [4, 3],
      // ueId: "ue1", // 不同编辑器必须不同的id
      addItemData: [
        {
          news_type: "1",
          news_title: "",
          author: "",
          news_content: "",
          news_pic: "", // 封面图
          content_source_url: "", // 原文地址
          thumb_media_id: "", // 	图文消息的封面图片素材id
          digest: "", // 摘要
          // isOriginal: false, // 是否原创
          show_cover_pic: 1, // 是否显示封面
          content_url: [], //选择资讯图片时， 资讯正文图片,
          video_url: "", // 视频
          news_media: "",
          category_id: "", // 服务id
          module_category_id: "",
          attr_id: "", // 分类id
          run_in: "1", // 投放区域： 1模块区 2轮播区 3官方快报 4推荐
          is_top: "1", //是否置顶 1=未置顶 2=置顶
          is_lock: "", // 是否锁定 1=未锁定 2=锁定
          sort: "", //资讯排序 按递增排序
          bsort: "", //轮播排序 按递增排序
          is_comment: "", //是否允许评论 1=允许 2=不允许,
          news_pic_type: "2", // 封面图类型 : 0无图 1小图 2大图 3视频
          news_link: "", // 原文链接地址
          banner_pic: "", // 轮播图片
          banner_title: "", // 轮播标题
          show_pic: "2", //是否显示封面 1是 2否（默认）
          news_intro: "",
          news_source: "",
          to_top_type: "0", // 否,is_top=2的时候必填，默认0  置顶类型： 0当前级 1全国 2全省 3全市 4全区 5全街道,
          showBaseUrl: true
        }
      ],
      adminType: getAdminType() || "", // 普通 公共部分
      oridary: {
        to_baijia: "2", // 是否发送到百家 1是 2否？
        to_kuaichuan: "2", // 是否发送到快传 1是 2否？？
        to_toutiao: "2", // 是否发送到头条 1是 2否？？
        to_weibo: "2", //是否发送到微博 1是 2否？？
        to_mp: "2", //是否发送到公众号 1是 2否
        put_time: "", // 发布时间
        put_mp_time: "", // 公众号发布时间，
        put_weibo_time: "", //微博发布时间
        put_toutiao_time: "", // 头条发布时间
        put_kuaichuan_time: "", // 快传发布时间
        put_baijia_time:'',// 百家发布时间
        show_at: "1", // 展示方式 1原生（默认） 2h5
        activity_list: [], // 关联活动
        link_miniprogram: "2", //是否关联活动：1是 2否
        put_area: "", //投放到指定位置,
        // is_top: "1", // 是否置顶 1=未置顶 2=置顶
        is_comment: "1", // 是否允许评论 1=允许 2=不允许,
        mp_list: [], //公众号,
        weibo_list: [], // 微博
        toutiao_list: [],
        kuaichuan_list: [],
        baijia_list: []
        // activity_list:[], // 关联活动
      },
      mpData: [], //  公众号列表数据
      mpActiveData: [], // 活动数据列表
      weiboData: [], //微博列表
      toutiaoData: [],
      kuaichuanData: [],
      baijiaData: [],
      moduleData: [], //服务模块
      moduleCateoryData: [], // 栏目
      classificationData: [], // 分类获取
      activeItem: 0,
      imageType: 0,
      searchBarFixed: false,
      imgChooseData: null,
      videoChooseData: null,
      editorId: 0,
      runInData: [],
      baseUrl: "https://img.sqydt.darongshutech.com/",
      newsTop: {}, // 置顶配置
      newsTopActive: {
        province: false,
        city: false,
        area: false,
        street: false,
        commity: false
      },
      timer: null,
      numMp: 5,
      // 头条重新授权
      releaseDialog: false,
      ruleForm: {
        toutiao_account: "",
        toutiao_pwd: "",
        captcha: "",
        key: ""
      },
      rules,
      btnMark: false, //提交form的时候按钮
      captcha_img: "",
      formLabelWidth: "120px",
      ruleFormIphone: {
        mobile: "",
        captcha: "",
        key: ""
      },
      captcha_imgIphone: "",
      codeMsg: "验证码获取",
      deleteMarkCode: false,
      btnMarkIphone: false,
      TouTiaoInnerVisible: false, // 手机验证的
      codeType: 22,
      iphoneTitle: "手机安全认证",
      rulesFormIphone,
      // 快传号
      kuaichuanInnerVisible: false,
      ruleFormKuaichuan: {
        kuaichuan_pwd: "",
        kuaichuan_account: "",
        captcha: "",
        key: ""
      },
      ruleFormKuaichuanOne,
      captcha_imgKuaichuan: false,
      // 百家号
      baijiaInnerVisible: false,
      ruleFormBaijia: {
        baijia_pwd: "",
        // baijia_account: "",
        captcha: ""
        // codeString: ""
      },
      ruleFormBaijiaOne,
      captcha_imgBaijia: "",
      btnMarkBaijia: false,
      deleteMarkBaijiaCode: false,
      baijiaCodeMsg: "验证码获取"
    };
  },
  created() {
    // window.addEventListener("scroll", this.handleScroll);
    if (this.news_id) {
      this.getMaterialDetail();
      // this.addItemData = this.item.content.news_item;
    } else {
      this.getDraft();
    }
    this.getMpData();
    this.getMpactivity();
    this.getModule();
    this.getModuleCateory();
    this.getWeiboData();
    this.getToutiaoData();
    this.getKuaichuanData();
    this.getBaijiaData();
  },
  updated() {
    // let tagImg = document.getElementsByTagName("iframe")[0].getElementsByTagName("img");
    // console.log(tagImg);
    // // for (var i = 0; i < tagImg.length; i++) {
    // //   tagImg[i].style.float = "none";
    // //   console.log(1111111111, tagImg[i]);
    // // }
  },
  mounted() {
    let _this = this;
    if (localStorage.loginPermissionData) {
      this.newsTop = JSON.parse(localStorage.loginPermissionData).customer_conf.cross_recom_news_top_conf;
    }
    // this.newsTop = JSON.parse(localStorage.loginPermissionData).customer_conf.cross_recom_news_top_conf;
    for (let i in this.newsTop) {
      if (this.newsTop[i].expiredate) {
        this.newsTopActive[i] = CompareDate(getNowFormatDate(), this.newsTop[i].expiredate);
      }
    }
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }

    this.timer = setInterval(function() {
      console.log("1111");
      _this.saveDraft();
    }, 60000); //每隔3分钟打印一次

    // console.log("时间比较", this.newsTopActive, CompareDate(getNowFormatDate(), "2018-09-04 00:00:00"));
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
    if (this.timer) {
      console.log("销毁");
      //如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.timer); //关闭
    }
  },

  methods: {
    // 微博认证
    getWeiboAuth() {
      RequestWeiboAuth({}).then(res => {
        if (res.weiboAuthUrl) {
          let authWin = window.open(res.weiboAuthUrl, "_blank", "width=600,height=400,left=500,top=300", false);
          let timerId = setInterval(function() {
            RequestWeiboAuthStatus({}).then(res1 => {
              if (!res1.weiboAuthUrl) {
                clearInterval(timerId);
                authWin.close();
                console.log("zhixing");
              } else {
              }
            });
          }, 1000);
        }
      });
    },
    // 是否同步微博
    handleWeibo(val) {
      val == 1 ? this.getWeiboAuth() : "";
    },
    // 微博列表
    getWeiboData() {
      RequestWeiboList({ current_page: 1, page_size: 1000, status: 1 }).then(res => {
        if (res.code === 2000) {
          this.weiboData = res.data.list;
        }
      });
    },
    handAuthor(row) {
      RequestWeiboAuth({ uid: row.uid }).then(res => {
        console.log("a_", res);
        if (res.code == 2000) {
          if (res.data.weiboAuthUrl) {
            // this.saveDraft();
            // let authWin = window.open(res.data.weiboAuthUrl, "_blank", "width=600,height=400,left=500,top=300", false);
            // authWin.location = res.data.weiboAuthUrl;
            RequestDraftfoAdd({
              content: { addItemData: this.addItemData, oridary: this.oridary },
              type: 1
            }).then(res1 => {
              window.location.href = res.data.weiboAuthUrl;
            });
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * 头条部分
     */
    // 头条列表
    getToutiaoData() {
      RequestToutiaoList({ current_page: 1, page_size: 1000, status: 1 }).then(res => {
        if (res.code === 2000) {
          this.toutiaoData = res.data.list;
        }
      });
    },
    //头条重新授权信息
    handToutiaoAuthor(row) {
      RequestToutiaoDetail({ toutiao_id: row.toutiao_id }).then(res => {
        if (res.code == 2000) {
          res.data.type = Number(res.data.type);
          this.ruleForm = Object.assign(this.ruleForm, res.data);
          this.oprateStatus = 1;
          this.handleVerify();
          this.releaseDialog = true;
        }
      });
    },
    // 头条验证码
    handleVerify() {
      let _args = {};
      this.ruleForm.toutiao_account ? (_args["toutiao_account"] = this.ruleForm.toutiao_account) : "";
      RequestToutiaoCaptcha(_args).then(res => {
        console.log(res);
        if (res.code == 2000) {
          this.ruleForm.key = res.data.key;
          this.captcha_img = res.data.captcha;
        }
      });
    },
    // 获取验证码
    handleVerifyIphone() {
      let _args = {};
      this.ruleForm.toutiao_account ? (_args["toutiao_account"] = this.ruleForm.toutiao_account) : "";
      RequestToutiaoCaptcha(_args).then(res => {
        if (res.code == 2000) {
          this.ruleFormIphone.key = res.data.key;
          this.captcha_imgIphone = res.data.captcha;
        }
      });
    },
    // 获取手机验证码
    handleIphoneCode() {
      // console.log()
      if (!this.ruleFormIphone.captcha || !this.ruleFormIphone.mobile) {
        this.$message.error("请输入验证码或手机号");
      } else {
        console.log(isvalidPhone(this.ruleFormIphone.mobile));
        if (isvalidPhone(this.ruleFormIphone.mobile)) {
          let { mobile, captcha, key, type = 22 } = this.ruleFormIphone;
          this.codeMsg = "验证码已发送";
          this.deleteMarkCode = true;
          RequestToutiaoIphoneCode({ mobile, captcha, key, type }).then(res => {
            if (res.code == 2000) {
            } else if (res.code == 1102) {
              // this.$message.error(res.msg);
              // this.codeMsg = "验证码获取";
              // this.deleteMarkCode = false;
              // this.ruleFormIphone.captcha = "";
              // this.captcha_imgIphone = res.data.captcha;
              this.$message.error(res.msg);
              this.codeMsg = "验证码获取";
              this.deleteMarkCode = false;
              this.ruleFormIphone.captcha = "";
              this.handleVerifyIphone();
            } else if (res.code == 4000) {
              this.$message.error(res.msg);
              this.codeMsg = "验证码获取";
              this.deleteMarkCode = false;
              this.ruleFormIphone.captcha = "";
              this.handleVerifyIphone();
            }
          });
        } else {
          this.$message.error("请输入正确的电话号码");
        }
      }
    },
    // 手机安全验证提交
    submitFormIphone(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnMarkIphone = true;
          var args = this.ruleFormIphone;
          args["toutiao_account"] = this.ruleForm.toutiao_account;
          if (this.codeType == 22) {
            RequestToutiaoSec(args).then(res => {
              oprateFnIphone(res);
            });
          } else if (this.codeType == 24) {
            RequestToutiaoByMobile(args).then(res => {
              oprateFnIphone(res);
            });
          }
          function oprateFnIphone(res) {
            _this.btnMarkIphone = false;
            if (res.code == 2000) {
              _this.$message.success("操作成功");
              _this.resetFormIphone("ruleFormIphone");
              _this.resetForm("ruleForm");
              _this.getToutiaoData();
            } else if (res.code == 4000) {
              _this.$message.error(res.msg);
              _this.ruleFormIphone.captcha = "";
              _this.ruleFormIphone.key = "";
              _this.handleVerifyIphone();
            } else if (res.code == 1102) {
              // this.ruleFormIphone.captcha = "";
              // this.captcha_imgIphone = res.data.captcha;
              _this.ruleFormIphone.captcha = "";
              _this.ruleFormIphone.key = "";
              _this.handleVerifyIphone();
              _this.$message.error(res.msg);
            } else if (res.code == 2222) {
              //  该情况针对  手机号登陆异常，请使用手机号验证
              _this.$message.error(res.msg);
              _this.iphoneTitle = "手机安全认证";
              _this.codeMsg = "验证码获取";
              _this.deleteMarkCode = false;
              _this.ruleFormIphone.captcha = "";
              _this.ruleFormIphone.code = "";
              _this.TouTiaoInnerVisible = true;
              _this.codeType = 22;
              _this.handleVerifyIphone();
            } else {
              _this.$message.error(res.msg);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.releaseDialog = false;
    },
    resetFormIphone(formName) {
      this.$refs[formName].resetFields();
      this.TouTiaoInnerVisible = false;
      this.codeMsg = "验证码获取";
      this.deleteMarkCode = false;
      this.ruleFormIphone.captcha = "";
    },
    handleCloseCode() {
      this.resetForm("ruleForm");
    },
    handleCloseIphone() {
      this.resetFormIphone("ruleFormIphone");
    },
    //  头条提交
    submitFormAuth(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnMark = true;
          var args = {
            toutiao_id: _this.ruleForm.toutiao_id,
            key: _this.ruleForm.key,
            captcha: _this.ruleForm.captcha,
            toutiao_pwd: _this.ruleForm.toutiao_pwd
          };
          RequestToutiaoAuth(args).then(res => {
            oprateFn(res);
          });

          function oprateFn(res) {
            _this.btnMark = false;
            if (res.code == 2000) {
              _this.resetForm("ruleForm");
              _this.$message({
                message: "操作成功",
                type: "success"
              });
              _this.getToutiaoData();
            } else if (res.code == 4000) {
              _this.ruleForm.captcha = "";
              _this.ruleForm.key = "";
              _this.handleVerify();
              _this.$message.error(res.msg);
            } else if (res.code == 1102) {
              _this.ruleForm.captcha = "";
              _this.ruleForm.key = "";
              _this.handleVerify();
              _this.$message.error(res.msg);
            } else if (res.code == 2222) {
              // 模拟 2222情况
              _this.iphoneTitle = "手机安全认证";
              _this.TouTiaoInnerVisible = true;
              _this.codeType = 22;
              _this.handleVerifyIphone();
            } else if (res.code == 1039) {
              // 模拟 1039
              _this.iphoneTitle = "手机号登陆";
              _this.codeType = 24;
              _this.TouTiaoInnerVisible = true;
              _this.handleVerifyIphone();
            } else {
              // _this.resetForm("ruleForm");
              _this.$message.error(res.msg);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     快传部分
     */
    //  RequestKuaichuanList
    getKuaichuanData() {
      RequestKuaichuanList({ current_page: 1, page_size: 1000, status: 1 }).then(res => {
        if (res.code === 2000) {
          this.kuaichuanData = res.data.list;
        }
      });
    },
    //快传重新授权信息
    handKuaichuanAuthor(row) {
      RequestKuaichuanDetail({ kuaichuan_id: row.kuaichuan_id }).then(res => {
        if (res.code == 2000) {
          console.log(res);
          this.ruleFormKuaichuan.kuaichuan_account = res.data.kuaichuan_account;
          this.ruleFormKuaichuan.kuaichuan_pwd = res.data.kuaichuan_pwd;
          this.handleVerifyKuaichuan();
          this.kuaichuanInnerVisible = true;
          // var { kuaichuan_id, kuaichuan_nickname, kuaichuan_nickname } = res.data;
          // RequestKuaichuanCaptcha({}).then(resCaptcha => {
          // if (resCaptcha.code == 2000) {
          //   this.ruleFormKuaichuan.captcha = resCaptcha.data.captcha;

          // RequestKuaichuanLogin({ kuaichuan_id, kuaichuan_nickname, kuaichuan_nickname, captcha, key }).then(resCallback => {
          //   if (resCallback.code == 2000) {
          //     this.$message.success("授权成功");
          //   } else {
          //     this.$message.success(resCallback.msg);
          //   }
          // });
          // }
          // "data:image/png;base64," +
          // this.ruleForm. = res.verify_img;
          // this.loginForm.verify_id = res.verify_id;
          // });
        }
      });
    },
    // 获取KUAICHUAN验证码
    handleVerifyKuaichuan() {
      let _args = {};
      this.ruleFormKuaichuan.kuiachuan_account ? (_args["kuiachuan_account"] = this.ruleFormKuaichuan.kuiachuan_account) : "";
      RequestKuaichuanCaptcha(_args).then(res => {
        if (res.code == 2000) {
          this.ruleFormKuaichuan.key = res.data.key;
          this.captcha_imgKuaichuan = res.data.captcha;
        }
      });
    },
    resetFormKuaichuan(formName) {
      this.$refs[formName].resetFields();
      this.kuaichuanInnerVisible = false;
    },
    // guanbi
    handleCloseKuaichuan() {
      this.resetFormKuaichuan("ruleFormKuaichuans");
    },

    // 快传授权 提交
    submitFormKuaichuan(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _args = {
            account: this.ruleFormKuaichuan.kuaichuan_account,
            password: this.ruleFormKuaichuan.kuaichuan_pwd,
            key: this.ruleFormKuaichuan.key,
            captcha: this.ruleFormKuaichuan.captcha,
            type: 2
          };
          RequestKuaichuanLogin(_args).then(resCallback => {
            if (resCallback.code == 2000) {
              this.$message.success("授权成功");
              this.resetFormKuaichuan(formName);
              this.getKuaichuanData();
            } else {
              this.$message.error(resCallback.msg);
              this.ruleFormKuaichuan.captcha = "";
              this.handleVerifyKuaichuan();
            }
          });
        }
      });
    },

    //  百家号
    getBaijiaData() {
      RequestBaijiaList({ current_page: 1, page_size: 1000, status: 1 }).then(res => {
        if (res.code === 2000) {
          this.baijiaData = res.data.list;
        }
      });
    },
    handleCloseBaijia() {
      this.resetFormBaijia("ruleFormBaijias");
    },
    handBaijiaAuthor(row) {
      console.log("aaa", row);
      this.ruleFormBaijia.baijia_account = row.baijia_account;
      // this.ruleFormBaijia.baijia_pwd = row.baijia_pwd;
      // this.handleVerifyBaijia();
      this.baijiaInnerVisible = true;
    },
    handleVerifyBaijia() {
      let isPass;
      this.$refs["ruleFormBaijias"].validateField("baijia_account", vaild => {
        isPass = vaild;
      });
      if (isPass) return false;
      this.baijiaCodeMsg = "验证码已发送";
      this.deleteMarkBaijiaCode = true;
      // this.ruleFormBaijia.key ? (_args["codeString"] = this.ruleFormBaijia.key) : "";
      RequestBaijiaCaptcha({baijia_account:this.ruleFormBaijia.baijia_account}).then(res => {
        if (res.code != 2000) {
          this.baijiaCodeMsg = "验证码获取";
          this.deleteMarkBaijiaCode = false;
          this.$message.error(res.msg);
        } else {
          this.$message.success("验证码已发送至您的手机，请注意查看");
        }
      });
    },
    resetFormBaijia(formName) {
      this.$refs[formName].resetFields();
      this.baijiaInnerVisible = false;
    },
    submitFormBaijia(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var args = this.ruleFormBaijia;
          let _argsLogin = {
            baijia_account: args.baijia_account,
            // baijia_pwd: args.baijia_pwd,
            // codeString: args.key,
            captcha: args.captcha,
            type: 2
          };
          _this.btnMarkBaijia = true;
          RequestBaijiaAdd(_argsLogin).then(res => {
            oprateFn(res);
          });
          function oprateFn(res) {
            _this.btnMarkBaijia = false;
            _this.codeMsg = "验证码获取";
            _this.deleteMarkCode = false;
            switch (res.code) {
              case 2000:
                _this.$message.success("操作成功");
                _this.getBaijiaData();
                _this.resetFormBaijia("ruleFormBaijias");
                break;
              default:
                varFilter(["captcha"], _this.ruleFormBaijia);
                _this.$message.error(res.msg);
                break;
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 读取草稿
    getDraft() {
      let _this = this;
      RequestDraftList({ type: 1 }).then(respones => {
        if (respones.code == 2000) {
          this.$confirm("检测到您上次有未保存的资讯，是否获取?", "温馨提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              // console.log("aaaaa__", respones.data);
              // let res = JSON.parse(respones.data);

              _this.addItemData = respones.data.addItemData;
              // console.log(_this.addItemData);
              _this.oridary = respones.data.oridary;
              // this.oridary=res.
            })
            .catch(() => {});
        }
      });
    },
    saveDraft() {
      let _this = this;
      if (this.addItemData[0].news_title || this.addItemData[0].news_content) {
        RequestDraftfoAdd({
          content: { addItemData: this.addItemData, oridary: this.oridary },
          type: 1
        }).then(res => {
          console.log(res);
        });
      }
    },
    //  监听返回
    goBack() {
      this.$confirm("确定要离开此页面, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.returnList();
        })
        .catch(() => {
          let state = {
            title: "title",
            url: window.location.href
          };
          window.history.pushState(state, null, window.location.href);
          window.history.forward(1);
        });
    },
    // 获取公众号列表
    getMpData() {
      RequestMpList({
        current_page: 1,
        page_size: 1000,
        q: this.search.m
      }).then(res => {
        if (res.code === 2000) {
          this.mpData = res.data.list;
        }
      });
    },
    hanldeCategory(val) {
      this.addItemData[this.activeItem].attr_id = "";
      let args = {
        category_id: this.addItemData[this.activeItem].category_id,
        pid: 0
      };
      this.getClassification(args);
    },
    // 获取活动列表
    getMpactivity() {
      RequestMpActive({
        current_page: 1,
        page_size: 1000,
        q: this.search.q
      }).then(res => {
        if (res) {
          this.mpActiveData = res;
        }
      });
    },
    // 获取 服务模块
    getModule() {
      RequestModuleServiceList({ type: 2 }).then(res => {
        // console.log(res);
        this.moduleData = res;
        if (this.addItemData[this.activeItem].category_id) {
          this.getClassification({
            category_id: this.addItemData[this.activeItem].category_id,
            pid: 0
          });
        }
      });
    },
    // 获取 栏目模块
    getModuleCateory() {
      RequestModuleServiceList({ type: 1 }).then(res => {
        this.moduleCateoryData = res;
      });
    },

    // 获取 投放分类
    getClassification(_obj) {
      RequestClassfiyList(_obj).then(res => {
        this.classificationData = res.list;
      });
    },
    handleScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      var offsetTop = document.querySelector(".img_article_box").offsetTop;
      if (scrollTop > offsetTop) {
        this.searchBarFixed = true;
      } else {
        this.searchBarFixed = false;
      }
    },
    returnList(active) {
      let _this = this;
      this.$router.push({
        name: "infoList",
        query: { active: active || 1 },
        params: {}
      });
      if (this.news_id) {
        this.$store.dispatch("delVisitedViews", {
          path: "/material/editImgArticle"
        });
      } else {
        this.$store.dispatch("delVisitedViews", {
          path: "/material/addImgArticle"
        });
      }
    },
    getMaterialDetail() {
      let _this = this;
      RequestMpNewsDetail({
        news_id: this.news_id // "MPkbQVATDIymrAcYe9NJbnNjodjecrUyVWxnppQef4Y"
      }).then(res => {
        // console.log(res);
        // return false;
        let _imageArr = [];
        if (res.news_type == 2) {
          res.news_content.map((items, index) => {
            _imageArr.push(items.url);
          });
        }

        try {
          res.news_content = res.news_content.replace(/\FLOAT/g, " ");
          res.news_content = res.news_content.replace(/float/g, " ");
        } catch (error) {
          console.log(error);
        }

        // console.log("isUrl(res.news_pic)", res.news_pic, !isUrl(res.news_pic || "111"));
        // return false;
        let article = [
          {
            news_type: res.news_type || "1",
            news_title: res.news_title || "",
            author: res.author || "",
            news_content: res.news_type == 1 ? res.news_content : "",
            news_pic: res.news_pic, // 封面图
            showBaseUrl: !isUrl(res.news_pic || ""),
            content_source_url: res.content_source_url || "", // 原文地址
            // thumb_media_id: "", // 	图文消息的封面图片素材id
            digest: "", // 摘要
            // isOriginal: false, // 是否原创
            // show_cover_pic: 1, // 是否显示封面
            content_url: _imageArr, //选择资讯图片时， 资讯正文图片,
            video_url: res.news_type == 3 ? res.news_content[0].url : "", // 视频
            news_media: "",
            category_id: res.run_in == 5 ? res.category_id : "", //栏目id
            module_category_id: res.run_in == 1 ? res.category_id : "",
            attr_id: res.run_in == 5 ? res.attr_id : "", // 分类id
            run_in: res.run_in || "1", // 投放区域： 1模块区 2轮播区 3官方快报 4推荐
            is_top: res.is_top || "1", //是否置顶 1=未置顶 2=置顶
            is_lock: res.is_lock || "", // 是否锁定 1=未锁定 2=锁定
            sort: res.sort || "", //资讯排序 按递增排序
            bsort: res.bsort || "", //轮播排序 按递增排序
            is_comment: res.is_comment || "", //是否允许评论 1=允许 2=不允许,
            news_pic_type: res.news_pic_type || "1", // 封面图类型 : 0无图 1小图 2大图 3视频
            news_link: res.news_link || "",
            banner_pic: res.banner_pic || "", // 轮播图片
            banner_title: res.banner_title || "", // 轮播标题
            show_pic: res.show_pic || "2",
            news_intro: res.news_intro || "",
            activity_list: [],
            news_source: res.news_source || "",
            to_top_type: res.to_top_type || "0" // 否,is_top=2的时候必填，默认0  置顶类型： 0当前级 1全国 2全省 3全市 4全区 5全街道
          }
        ];
        this.addItemData = article;
        // console.log("aasssa____", res.to_mp);
        this.oridary = {
          to_weibo: res.to_weibo || "2",
          to_toutiao: res.to_toutiao || "2",
          to_kuaichuan: res.to_kuaichuan || "2", // 是否发送到快传 1是 2否？？
          to_baijia: "2", // 是否发送到百家 1是 2否？
          to_mp: res.to_mp || "1", //是否发送到公众号 1是 2否
          put_time: res.put_time, // 发布时间
          put_mp_time: res.put_mp_time, // 公众号发布时间，
          put_weibo_time: res.put_weibo_time, // 微博发布时间
          put_toutiao_time: res.put_toutiao_time || "", // 头条发布时间
          put_kuaichuan_time: res.put_kuaichuan_time || "", //  快传发布时间
          show_at: res.show_at || "1", // 展示方式 1原生（默认） 2h5
          activity_list: res.link_third_miniprogram ? res.link_third_miniprogram || [] : [], // 关联活动
          link_miniprogram: res.link_miniprogram.toString() || "2", //是否关联活动：1是 2否
          put_area: "", //投放到指定位置,
          // is_top: res.is_top || "", // 是否置顶 1=未置顶 2=置顶
          is_comment: res.is_comment || "1", // 是否允许评论 1=允许 2=不允许,
          mp_list: [], //公众号,
          weibo_list: [],
          toutiao_list: [],
          kuaichuan_list: [],
          baijia_list: []
        };
        // console.log("aaaaaaaaaaaaa________", this.oridary.activity_list);
        // if (res.link_third_miniprogram) {
        //   if (res.link_third_miniprogram.length != 0) {
        //     res.link_third_miniprogram.forEach(row => {
        //       _this.$refs.mpActiveDataTable.toggleRowSelection(row);
        //       console.log("a________", _this.$refs.mpActiveDataTable.toggleRowSelection(row));
        //     });
        //   }
        // }
        // this.addItemData.map(function(item, index) {
        //   item.thumb_url = item.loc_url;
        //   return item;
        // });
      });
    },
    // 获取富文本
    getUEContent() {
      let news_content = this.$refs.ue.getUEContent(); // 获取编辑器html内容
      alert(news_content);
    },
    //  添加图文资讯
    addImgArticle(type) {
      if (this.addItemData.length < 8)
        this.addItemData.push({
          news_type: "1",
          news_title: "",
          author: "",
          news_content: "",
          news_pic: "", // 封面图
          showBaseUrl: false, // 是否显示基础地址
          content_source_url: "", // 原文地址
          thumb_media_id: "", // 	图文消息的封面图片素材id
          digest: "", // 摘要
          // isOriginal: false, // 是否原创
          show_cover_pic: 1, // 是否显示封面
          content_url: [], //选择资讯图片时， 资讯正文图片
          video_url: [], // 视频
          news_media: "",
          category_id: "", //服务id
          module_category_id: "", // 栏目id
          attr_id: "", // 分类id
          run_in: "1", // 投放区域： 1模块区 2轮播区 3官方快报 4推荐
          is_top: "1", //是否置顶 1=未置顶 2=置顶
          is_lock: "", // 是否锁定 1=未锁定 2=锁定
          sort: "", //资讯排序 按递增排序
          bsort: "", //轮播排序 按递增排序
          is_comment: "", //是否允许评论 1=允许 2=不允许,
          news_pic_type: "2", // 封面图类型 : 0无图 1小图 2大图 3视频
          news_link: "", // 原文链接地址
          banner_pic: "", // 轮播图片
          banner_title: "", // 轮播标题
          show_pic: "2",
          news_intro: "", // 资讯描述
          to_top_type: "0" // 否,is_top=2的时候必填，默认0  置顶类型： 0当前级 1全国 2全省 3全市 4全区 5全街道
        });
    },
    changeActive(i) {
      this.activeItem = i;
      this.imgChooseData = null;
      this.videoChooseData = null;
    },
    swapArray(x, y) {
      let arr = this.addItemData;
      arr.splice(x, 1, ...arr.splice(y, 1, arr[x]));
    },
    sortUp(index) {
      if (index != 0) {
        this.swapArray(index, index - 1);
      }
    },
    sortDown(index) {
      if (index != this.addItemData.length - 1) {
        this.swapArray(index, index + 1);
      }
    },
    listDel(_index) {
      if (this.addItemData.length > 1) {
        if (this.activeItem == _index) {
          this.activeItem = 0;
        }
        this.addItemData.splice(_index, 1);
      } else {
        this.$message({
          message: "最少需要一条图文消息！",
          type: "warning"
        });
      }
    },
    selectContent(type) {
      this.imageType = type;
      // if (this.imageType != 2) {
      this.dialogVisible = true;
      // }
      // console.log(this.imgChooseData, (this.videoChooseData = null));
    },
    changeChoose(params) {
      this.imgChooseData = params;
      // console.log("this.imgChooseData", params);
    },
    changeVedioChoose(params) {
      this.videoChooseData = params;
      // console.log("this.videoChooseData", params);
    },
    handleChoose() {
      // console.log(this.imageType, this.videoChooseData);
      if ((this.imageType == 0 || this.imageType == 1 || this.imageType == 3) && this.imgChooseData == null) {
        this.$message({
          type: "warning",
          message: "请选择图片！"
        });
        return false;
      } else if ((this.imageType == 2 || this.imageType == 4) && this.videoChooseData == null) {
        this.$message({
          type: "warning",
          message: "请选择视频！"
        });
        return false;
      }
      if (this.imageType == 0) {
        // 封面
        // console.log("imgChooseData", this.imgChooseData);
        // this.addItemData[this.activeItem].thumb_media_id = this.imgChooseData.media_id;
        this.addItemData[this.activeItem].news_pic = this.imgChooseData.material_url;
        this.addItemData[this.activeItem].showBaseUrl = true;
        this.handleClose();
      } else if (this.imageType == 3) {
        if (this.addItemData[this.activeItem].content_url.length < 20) {
          // this.addItemData[this.activeItem].thumb_media_id = this.imgChooseData.media_id;
          this.addItemData[this.activeItem].content_url.push(this.imgChooseData.material_url);
        } else {
          this.$message({
            type: "warning",
            message: "最多只能上传20张图片！"
          });
        }
        this.handleClose();
      } else if (this.imageType == 4) {
        // this.addItemData[this.activeItem].thumb_media_id = this.videoChooseData.media_id;
        this.addItemData[this.activeItem].video_url = this.videoChooseData.material_url;
        this.handleClose();
      } else {
        // 插入图片和视频
        const _src = "https://mmbiz.qlogo.cn/mmbiz_jpg/rwzeDg6icqSyBZ2eqCcfxiapnRda1Diby5TaoPspyWKBGas4cibQ6w1XJGYRkaUEFOjoNRq9ibDIjCLznMJIiaT1bDQg/0?wx_fmt=jpeg";
        const _src2 = "http://www.w3school.com.cn/example/html5/mov_bbb.mp4";

        const _vedio = `<video width="100%" controls="controls"><source src="" type="video/mp4">Your browser does not support the video tag.</video>`;

        let _insertContent = this.imageType == 1 ? `<img  width="100%" src=' ${this.baseUrl + this.imgChooseData.material_url}' alt='文章图片'>` : `<p><video  width="100%" src="${this.baseUrl + this.videoChooseData.material_url}" controls="controls">${this.videoChooseData.material_name || "开发者"}</video> </p>`;
        this.$refs.ue.clearEditor(); // 在光标处插入内容前清空提示
        this.$refs.ue.insertContent(_insertContent); // 在光标处插入内容 （图片/视频等 ）
        this.handleClose();
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.imgChooseData = null;
      this.videoChooseData = null;
    },
    addMaterial(submit_type) {
      let _this = this;
      let paramsData = JSON.parse(JSON.stringify(this.addItemData));
      // console.log("aaa", this.oridary.mp_list, this.news_id);
      if (this.oridary.to_mp == 1 && this.oridary.mp_list.length == 0 && !this.news_id) {
        _this.$message({
          message: "请选择公众号",
          type: "warning"
        });
        return false;
      }

      let valStatus = paramsData.every(function(item, index) {
        // console.log(item);
        // const contentText = _this.$refs.ue.getUEContentTxt();
        // console.log("aaaaaaaa__________", item.content_url);
        let status = true;
        // console.log("sss", item.news_content);
        if (_this.oridary.to_mp == 1 && item.news_type != 1) {
          _this.$message({
            message: "第" + (index + 1) + "篇同步微信公众号只能选择图文资讯",
            type: "warning"
          });
          status = false;
        } else if (!item.news_title.length) {
          _this.$message({
            message: "请为第" + (index + 1) + "篇文章填写标题！",
            type: "warning"
          });
          status = false;
        } else if (!item.news_content.length && item.news_type == 1) {
          _this.$message({
            message: "请为文章《" + item.news_title + "》填写正文！",
            type: "warning"
          });
          status = false;
        } else if (item.content_url.length == 0 && item.news_type == 2) {
          _this.$message({
            message: "文章《" + item.news_title + "》资讯正文添加图片！",
            type: "warning"
          });
          status = false;
        } else if (item.video_url == "" && item.news_type == 3) {
          _this.$message({
            message: "文章《" + item.news_title + "》资讯正文添加视频！",
            type: "warning"
          });
          status = false;
        } else if (item.run_in == 1 && !item.module_category_id) {
          // console.log("item.category_id", item.category_id);
          _this.$message({
            message: "文章《" + item.news_title + "》投放栏目资讯未选择！",
            type: "warning"
          });
          status = false;
        } else if (item.run_in == 5 && !item.category_id) {
          _this.$message({
            message: "文章《" + item.news_title + "》投放服务资讯未选择！",
            type: "warning"
          });
          status = false;
        } else if (item.run_in == 2 && !item.banner_pic) {
          _this.$message({
            message: "文章《" + item.news_title + "》上传轮播图！",
            type: "warning"
          });
          status = false;
        } else if (item.run_in == 2 && !item.banner_title) {
          _this.$message({
            message: "文章《" + item.news_title + "》添加轮播标题！",
            type: "warning"
          });
          status = false;
        } else if (item.news_pic == "" && (item.news_pic_type == 1 || item.news_pic_type == 2) && item.run_in != 2) {
          _this.$message({
            message: "文章《" + item.news_title + "》资讯正文添加资讯封面！",
            type: "warning"
          });
          status = false;
        }
        // console.log("paramsData", paramsData);
        // 编辑时
        if (_this.news_id) {
          delete paramsData[index].need_open_comment;
          delete paramsData[index].only_fans_can_comment;
          delete paramsData[index].url;
          paramsData[index].index = index;
        }

        return status;
      });
      if (this.oridary.to_weibo == 1 && this.oridary.weibo_list.length == 0 && !this.news_id) {
        _this.$message({
          message: "请选择微博账号",
          type: "warning"
        });
        return false;
      }
      if (this.oridary.to_toutiao == 1 && this.oridary.toutiao_list.length == 0 && !this.news_id) {
        _this.$message({
          message: "请选择头条账号",
          type: "warning"
        });
        return false;
      }
      if (this.oridary.to_kuaichuan == 1 && this.oridary.kuaichuan_list.length == 0 && !this.news_id) {
        _this.$message({
          message: "请选择快传账号",
          type: "warning"
        });
        return false;
      }
      if (this.oridary.to_baijia == 1 && this.oridary.baijia_list.length == 0 && !this.news_id) {
        _this.$message({
          message: "请选择百家账号",
          type: "warning"
        });
        return false;
      }
      if (this.oridary.link_miniprogram == 1 && this.oridary.activity_list.length == 0) {
        _this.$message({
          message: "请选择的关联活动 ",
          type: "warning"
        });
        return false;
      }

      if (valStatus) {
        _this.loading = true;
        paramsData.map((items, index) => {
          if (items.news_type == 2) {
            let arr = [];
            for (let i in items.content_url) {
              arr.push({ url: items.content_url[i] });
            }
            items.news_content = arr;
          } else if (items.news_type == 3) {
            let arr = [];
            arr.push({ url: items.video_url });
            items.news_content = arr;
          }
          if (items.run_in == 1) {
            items.category_id = items.module_category_id;
          }
        });
        let _args = {};
        if (this.news_id) {
          _args = Object.assign(_args, paramsData[0]);
        } else {
          _args = {
            articles: JSON.stringify(paramsData),
            submit_type
          };
        }
        _args = Object.assign(_args, this.oridary);
        _args.mp_list.length != 0 ? (_args.mp_list = JSON.stringify(this.oridary.mp_list)) : delete _args["mp_list"];
        _args.activity_list.length != 0 ? (_args.activity_list = JSON.stringify(this.oridary.activity_list)) : delete _args["activity_list"];
        _args.weibo_list.length != 0 ? (_args.weibo_list = JSON.stringify(this.oridary.weibo_list)) : delete _args["weibo_list"];
        _args.toutiao_list.length != 0 ? (_args.toutiao_list = JSON.stringify(this.oridary.toutiao_list)) : delete _args["toutiao_list"];
        try {
          _args.kuaichuan_list.length != 0 ? (_args.kuaichuan_list = JSON.stringify(this.oridary.kuaichuan_list)) : delete _args["kuaichuan_list"];
          _args.baijia_list.length != 0 ? (_args.baijia_list = JSON.stringify(this.oridary.baijia_list)) : delete _args["baijia_list"];
        } catch (error) {}

        if (!_this.news_id) {
          RequestMpNewsAdd(_args).then(res => {
            _this.loading = false;
            if (res.code == 2000) {
              _this.returnList(2);
            } else if (res.code == 5000) {
              _this.$message({
                message: "服务器错误！",
                type: "error"
              });
            }
          });
        } else if (_this.news_id) {
          _args["news_id"] = _this.news_id;
          _args["submit_type"] = submit_type;
          RequestMpNewsEditor(_args).then(res => {
            _this.loading = false;
            if (res.code == 2000) {
              _this.returnList(2);
            } else if (res.code == 5000) {
              _this.$message({
                message: "服务器错误！",
                type: "error"
              });
            }
          });
        }
      }
    },
    // 预览
    handleView() {
      this.dialogVisibleIphone = true;
    },
    beforeUploadImage(file) {
      //  this.qiniuData.key = file.name;
      const isJPG = file.type === "image/jpg";
      const isPNG = file.type === "image/png";
      const isGif = file.type === "image/gif";
      const isJpeg = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG && !isGif && !isJpeg) {
        this.$message.error("图片只能是 JPG/jPEG/PNG/GIF 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
        return false;
      }
      let formData = new FormData();
      formData.append("file", file);
      formData.append("token", getToken());
      RequestUploads(formData).then(res => {
        if (res.code === 2000) {
          this.addItemData[this.activeItem].banner_pic = res.data.key;
          // console.log(res.code, this.addItemData[this.activeItem]);
        }
      });
    },
    //  剪裁图片回掉
    callBackImg(status, params, data) {
      this.baseUrl = params.baseUrl;
      // console.log(status, params, data);
      if (status == "uploadSuccess") {
        this.addItemData[this.activeItem].banner_pic = data.key;
      }
    },
    // 资讯封面剪裁
    // callBackImgNews(status, params, data) {
    //   console.log(this.fixedRatio);
    //   this.baseUrl = params.baseUrl;
    //   // console.log(status, params, data);
    //   if (status == "uploadSuccess") {
    //     this.addItemData[this.activeItem].news_pic = data.key;
    //     this.addItemData[this.activeItem].showBaseUrl = true;
    //   }
    // },
    imgfixedRatio(val) {
      console.log(val);
      if (val == 1) {
        this.fixedRatio.map((item, index) => {
          if (index == 0) {
            item = 4;
          } else if (index == 1) {
            item = 3;
          }
        });
      } else if (val == 2) {
        this.fixedRatio.map((item, index) => {
          if (index == 0) {
            item = 2;
          } else if (index == 1) {
            item = 1;
          }
        });
      }
      console.log(this.fixedRatio);
    },
    /**
     * 资讯图片，删除图片
     */
    handleDeleteContentUrl(val) {
      this.addItemData[this.activeItem].content_url.map((item, index) => {
        if (index == val) {
          this.addItemData[this.activeItem].content_url.splice(index, 1);
        }
      });
    },
    imageSuccessCBK(val) {
      // console.log(val);
      // 封面
      if (val.code == 2000) {
        // this.addItemData[this.activeItem].thumb_media_id = val.data.media_id;
        this.addItemData[this.activeItem].thumb_url = val.data.url;
      }
    },
    handleSelectionChangeMp(val) {
      let _arr = [];
      if (val.length != 0) {
        if (val.length == 1) {
          // 	公众号类型type  1服务号 2订阅号
          // console.log("val[0].type", val[0].type);
          val[0].type == 1 ? (this.numMp = 5) : (this.numMp = 8);
        } else {
          this.numMp = 5;
        }
        val.map((item, index) => {
          _arr.push(item.app_id);
        });
      }

      this.oridary.mp_list = _arr;
    },
    handleSelectionChangeMpActive(val) {
      this.oridary.activity_list = val;
      // console.log(this.oridary.activity_list);
    },
    //  weibo选择
    handleSelectionChangeWeibo(val) {
      let _arr = [];
      val.forEach((item, index) => {
        _arr.push(item.uid);
      });
      this.oridary.weibo_list = _arr;
    },
    //  头条选择
    handleSelectionChangeToutiao(val) {
      let _arr = [];
      val.forEach((item, index) => {
        _arr.push(item.toutiao_account);
      });
      this.oridary.toutiao_list = _arr;
    },
    // 快传选择
    handleSelectionChangeKuaichuan(val) {
      let _arr = [];
      val.forEach((item, index) => {
        _arr.push(item.kuaichuan_account);
      });
      this.oridary.kuaichuan_list = _arr;
    },
    // 百家选择
    handleSelectionChangeBaijia(val) {
      let _arr = [];
      val.forEach((item, index) => {
        _arr.push(item.baijia_account);
      });
      this.oridary.baijia_list = _arr;
    },
    handleSearch(val) {
      val == 2 ? this.getMpactivity() : this.getMpData();
    },
    handleWeixinRadio(val) {
      if (val == 1) {
        this.addItemData.map((item, idx) => {
          item.news_pic_type = "2";
          item.news_type = "1";
        });
      }
    },
    handleWeiboRadio(val) {
      if (val == 1) {
        this.addItemData.map((item, idx) => {
          item.news_pic_type = "2";
          item.news_type = "1";
        });
      }
    },
    handleToutiaoRadio(val) {
      if (val == 1) {
        this.addItemData.map((item, idx) => {
          item.news_pic_type = "2";
          item.news_type = "1";
        });
      }
    },
    handleKuaichuanRadio(val) {
      console.log("aaaa______", val);
      if (val == 1) {
        this.addItemData.map((item, idx) => {
          console.log(item.news_type);
          item.news_pic_type = "2";
          item.news_type = "1";
        });
      }
    },
    handleBaijiaRadio(val) {
      if (val == 1) {
        this.addItemData.map((item, idx) => {
          console.log(item.news_type);
          item.news_pic_type = "2";
          item.news_type = "1";
        });
      }
    }
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style scoped>
.isFixed {
  position: fixed;
  background-color: #fff;
  top: 0;
  z-index: 999;
}
.is_top {
  padding: 10px 0;
}
.is_top span {
  color: red;
}
.form_header_title {
  padding: 10px 15px;
  /* background: #82d1fffd; */
  border-bottom: 1px solid #eee;
  color: #666666;
  font-size: 18px;
  font-weight: 400;
  font-family: "微软雅黑";
}
.form_header_title div {
  padding-left: 10px;
  border-left: 3px #3ea6fe solid;
}
.page_box {
  padding: 60px 20px 50px;
  padding-bottom: 150px;
  width: 100%;
  background-color: #f6f8f9;
}
section {
  /* display: flex;
  justify-content: space-between;
  align-items: flex-start; */
  width: 1200px;
  min-width: 1200px;
  margin: 0 auto 0px;
  /* padding: 30px 0; */
  box-sizing: border-box;
  /* border-radius: 5px; */
  background-color: #fff;
  font-size: 0;
  padding-bottom: 10px;
}
section > div {
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  font-size: 14px;
}
.img_article_box {
  width: 250px;
  margin-top: 360px;
  box-sizing: border-box;
}
/* .category_name .el-radio {
  padding: 10px 0;
  margin-right: 10px !important;
}
.category_name .el-radio__label {
  padding-left: 5px !important;
} */
h4 {
  font-weight: 400;
  font-size: 14px;
}

.editor_container {
  width: 750px;
  margin-top: 10px;
  position: relative;
  z-index: 1000;
  /* border: 1px solid #eee; */
}

.img_article_list,
.img_article_multimedia {
  width: 250px;
  padding: 0 20px;
}
.img_article_list_title {
  padding: 30px 0 20px;
}

.list_item,
.list_item2 {
  padding: 12px;
  position: relative;
  border: 1px solid #e7e7eb;
  cursor: pointer;
}
.active_item {
  border: 2px solid #39bcf3 !important;
  box-sizing: border-box;
}
.list_item {
  height: 132px;
}
.list_item:hover > .list_sort,
.list_item2:hover > .list_sort {
  display: block;
}
.list_item img {
  width: 100%;
}
.list_item .list_mask {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-clip: content-box;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  overflow: hidden;
}
.list_item .list_title {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  padding: 33px 15px 5px;
  background-color: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  color: #ffffff;
  font-size: 14px;
  line-height: 24px;
}
.list_title {
  position: absolute;
  top: 0;
  left: 0;
}

.list_item2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: none;
  font-size: 14px;
}
.item2_Thumbnail {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background-image: url("");
  background-size: cover;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  background-repeat: no-repeat;
}
.list_item3 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 92px;
  border: 2px dotted #d9dadc;
  border-top: none;
}
.add_icon {
  position: relative;
  width: 48px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  cursor: pointer;
}
.add_icon i {
  font-size: 36px;
  color: #e3e3e3;
}
.add_icon:hover > i {
  color: #999;
}
.add_icon:hover > .list_add_type {
  display: block;
}
.list_add_type {
  position: absolute;
  top: 52px;
  left: -50%;
  margin-left: -17px;
  width: 130px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  display: none;
}
.list_add_type:before {
  content: " ";
  position: absolute;
  top: -4px;
  left: 50%;
  margin-left: -4px;
  display: inline-block;
  width: 0;
  height: 0;
  border-width: 4px;
  border-style: dashed;
  border-color: transparent;
  border-top-width: 0;
  border-bottom-color: rgba(0, 0, 0, 0.8);
  border-bottom-style: solid;
}
.list_add_type .list_add_item {
  width: 100%;
  height: 44px;
  line-height: 44px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
}
.list_add_type .list_add_item i {
  margin-right: 8px;
  font-size: 14px;
}
.list_sort {
  display: none;
  position: absolute;
  bottom: 0;
  margin-left: -13px;
  width: 210px;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  overflow: hidden;
}
.list_sort i {
  font-size: 18px;
}
.list_sort .icon_up {
  margin-right: 10px;
}
.list_sort .icon_del {
  float: right;
}

.multimedia_box p {
  /* display: flex;
  justify-content: flex-start;
  align-items: center; */
  width: 115px;
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  border: 1px solid #eee;
  border-top: 1px solid #fff;
  font-size: 14px;
  cursor: pointer;
  color: #353535;
}
.multimedia_box p:first-child {
  border-top: 1px solid #eee;
}
.multimedia_box ul li i {
  font-size: 20px;
  margin-right: 5px;
  color: #979797;
}
.multimedia_box ul li:hover {
  border: 1px solid #39bcf3;
  color: #39bcf3;
}
.multimedia_box ul li:hover > i {
  color: #39bcf3;
}

footer {
  position: fixed;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -20px;
  width: 100%;
  /* width: calc(100% - 180px); */
  height: 97px;
  border-top: 1px solid #d9dadc;
  background-color: #fff;
}
.foot_box {
  display: flex;
  justify-content: space-between;
  width: 500px;
  text-align: center;
  margin-left: -180px;
}
.form_header {
  width: 1200px;
  min-width: 1200px;
  margin: 10px auto 0px;

  box-sizing: border-box;
  border-radius: 5px;
  background-color: #fff;
  padding: 0px 0;
}
.form_bottom {
  padding-bottom: 20px;
}
@media screen and (min-width: 1200px) {
  .page_box {
    padding: 00px 0px 0px;
  }
}
.message_footer {
  width: 75%;
  margin: 0 auto;
  padding: 30px 0;
  /* border-top: 1px solid #eee; */
}
.img-flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin: 10px 0;
}
.img-flex div {
  margin: 0 10px 10px 0;
}
.cover_img {
  position: relative;
  width: 100px;
  height: 100px;
  background-size: cover;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  background-repeat: no-repeat;
}
.cover_img-1 {
  position: relative;
  margin-top: 10px;
  width: 214px;
  height: 120px;
  background-size: cover;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  background-repeat: no-repeat;
}
.cover_img-1:hover > .cover_img_mask {
  display: flex;
}
.cover_img:hover > .cover_img_mask {
  display: flex;
}
.cover_img_mask {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
}

.cover_img_mask i {
  padding: 3px;
  cursor: pointer;
}
.i_upload {
  display: flex;
}
.form_tips {
  font-size: 12px;
  color: #50bfff;
  margin-top: 10px;
}
.avatar-uploader,
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 214px;
  height: 120px;
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
  width: 214px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 214px;
  height: 120px;
  display: block;
}
.beg-input {
  height: 40px;
  /* border-bottom: 1px solid #f2f2f2; */
  display: flex;
  justify-content: space-between;
  /* align-items: baseline; */
}
.beg-input > input {
  border: none;
  outline: none;
}
.beg-info {
  position: relative;
  top: 10px;
}
.verify-img {
  float: right;
  width: 30%;
}
.verify-img img {
  width: 100%;
  height: 100%;
}
.beg-btn {
  width: 200px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #ffd100;
  border-radius: 20px;
  margin-top: 45px;
  cursor: pointer;
}
</style>

