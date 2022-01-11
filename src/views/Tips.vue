<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      TIPS
    </el-header>

    <el-main>
      <el-collapse accordion>
        <el-collapse-item style="text-align: left" title="功能说明">
          <b style="color:red">注：本UI大量使用了数据缓存功能提升体验；多个标签页无法共享缓存，有可能造成数据混乱；故仅推荐使用一个标签进行浏览</b>

          <h2>导航栏：社区</h2>
          <ol>
            <li>收藏的版面：点击进入版面</li>
            <li>
              <h4>版面主题</h4>
              <ol>
                <li>路径导航（面包屑）：位于顶部，每一级路径的下拉列表会显示本级的浏览历史；其中版面历史中还包含了收藏版面，以背景颜色区分</li>
              </ol>
            </li>
          </ol>
          <h2>导航栏：我的</h2>
          <ol>
            <li>短消息：私信和系统消息</li>
            <li>配置：当前用户个人中心，账号管理，界面配置</li>
            <li>收藏：当前账号收藏的主题</li>
            <li>关于：本UI的功能说明，使用技巧等</li>
          </ol>
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

        <el-collapse-item style="text-align: left" title="本地部署操作步骤(推荐使用)">
          <h3>好处</h3>
          <ol>
            <li>不依赖本服务器</li>
            <li>自己的带宽直连一般而言速度更快</li>
            <li>降低本服务器的压力(滑稽)</li>
          </ol>

          <h3>Nginx配置</h3>
          <ol>
            <li>将下文的 http:{} 的花括号中间的内容，添加到 nginx 的配置文件（nginx.conf）的相同位置里</li>
            <li>其中2-4行如果之前已有名称相同的配置项，保留数字较大的</li>
            <li>如果你使用Pixiv-Nginx，配置文件在conf文件夹中，如果使用官方nginx请参考官方说明</li>
            <li>启动nginx.exe，如果之前已经启动，需要使用 cmd 命令行 到 nginx文件夹下 执行该命令重启 让配置生效 <b style="color:red">.\nginx.exe -s reload</b></li>
            <li>也可以使用Powershell执行该命令，打开方法：在nginx文件夹下的空白处，按住Shift+右键，在菜单中选择"在此处打开Powershell窗口"</li>
            <li>在nginx文件夹下创建一个文件夹 nga , 下载本UI的压缩包解压进去 , 保证 index.html 的路径为：/nginx文件夹/nga/index.html</li>
            <li>打开浏览器，访问 http://localhost:11451 ，看到界面则表示配置成功</li>
          </ol>
          <el-collapse>
            <el-collapse-item title="nginx配置">
              <nga-code-textarea :code="code.http" lang="nginx" />
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>


    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {bbsCodeLibrary} from "@/assets/nga/bbscode";
import NgaCodeTextarea from "@/components/nga/read/nga-code-textarea";

export default {
  name: "Tips",
  components: {NgaCodeTextarea},
  data() {
    return {
      bbsCodeLibrary,
      code: {
        http: `http:{
    client_header_buffer_size 10240k;
    large_client_header_buffers 6 10240k;
    client_max_body_size 50m;


    server {
          listen       11451;
          server_name  localhost;

          location / {
              root   nga;
              index  index.html index.htm;
              try_files $uri $uri/ /index.html;
          }

          location ^~ /nga-api/ {
              proxy_pass https://bbs.nga.cn/;
          }
          location ^~ /attachments/ {
              proxy_pass https://img.nga.178.com/attachments/;
              proxy_set_header Referer https://img.nga.178.com;
              #proxy_set_header Host $proxy_host;
              #proxy_set_header :authority img.nga.178.com;
              #proxy_set_header X-Real-IP $remote_addr;
              #proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              #proxy_set_header REMOTE-HOST $remote_addr;
              }
          location ^~ /emote/ {
              proxy_pass https://img4.nga.178.com/ngabbs/post/smile/;
              proxy_set_header Referer https://img4.nga.178.com;
              #proxy_set_header Host $proxy_host;
              #proxy_set_header X-Real-IP $remote_addr;
              #proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              #proxy_set_header REMOTE-HOST $remote_addr;
              }
          location ^~ /178/avatars/ {
              proxy_pass http://pic1.178.com/avatars/;
              proxy_set_header Host $proxy_host;
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              proxy_set_header Referer https://img.nga.178.com;
              proxy_set_header REMOTE-HOST $remote_addr;
              }
          location ^~ /avatars/ {
              proxy_pass https://img.nga.178.com/avatars/;
              proxy_set_header Host $proxy_host;
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              proxy_set_header Referer https://img.nga.178.com;
              proxy_set_header REMOTE-HOST $remote_addr;
              }
          location ^~ /icon/f/ {
              proxy_pass https://img4.nga.178.com/proxy/cache_attach/ficon/;
              proxy_set_header Host $proxy_host;
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              proxy_set_header Referer https://img.nga.178.com;
              proxy_set_header REMOTE-HOST $remote_addr;
              }
          location ^~ /items/ {
              proxy_pass https://img4.nga.178.com/ngabbs/nga_classic/items/;
              proxy_set_header Host $proxy_host;
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              proxy_set_header Referer https://img.nga.178.com;
              proxy_set_header REMOTE-HOST $remote_addr;
              }
          location ^~ /upload {
              proxy_pass https://img8.nga.cn/attach.php;
          }

          error_page   500 502 503 504  /50x.html;
          location = /50x.html {
              root   html;
          }
      }
}
`,
      }
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