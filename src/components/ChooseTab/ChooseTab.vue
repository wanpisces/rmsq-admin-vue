<template>
    <div>
        <el-button type="primary" icon="el-icon-circle-plus-outline"   @click="releaseClick()" v-if="addTitle">{{addTitle}}</el-button>
        <el-dropdown>
            <el-button >
                选项<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item ><div @click="handleShow"><i class="el-icon-tickets icon-font"></i> 显示列表定制</div></el-dropdown-item> -->
                <el-dropdown-item><div @click="TimeOn(1)"><i class="el-icon-upload2 icon-font" ></i> 时间升序</div></el-dropdown-item>
                <el-dropdown-item><div @click="TimeOn(2)"><i class="el-icon-download icon-font"></i> 时间降序</div></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>    
</template>

<script>
export default {
    props:{
        addTitle:{
        type:String,
        default:'',
      },
    },
    methods: {
    //    handleShow () {
    //        this.$emit( 'handleShowDliog' )
    //    },
       TimeOn(value) {
           this.$emit( 'TimeOn',value)
       },
       releaseClick() {
           this.$emit( 'handleAdd' )
       }
    }
  
}
</script>
<style scoped rel="stylesheet/scss" lang="scss">

</style>


