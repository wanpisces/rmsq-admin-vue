<template>
  <div>
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" @close="$emit('update:dialogVisibleBefore', false)" :dialogVisibleBefore="dialogVisibleBefore">
      <el-form :model="form" ref="form" label-width="120px" class="demo-ruleForm">
        <el-form-item label="服务类目名称：" prop="category_name" :rules="[{ required: true, message: '服务类目名称不能为空'},{min:1,max:6,message: '长度在 1 到 6 个字符',trigger: 'blur'}]">
          <el-input v-model="form.category_name" placeholder="请输入类目名称" maxlength="6"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
          <el-button @click="cancle('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
let self;
import {
  RequestServiceCategoryAdd,
  RequestServiceCategoryEditor
} from "@/fetch/modules/service";
export default {
  props: {
    /**
     * 1.弹框显示隐藏（外部控制）
     */
    dialogVisibleBefore: {
      type: Boolean,
      default: false
    },
    /**
     * 1. 标题自定义
     */
    title: {
      type: String,
      default: ""
    },
    /**
     * 1.表单数据
     */
    dataForm: {
      type: Object,
      default: function() {
        return {
          category_name: "",
          category_id: ""
        };
      }
    },
    /**
     * 1判断是编辑状态还是添加
     */
    statuts: {
      type: String,
      default: ""
    }
  },
  watch: {
    /**
     * 监听外部传回的 显隐
     */
    dialogVisibleBefore() {
      this.dialogVisible = this.dialogVisibleBefore;
    }
  },
  data() {
    self = this;
    return {
      form: this.dataForm,
      dialogVisible: this.dialogVisibleBefore
    };
  },
  methods: {
    /**
     * 1.取消弹框，并且清除数据
     * */
    cancle(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
      this.update();
    },
    /**
     * 1.form表单提交
     * 2.验证表单
     * 3.数据回调
     * 4.关闭弹框，清除内容
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _args = JSON.parse(JSON.stringify(this.form));
          for (const key in _args) {
            if (_args[key] === "") {
              delete _args[key];
            }
          }
          _args.category_type = 2;
          if (this.statuts == 1) {
            RequestServiceCategoryAdd(_args).then(res => {
              res.code === 2000
                ? self.$message.success(res.msg)
                : self.$message.error(res.msg);
              self.dialogVisible = false;
              self.$refs["form"].resetFields();
              this.update();
              self.$emit("sure");
            });
          } else if (this.statuts == 2) {
            RequestServiceCategoryEditor(_args).then(res => {
              res.code === 2000
                ? self.$message.success(res.msg)
                : self.$message.error(res.msg);
              self.dialogVisible = false;
              self.$refs["form"].resetFields();
              this.update();
              self.$emit("sure");
            });
            // console.log("执行");
          }
          console.log("执行");
          // this.$emit("sure");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 1.关闭前的回调，并且清除内容
     */
    handleClose() {
      this.dialogVisible = false;
      this.$refs["form"].resetFields();
      this.update();
    },
    /**
     * 数据更新
     */
    update() {
      for (let i in this.form) {
        this.form[i] ? (this.form[i] = "") : "";
      }
      for (let i in this.dataForm) {
        this.dataForm[i] ? (this.dataForm[i] = "") : "";
      }
    }
  }
};
</script>

<style scoped>
</style>
