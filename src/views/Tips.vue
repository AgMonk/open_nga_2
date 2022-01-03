<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      TIPS
    </el-header>

    <el-main>
      <el-collapse accordion>
        <el-collapse-item style="text-align: left" title="快捷键">
          <div>
            <h4>全局</h4>
            <div>w 、 s ：页面上下滚动</div>
            <div>W 、 S ：页面滚动到顶部、底部</div>
            <div>q 、 e ：前进、后退(输入框中无效)</div>
          </div>
          <div>
            <h4>主题列表</h4>
            <div>r ：刷新当前页</div>
          </div>
          <div>
            <h4>主题内</h4>
            <div>a 、 d ：翻页</div>
            <div>A 、 D ：第一页、最后一页</div>
            <div>r ：刷新当前页</div>
            <div>R ：回复主题</div>
            <div>Q ：回到该主题所在的版面/合集</div>
          </div>
        </el-collapse-item>
        <el-collapse-item style="text-align: left" title="快捷输入">

        </el-collapse-item>
      </el-collapse>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
export default {
  name: "Tips",
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>