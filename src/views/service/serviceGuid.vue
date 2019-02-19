<template>
  <div class="info-container">
    <el-card class="box-card">
      <!-- 查询 -->
      <div class="search-box">
        <div class="search">
          <span>输入搜索：</span>
          <el-input style="width:200px" placeholder="请输入事项名称" v-model="objSearch.q"></el-input>
        </div>
        <!-- <div class="search">
                  <span>单位：</span>
                  <el-select v-model="objSearch.unit_id" placeholder="请选择单位">
                        <el-option
                        v-for="item in unitData"
                        :key="item.unit_id"
                        :label="item.unit_name"
                        :value="item.unit_id">
                        </el-option>
                  </el-select>
              </div> -->
        <div class="search">
          <span>分类：</span>
          <el-cascader @change="selectAttr" :options="options" :show-all-levels="false"></el-cascader>
        </div>
        <div class="search ">
          <el-button type="primary" icon="el-icon-search" @click='searchKeyword'>搜索</el-button>
        </div>
      </div>
    </el-card>
    <!-- tabelList -->
    <el-card class="box-card">
      <div class="table-list">
        <el-popover ref="popover2" placement="bottom" width="100" trigger="click">
          <div class="table-choose">
            <p>
              <i class="el-icon-tickets icon-font"></i> 显示列表定制</p>
            <p>
              <i class="el-icon-upload2 icon-font"></i>时间升序</p>
            <p>
              <i class="el-icon-download icon-font"></i>时间降序</p>
          </div>
        </el-popover>
        <div class="table-title">
          <div>
            <el-button v-if="perm.caseDele == 1" type="danger" plain @click="tabelDelete" :disabled="selectionValues.length===0">删除</el-button>
          </div>
          <div>
            <choose-tab v-if="perm.caseAdd == 1" add-title="新增" @handleAdd="releaseClick" @TimeOn="TimeOn">
            </choose-tab>
          </div>
        </div>
        <el-table ref="table" :data="tableData" border style="width: 100%" @selection-change="selectionChange" @row-click="handleCurrentChange">
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="event_name" label="事项名称" align="center">
            <template slot-scope="scope">
              <router-link style="color:#409eff;" :to="{path:'guidDetail',query:{event_id:scope.row.event_id}}">{{scope.row.event_name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="发布时间" align="center">
          </el-table-column>
          <el-table-column prop="editor_name" label="发布人姓名" align="center">
          </el-table-column>
          <!-- <el-table-column
                prop="group_name "
                label="单位名称"
                align="center">
                </el-table-column> -->
          <el-table-column prop="attr_text" label="事项分类" align="center">
          </el-table-column>
          <el-table-column fixed="right" v-if="perm.caseEdit == 1" label="操作选项" width="100" align="center">
            <template slot-scope="scope">
              <!-- <div class="el-icon-wrapper">
                <i v-if="perm.caseEdit == 1" class="el-icon-edit" title="修改" @click="handEditor(scope.row)"></i>
              </div> -->
              <el-button type="text" size="small" @click="handEditor(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div align="right" style="margin-top: 30px">
          <!-- <mo-paging :page-index="objSearch.current_page" :total="count" :page-size="objSearch.page_size" @change="pageChange">
          </mo-paging> -->
          <el-pagination background @current-change="pageChange" :current-page.sync="objSearch.current_page" :page-size="objSearch.page_size" layout="total,prev, pager, next, jumper" :total="count">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import MoPaging from "../../components/Paginations.vue";
import ChooseTab from "../../components/ChooseTab/ChooseTab.vue";
import { GetClassfiyList } from "../../fetch/validate.js";
import {
  RequestServiceGuidList,
  RequestClassfiyList,
  RequestServiceGuidDelete
} from "../../fetch/modules/service";

export default {
  components: { MoPaging, ChooseTab },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      to.meta.perm.forEach((item, index) => {
        vm.perm[item.perm_name] = item.is_select;
      });
    });
  },
  data() {
    return {
      perm: {
        caseAdd: 2,
        caseEdit: 2,
        caseDele: 2
      },
      options: [],
      value: "",
      unitData: [
        {
          unit_id: 0,
          unit_name: "全部"
        },
        {
          unit_id: 1,
          unit_name: "华阳街道办事处"
        },
        {
          unit_id: 2,
          unit_name: "天府新区联合华阳街道办事处联合双流"
        },
        {
          unit_id: 3,
          unit_name: "天府新区人民政府"
        }
      ],
      tableData: [],
      objSearch: {
        attr_id: "",
        current_page: 1,
        page_size: 10,
        q: "",
        order_time: 2,
        unit: ""
      },
      count: 0,
      formLabelWidth: "120px",
      multipleSelection: [],
      deleteMark: true,
      selectionValues: [] // 删除列表
    };
  },
  created() {
    this.getAttr();
    this.getListData();
  },
  methods: {
    //分页
    pageChange(currentPage) {
      this.objSearch.current_page = currentPage;
      this.getListData();
    },
    //获取列表
    getListData() {
      var args = this.objSearch;
      for (const key in args) {
        // 去除对象内多余的空值key
        if (args[key] === "") {
          delete args[key];
        }
      }
      RequestServiceGuidList(args).then(res => {
        this.tableData = res.list;
        this.objSearch.current_page = Number(res.current_page);
        this.objSearch.page_size = Number(res.page_size);
        this.count = Number(res.total_num);
      });
    },
    //选择分类
    selectAttr(arr) {
      this.objSearch.attr_id = arr[arr.length - 1];
    },
    //获取分类
    getAttr() {
      GetClassfiyList().then(res => {
        this.options = res;
      });
    },
    // 搜索关键词
    searchKeyword() {
      this.objSearch.current_page = 1;
      var args = this.objSearch;
      this.getListData(args);
    },
    //排序
    TimeOn(sort) {
      this.objSearch.order_time = sort;
      var args = this.objSearch;
      this.getListData(args);
    },
    // 添加
    releaseClick() {
      this.$router.push({ name: "guidAdd" });
    },
    //编辑信息
    handEditor(row) {
      const event_id = row.event_id;
      this.$router.push({ name: "guidEdit", query: { event_id: event_id } });
    },

    handleSelectionChange(val) {
      for (var i = 0; i < val.length; i++) {
        this.multipleSelection.push(val[i].event_id);
      }
      if (val.length <= 0) {
        this.deleteMark = true;
      } else {
        this.deleteMark = false;
      }
    },
    // 批量选中
    selectionChange(selectionValues) {
      this.selectionValues = selectionValues;
    },
    // 表格选择
    handleCurrentChange(row, event, column) {
      this.$refs.table.toggleRowSelection(row);
    },
    //  表格删除
    tabelDelete() {
      let self = this,
        selectionArr = [];

      for (let i in this.selectionValues) {
        selectionArr.push(this.selectionValues[i].event_id);
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RequestServiceGuidDelete({ event_id: selectionArr }).then(res => {
            self.getListData(self.objSearch);
          });
        })
        .catch(() => {
          this.$Message({
            type: "info",
            text: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .img-resopnse {
    width: 100%;
    height: 100px;
  }
  @media (min-width: 1562px) and (max-width: 1920px) {
    .img-resopnse {
      width: 80%;
    }
  }

  @media (min-width: 1920px) {
    .img-resopnse {
      width: 50%;
      text-align: center;
    }
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
  .table-choose p {
    cursor: pointer;
  }
  .avatar {
    width: 100%;
    height: 100%;
  }
}
</style>

