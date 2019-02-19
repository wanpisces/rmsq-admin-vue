<template>
  <div style="padding:0px 10px">
    <!-- <div>{{dataObject.list[0]}}----------11111</div> -->
    <div v-if="dataObject.tr==0">
      <!-- 文本框 -->
      <div v-if="dataObject.list[0].builder_id=='1000001' " :class="[dataObject.isFalse==true ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
        <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
        <img class="d-delete-icon" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
        <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
        <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
        <div :class="[dataObject.list[0].builder_params.input_type==1?'d-input':'d-textarea']">{{dataObject.list[0].builder_params.placeholder}}</div>
      </div>
      <!-- 日期组件 -->
      <div v-if="dataObject.list[0].builder_id=='1000005' " :class="[dataObject.isFalse==true ?'d-wrapper d-choose-active':'d-wrapper' ]" @click.stop="handleBg(dataObject.list[0])">
        <!-- <i :class="dataObject.isFalse==true ?'d-delete-icon d-delete-active':'d-delete-icon'" @click.stop="handleDelete(index)"></i> -->
        <img class="d-delete-icon" src="./../../../../static/images/deleteIcon.png" width="20" alt="" @click.stop="handleDelete(dataObject.list[0])">
        <span class="word_wrap " v-html="dataObject.list[0].builder_params.title"></span> <span class="d-start" v-if="dataObject.list[0].builder_params.is_required==1">*</span>
        <p class="word_wrap d-desc">{{dataObject.list[0].builder_params.desc}}</p>
        <div class="d-input">{{dataObject.list[0].builder_params.placeholder}}</div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object || Array,
      default: function() {
        return {};
      }
    },
    isShow: {
      type: Number || String,
      default: 0
    },
    index: {
      type: Number,
      type: 0
    },
    tr: {
      type: Number || String,
      default: 0
    }
  },
  data() {
    return {
      dataObject: this.data,
      isFalse: false
    };
  },
  watch: {
    data() {
      console.log("sssss", this.data);
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleDelete(index) {
      this.$emit("handleDelete", index);
      // this.dataObject.splice(index, 1);
    },
    handleBg(val) {
      // console.log(val);
      this.$emit("handleBg", val);
    }
  }
};
</script>

<style scoped>
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
.d-wrapper:hover {
  border: 1px #ccc dotted;
}
.d-desc {
  color: #848484;
  font-size: 14px;
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
  height: 80px;
  border: 1px #17b1ed solid;
  color: #848484;
  padding: 10px 0 0 10px;
  font-size: 14px;
  margin-top: 10px;
}
.d-input {
  width: 100%;
  height: 30px;
  color: #848484;
  font-size: 14px;
  border-bottom: 1px #ebeef5 solid;
  /* border-bottom: 1px #17b1ed solid; */
  margin-top: 10px;
}
.d-start {
  margin-left: 2px;
  color: rgb(218, 40, 36);
}
</style>
