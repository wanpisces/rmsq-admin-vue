<template>
  <div class="info-container">
      <el-card class="box-card">
          <!-- 查询 -->
          <div class="search-box">
              <div class="search">
                  <span>输入搜索：</span>
                  <el-input style="width:200px" placeholder="服务名称/行政单位"></el-input>
              </div>

              <div class="search">
                  <span>资讯来源：</span>
                   <el-select v-model="value" placeholder="请选择行政级别">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                  </el-select>
              </div>
              <div class="search">
                  <span>资讯分类：</span>
                  <el-select v-model="value" placeholder="请选择服务类型">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                  </el-select>
              </div>
              <div class="search ">
                  <el-button type="primary" icon="el-icon-search">搜索</el-button>
              </div>
          </div>
       </el-card>    
          <!-- tabelList -->
       <el-card class="box-card">   
          <div class="table-list">
             <!-- <el-popover
                    ref="popover2"
                    placement="bottom"
                    width="70"
                    trigger="click"
                    >
                <div>
                    <p style="line-height:40px;cursor: pointer;" class="label-choose"><i class="el-icon-tickets icon-font"></i> 显示列表定制</p>
                    <p style="line-height:40px;cursor: pointer;"><i class="el-icon-upload2 icon-font"></i> 时间升序</p>
                    <p style="line-height:40px;cursor: pointer;"><i class="el-icon-download icon-font"></i> 时间降序</p>
                </div>    
            </el-popover>   -->
            <div class="table-title">
                 <div>
                    <el-button type="danger" plain @click="tabelDelete()">删除</el-button>
                    <el-button type="primary" disabled="">全部</el-button>
                   
                 </div>
                 <div>
                     <el-dropdown>
                        <el-button >
                           选项<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item ><div @click="listShowDialog=true"><i class="el-icon-tickets icon-font"></i> 显示列表定制</div></el-dropdown-item>
                            <el-dropdown-item><i class="el-icon-upload2 icon-font"></i> 时间升序</el-dropdown-item>
                            <el-dropdown-item><i class="el-icon-download icon-font"></i> 时间降序</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                 </div>
                
            </div> 
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                type="selection"
                width="55" >
                </el-table-column>
                <el-table-column
                prop="date"
                label="编号"
                width="180" v-if="tabel[0].tatbelShow">
                </el-table-column >
                <el-table-column
                prop="name"
                label="单位名称"
                width="180" v-if="tabel[1].tatbelShow">
                </el-table-column>
                <el-table-column
                prop="address"
                label="行政级别" v-if="tabel[2].tatbelShow">
                </el-table-column>
                 <el-table-column
                prop="address"
                label="服务项" v-if="tabel[3].tatbelShow">
                </el-table-column>
                 <el-table-column
                prop="address"
                label="单位地址" v-if="tabel[4].tatbelShow">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="140" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handEditor(scope.row)">编辑</el-button>
                        <el-button type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
                
            </el-table>
            <div class="table-footer">
                <div style="margin-left: 20px;">
                    <mo-paging     
                    :page-index="currentPage"   
                    :total="count"     
                    :page-size="pageSize"   
                    @change="pageChange">   
                </mo-paging>  
                </div>
                
            </div>
          </div>
      </el-card>
     <!-- 发布添加 -->
     <el-dialog title="发布资讯" :visible.sync="releaseDialog" width="70%">
        <el-form :model="form">
            <el-form-item label="资讯标题：" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="资讯标签：" :label-width="formLabelWidth">
                <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
                </el-tag>
                <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+添加</el-button>
            </el-form-item>
             <el-form-item label="资讯模块：" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="资讯分类：" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="资讯正文：" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="资讯正文：" :label-width="formLabelWidth">
                <tinymce :height="400" v-model="form.content"></tinymce>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 编辑 -->


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
import MoPaging  from '../../components/Paginations.vue' 
import Tinymce from '../../components/Tinymce/index.vue'
export default {
   components:{MoPaging,Tinymce},
    data() {
        return{
           search:'zk',
           options: [{
            value: '选项1',
            label: '黄金糕'
            }, {
            value: '选项2',
            label: '双皮奶'
            }, {
            value: '选项3',
            label: '蚵仔煎'
            }, {
            value: '选项4',
            label: '龙须面'
            }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
            value: '',
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


            ],
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                online:1
                }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄',
                online:1
                }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄',
                online:1
                }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄',
                online:2
            }],
            currentPage:1,
            count:60,
            pageSize:4,
            // 发布编辑
            releaseDialog:false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
                content:''
            },
            formLabelWidth: '120px',
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            editorData:[],
            // 列的显隐 穿梭机
            listShowDialog:false,
            tempValues:[],
            tempTabelOne:[]
        

            
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
    },
    methods:{
        pageChange() {

        },
        releaseClick() {
            this.releaseDialog= true;
        },
        tabelDelete() {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
            });
        },
        // 编辑
        handEditor(row) {

        },
        handleClose(tag) {
           this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        listShow() {
          let self= this; 
          let a=[...new Set(this.value1)].sort(),tabelData=this.tabel
          tabelData.map((item,index)=>{
              if(self.value1){ 
                  for(let i in a){  
                     if(item.key== a[i]){
                        item.tatbelShow= false,
                        console.log(item.key)
                        console.log(item.tatbelShow)
                     }
                  }
              }else{

              }         
          })
          this.listShowDialog= false
        },

       showInput() {
         this.inputVisible = true;
         this.$nextTick(_ => {
           this.$refs.saveTagInput.$refs.input.focus();
         });
       },

       handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
            this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
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
  .label-choose{
      list-style: none;
      cursor: pointer;
  }
  .table-footer{
      margin-top: 30px;
      display: flex;
      justify-content:flex-end;
      align-items: center
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
}

</style>

