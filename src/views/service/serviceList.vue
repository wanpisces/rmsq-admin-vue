<template>
    <div class="info-container">
        <div>
            <el-card class="box-card">
                <!-- 查询 -->
                <div class="search-box">
                    <div class="search">
                        <span>输入搜索：</span>
                        <el-input style="width:200px" v-model="search.q" placeholder="单位名称"></el-input>
                    </div>
                    <div class="search">
                        <span>服务分类：</span>
                        <el-select v-model="search.category_id" placeholder="请选择服务分类">
                            <el-option v-for="item in categoryData" :key="item.category_id" :label="item.category_name" :value="item.category_id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search">
                        <span>行政级别：</span>
                        <el-select v-model="search.group_type" placeholder="请选择行政级别">
                            <el-option v-for="item in groupData" :key="item.group_type" :label="item.group_name" :value="item.group_type">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="search ">
                        <el-button type="primary" icon="el-icon-search" @click="selectionCotent()">搜索</el-button>
                    </div>
                </div>
            </el-card>
            <!-- tabelList -->
            <el-card class="box-card">
                <div class="table-list">

                    <div class="table-title">
                        <div>
                            <!-- <el-button type="danger" plain  :disabled="selectionValues.length===0" @click="tabelDelete()">删除</el-button> -->
                            <!-- <el-button v-for="(item, index) in switchData" :key="index" :type="active == item.active?'primary':''" @click="switchFn(item.active)">{{item.name}}</el-button> -->
                        </div>
                        <div>
                            <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="releaseClick()">发布资讯</el-button> -->
                            <choose-tab @TimeOn="timeOn">
                            </choose-tab>
                        </div>

                    </div>
                    <el-table :data="tableData" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中...." element-loading-spinner="el-icon-loading" ref="table" @row-click="handleCurrentChange" @selection-change="selectionChange">
                        <!-- <el-table-column
                type="selection"
                width="55" >
                </el-table-column> -->
                        <el-table-column prop="service_title" label="服务分类" width="180">
                        </el-table-column>
                        <el-table-column label="服务名称">
                            <template slot-scope="scope">
                                <span>{{scope.row.category_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="行政级别">
                            <template slot-scope="scope">
                                <span>{{scope.row.group_type==1?'社区':scope.row.group_type==2?'街道':scope.row.group_type==3?'区':scope.row.group_type==4?'市':'省'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="单位名称">
                            <template slot-scope="scope">
                                <span>{{scope.row.inst_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="单位地址">
                            <template slot-scope="scope">
                                <span>{{scope.row.inst_addr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="联系方式">
                            <template slot-scope="scope">
                                <span v-if="scope.row.inst_phone">{{scope.row.inst_phone}}</span>
                                <span v-else>无</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column
                    fixed="right"
                    label="操作"
                    width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handEditor(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="handleState(scope.row.nav_id,scope.row.status)">{{scope.row.status==1?'禁用':'启用'}}</el-button>
                    </template>
                </el-table-column> -->
                    </el-table>
                    <div class="table-footer">
                        <div style="margin-left: 20px;">
                            <mo-paging :page-index="current_page" :total="count" :page-size="page_size" @change="pageChange">
                            </mo-paging>
                        </div>

                    </div>
                </div>
            </el-card>
        </div>

    </div>
</template>

<script>
import MoPaging from "../../components/Paginations.vue";
import Tinymce from "../../components/Tinymce/index.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
// import SwitchTable from "../../components/SwitchTable/index.vue"
// 数据service接口
import { RequestUploads } from "../../fetch/modules/public.js";
import { RequestQiNiutoken } from "../../fetch/tool";
// import {RequestClassfiyList,RequestNewsList,RequestNewsAdd,RequestNewsEditor,RequestNewsDelete,RequestModuleList,RequestNewsOnline,RequestNewsTop} from  "../../fetch/modules/info.js"
// import { RequestModulesList,RequestModulesAdd,RequestModulesDelete,RequestModulesEditor,RequestModulesState }  from '../../fetch/modules/setting'
import {
  RequestServiceList,
  RequestCategory
} from "../../fetch/modules/service";
// 正则匹配
const rules = {
  nav_title: [
    { required: true, message: "请输入模块名称", trigger: "blur" },
    { min: 1, max: 4, message: "长度在 1 到 4 个字符", trigger: "blur" }
  ],
  nav_pic: [{ required: true, message: "请选择icon上传", trigger: "blur" }]
};
export default {
  components: { MoPaging, Tinymce, ChooseTab },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      to.meta.perm.forEach((item, index) => {
        vm.perm[item.perm_name] = item.is_select;
      });
    });
  },
  data() {
    return {
      rules,
      search: {
        // 搜索条件
        q: "", // 搜索条件
        order_time: 2, // 时间排序
        category_id: "", // 服务分类
        group_type: "" // 行政级别,
      },

      tableData: [],
      current_page: 1,
      count: 0,
      page_size: 5,
      formLabelWidth: "120px",
      selectionValues: [],
      loading: false,
      groupData: [
        {
          group_type: "",
          group_name: "全部"
        },
        {
          group_type: "1",
          group_name: "社区"
        },
        {
          group_type: "2",
          group_name: "街道"
        },
        {
          group_type: "3",
          group_name: "区"
        },
        {
          group_type: "4",
          group_name: "市"
        },
        {
          group_type: "5",
          group_name: "省"
        }
      ],
      categoryData: [{ category_id: "", category_name: "全部" }]
    };
  },
  mounted() {
    this.categoryList();
    this.newList();
  },
  methods: {
    // 资讯列表
    newList(_obj) {
      this.loading = true;
      let _data = Object.assign(JSON.parse(JSON.stringify(this.search)), _obj);
      for (const key in _data) {
        // 去除对象内多余的空值key
        if (_data[key] === "") {
          delete _data[key];
        }
      }
      let page = { page_size: this.page_size, current_page: 1 };
      let args = Object.assign(page, _data) || {};
      let self = this;
      RequestServiceList(args).then(res => {
        if (res) {
          self.tableData = res.list;
          self.count = res.total_num;
          this.loading = false;
        }
      });
    },
    // 服务分类
    categoryList() {
      const self = this;
      RequestCategory({ category_type: 2 }).then(res => {
        if (res) {
          self.categoryData = self.categoryData.concat(res);
        }
      });
    },

    // 查询
    selectionCotent() {
      this.current_page = 1;
      let args = { q: this.search.q };
      this.newList(args);
    },

    // 时间切换
    timeOn(value) {
      this.search.order_time = value;
      let args = { order_time: value };
      this.newList(args);
    },
    // 分页选择
    pageChange(current) {
      this.current_page = current;
      let args = { current_page: current };
      this.newList(args);
    },
    // 批量选中
    selectionChange(selectionValues) {
      this.selectionValues = selectionValues;
    },
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
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
  .table-list {
    margin: 10px 0;
  }
  .icon-font {
    font-size: 16px;
  }
  .table-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
  }
  .label-choose {
    list-style: none;
    cursor: pointer;
  }
  .table-footer {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
  .switch-btn {
    position: relative;
    width: 70px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px #dcdfe6 solid;
    outline: none;
    border-radius: 5px;
    background: #fff;
    top: 2px;
    cursor: pointer;
  }
  .active {
    background: #409eff;
    color: #fff;
  }
  .active:hover {
    opacity: 0.8;
  }
  margin: 30px 15px;
  font-size: 14px;
  .info-footer {
    margin-left: 120px;
    padding: 50px 0;
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
    height: 70px;
    width: 70px;
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
    font-size: 10px;
    color: #8c939d;
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
  }

  .avatar {
    width: 70px;
    height: 70px;
    display: block;
  }
}
</style>

