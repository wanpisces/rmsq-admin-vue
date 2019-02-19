<template>
  <div class="container">
     <el-card>
         <el-form ref="form" :model="form" label-width="120px" :rules="rules" >
            <el-form-item label="单位名称：" prop="name" >
                <el-input v-model="form.name" style="width：200px"></el-input>
            </el-form-item>
            <el-form-item label="单位地址：" prop="name" >
                <el-input v-model="form.name" style="width：200px"></el-input>
            </el-form-item>
            <el-form-item label="行政级别：" prop="name">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="行政服务："  prop="type">
                <el-checkbox-group v-model="form.type">
                <el-checkbox label="在线预约" name="type"></el-checkbox>
                <el-checkbox label="税收服务" name="type"></el-checkbox>
                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="公共服务：" prop="type">
                <el-checkbox-group v-model="form.type">
                <el-checkbox label="在线预约" name="type"></el-checkbox>
                <el-checkbox label="税收服务" name="type"></el-checkbox>
                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="医疗服务：" prop="type">
                <el-checkbox-group v-model="form.type">
                <el-checkbox label="在线预约" name="type"></el-checkbox>
                <el-checkbox label="税收服务" name="type"></el-checkbox>
                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="基本服务：" prop="type">
                <el-checkbox-group v-model="form.type">
                <el-checkbox label="在线预约" name="type"></el-checkbox>
                <el-checkbox label="税收服务" name="type"></el-checkbox>
                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="ServiceConfigOnSubmit('form')">确定</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
     </el-card>
  </div>
</template>

<script>
const  rules={
          name: [
            { required: true, message: '请输入单位名称', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
          ],
           region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个行政服务', trigger: 'change' }
          ],
           }
export default {
    data() {
        return{
           rules,
           form: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
        }
        }
    },
    methods: {
        ServiceConfigOnSubmit(formName) {
           this.$refs[formName].validate((valid)=>{
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
           })
        }
    }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.container{
    margin: 30px  15px;   
}
</style>
