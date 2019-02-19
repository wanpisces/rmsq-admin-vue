<template>
  <div class="info-container fix-content">
    <el-card class="box-card card-left " :body-style="{  minHeight: '550px', height: 'calc(100vh - 150px)',overflowY: 'auto', overflowX: 'hidden',padding: '70px 15px 20px'}">
      <div slot="header" class="clearfix">
        <span>预览</span>
      </div>
      <div class="phone-box">
        <section class="phone-head" :style="{backgroundColor: themeColorShow}">
          <h4>问卷调查</h4>
        </section>
        <section class="phone-body">
          <el-scrollbar ref="elscrollbar" style="height:100%;">
            <div class="phone-scrollbar">
              <h5 class="word_wrap">{{form.questionnaire_title || '问卷标题' }}</h5>
              <div class="pbody-detail">
                <p>截止时间：{{form.end_date || '0000-00-00 00:00' }}</p>
                <p>参与人数：0人</p>
              </div>
              <p class="word_wrap">
                {{form.questionnaire_desc || ''}}
              </p>
              <div class="phone-content">
                <div class="pcontent-body">
                  <div v-for="(item,index) in form.subjects" :key="index" class="phone-topic">
                    <h6 v-if="item.subject_type != 0">{{index+1}}. {{item.subject_title || "题目标题"}}
                      <span v-if=" item.subject_type != 3">（{{(item.subject_type == '1' || item.subject_type == '5'|| item.subject_type == '7')?'单选':'多选，最多选'+item.max_select+'项，至少选'+item.min_select+'项'}}）</span>
                    </h6>
                    <!-- 文字 -->
                    <div v-if="item.subject_type == 1 || item.subject_type == 2">
                      <p class="topic-item word_wrap" v-for="(item2,index2) in item.subject_items" :key="index2">
                        <i class="icon iconfont2 " :style="{color: themeColorShow}" :class="item.subject_type == 1 ? 'icon-circle' : 'icon-xuanze'"></i>{{item2.subject_item_title || '-'}}</p>
                    </div>

                    <!-- 填空 -->
                    <div v-else-if="item.subject_type == 3">
                      <div class="component-textarea" :style="{border:'1px solid ' + themeColorShow}">
                        {{item.subject_item_title || '请输入内容'}}
                        <p class="no_select_text"> 0/300</p>
                      </div>
                    </div>

                    <!-- 视频 -->
                    <div class="flex-between-wrap" v-else-if="item.subject_type == 5 || item.subject_type == 6">
                      <div class="topic-item" v-for="(item2,index2) in item.subject_items" :key="index2">
                        <video :src="item2.subject_item_videos[0].vid_url" width="116" height="120" controls="controls">
                          Your browser does not support the video tag.
                        </video>
                        <p class=" word_wrap">
                          <i class="icon iconfont2" :style="{color: themeColorShow}" :class="item.subject_type == 5 ? 'icon-circle' : 'icon-xuanze'"></i>{{item2.subject_item_title || '-'}}</p>
                      </div>
                    </div>

                    <!-- 音频 -->
                    <div v-else-if="item.subject_type == 7 || item.subject_type == 8">
                      <div class="topic-item" v-for="(item2,index2) in item.subject_items" :key="index2">
                        <audio width="116" height="120" :src="item2.subject_item_voices[0].aud_url" controls="controls">
                          Your browser does not support the audio tag.
                        </audio>
                        <p style="width:100%;" class="word_wrap">
                          <i class="icon iconfont2" :style="{color: themeColorShow}" :class="item.subject_type == 7 ? 'icon-circle' : 'icon-xuanze'"></i>{{item2.subject_item_title || '-'}}</p>
                      </div>
                    </div>

                    <!-- 联系人组件 -->
                    <div v-else-if="item.subject_type == 0">
                      <!-- 文本框 -->
                      <div v-if="item.subject_builder.type == 1">
                        <h6>
                          <i class="icon iconfont2 " :style="{color: themeColorShow}" :class="iconSet[item.subject_builder.builder_id]"></i>{{item.subject_title}}
                          <em class="red">*</em>
                        </h6>
                        <div class="component-input" :style="{borderBottom: '1px solid ' + themeColorShow}">
                          请输入{{item.subject_title}}
                        </div>
                      </div>
                      <!-- 单选框 -->
                      <div class=" flex-between-wrap" v-else-if="item.subject_builder.type == 2">
                        <h6>
                          <i class="icon iconfont2 " :style="{color: themeColorShow}" :class="iconSet[item.subject_builder.builder_id]"></i>{{item.subject_title}}
                          <em class="red">*</em>
                        </h6>
                        <div class="component-radio flex-start-wrap">
                          <p v-for="_item in item.item_list " :key="_item.val" class=" word_wrap ">
                            <i class="icon iconfont2 icon-circle" :style="{color: themeColorShow}"></i>{{ _item.desc }}
                          </p>
                        </div>
                      </div>
                      <!-- 多选框 -->
                      <div class=" flex-between-wrap" v-else-if="item.subject_builder.type == 3">
                        <h6>
                          <i class="icon iconfont2" :style="{color: themeColorShow}" :class="iconSet[item.subject_builder.builder_id]"></i>{{item.subject_title}}
                          <em class="red">*</em>
                        </h6>
                        <div class="component-radio flex-start-wrap">
                          <p v-for="_item in item.item_list " :key="_item.val" class=" word_wrap ">
                            <i class="icon iconfont2 icon-xuanze" :style="{color: themeColorShow}"></i>{{ _item.desc }}
                          </p>
                        </div>
                      </div>
                      <!--  所在地-->
                      <div v-else-if="item.subject_builder.type == 5">
                        <h6>
                          <i class="icon iconfont2" :style="{color: themeColorShow}" :class="iconSet[item.subject_builder.builder_id]"></i>{{item.subject_title}}
                          <em class="red">*</em>
                        </h6>
                        <ul class="component-select flex-between-wrap">
                          <li>请选择
                            <div class="css-triangle" :style="{borderTop:'4px solid ' + themeColorShow}"></div>
                          </li>
                          <li>请选择
                            <div class="css-triangle" :style="{borderTop:'4px solid ' + themeColorShow}"></div>
                          </li>
                          <li>请选择
                            <div class="css-triangle" :style="{borderTop:'4px solid ' + themeColorShow}"></div>
                          </li>
                        </ul>
                      </div>
                      <!-- 文件上传 -->
                      <div v-else-if="item.subject_builder.type == 4">
                        <h6>
                          <i class="icon iconfont2" :style="{color: themeColorShow}" :class="iconSet[item.subject_builder.builder_id]"></i>{{item.subject_title}}
                          <em class="red">*</em>
                        </h6>
                        <div class="component-avatar">
                          <div>
                            照片
                          </div>
                          <p>点击上传头像</p>
                        </div>
                      </div>
                      <!-- 地址 -->
                      <div v-else-if="item.subject_builder.type == 6">
                        <h6>
                          <i class="icon iconfont2" :style="{color: themeColorShow}" :class="iconSet[item.subject_builder.builder_id]"></i>{{item.subject_title}}
                          <em class="red">*</em>
                        </h6>
                        <ul class="component-select flex-between-wrap">
                          <li>请选择
                            <div class="css-triangle" :style="{borderTop:'4px solid ' + themeColorShow}"></div>
                          </li>
                          <li>请选择
                            <div class="css-triangle" :style="{borderTop:'4px solid ' + themeColorShow}"></div>
                          </li>
                          <li>请选择
                            <div class="css-triangle" :style="{borderTop:'4px solid ' + themeColorShow}"></div>
                          </li>
                        </ul>
                        <div style="margin:5px 0;" class="component-input" :style="{borderBottom: '1px solid ' + themeColorShow}">
                          请填写您的详细地址
                        </div>
                        <div class="component-input" :style="{borderBottom: '1px solid ' + themeColorShow}">
                          邮编
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pcontent-operat">
                  <p v-if="form.allow_anonymous == 1">
                    <i class="icon iconfont2 icon-xuanze1" :style="{color: themeColorShow}"></i>匿名参加
                  </p>
                  <div class="operat-button no_select_text" :style="{backgroundColor: themeColorShow}">
                    <i class="icon iconfont2 icon-shiliangzhinengduixiang"></i>提交
                  </div>
                  <div class="operat-foot">
                    <p>
                      <i class="icon iconfont2 icon-shouye"></i>首页</p>
                    <p>
                      <i class="icon iconfont2 icon-fenxiang"></i>分享</p>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </section>
      </div>
    </el-card>

    <el-card class="box-card  card-middle" :body-style="{ padding: '90px 0 10px 0',minHeight: '500px', height: 'calc(100vh - 152px)', overflowY: 'auto',overflowX: 'hidden'}">
      <div slot="header" class="clearfix">
        <span>{{questionnaire_id ? '编辑':'新建' }}问卷</span>
      </div>

      <div class="card-curBody">
        <el-form ref="form" :model="form" label-width="160px">
          <el-form-item label="问卷标题：" prop="questionnaire_title" :rules="[{ required: true, message: '请填写问卷标题', trigger: 'blur' }]">
            <el-input maxlength="40" placeholder="不超过40个字符！" v-model="form.questionnaire_title" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="问卷说明：">
            <el-input type="textarea" placeholder="不超过200个字符！" maxlength="200" v-model="form.questionnaire_desc" style="width:400px;"></el-input>
          </el-form-item>
          <!-- div.subjects-box 添加指令 v-dragging="{ item: item, list: form.subjects, group: 'subjects', otherData: {index:index} }" 即可拖拽 -->
          <div :id="'topic'+index" class="subjects-box" v-for="(item,index) in form.subjects" :key="index">
            <h4 style="padding-left:155px;">题目{{index+1}}
              <el-button @click="removeTopic(index,item)" type="text">（移除此题）</el-button>
            </h4>
            <section :key="'subject_title'+index" v-if="item.subject_type != 0">
              <el-form-item label="题目标题：" :prop="'subjects.'+index+'.subject_title'" :rules="[{ required: true, message: '请填写题目标题', trigger: 'blur' }]">
                <el-input maxlength="40" placeholder="不超过40个字符！" v-model="item.subject_title" style="width:400px;"></el-input>
              </el-form-item>
              <el-form-item label="题目类型：">
                <div style="width:400px;" class="radio-vertical-box">
                  <el-radio-group v-model="item.subject_type">
                    <el-radio label="1">文字单选</el-radio>
                    <el-radio label="2">文字多选</el-radio>
                    <el-radio label="5">视频单选</el-radio>
                    <el-radio label="6">视频多选</el-radio>
                    <el-radio label="7">音频单选</el-radio>
                    <el-radio label="8">音频多选</el-radio>
                    <el-radio label="3">填空</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
              <el-form-item v-if="item.subject_type != 3" label="选项：">
                <div class="topicOption">
                  <div class="topic-option-box">
                    <p v-if="item.subject_type == 5 || item.subject_type == 6 ">
                      <em style="color:red;">* </em>仅支持MP4格式且大小不超过20M的视频
                    </p>
                    <p v-if="item.subject_type == 7 || item.subject_type == 8">
                      <em style="color:red;">* </em>支持MP3、WAV格式且大小不超过10M的音频
                    </p>
                    <div v-for="(item2,index2) in item.subject_items" :key="index2" class="topic-option-item">
                      <!-- 文字 -->
                      <div v-if="item.subject_type == 1 || item.subject_type == 2">
                        <el-form-item :key="'index'+index+'index2_0_'+index2" label-width="80px" :label=" '选项'+(index2+1)+'：'" :prop="'subjects.'+index+'.subject_items.'+index2+'.subject_item_title'" :rules="[{ required: true, message: '请填写选项内容', trigger: 'blur' },{ validator: checkItemName, trigger: 'blur' }]">
                          <el-input size="mini" maxlength="40" placeholder="选项内容" v-model="item2.subject_item_title" style="width:220px;"></el-input>
                        </el-form-item>
                        <i @click="removeOption(index,index2)" class=" el-icon-circle-close-outline remove-icon"></i>
                      </div>
                      <!-- 音频 -->
                      <div v-else-if="item.subject_type == 7 || item.subject_type == 8">
                        <!-- 选项内容 -->
                        <el-form-item :key="'index_'+index+'index2_3_'+index2" label-width="80px" :label=" '选项'+(index2+1)+'：'" :prop="'subjects.'+index+'.subject_items.'+index2+'.subject_item_title'" :rules="[{ required: true, message: '请填写选项内容', trigger: 'blur' },{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },{ validator: checkItemName, trigger: 'blur' }]">
                          <!-- 上传音频 -->
                          <div class="add-aud-box">
                            <el-form-item :key="'index'+index+'index2_4_'+index2" label="" :prop="'subjects.'+index+'.subject_items.'+index2+'.subject_item_voices[0].aud_url'" :rules="[{ required: true, message: '请选择选项音频', trigger: 'change' }]">
                              <uploadFile class="uploadClick" @change="handleChange" :acceptString="'.mp3,.wav'" :maxSize="10" :paramsObj="{indexs:[index,index2],subjectType:'subject_item_voices',urlType:'aud_url'}">
                                <el-button v-if="item2.subject_item_voices[0].desc == ''" class="add-audio-btn" plain size="mini">添加音频</el-button>

                                <span style="width:220px;display:inline-block;height:20px;" class="ellipsos " v-else>{{item2.subject_item_voices[0].desc}}</span>
                              </uploadFile>
                            </el-form-item>
                          </div>

                          <el-input size="mini" maxlength="30" placeholder="选项内容" v-model="item2.subject_item_title" style="width:220px;"></el-input>
                        </el-form-item>

                        <i @click="removeOption(index,index2)" class=" el-icon-circle-close-outline remove-icon"></i>
                      </div>
                      <!-- 视频 -->
                      <div v-else-if="item.subject_type == 5 || item.subject_type == 6">

                        <!-- 选项内容 -->
                        <el-form-item :key="'index_'+index+'index2_5_'+index2" label-width="80px" :label=" '选项'+(index2+1)+'：'" :prop="'subjects.'+index+'.subject_items.'+index2+'.subject_item_title'" :rules="[{ required: true, message: '请填写选项内容', trigger: 'blur' },{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },{ validator: checkItemName, trigger: 'blur' }]">
                          <!-- 上传视频 -->
                          <div class="add-aud-box">
                            <el-form-item :key="'index'+index+'index2_6_'+index2" label="" :prop="'subjects.'+index+'.subject_items.'+index2+'.subject_item_videos[0].vid_url'" :rules="[{ required: true, message: '请选择选项视频', trigger: 'change' }]">
                              <uploadFile class="uploadClick" @change="handleChange" :acceptString="'.mp4'" :maxSize="20" :paramsObj="{indexs:[index,index2],subjectType:'subject_item_videos',urlType:'vid_url'}">
                                <el-button v-if="item2.subject_item_videos[0].desc == ''" class="add-audio-btn" plain size="mini">添加视频</el-button>
                                <span style="width:220px;display:inline-block;height:20px;" class="ellipsos " v-else>{{item2.subject_item_videos[0].desc}}</span>
                              </uploadFile>
                            </el-form-item>
                          </div>
                          <el-input size="mini" maxlength="30" placeholder="选项内容" v-model="item2.subject_item_title" style="width:220px;"></el-input>
                        </el-form-item>

                        <i @click="removeOption(index,index2)" class=" el-icon-circle-close-outline remove-icon"></i>
                      </div>
                    </div>

                  </div>

                </div>
              </el-form-item>
              <el-form-item v-if="item.subject_type != 3" label="选项设置：">
                <span v-show="item.subject_type == 2 || item.subject_type == 4 || item.subject_type == 6 || item.subject_type == 8">
                  至少：
                  <el-select style="width:100px" @change="item.max_select = item.subject_items.length+''" size="mini" v-model="item.min_select" placeholder="至少选几项">
                    <el-option v-for="(item3,index3) in item.subject_items.length" :key="index3+1" :value="index3+1+''" :label="index3+1+'项'" :disabled="index3+1 == item.subject_items.length">
                    </el-option>
                  </el-select>
                  &nbsp;&nbsp;最多：
                  <el-select style="width:100px" size="mini" v-model="item.max_select" placeholder="最多选几项">
                    <el-option v-for="(item4,index4) in item.subject_items.length" :key="index4+1" :disabled="index4 < +item.min_select" :value="index4+1+''" :label="index4+1+'项'">
                    </el-option>
                  </el-select>
                </span>
                &nbsp;&nbsp;
                <el-button @click="addOption(index)" type="primary" plain size="mini" class="topic-option-additem">添加选项</el-button>
              </el-form-item>
            </section>
            <!-- 联系人组件 -->
            <section v-else>
              <!-- 文本框 -->
              <el-form-item v-if="item.subject_builder.type == 1" :label="item.subject_title+'： '">
                <el-input class="component-width" disabled :placeholder="'请输入'+item.subject_title"></el-input>
              </el-form-item>
              <!-- 单选框 -->
              <el-form-item v-if="item.subject_builder.type == 2" :label="item.subject_title+'： '">
                <div class="radio-vertical-box">
                  <el-radio-group>
                    <el-radio disabled v-for="_item in item.item_list " :key="_item.val" :label="_item.desc" :value="_item.val"></el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
              <!-- 多选框 -->
              <el-form-item v-if="item.subject_builder.type == 3" :label="item.subject_title+'： '">
                <div class="radio-vertical-box">
                  <el-checkbox-group>
                    <el-checkbox disabled v-for="_item in item.item_list " :key="_item.val" :label="_item.desc" :value="_item.val"></el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-form-item>
              <!-- 所在地 -->
              <el-form-item v-if="item.subject_builder.type == 5" :label="item.subject_title+'： '">
                中国&nbsp;
                <el-cascader class="component-width" disabled :options="[]" filterable change-on-select>
                </el-cascader>
              </el-form-item>
              <!-- 文件上传 -->
              <el-form-item v-if="item.subject_builder.type == 4" :label="item.subject_title+'： '">
                <p style="color:#c0c4cc;">支持jpg，jpeg，png，gif图片格式</p>
                <div style="width:120px;height:120px;border:1px solid #e6e6e6;line-height:120px;text-align:center;font-size:42px;color:#999;cursor: not-allowed;background-color:#f5f7fa">
                  <i class="el-icon-upload"></i>
                </div>
              </el-form-item>
              <!-- 地址 -->
              <el-form-item v-if="item.subject_builder.type == 6" :label="item.subject_title+'： '">
                中国&nbsp;
                <el-select disabled style="width:80px;" value="" placeholder="地区">
                  <el-option value="1" label="选项一"></el-option>
                </el-select>
                <el-input class="component-width" style="margin-bottom:5px;" disabled placeholder="详细地址"></el-input>
                &nbsp;
                <el-input style="width:100px;" disabled placeholder="邮政编码"></el-input>
              </el-form-item>
            </section>
          </div>

          <el-form-item>
            <el-button @click="addTopic" size="small" icon="el-icon-plus" plain type="primary">添加题目</el-button>
          </el-form-item>

          <!-- <el-form-item label="问卷截止时间：" prop="end_date" :rules="[{ required: true, message: '请选择截止时间', trigger: 'blur' }]">
            <el-date-picker v-model="form.end_date" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label=" 是否可以匿名填写： ">
            <el-radio-group v-model="form.allow_anonymous">
              <el-radio label="2">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label=" 是否关联活动： ">
            <el-radio-group v-model="form.link_miniprogram">
              <el-radio :label="2">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="已选择:" v-show="form.link_miniprogram==1">
            <ol class="">
              <li v-for="(item,index) in form.activity_list" :key="index">{{ item.service_title || item.title}}
              </li>
            </ol>
          </el-form-item>
          <el-form-item label="关联活动:" v-show="form.link_miniprogram==1" style="600px">

            <div style="margin-bottom:10px">
              <el-input v-model="activeSearch.q" placeholder="请输入活动名称" style="width:200px"></el-input>
              <el-select v-model="activeSearch.type" placeholder="请选择">
                <el-option key="0" label="全部" :value="0"></el-option>
                <el-option key="1" label="社区活动" :value="1"></el-option>
                <el-option key="3" label="随手拍（不审核）" :value="3"></el-option>
                <el-option key="4" label="投票" :value="4"></el-option>
                <el-option key="5" label="评选" :value="5"></el-option>
                <el-option key="6" label="问卷调查" :value="6"></el-option>
              </el-select>
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
          <share-template v-if="templateData.length>0" :share_desc="form.share_desc" :share_pic="form.share_pic" :curTitle="form.questionnaire_title" @getShare="shareChange" :templateData="templateData"></share-template> -->
          <el-form-item style="margin-top:30px;">
            <el-button :loading="submitStatus1" v-if="!questionnaire_id" type="primary" @click="onSubmit( 'form','1') ">发布</el-button>
            <el-button :loading="submitStatus2" type="primary" @click="onSubmit( 'form','2') ">保存</el-button>
            <el-button @click="backToList">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 右侧面板 -->
    <el-card class="box-card card-right" :body-style="{  minHeight: '550px', height: 'calc(100vh - 150px)',padding: '98px 15px 20px',overflowY: 'auto', overflowX: 'hidden'}">
      <div slot="header" class="clearfix">
        <span>设置</span>
      </div>
      <el-collapse accordion value="2">
        <el-collapse-item title="主题设置" name="1">
          <div style="height:300px;padding: 0 5px 8px;">
            <el-tabs value="first">
              <el-tab-pane style="height:245px;overflow-x:hide;overflow-y:auto;" label="主题颜色" name="first">
                <checkCard ref="themeColor" :id="'themeColor'" @change="changeTheme" :showType="1" :row="5" :dataKey="{desc: '',value:'theme_color'}" :iconSize="40" :padTop="0" :componentColor="'#fff'" :itemColor="'#fbfbfb'" :padding="5" :checkArrP="checkThemeColor"></checkCard>
              </el-tab-pane>
              <el-tab-pane style="height:245px;overflow-x:hide;overflow-y:auto;" label="主题背景" name="second">
                <checkCard ref="themeImg" :id="'themeImg'" @change="changeTheme" :row="2" :dataKey="{desc: '',value:'theme_bg'}" :iconSize="106" :space="3" :padTop="0" :componentColor="'#fff'" :itemColor="'#fbfbfb'" :padding="5" :checkArrP="checkThemeImg"></checkCard>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-collapse-item>
        <el-collapse-item title="联系人组件" name="2">
          <div style="height: calc(100vh - 150px - 140px  - 48px * 4);overflow-y:auto;min-height:315px;">
            <checkCard ref="contactConp" @change="changeCard" :row="3" :isShowIcon="false" :iconSize="42" :dataKey="{desc: 'builder_name',value:'builder_icon'}" multiple :componentColor="'#fff'" :itemColor="'#fbfbfb'" :paddingW="22" :checkArrP="checkArr"></checkCard>
          </div>
        </el-collapse-item>
        <el-collapse-item title="其它设置" name="3">
          <div class="other-setting" style="height: calc(100vh - 150px - 140px  - 48px * 4);overflow-y:auto;min-height:315px;padding:0 10px;">
            <el-form ref="form2" :model="form" label-position="top">
              <el-form-item label="问卷截止时间：" prop="end_date" :rules="[{ required: true, message: '请选择截止时间', trigger: 'blur' }]">
                <el-date-picker v-model="form.end_date" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="是否可以匿名参加： ">
                <el-radio-group v-model="form.allow_anonymous">
                  <el-radio label="2">否</el-radio>
                  <el-radio label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label=" 是否关联活动： ">
                <el-radio-group v-model="form.link_miniprogram">
                  <el-radio :label="2">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="关联活动:" v-show="form.link_miniprogram==1" style="600px">
                <div style="margin-bottom:10px">
                  <el-input v-model="activeSearch.q" placeholder="请输入活动名称" style="width:220px;margin-bottom:5px;"></el-input>
                  <el-select style="width:160px" v-model="activeSearch.type" placeholder="请选择">
                    <el-option key="0" label="全部" :value="0"></el-option>
                    <el-option key="1" label="社区活动" :value="1"></el-option>
                    <!-- <el-option key="2" label="随手拍（审核）" :value="2"></el-option> -->
                    <el-option key="3" label="随手拍（不审核）" :value="3"></el-option>
                    <el-option key="4" label="投票" :value="4"></el-option>
                    <el-option key="5" label="评选" :value="5"></el-option>
                    <el-option key="6" label="问卷调查" :value="6"></el-option>
                  </el-select>
                  <el-button @click="handleSearch(2)" type="primary"> 搜索</el-button>
                </div>
              </el-form-item>
              <el-form-item label="已选择:" v-show="form.link_miniprogram==1">
                <ol class="">
                  <li v-for="(item,index) in form.activity_list" :key="index">{{ item.service_title || item.title}}</li>
                </ol>
              </el-form-item>
            </el-form>
            <el-table v-show="form.link_miniprogram==1" :cell-style="cellStyle" height="220" ref="mpActiveDataTable" :data="mpActiveData" tooltip-effect="dark" @selection-change="handleSelectionChangeMpActive">
              <el-table-column type="selection" width="35">
              </el-table-column>
              <el-table-column prop="name" label="类型" width="70">
                <template slot-scope="scope">{{{1:'社区活动',2:'随手拍（审核）',3:"随手拍（不审核）",4:'投票',5:'评选',6:'问卷调查'}[scope.row.type] }}</template>
              </el-table-column>
              <el-table-column prop="service_title" label="活动名称" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item title="分享设置" name="4">
          <div style="height: calc(100vh - 150px - 140px  - 48px * 4);overflow-y:auto;min-height:315px;padding:0 20px;">
            <el-form ref="form3" :model="form">
              <share-template v-if="templateData.length>0" :share_desc="form.share_desc" :share_pic="form.share_pic" :curTitle="form.vote_title" @getShare="shareChange" :templateData="templateData"></share-template>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import { RequestUploads, RequestMpActive } from "@/fetch/modules/public.js";
import { format } from "@/fetch/tool.js";
import getServiceId from "@/components/getServiceId";
import uploadFile from "@/components/uploadFile";
import checkCard from "@/components/checkCard";
import ShareTemplate from "@/components/ShareTemplate/index.vue";
// service 数据接口（分类列表,活动添加,分类添加）
import {
  RequestQuestionnaireAdd,
  RequestQuestionSubjectList,
  RequestQuestionSubjectRemove,
  RequestQuestionSubjectItemRemove,
  RequestQuestionnaireEdit,
  RequestQuestionnaireDetail,
  RequestformBuilderList,
  RequestThemeList
} from "@/fetch/modules/service.js";
import { RequestShareTheme } from "@/fetch/modules/share.js";

// 多选的组件ID
const _multipleComponent = [
  "4000002",
  "4000003",
  "4000012",
  "4000013",
  "4000014",
  "4000015"
];

export default {
  components: { getServiceId, uploadFile, checkCard, ShareTemplate },
  data() {
    return {
      urlLastId: "",
      questionnaire_id: "",
      form: {
        service_id: "", // 服务ID
        questionnaire_title: "", // 问卷标题
        questionnaire_desc: "", // 问卷说明

        subjects: [JSON.parse(JSON.stringify(_topic))], // 题目

        end_date: "", // 截至时间 年-月-日 时:分
        allow_anonymous: "2", // 匿名问卷 1是 2否(默认)
        activity_list: [],
        theme_id: "", // 主题ID
        link_miniprogram: 2, // 是否关联活动
        share_desc: "",
        share_pic: ""
      },
      mySubjects: null,
      mpActiveData: [],
      activeSearch: {
        q: "",
        type: 0
      },
      checkArr: [], // 选择组件的选项
      componentIdIndex: {}, // 记录选中的组件id对应的组件索引 /* newAdd */
      checkThemeColor: [], // 选择主题颜色的选项
      checkThemeImg: [], // 选择主题背景的选项
      templateData: [],
      themeColorShow: "#39bcf3", // 主题颜色
      iconSet: {
        "4000001": "icon-xingming", // 姓名
        "4000002": "icon-shouji", // 手机
        "4000003": "icon-youxiang", // 邮箱
        "4000004": "icon-gongsi", // 公司
        "4000005": "icon-bumen", // 部门
        "4000006": "icon-zhiwei", // 职位
        "4000007": "icon-touxiang", // 头像
        "4000008": "icon-chengwei", // 称谓
        "4000009": "icon-xingbie", // 性别
        "4000010": "icon-shengri", // 生日
        "4000011": "icon-suozaidi", // 所在地
        "4000012": "icon-dizhi", // 地址
        "4000013": "icon-wangzhi", // 网址
        "4000014": "icon-zuoji", // 座机
        "4000015": "icon-chuanzhen" // 传真
      },
      submitStatus1: false, //发布状态
      submitStatus2: false // 保存状态
    };
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.form.service_id = to.meta.service_id;
      vm.urlLastId = to.meta.id;
    });
  },
  created() {
    this.getMpactivity();
    if (!this.$route.query.questionnaire_id) {
      this.getShareTheme();
    }
  },
  mounted() {
    this.getThemeList();
    this.getComponentList();
  },
  methods: {
    cellStyle(row, column, rowIndex, columnIndex) {
      return {
        paddingLeft: "1px",
        paddingRight: "1px"
      };
    },
    // 判断是否在数组中
    isInArr(_val, _arr) {
      return _arr.some(item => {
        if (item === _val) {
          return true;
        }
      });
    },
    //分享设置
    shareChange(obj) {
      this.form.share_desc = obj.share_desc;
      this.form.share_pic = obj.share_pic;
    },
    getShareTheme() {
      RequestShareTheme({ theme_type: 4 }).then(res => {
        this.templateData = res;
        if (!this.$route.query.questionnaire_id) {
          this.form.share_pic = res[0].share_pic;
        }
      });
    },
    // 获取主题列表
    getThemeList() {
      RequestThemeList().then(res => {
        console.log("主题", res);
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

        // 获取题目列表
        if (this.$route.query.questionnaire_id) {
          this.questionnaire_id = this.$route.query.questionnaire_id;
          this.getSubjectList();
        }
      });
    },
    // 改变主题
    changeTheme(_index, _data, params) {
      // 取消另一个主题选择
      const _radioGroup = { themeImg: "themeColor", themeColor: "themeImg" };
      this.$refs[_radioGroup[params.id]].cancelCheck();

      // 主题ID
      this.form.theme_id = _index.length ? _data.theme_id : "";

      // 主题颜色
      this.themeColorShow = _data.theme_color || "#39bcf3";
      // 主题背景
      document.querySelector(
        ".phone-box"
      ).style.backgroundImage = _data.theme_bg
        ? "url(" + _data.theme_bg + ")"
        : "";
    },
    // 回显主题
    showCheckedTheme(refName, _arr) {
      this.$refs[refName].setCheck(_arr);
    },
    // 获取组件列表
    getComponentList() {
      RequestformBuilderList({
        builder_type: 4 //  1基础类组件 2图片类组件 3辅助类组件 4联系人组件
      }).then(res => {
        console.log("_RequestformBuilderList_", res);
        if (res.code == 2000) {
          this.checkArr = res.data;
        }
      });
    },
    toBottom() {
      setTimeout(() => {
        // 预览滚动条
        var div = this.$refs["elscrollbar"].$refs["wrap"];
        this.$nextTick(() => {
          div.scrollTop = div.scrollHeight;
        });

        // 题目滚动
        const _middleBody = document.querySelector(
          ".card-middle .el-card__body"
        );
        _middleBody.scrollTop = _middleBody.scrollHeight;
        // const _index = this.form.subjects.length - 1;
        // document.querySelector(".card-middle .el-card__body").scrollTop = document.getElementById("topic" + _index).offsetTop - 60;
      }, 320);
    },
    // 组件选择
    changeCard(_indexs, _data, _params) {
      /* newAdd */
      console.log("chageCard", _indexs, _data, _params.checked);

      const _componentID = _data.builder_id; // 组件ID
      let _subjects = this.form.subjects;

      // 组件是否可多选
      if (this.isInArr(_componentID, _multipleComponent)) {
        // 添加组件
        _subjects.push({
          subject_title: _data.builder_name, // 题目名称
          subject_type: "0",
          // subject_id: "",
          item_list: _data.builder_params.item_list || [], // 选项列表
          subject_builder: {
            builder_id: _componentID, // 组件ID
            type: _data.builder_params.type // 1-文本框；2-单选框；3-多选框；4-文件上传；5-所在地；6-地址
          }
        });
        this.$refs["contactConp"].cancelCheck([_indexs[_indexs.length - 1]]); // 取消选中
        this.componentIdIndex[_data.builder_id] = _indexs[_indexs.length - 1];
        this.toBottom();
        return;
      }

      if (_params.checked) {
        // 添加组件
        _subjects.push({
          subject_title: _data.builder_name, // 题目名称
          subject_type: "0",
          // subject_id: "",
          item_list: _data.builder_params.item_list || [], // 选项列表
          subject_builder: {
            builder_id: _componentID, // 组件ID
            type: _data.builder_params.type // 1-文本框；2-单选框；3-多选框；4-文件上传；5-所在地；6-地址
          }
        });
        this.componentIdIndex[_data.builder_id] = _indexs[_indexs.length - 1];
      } else {
        // 移除组件
        _subjects.some((item, index) => {
          if (
            item.subject_type == "0" &&
            item.subject_builder.builder_id == _componentID
          ) {
            if (this.vote_id && item.subject_id) {
              // 编辑投票
              this.removeTopic(index, item);
            } else {
              // 添加投票
              _subjects.splice(index, 1);
            }
            return true;
          }
        });
      }
      this.toBottom();
    },
    // 文件上传
    handleChange(status, _file, params, resp) {
      const _baseUrl = params.baseUrl, // 上传文件存放地址
        _index = params.indexs,
        _subjectType = params.subjectType,
        _urlType = params.urlType;
      let itemInfo = this.form.subjects[_index[0]].subject_items[_index[1]]; // 选项信息
      let imageInfo = itemInfo[_subjectType][0];
      if (status === "startUpload") {
        imageInfo.desc = "上传中···";
      } else if (status === "uploading") {
        imageInfo.desc = "文件已上传" + resp; // 当为状态上传中时，resp为上传进度
      } else if (status === "uploadSuccess") {
        const _fileName = _file.name; // 文件名称
        const _index = _fileName.lastIndexOf(".");
        const _name = _fileName.substring(0, _index > 29 ? 29 : _index); // 无后缀文件名

        // 记录数据
        imageInfo.url = resp.key;
        imageInfo[_urlType] = _baseUrl + resp.key;
        imageInfo.desc = _file.name;

        // 如果选项文字为空，则显示无后缀文件名
        !itemInfo.subject_item_title && (itemInfo.subject_item_title = _name);
      } else {
        imageInfo.desc = "上传失败，点击重试！";
      }
    },
    // 检查选项名称
    checkItemName(rule, value, callback) {
      let _index = rule.field.split(
        /subjects.|.subject_items.|.subject_item_title/
      );
      this.form.subjects[_index[1]].subject_items.forEach((item, index) => {
        if (index != _index[2] && item.subject_item_title === value) {
          callback(new Error("与第" + (index + 1) + "个选项内容相同！"));
        }
      });
      callback();
    },
    // 获取活动列表
    getMpactivity() {
      RequestMpActive({
        current_page: 1,
        page_size: 1000,
        q: this.activeSearch.q,
        type: this.activeSearch.type
      }).then(res => {
        if (res) {
          this.mpActiveData = res;
        }
      });
    },
    handleSelectionChangeMpActive(val) {
      this.form.activity_list = val;
      // console.log(this.form.activity_list);
    },
    hanldeActiveMp(index) {
      this.form.activity_list.splice(index, 1);
    },
    // 活动查询
    handleSearch(val) {
      RequestMpActive({
        current_page: 1,
        page_size: 1000,
        q: this.activeSearch.q,
        type: this.activeSearch.type
      }).then(res => {
        if (res) {
          this.mpActiveData = res;
          if (this.$route.query.questionnaire_id) {
            this.vote_id = this.$route.query.questionnaire_id;
          }
        }
      });
    },
    // 获取投票详情
    getVoteDetail() {
      let _self = this;
      RequestQuestionnaireDetail({
        questionnaire_id: this.questionnaire_id
      }).then(res => {
        res.data.subjects = this.mySubjects;
        this.form = Object.assign(this.form, res.data);
        console.log(this.form);
        this.getShareTheme();
        // 找到主题 index 并设置
        const _getIndex = this.checkThemeColor.some((_item, _index) => {
          if (_item.theme_id == this.form.theme_id) {
            this.showCheckedTheme("themeColor", [_index]);
            return true;
          }
        });
        if (!_getIndex) {
          this.checkThemeImg.some((_item2, _index2) => {
            if (_item2.theme_id == this.form.theme_id) {
              this.showCheckedTheme("themeImg", [_index2]);
              return true;
            }
          });
        }

        this.form.activity_list = res.data.link_third_miniprogram || [];
        if (res.data.link_third_miniprogram) {
          res.data.link_third_miniprogram.forEach(row => {
            this.mpActiveData.forEach(val => {
              if (
                row.branch_id == val.branch_id &&
                row.service_id == val.service_id
              ) {
                // this.$refs.mpActiveDataTable.toggleRowSelection(val, true);
                setTimeout(() => {
                  _self.$refs.mpActiveDataTable.toggleRowSelection(val, true);
                }, 1);
              }
            });
          });
        }
      });
    },
    // 获取题目列表
    getSubjectList() {
      RequestQuestionSubjectList({
        questionnaire_id: this.questionnaire_id
      }).then(res => {
        console.log("getSubjectList", res);
        this.mySubjects = res.data.list;
        this.mySubjects.map((item, index) => {
          item.subject_items = item.subject_item_list;
          delete item.subject_item_list;

          // 联系人组件
          if (item.subject_type == "0") {
            const _subject_builder = item.subject_builder_list[0];
            console.log("item", item);
            console.log("_subject_builder", _subject_builder);
            item.item_list = _subject_builder.builder_params.item_list || [];
            item.subject_builder = {
              subject_builder_id: _subject_builder.subject_builder_id,
              builder_id: _subject_builder.builder_id, // 组件ID
              type: _subject_builder.builder_params.type // 1-文本框；2-单选框；3-多选框；4-联动选择框；5-文件上传；6-地址
            };
            delete item.subject_builder_list;

            /* newAdd */
            if (
              !this.isInArr(_subject_builder.builder_id, _multipleComponent)
            ) {
              // 找到组件 index
              this.checkArr.some((_item, _index) => {
                if (_item.builder_id == _subject_builder.builder_id) {
                  this.componentIdIndex[_item.builder_id] = _index; // 记录  选中的组件ID：组件在联系人组件中的索引
                  this.$refs["contactConp"].setCheck([_index]); // 设置选中
                  return true;
                }
              });
            }
          } else {
            // 填补数据格式
            item.subject_items.map(item2 => {
              if (!item2.subject_item_images) {
                item2.subject_item_images = [
                  {
                    url: "",
                    img_url: "",
                    desc: ""
                  }
                ];
              }
              if (!item2.subject_item_voices) {
                item2.subject_item_voices = [
                  {
                    url: "",
                    aud_url: "",
                    desc: ""
                  }
                ];
              }
              if (!item2.subject_item_videos) {
                item2.subject_item_videos = [
                  {
                    url: "",
                    vid_url: "",
                    desc: ""
                  }
                ];
              }
            });
          }
          return item;
        });
        this.getVoteDetail();
      });
    },
    changeServiceId(id) {
      this.form.service_id = id;
    },
    // 添加题目
    addTopic() {
      this.form.subjects.push(JSON.parse(JSON.stringify(_topic)));
    },

    removeTopic(index, _data) {
      if (this.form.subjects.length > 1) {
        console.log(
          "asdas",
          this.questionnaire_id,
          this.form.subjects[index].subject_id
        );
        let _subject_id = this.form.subjects[index].subject_id;
        if (this.questionnaire_id && _subject_id) {
          // 编辑
          RequestQuestionSubjectRemove({
            subject_id: _subject_id
          }).then(res => {
            console.log("RequestSubjectRemove", res);
            if (res.code == 2000) {
              this.form.subjects.splice(index, 1);
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success"
              });
              // 组件 /* newAdd */
              if (_data.subject_builder) {
                const _itemIndex = this.componentIdIndex[
                  _data.subject_builder.builder_id
                ];
                console.log("_itemIndex", _itemIndex);
                // 取消选择状态
                this.$refs["contactConp"].cancelCheck([_itemIndex]);
              }
            }
          });
        } else {
          // 添加
          this.form.subjects.splice(index, 1);

          // 组件 /* newAdd */
          if (_data.subject_builder) {
            let _itemIndex = this.componentIdIndex[
              _data.subject_builder.builder_id
            ];
            console.log("_itemIndex", _itemIndex);
            // 取消选择状态
            this.$refs["contactConp"].cancelCheck([_itemIndex]);
          }
        }
      } else {
        this.$message({
          showClose: true,
          message: "至少需要一道题！",
          type: "warning"
        });
      }
    },
    // 添加选项
    addOption(index) {
      this.form.subjects[index].subject_items.push({
        subject_item_voices: [
          {
            url: "",
            aud_url: "",
            desc: ""
          }
        ],
        subject_item_videos: [
          {
            url: "",
            vid_url: "",
            desc: ""
          }
        ],
        subject_item_title: ""
      });

      this.form.subjects[index].max_select =
        this.form.subjects[index].subject_items.length + "";

      // console.log("this.form.subjects[index].subject_items", this.form.subjects[index].subject_items, this.form.subjects[index].max_select);
    },
    // 移除选项
    removeOption(index, index2) {
      if (this.form.subjects[index].subject_items.length > 1) {
        let _subject_item_id = this.form.subjects[index].subject_items[index2]
          .subject_item_id;

        if (this.questionnaire_id && _subject_item_id) {
          // 编辑
          RequestQuestionSubjectItemRemove({
            subject_item_id: _subject_item_id
          }).then(res => {
            console.log("RequestSubjectRemove", res);
            if (res.code == 2000) {
              this.form.subjects[index].subject_items.splice(index2, 1);
              this.form.subjects[index].min_select = 1 + "";
              this.form.subjects[index].max_select =
                this.form.subjects[index].subject_items.length + "";
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success"
              });
            }
          });
        } else {
          // 添加
          this.form.subjects[index].subject_items.splice(index2, 1);
          this.form.subjects[index].min_select = 1 + "";
          this.form.subjects[index].max_select =
            this.form.subjects[index].subject_items.length + "";
        }
      } else {
        this.$message({
          showClose: true,
          message: "至少需要一个选项！",
          type: "warning"
        });
      }
    },

    onSubmit(formName, type) {
      this.$refs["form2"].validate(valid2 => {
        if (valid2) {
          this.$refs["form3"].validate(valid3 => {
            if (valid3) {
              this.$refs[formName].validate(valid => {
                // console.log("valid", valid, JSON.stringify(this.form));
                if (valid) {
                  if (
                    this.form.link_miniprogram == 1 &&
                    this.form.activity_list.length == 0
                  ) {
                    this.$message.error("请选择活动");
                    return false;
                  }
                  let _args = JSON.parse(JSON.stringify(this.form));

                  // 提交类型
                  _args.submit_type = type;

                  // 题目类型为3时，subject_items 为空 arr
                  // try {
                  //   _args.subjects.map(function(item, index) {
                  //     if (item.subject_type == "3") {
                  //       item.subject_items = [];
                  //     } else if (item.subject_items.length === 0) {
                  //       throw "选项不能为空！";
                  //     }
                  //     return item;
                  //   });
                  // } catch (err) {
                  //   this.$message({
                  //     showClose: true,
                  //     message: err,
                  //     type: "warning"
                  //   });
                  //   return;
                  // }

                  // 数据处理：移除不必要的字段
                  _args.subjects.map(function(item) {
                    // 填空题
                    if (item.subject_type == "3") {
                      item.subject_items = [];
                    }
                    // 联系人组件
                    if (item.subject_type == "0") {
                      delete item.item_list; /* 删除选项列表 */
                    }

                    if (
                      item.subject_type != "5" &&
                      item.subject_type != "6" &&
                      item.subject_items
                    ) {
                      item.subject_items.map(function(sj_items) {
                        delete sj_items.subject_item_videos; /* 删除选项视频 */
                        return sj_items;
                      });
                    }
                    if (
                      item.subject_type != "7" &&
                      item.subject_type != "8" &&
                      item.subject_items
                    ) {
                      item.subject_items.map(function(sj_items) {
                        delete sj_items.subject_item_voices; /* 删除选项音频 */
                        return sj_items;
                      });
                    }
                    return item;
                  });
                  _args.subjects = JSON.stringify(_args.subjects);
                  _args.share_desc =
                    _args.share_desc || _args.questionnaire_title;

                  // return;
                  type == "1"
                    ? (this.submitStatus1 = true)
                    : (this.submitStatus2 = true);
                  if (!this.questionnaire_id) {
                    RequestQuestionnaireAdd(_args).then(res => {
                      type == "1"
                        ? (this.submitStatus1 = false)
                        : (this.submitStatus2 = false);
                      if (res.code == 2000) {
                        this.backToList();
                      } else if (res.code == 4000) {
                        this.$message({
                          showClose: true,
                          message: res.msg,
                          type: "error"
                        });
                      } else {
                        this.$message({
                          showClose: true,
                          message: "添加失败",
                          type: "error"
                        });
                      }
                    });
                  } else {
                    _args.questionnaire_id = this.questionnaire_id;
                    RequestQuestionnaireEdit(_args).then(res => {
                      type == "1"
                        ? (this.submitStatus1 = false)
                        : (this.submitStatus2 = false);
                      if (res.code == 2000) {
                        this.backToList();
                      } else if (res.code == 4000) {
                        this.$message({
                          showClose: true,
                          message: res.msg,
                          type: "error"
                        });
                      } else {
                        this.$message({
                          type: "error",
                          message: "修改失败"
                        });
                      }
                    });
                  }
                } else {
                  this.$message({
                    type: "warning",
                    message: "存在必填项未填写！"
                  });
                }
              });
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: "请在 其它设置 中设置截止时间！",
            type: "warning"
          });
        }
      });
    },
    previewVote() {
      let _args = JSON.parse(JSON.stringify(this.form));
      this.$router.push({
        path: "previewQuestion" + this.urlLastId,
        query: { data: JSON.stringify(_args) }
      });
    },
    backToList() {
      const _url = !this.questionnaire_id ? "/addQuestion" : "/editQuestion";
      this.$router.push({
        path: "question" + this.urlLastId
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/questionModule" + _url + this.urlLastId
      });
    }
  }
};

const _topic = {
  subject_title: "",
  subject_type: "1", // 1文字单选 2文字多选 3填空
  subject_items: [
    {
      subject_item_voices: [
        {
          url: "",
          aud_url: "",
          desc: ""
        }
      ],
      subject_item_videos: [
        {
          url: "",
          vid_url: "",
          desc: ""
        }
      ],
      subject_item_title: ""
    },
    {
      subject_item_voices: [
        {
          url: "",
          aud_url: "",
          desc: ""
        }
      ],
      subject_item_videos: [
        {
          url: "",
          vid_url: "",
          desc: ""
        }
      ],
      subject_item_title: ""
    },
    {
      subject_item_voices: [
        {
          url: "",
          aud_url: "",
          desc: ""
        }
      ],
      subject_item_videos: [
        {
          url: "",
          vid_url: "",
          desc: ""
        }
      ],
      subject_item_title: ""
    },
    {
      subject_item_voices: [
        {
          url: "",
          aud_url: "",
          desc: ""
        }
      ],
      subject_item_videos: [
        {
          url: "",
          vid_url: "",
          desc: ""
        }
      ],
      subject_item_title: ""
    }
  ],
  min_select: "1", // 最少可选几项：默认 1
  max_select: "4" // 默认选项数量
};
const _checkArr = [
  {
    builder_name: "姓名",
    builder_id: "000",
    builder_params: {
      type: "1" // 1-文本框；2-单选框；3-多选框；4-联动选择框；5-文件上传；6-地址；
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211010133261.jpg"
  },
  {
    builder_name: "手机",
    builder_id: "002",
    builder_params: {
      type: "1"
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211016395821.jpg"
  },
  {
    builder_name: "邮箱",
    builder_id: "003",
    builder_params: {
      type: "1"
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211016437367.jpg"
  },
  {
    builder_name: "公司",
    builder_id: "004",
    builder_params: {
      type: "1"
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211016475679.jpg"
  },
  {
    builder_name: "部门",
    builder_id: "005",
    builder_params: {
      type: "1"
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211010133261.jpg"
  },
  {
    builder_name: "职位",
    builder_id: "006",
    builder_params: {
      type: "1"
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211016437367.jpg"
  },
  {
    builder_name: "头像",
    builder_id: "007",
    builder_params: {
      type: "5"
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211016475679.jpg"
  },
  {
    builder_name: "称谓",
    builder_id: "008",
    builder_params: {
      type: "2",
      item_list: [
        {
          desc: "先生",
          val: "1"
        },
        {
          desc: "小姐",
          val: "2"
        },
        {
          desc: "女士",
          val: "3"
        },
        {
          desc: "博士",
          val: "4"
        },
        {
          desc: "教授",
          val: "5"
        }
      ]
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211010133261.jpg"
  },
  {
    builder_name: "性别",
    builder_id: "009",
    builder_params: {
      type: "2",
      item_list: [
        {
          desc: "男",
          val: "1"
        },
        {
          desc: "女",
          val: "2"
        },
        {
          desc: "保密",
          val: "0"
        }
      ]
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211016395821.jpg"
  },
  {
    builder_name: "生日",
    builder_id: "010",
    builder_params: {
      type: "1"
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211016437367.jpg"
  },
  {
    builder_name: "所在地",
    builder_id: "011",
    builder_params: {
      type: "4"
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211016475679.jpg"
  },
  {
    builder_name: "地址",
    builder_id: "012",
    builder_params: {
      type: "6"
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211010133261.jpg"
  },
  {
    builder_name: "网址",
    builder_id: "013",
    builder_params: {
      type: "1"
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211016395821.jpg"
  },
  {
    builder_name: "座机",
    builder_id: "014",
    builder_params: {
      type: "1"
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211016437367.jpg"
  },
  {
    builder_name: "传真",
    builder_id: "015",
    builder_params: {
      type: "1"
    },
    builder_icon:
      "https://img.sqydt.darongshutech.com/image_201809211016437367.jpg"
  }
];
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.component-textarea {
  height: 100px;
  margin-top: 6px;
  padding: 5px 3px;
  border: 1px solid #39bcf3;
  border: 1px solid var(--theme-color);
  font-size: 12px;
  color: #aaa;

  p {
    margin-top: 62px;
    text-align: right;
  }
}

.subjects-box {
  padding: 5px 0 10px;
}
.drag-over,
.dragging,
.drag-enter {
  background-color: #fffff6;
  outline: #b0e4fa dashed thin;
}

.topic-option-box {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;

  width: 400px;
  height: auto;

  > p {
    margin: 0 12px;
    font-size: 14px;
    color: #94c7fa;
  }
  .topic-option-item {
    padding: 16px 35px;
    position: relative;
  }
  .topic-option-additem {
    margin: 16px 35px;
  }

  .remove-icon {
    position: absolute;
    right: 10px;
    top: 14px;
    z-index: 88;
    font-size: 18px;
    color: #d9d9d9;
    cursor: pointer;
  }
  .remove-icon:hover {
    color: #409eff;
  }
}

/* 上传 */
.avatar-uploader,
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 130px;
  height: 130px;
  overflow: hidden;
}
.avatar-uploader:hover,
.avatar-uploader:focus,
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
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}
.img-bg-box {
  width: 130px;
  height: 130px;
  background-size: cover;
  background-clip: content-box;
  background-position: 50% 50%;
  background-color: #f6f8f9;
  overflow: hidden;
}

.component-width {
  width: 220px;
}
</style>
