<template>
  <el-container>
    <!-- 左侧 -->
    <el-aside width="240px">
      <el-menu
        :default-active="activeIndex"
        background-color="#303030"
        text-color="#fff"
        active-text-color="#ffd103"
        unique-opened
        router
      >
        <div v-for="obj in treelist" :key="obj.index">
          <el-menu-item :index="obj.index">
            <i :class="obj.i"></i>
            <span slot="title">{{ obj.text }}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </el-aside>

    <!-- 右侧 -->
    <el-container>
      <!-- 右-头 -->
      <el-header>Release rule test</el-header>
      <!-- 右-身 -->
      <el-main>
        <el-card>
          <router-view></router-view>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      activeIndex:"/index/Home",
      treelist: [
        { index: "/index/Home", i: "el-icon-star-off", text: "Home" },
        {
          index: "/index/SeedRoundContract",
          i: "el-icon-magic-stick",
          text: "Seed Round Contract",
        },
        {
          index: "/index/PrivatePlacementContract",
          i: "el-icon-document-copy",
          text: "Private Placement Contract",
        },
        {
          index: "/index/TeamContract",
          i: "el-icon-ship",
          text: "Team Contract",
        },
        {
          index: "/index/StartRelease",
          i: "el-icon-switch-button",
          text: "Start Release",
        },
      ],
    };
  },
  mounted(){
    // 动态选中当前菜单
    this.activeIndex = this.$route.path;
  }
};
</script>

<style lang="less" scoped>
.el-menu {
  border: 0;
}

.el-container {
  width: 100%;
  height: 100%;

  .el-aside {
    background-color: #303030;
  }

  .el-header {
    background-color: #ffd103;
    font-size: 32px;
    text-align: center;
    line-height: 3.75rem;
  }
}
</style>
