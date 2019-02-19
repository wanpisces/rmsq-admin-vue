<template>
  <div class="group-content" :style="{width: row ? row*(iconSize + padW*2 + space*2) + space*2 +'px' : '100%',backgroundColor: componentColor,padding: space+'px'}">

    <!-- 图标项 -->
    <div :style="{padding: padH + padTop +'px ' + padW +'px ' + padH +'px ',margin: space + 'px',backgroundColor:itemColor }" v-for="(item,index) in checkArr" :key="index" class="group-item choose-item">

      <!-- 图标 or color-->
      <div v-if="showType == 0">
        <div class="img-bg-box" :style="{backgroundImage: 'url('+item[dataKey.value]+')',width:iconSize+'px',height:iconSize+'px'}">
        </div>
      </div>

      <div v-else>
        <div :style="{backgroundColor: item[dataKey.value], width:iconSize+'px', height:iconSize+'px'}">
        </div>
      </div>

      <!-- 文字  若 dataKey.desc 字段为空则不显示描述文字 -->
      <p v-if="dataKey.desc && item[dataKey.desc]" :style="{width:iconSize+'px'}" class="ellipse"> {{item[dataKey.desc]}}</p>

      <!-- 遮罩  35为描述文字的行高  -->
      <div :key="index" :style="{width:iconSize + padW*2 + 'px', height: iconSize + (item[dataKey.desc] ? 35 : 0) + padH*2 + padTop +'px',opacity: chooseStatus[index] ? 100 : 0}" @click="chooseTeamClick(index,$event)" class="item-mask">
        <i v-if="isShowIcon" :style="{fontSize:(iconSize + padW*2)/3 + 'px'}" class="el-icon-circle-check-outline"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { RequestUploads } from "@/fetch/modules/public.js";
export default {
  props: {
    id: {
      type: String,
      default: "checkCard" /* 组件ID  */
    },
    dataKey: {
      type: Object /* 传入数据键名，用来匹配显示的图标（颜色）和描述文字 */,
      default: function() {
        return {
          desc: "desc",
          value: "value"
        };
      }
    },
    showType: {
      type: Number,
      default: 0 /* 显示类型 0-icon 1-color */
    },
    multiple: {
      type: Boolean,
      default: false /* 多选 */
    },
    row: {
      type: Number,
      default: 0 /* 每行个数 若为0则为响应式布局 */
    },
    iconSize: {
      type: Number,
      default: 80 /* icon大小  */
    },
    padding: {
      type: Number,
      default: 0 /* padding  */
    },
    paddingW: {
      type: Number,
      default: 15 /* padding宽  */
    },
    paddingH: {
      type: Number,
      default: 10 /* padding高  */
    },
    padTop: {
      type: Number,
      default: 8 /* paddingTop 的填补（文字行高会多出空隙额，以至于视觉没有上下居中）  */
    },
    space: {
      type: Number,
      default: 2 /* icon之间的间隙 margin  */
    },
    componentColor: {
      type: String,
      default: "#fff" /* 选择区背景颜色  */
    },
    itemColor: {
      type: String,
      default: "transparent" /* item背景颜色  */
    },
    checkArrP: {
      type: Array /* 选择数据 */,
      default: function() {
        return [
          // {
          //   desc: "quansheng",
          //   value: "https://img.sqydt.darongshutech.com/image_201809211016395821.jpg"
          // },
          // {
          //   desc: "少凤",
          //   value: "https://img.sqydt.darongshutech.com/image_201809211010133261.jpg"
          // },
          // {
          //   desc: "静静",
          //   value: "https://img.sqydt.darongshutech.com/image_201809211016475679.jpg"
          // },
          // {
          //   desc: "浦蒲",
          //   value: "https://img.sqydt.darongshutech.com/image_201809211016437367.jpg"
          // }
        ];
      }
    },
    isShowIcon: {
      type: Boolean,
      default: true /* 是否显示iocn */
    },
    isClickChoose: {
      type: Boolean,
      default: false /* 投票选举的组件选择 */
    },
    paramsObj: {
      type: Object /* 载荷 */,
      default: function() {
        return {
          id: this.id
        };
      }
    }
  },
  data() {
    return {
      chooseStatus: [] /* 所有项的选择状态 */,
      chooseIndex: [] /* 所有项的索引 */,
      chooseTeam: [] /* 此次选择的数据 */,
      checkArr: this.checkArrP,
      padW: 0, // 左右 padding
      padH: 0 // 上下 padding
    };
  },
  watch: {
    checkArrP(_data) {
      this.checkArr = _data;
      this.checkArr.forEach((item, index) => {
        this.chooseStatus.push(false);
        this.chooseIndex.push(index);
      });
    }
  },
  created() {},
  mounted() {
    this.padW = this.padding ? this.padding : this.paddingW;
    this.padH = this.padding ? this.padding : this.paddingH;
  },
  methods: {
    // 选择队伍
    chooseTeamClick: function(index, e) {
      let __checkedStaus = false; // 记录选择状态

      /* 单击选择，无选择效果 */
      if (this.isClickChoose) {
        this.chooseTeam = [index];
        this.paramsObj.checked = true;
        this.$emit("change", this.chooseTeam, this.checkArr[index], this.paramsObj);
        return;
      }

      if (this.multiple) {
        /* 多选 */
        if (this.chooseStatus[index]) {
          console.log("asdasd");
          this.$set(this.chooseStatus, index, false);
          if (!!~this.chooseTeam.indexOf(index)) this.chooseTeam.splice(this.chooseTeam.indexOf(index), 1);
        } else {
          this.$set(this.chooseStatus, index, true);
          this.chooseTeam.push(index);
          __checkedStaus = true;
        }
      } else {
        /* 单选 */
        this.chooseStatus.forEach((element, _index) => {
          if (_index == index) {
            if (this.chooseStatus[_index]) {
              this.$set(this.chooseStatus, _index, false);
              this.chooseTeam = [];
            } else {
              this.$set(this.chooseStatus, _index, true);
              this.chooseTeam = [index];
              __checkedStaus = true;
            }
          } else {
            this.$set(this.chooseStatus, _index, false);
          }
        });
      }
      this.paramsObj.checked = __checkedStaus;
      this.$emit("change", this.chooseTeam, this.checkArr[index], this.paramsObj);
    },
    // 置为选择
    setCheck(_arr) {
      _arr = _arr && _arr.length ? _arr : this.chooseIndex;
      _arr.forEach(item => {
        this.$set(this.chooseStatus, item, true);
        this.chooseTeam.push(item);
      });
    },
    // 取消选择
    cancelCheck(_cancerArr) {
      const _arr = _cancerArr && _cancerArr.length ? _cancerArr : this.chooseIndex;
      _arr.forEach(item => {
        this.$set(this.chooseStatus, item, false);
        if (!!~this.chooseTeam.indexOf(item)) this.chooseTeam.splice(this.chooseTeam.indexOf(item), 1);
      });
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.ellipse {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
}
.group-content {
  width: 630px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .group-item {
    display: flex;
    flex-direction: column;
    padding: 15px 20px;
    position: relative;

    .img-bg-box {
      width: 80px;
      height: 80px;
      // border-radius: 50%;
      background-size: cover;
      background-clip: content-box;
      background-position: 50% 50%;
      background-color: #f6f8f9;
      overflow: hidden;
    }

    p {
      width: 80px; /* 显示省略号的兼容 */
      line-height: 35px;
      font-size: 14px;
      text-align: center;
      color: #999;
    }
  }
}

.choose-item .item-mask {
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(144, 144, 144, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0;

  i {
    font-size: 30px;
    color: #ffffff;
  }
}
</style>
