<template>
  <div class="info-container">
    <el-card class="box-card  preview-content">
      <div slot="header" class="clearfix">
        <span>预览问卷</span>
      </div>
      <div class="card-body">

        <h3>
          <strong>问卷标题：</strong>{{voteData.questionnaire_title}}</h3>
        <p class="word-wrap">
          <strong>问卷说明：</strong>{{voteData.questionnaire_desc}}</p>
        <div class="topic-content">
          <p>
            <strong>题目：</strong>
          </p>
          <div style="padding: 30px 0 10px;">
            <div style="padding: 18px 10px 0;" v-for="(item,index) in voteData.subjects" :key="index">
              <!-- 选项 -->
              <section v-if="item.subject_type != '0'">
                <h4>{{index+1}}.{{item.subject_title}}
                  <samp class="font-size-14">（{{{'1':'单选','2':'多选，最多选'+item.max_select+'项，至少选'+item.min_select+'项','3':'填空'}[(item.subject_type == 1 || item.subject_type == 5 || item.subject_type == 7 ? '1' : (item.subject_type == 3 ? '3' : '2' ) )]}}）</samp>
                </h4>

                <div v-if="item.subject_type!=3" class="topic-option">
                  <p class="font-size-14"> 选项：</p>
                  <div>
                    <div v-for="(item2,index2) in item.subject_items" :key="index2" class="topic-option-item2">
                      <p class="font-size-14">{{item2.subject_item_title}}</p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- 联系人组件 -->
              <section v-else>
                <el-form ref="form" :model="item" label-position="top">
                  <!-- 文本框 -->
                  <el-form-item v-if="item.subject_builder.type == 1" :label="index+1 +'. '+ item.subject_title+'： '">
                    <el-input class="component-width" disabled :placeholder="'请输入'+item.subject_title"></el-input>
                  </el-form-item>
                  <!-- 单选框 -->
                  <el-form-item v-if="item.subject_builder.type == 2" :label="index+1 +'. '+ item.subject_title+'： '">
                    <div class="radio-vertical-box">
                      <el-radio-group>
                        <el-radio disabled v-for="_item in item.item_list " :key="_item.key" :label="_item.desc" :value="_item.val"></el-radio>
                      </el-radio-group>
                    </div>
                  </el-form-item>
                  <!-- 多选框 -->
                  <el-form-item v-if="item.subject_builder.type == 3" :label="index+1 +'. '+ item.subject_title+'： '">
                    <div class="radio-vertical-box">
                      <el-checkbox-group>
                        <el-checkbox disabled v-for="_item in item.item_list " :key="_item.key" :label="_item.desc" :value="_item.val"></el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-form-item>
                  <!-- 级联选择器 -->
                  <el-form-item v-if="item.subject_builder.type == 4" :label="index+1 +'. '+ item.subject_title+'： '">
                    <el-cascader class="component-width" disabled :options="[]" filterable change-on-select>
                    </el-cascader>
                  </el-form-item>
                  <!-- 文件上传 -->
                  <el-form-item v-if="item.subject_builder.type == 5" :label="index+1 +'. '+ item.subject_title+'： '">
                    <p style="color:#c0c4cc;margin-top:0;">支持jpg，jpeg，png，gif图片格式</p>
                    <div style="width:120px;height:120px;border:1px solid #e6e6e6;line-height:120px;text-align:center;font-size:42px;color:#999;cursor: not-allowed;background-color:#f5f7fa">
                      <i class="el-icon-upload"></i>
                    </div>
                  </el-form-item>
                  <!-- 地址 -->
                  <el-form-item v-if="item.subject_builder.type == 6" :label="index+1 +'. '+ item.subject_title+'： '">
                    <el-select disabled style="width:80px;" value="" placeholder="地区">
                      <el-option value="1" label="选项一"></el-option>
                    </el-select>
                    <el-input class="component-width" disabled placeholder="详细地址"></el-input>
                  </el-form-item>
                </el-form>
              </section>
            </div>
          </div>

        </div>
        <p>
          <strong>报名截止时间：</strong>{{voteData.end_date}}</p>
        <p>
          <strong>是否需要匿名填写：</strong>{{voteData.allow_anonymous == 1 ? '是' : '否'}}</p>
        <p>
          <strong>是否关联活动：</strong>{{voteData.link_miniprogram == 1 ? '是' : '否'}}
        </p>
        <p v-if="voteData.link_miniprogram==1">
          <strong>已关联活动：</strong>
          <ol class="">
            <li v-for="(item,index) in voteData.link_third_miniprogram" :key="index" v-if="voteData.link_third_miniprogram">{{ item.service_title || item.title}}</li>
          </ol>
        </p>
        <!-- <p>
          <strong>投放分类：</strong>{{voteData.service_id}}
        </p> -->
        <div class="preview-footer">
          <el-button type="primary" @click="changeVoteStatus">发布</el-button>
          <el-button @click="backToList">返回问卷列表</el-button>
        </div>

      </div>

    </el-card>
  </div>
</template>

<script>
import { RequestQuestionnaireDetail, RequestQuestionSubjectList, RequestQuestionnaireState } from "@/fetch/modules/service.js";

export default {
  data() {
    return {
      urlLastId: "",
      questionnaire_id: "",
      voteData: {
        service_id: "",
        questionnaire_title: "",
        questionnaire_desc: "",
        subjects: [],
        end_date: "",
        allow_anonymous: ""
      },
      mySubjects: null
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.urlLastId = to.meta.id;
    });
  },
  mounted() {
    console.log("questionnaire_id", this.$route.query.questionnaire_id);
    this.questionnaire_id = this.$route.query.questionnaire_id;

    if (this.questionnaire_id) {
      this.getSubjectList();
    }
  },
  methods: {
    // 发布
    changeVoteStatus() {
      RequestQuestionnaireState({
        questionnaire_id: this.questionnaire_id
      }).then(res => {
        if (res.code == 2000) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.backToList();
        } else {
          this.$message({
            type: "warning",
            message: res.msg
          });
        }
        console.log("__RequestVoteState__", res);
      });
    },
    // 获取问卷详情
    getVoteDetail() {
      RequestQuestionnaireDetail({
        questionnaire_id: this.questionnaire_id
      }).then(res => {
        console.log("getVoteDetail", res);
        res.data.subjects = this.mySubjects;

        this.voteData = res.data;
        console.log("this.form ", this.form);
      });
    },
    // 获取题目列表
    getSubjectList() {
      RequestQuestionSubjectList({
        questionnaire_id: this.questionnaire_id
      }).then(res => {
        console.log("getSubjectList", res);
        this.mySubjects = res.data.list;
        this.mySubjects.map(function(item, index) {
          item.subject_items = item.subject_item_list;
          delete item.subject_item_list;

          // 联系人组件
          if (item.subject_type == "0") {
            const _subject_builder = item.subject_builder_list[0];
            item.item_list = _subject_builder.builder_params.item_list || [];
            item.subject_builder = {
              subject_builder_id: _subject_builder.subject_builder_id,
              builder_id: _subject_builder.builder_id, // 组件ID
              type: _subject_builder.builder_params.type // 1-文本框；2-单选框；3-多选框；4-联动选择框；5-文件上传；6-地址
            };
            delete item.subject_builder_list;
          }
          return item;
        });
        this.getVoteDetail();
      });
    },
    // 返回上一页
    backToList() {
      this.$router.push({
        path: "question" + this.urlLastId
      });
      this.$store.dispatch("delVisitedViews", {
        path: "/questionModule/previewQuestion" + this.urlLastId
      });
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  padding: 30px 15px;
  font-size: 14px;

  strong {
    display: inline-block;
    width: 160px;
    text-align: right;
  }

  .card-body {
    width: 90%;
    margin: 0 auto;
    p {
      margin: 15px 0;
    }
  }

  .topic-content {
    display: flex;

    .topic-option {
      display: flex;
      justify-content: flex-start;
      padding-left: 2em;

      .topic-option-box {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-items: flex-start;
        width: 400px;
        height: auto;

        .topic-option-item {
          padding: 16px 35px;
        }
        .img-bg-box {
          width: 130px;
          height: 130px;
          background-size: cover;
          background-clip: content-box;
          background-position: 50% 50%;
          background-color: #f6f8f9;
          overflow: hidden;
          // border: 1px solid #f2f2f2;
          border-radius: 5px;
        }
      }
      .topic-option-item2 {
        padding-left: 6px;
      }
    }
  }
}

h3,
h4,
p {
  font-size: 14px;
}
h3 {
  font-weight: normal;
}
h4 {
  margin: 0;
}

.font-size-14 {
  font-size: 14px;
  font-weight: 400;
}
.preview-footer {
  display: flex;
  justify-content: flex-end;
}

.component-width {
  width: 220px;
}
</style>
