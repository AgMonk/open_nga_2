<!--    todo 解析 渲染-->


<script>
import NgaEmoteImage from "@/components/nga/post/nga-emote-image";
import NgaReplyLink from "@/components/nga/read/nga-reply-link";
import NgaUserLink from "@/components/nga/user/nga-user-link";
import NgaContentLink from "@/components/nga/read/nga-content-link";
import {searchEmotes} from "@/assets/nga/emotions";

export default {
  name: "nga-content-render",
  components: {NgaEmoteImage, NgaReplyLink, NgaUserLink, NgaContentLink},
  render() {
    return this.render(this.data)
    // return this.render(this.myData, 2)
  },
  data() {
    return {
      renderMethod: {
        ul: ({children}) => <ul>{this.render(children)}</ul>,
        h: ({children}) => <h3 style="margin: 8px auto;">{this.render(children)}</h3>,
        b: ({children}) => <b>{this.render(children)}</b>,
        u: ({children}) => <u>{this.render(children)}</u>,
        i: ({children}) => <i>{this.render(children)}</i>,
        li: ({children}) => <li>{this.render(children)}</li>,
        del: ({children}) => <del>{this.render(children)}</del>,
        color: ({children, props}) => <span style={'color: ' + props}>{this.render(children)}</span>,
        size: ({children, props}) => <span style={"font-size:" + props}>{this.render(children)}</span>,
        align: ({children, props}) => <span style={"text-align:" + props}>{this.render(children)}</span>,
        uid: ({children, props}) => <nga-user-link uid={props || children[0].raw}>{this.render(children)}</nga-user-link>,
        tid: ({children, props}) => <nga-thread-link data={{tid: props}}>{this.render(children)}</nga-thread-link>,
        table: ({children}) => <table style="border: 1px solid black;border-collapse: collapse;">{this.render(children.filter(item => item.type === 'tr'))}</table>,
        tr: ({children}) => <tr style="border: 1px solid black;">{this.render(children.filter(item => item.type === 'td'))}</tr>,
        td: ({children}) => <td style="border: 1px solid black;">{this.render(children)}</td>,
        collapse: ({children, props}) => {
          const title = props ? `折叠：${props}` : "[折叠内容]";
          return <el-collapse>
            <el-collapse-item title={title}>
              {this.render(children)}
            </el-collapse-item>
          </el-collapse>
        },
        quote: ({children, props}) => {
          return <el-card className="box-card" body-style="padding:10px;border: 1px solid #81a3f3;background-color: #0cb2fb1f;">
            {this.render(children)}
          </el-card>
        },
        span: ({children}) => {
          let regExp = /\[s:(.*?):(.+?)]/g
          let r;
          let startIndex = 0;
          if (children.match(regExp)) {
            // 有官方表情
            let array = [];
            while (r = regExp.exec(children)) {
              array.push(<span style="white-space: pre-line">{children.substring(startIndex, r.index)}</span>)
              //插入图片
              const emote = searchEmotes(r[0])[0];
              array.push(<nga-emote-image data={emote}/>)
              //  更新起始位置
              startIndex = r.index + r[0].length;
            }
            array.push(<span style="white-space: pre-line">{children.substring(startIndex)}</span>)
            return array;
          }
          return <span style="white-space: pre-line">{children}</span>
        },
        pid: ({children, props}) => {
          const [pid, tid, page] = props.split(',')
          return <nga-reply-link pid={pid} tid={tid} page={page}>{this.render(children)}</nga-reply-link>
        },
        raw: ({raw}) => {
          return <span>{raw}</span>
        },
        url: ({children, props}) => {
          console.log("url")
          console.log(children)
          console.log(props)
          if (!props) {
            return <nga-content-link createText src={children[0].children}/>
          }
          return <nga-content-link src={props}>{this.render(children)}</nga-content-link>
        }
      }
    }
  },
  methods: {
    render(tags) {
      if (!tags) {
        return [];
      }
      return tags.map(tag => {
        if (this.renderMethod.hasOwnProperty(tag.type)) {
          return this.renderMethod[tag.type](tag)
        } else {
          return this.renderMethod.raw(tag)
        }
      })
    }
  },
  mounted() {
  },
  watch: {},
  props: {
    data: {type: Object, required: true}
  },
}

</script>

<style scoped>

</style>