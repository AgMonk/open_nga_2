<!--    解析 渲染-->


<script>
import NgaEmoteImage from "@/components/nga/post/nga-emote-image";
import NgaReplyLink from "@/components/nga/read/nga-reply-link";
import NgaUserLink from "@/components/nga/user/nga-user-link";
import NgaContentLink from "@/components/nga/content/nga-content-link";
import {searchEmotes} from "@/assets/nga/emotions";
import NgaContentImg from "@/components/nga/content/nga-content-img";
import NgaCodeTextarea from "@/components/nga/read/nga-code-textarea";
import NgaThreadLink from "@/components/nga/thread/nga-thread-link";
import NgaContentCarousel from "@/components/nga/content/nga-content-carousel";
import NgaContentTd from "@/components/nga/content/nga-content-td";
import "@/assets/nga/nga-dice";
import NgaDiceTag from "@/components/nga/read/nga-dice-tag";
import NgaContentFlash from "@/components/nga/content/nga-content-flash";
import {parseUrl} from "@/assets/utils/StringUtils";

export default {
  name: "nga-content-render",
  components: {
    NgaEmoteImage,
    NgaReplyLink,
    NgaUserLink,
    NgaContentLink,
    NgaContentImg,
    NgaCodeTextarea,
    NgaThreadLink,
    NgaContentCarousel,
    NgaContentTd,
    NgaDiceTag,
    NgaContentFlash,
  },
  render() {
    // console.log(this.data)
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
        flash: ({children}) => <nga-content-flash url={children[0].raw} />,
        attach: ({children}) => {
          const {url, query} = parseUrl(children[0].raw)
          const type = url.substring(url.lastIndexOf('.') + 1);
          if (['mp3', 'mp4'].includes(type)) {
            return <nga-content-flash url={children[0].raw} />
          }
          if ('zip' === type) {
            return <el-link download={query.filename} href={'/attachments' + url.substring(1)} type="danger">[下载附件]</el-link>
          }
        },
        color: ({children, props}) => <span style={'color: ' + props}>{this.render(children)}</span>,
        size: ({children, props}) => <span style={"font-size:" + props}>{this.render(children)}</span>,
        align: ({children, props}) => <span style={"text-align:" + props}>{this.render(children)}</span>,
        uid: ({children, props}) => <nga-user-link uid={props || children[0].raw} text={children[0].raw} />,
        tid: ({children, props}) => <nga-thread-link data={{tid: props}}>{this.render(children)}</nga-thread-link>,
        table: ({children}) => <table style="border: 1px solid black;border-collapse: collapse;width:100%">{this.render(children.filter(item => item.type === 'tr'))}</table>,
        randomblocks: ({children}) => <el-carousel trigger="click">{this.render(children.filter(item => item.type === 'randomblock'))}</el-carousel>,
        randomblock: ({children}) => <el-carousel-item>{this.render(children)}</el-carousel-item>,
        // randomblock:({children})=><el-carousel-item>{this.render(children)}</el-carousel-item>,
        tr: ({children}) => <tr style="border: 1px solid black;">{this.render(children.filter(item => item.type === 'td'))}</tr>,
        td: ({children, props}) => <nga-content-td props={props}>{this.render(children)}</nga-content-td>,
        collapse: ({children, props}) => {
          const title = props ? `折叠：${props}` : "[折叠内容]";
          return <el-collapse>
            <el-collapse-item title={title}>
              {this.render(children)}
            </el-collapse-item>
          </el-collapse>
        },
        quote: ({children}) => {
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
              array.push(<nga-emote-image data={emote} />)
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
          // console.log(`pid渲染 ${pid} ${tid} ${page}`)
          if (pid) {
            return <nga-reply-link pid={pid} tid={tid} page={page}>{this.render(children)}</nga-reply-link>
          }
          return <nga-reply-link pid={children[0].raw}>[这个回复]</nga-reply-link>
        },
        raw: ({raw}) => {
          return <span>{raw}</span>
        },
        dice: ({children}) => {
          return <nga-dice-tag seed={this.seed} data={children[0].raw} />
        },
        url: ({children, props}) => {
          // console.log("url")
          // console.log(children)
          // console.log(props)
          if (!props) {
            return <nga-content-link createText src={children[0].children} />
          }
          return <nga-content-link src={props}>{this.render(children)}</nga-content-link>
        },
        img: ({children}) => {
          return <nga-content-img src={children[0].raw} />
        },
        code: ({children, props}) => {
          return <nga-code-textarea code={children} lang={props} />
        },
        r: ({children}) => <span style="display: block;float: right;">{this.render(children)}</span>,
        l: ({children}) => <span style="display: block;float: left;">{this.render(children)}</span>,
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
    data: {type: Object, required: true},
    seed: {type: Object,},
  },
}

</script>

<style scoped>

</style>