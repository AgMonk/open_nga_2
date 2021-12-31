<!--    todo 解析 渲染-->


<script>
import {searchEmotes} from "@/assets/nga/emotions";
import MySpan from "@/components/my/my-span";
import NgaEmoteImage from "@/components/nga/post/nga-emote-image";
import NgaReplyLink from "@/components/nga/read/nga-reply-link";
import NgaUserLink from "@/components/nga/user/nga-user-link";

export default {
  name: "nga-content-render",
  components: {MySpan, NgaEmoteImage, NgaReplyLink, NgaUserLink},
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
        uid: ({children, props}) => <nga-user-link uid={props}>{this.render(children)}</nga-user-link>,
        quote: ({children, props}) => {
          return <el-card className="box-card" body-style="padding:10px;border: 1px solid #81a3f3;background-color: #0cb2fb1f;">
            {this.render(children)}
          </el-card>
        },
        span: ({children, props}) => {
          const emoteRegExp = /\[s:(.*?):(.+?)]/g
          if (children.match(emoteRegExp)) {
            let array = [];
            let r;
            let startIndex = 0;
            while (r = emoteRegExp.exec(children)) {
              array.push(<my-span>{children.substring(startIndex, r.index)}</my-span>)
              const emote = searchEmotes(r[0]);
              array.push(<nga-emote-image data={emote[0]}/>)
              startIndex = r.index + r[0].length;
            }
            array.push(<my-span>{children.substring(startIndex)}</my-span>)
            // console.log(array)
            return array
          }
          return <my-span>{children}</my-span>
        },
        pid: ({children, props}) => {
          const [pid, tid, page] = props.split(',')
          return <nga-reply-link pid={pid} tid={tid} page={page}>{this.render(children)}</nga-reply-link>
        },
        raw: ({raw}) => {
          return <my-span>{raw}</my-span>
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