<template>
  <div class="info-container">
      <el-card class="box-card">
          <!-- 查询 -->
          <div class="search-box">
              <div class="search">
                  <span>输入搜索：</span>
                  <el-input style="width:200px" placeholder="热词名称"></el-input>
              </div>
              <div class="search ">
                  <el-button type="primary" icon="el-icon-search">搜索</el-button>
              </div>
          </div>
       </el-card>    
          <!-- tabelList -->
       <el-card class="box-card">   
          <div class="table-list">
             <el-popover
                    ref="popover2"
                    placement="bottom"
                    width="100"
                    trigger="click"
                    >
                <div class="table-choose">
                    <p><i class="el-icon-tickets icon-font"></i> 显示列表定制</p>
                    <p><i class="el-icon-upload2 icon-font"></i>时间升序</p>
                    <p><i class="el-icon-download icon-font"></i>时间降序</p>
                </div>    
            </el-popover>  
            <div class="table-title">
                 <div>
                    <el-button type="danger" plain  @click="batchDelete">删除</el-button> 
                    <!-- <switch-table @switchFn="switchFnSelf" :switchData = "switchData" :active="active"></switch-table> -->
                 </div>
                 
                 <div class="" align="right">
                    <choose-tab 
                        @handleShowDliog="handleShowDliog"  
                        add-title="新建"
                        @handleAdd="releaseClick()">
                    </choose-tab>
                 </div>
            </div> 
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="date"
                label="编号"
                width="180">
                </el-table-column>
                <el-table-column
                prop="name"
                label="热词名称"
                width="180"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="address"
                label="搜索次数">
                </el-table-column>
                 <el-table-column
                prop="address"
                label="上线时间"
                show-overflow-tooltip>
                </el-table-column>
                 <el-table-column
                prop="address"
                label="排序">
                </el-table-column>
                <el-table-column
                label="操作选项"
                fixed="right"
                width="100"  align = 'center'>
                    <template slot-scope="scope">
                        <el-switch 
                        v-model="scope.row.mark"
                        @change="setHotWord(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
            <div align="right" style="margin-top: 30px"> 
                <mo-paging     
                    :page-index="currentPage"   
                    :total="count"     
                    :page-size="pageSize"   
                    @change="pageChange">   
                </mo-paging>  
            </div>
          </div>
      </el-card>
      <el-dialog title="新建热词" :visible.sync="releaseDialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"> 
            <el-form-item label="热词名称：" prop="name" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="热词类型" prop="type" :label-width="formLabelWidth">
            <el-select v-model="ruleForm.type" placeholder="请选择热词类型">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
            </el-select>    
            </el-form-item>
            <el-form-item label="运营目的："  :label-width="formLabelWidth">
            <el-input v-model="ruleForm.unit"  type="textarea" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="热词排序：" prop="sort" :label-width="formLabelWidth">
            <el-input v-model.number="ruleForm.sort" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item align="right">
                <el-button @click="releaseDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 选项  列的显示 -->
    <el-dialog title="" :visible.sync="listShowDialog" width="560PX">
        <el-transfer v-model="value1" :data="tabelOne" :titles="['显示', '隐藏']"></el-transfer>
        <div slot="footer" class="dialog-footer">
            <el-button @click="listShowDialog = false">取 消</el-button>
            <el-button type="primary" @click="listShow()">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import Switchtable  from '../../components/Switchtable' 
import MoPaging  from '../../components/Paginations.vue' 
import ChooseTab from '../../components/ChooseTab/ChooseTab.vue'
export default {
   components:{Switchtable,MoPaging,ChooseTab},
    data() {
        return{
        search:'zk',
        value: '',
        tableData: [{
            id:1,
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            mark:true
            }, {
            id:2,
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
            mark:false
            }, {
            id:3,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
            mark:false
            }, {
            id:4,
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
            mark:false
        }],
        active:1,
        currentPage:1,
        count:60,
        pageSize:4,
        ruleForm: {
        name: '',
        icon:'',
        sort:'',
        type:''
        },
        switchData:[{
                name:'上线',
                active:1
            },
            {
                name:'下线',
                active:2
        }],
        rules: {
            name: [
                { required: true, message: '模块名称不能为空', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            type:[{ required: true,message: '请选择热词类型', trigger: 'blur' }],
            sort:[{ required: true, message: '排序不能为空'},
                { type: 'number', message: '排序必须为数字值'}]
        },
        formLabelWidth: '120px',
        multipleSelection: [],
        // 发布编辑
        releaseDialog:false,
        // 列的显隐 穿梭机
        listShowDialog: false,
        tempValues: [],
        tabel:[
               {
                key:1,
                label: "编号1",   
                tatbelShow: false,
               },
                {
                key:2,
                label: "编号2",   
                tatbelShow: true,
               },
                {
                key:3,
                label: "编号3",   
                tatbelShow: true,
               },
                {
                key:4,
                label: "编号4",   
                tatbelShow: true,
               },
                {
                key:5,
                label: "编号5",   
                tatbelShow: false,
               },
                {
                key:6,
                label: "编号6",   
                tatbelShow: true,
               }


            ]
        }
    },
    methods:{
        pageChange() {

        },
        releaseClick() {
            this.releaseDialog= true;
        },
        handleShowDliog() {
            console.log('aaaaaaa')
           this.listShowDialog=true;
        },
        //切换组件函数
        switchFnSelf (opt) {
            console.log(opt.active,'aaa')
        },
        setHotWord (value) {
            console.log(value)
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        // 下线
        offlineClick(data) {
            console.log(data)
            this.$confirm('确定要下线该模块吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '下线成功!'
                });
            }).catch(() => {
                return;
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 批量删除
        batchDelete(){
            const multipleSelection =  this.multipleSelection;
            if(multipleSelection.length == 0){
                 this.$message({
                    showClose: true,
                    message: '未选中任何选项！',
                    type: 'error'
                });
                return;
            }
            this.$confirm('确定删除选中选项吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.multipleSelection = [];
            }).catch(() => {
                return;
            });
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        }
    },
    computed:{
        tabelOne: {
            get: function(){
                let data=JSON.parse(JSON.stringify(this.tabel))
                data.map((item,i)=>{
                    if(item.tatbelShow== false){
                       item.tatbelShow= true
                    }
                })
                return   data
            },
            set: function(value){
               console.log('ssss',value)
            }

        },
        value1: {
            get: function (value) {
                let data=this.tabel
                data.map((item,i)=>{
                    if(item.tatbelShow== false){
                        this.tempValues.push(i+1)
                    }
                })
                // console.log(this.tempValues)
                return   this.tempValues
            },
            set: function(value) {
            //   console.log('set',[...new Set(value)])  
              this.tempValues=[...new Set(value)].sort()
              return this.tempValues;
            }
           
        }
    }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container{
   margin: 30px  15px;
   font-size: 14px;
  .search-box{
      width: 100%;
      display: flex;
      align-items: center; 
  }
  .box-card{
      margin-bottom:30px; 
  }
  .search{
    //   width: 30%;
      display: flex;
      margin-right: 2%;
      align-items: center;     
  }
  .table-list{
      margin: 10px  0;    
  }
  .icon-font{
     font-size:16px
  }
  .table-title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin:20px 0;
  }
  .table-choose p{
     cursor: pointer;
  }
}

</style>

