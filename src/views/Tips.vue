<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      TIPS
    </el-header>

    <el-main>
      <el-collapse accordion>
        <el-collapse-item style="text-align: left" title="功能说明">

        </el-collapse-item>
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
            <div>R ：回复当前主题</div>
            <div>Q ：回到该主题所在的版面/合集</div>
          </div>
        </el-collapse-item>
        <el-collapse-item style="text-align: left" title="快捷输入">
          在回复框中有效， 触发快捷键：<b>Alt+Enter</b>

          使用方法：输入一个空格，输入关键字，按触发快捷键；程序会按 论坛代码 > 表情 的优先级尝试匹配
          <div>
            <h4>快捷输入论坛代码</h4>
            <ul>
              <li>关键字格式： 标签名 或 标签名：属性</li>
              <li>标签名、属性、中间的冒号均可以中英文混用，对应关系见后文。</li>
              <li>只输入标签名时，关键字部分会被替换为：[标签英文名][/标签英文名]</li>
              <li>输入标签名+属性时，关键字部分会被替换为：[标签英文名=属性英文名][/标签英文名]</li>
            </ul>
            <h4>代码、属性的中英文对照</h4>
            <el-table :data="bbsCodeLibrary">
              <el-table-column label="中文" prop="cn" />
              <el-table-column label="英文" prop="en" />
              <el-table-column label="简称" prop="short" />
              <el-table-column label="属性">
                <template #default="s">
                  <el-collapse v-if="s.row.props">
                    <el-collapse-item title="点击展开">
                      <el-table :data="s.row.props">
                        <el-table-column label="中文" prop="cn" />
                        <el-table-column label="英文" prop="en" />
                      </el-table>
                    </el-collapse-item>
                  </el-collapse>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div>
            <h4>快捷输入表情</h4>
            <ul>
              <li>当关键字不符合论坛代码格式时会尝试搜索是否符合表情</li>
              <li>匹配规则：关键字是否出现在表情全名中；点击“表情”按钮，鼠标指向对应的表情的表情的鼠标提示中即为它的全名</li>
              <li>当只匹配到一个表情时，会直接进行替换；匹配到多个时会显示搜索结果，点击选择</li>
              <li>例：输入“ac：哭”，会搜索到3个ac娘表情</li>
            </ul>
          </div>

        </el-collapse-item>
      </el-collapse>


    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {bbsCodeLibrary} from "@/assets/nga/bbscode";

export default {
  name: "Tips",
  data() {
    return {
      bbsCodeLibrary,
    }
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {},
}

</script>

<style scoped>
.el-collapse {
  --el-collapse-header-bg-color: rgba(178, 229, 123, 0.55);
  --el-collapse-content-bg-color: rgb(0 0 0 / 0%);
}

.el-descriptions__cell {
  background-color: rgb(0 0 0 / 0%);
}

.el-descriptions__body {
  background-color: rgb(0 0 0 / 0%);
}
</style>