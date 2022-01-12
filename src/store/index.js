import {createStore} from 'vuex'
import read from "@/store/read";
import users from "@/store/users";
import breadcrumb from "@/store/breadcrumb";
import thread from "@/store/thread";
import history from "@/store/history";
import forums from "@/store/forums";
import notice from "@/store/notice";
import config from "@/store/config";
import messages from "@/store/messages";
import search from "@/store/search";
import client from "@/store/client";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    read, users, breadcrumb, thread, history, forums, notice, config, messages, search, client
  }
})
