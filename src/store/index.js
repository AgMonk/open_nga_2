import { createStore } from 'vuex'
import read from "@/store/read";
import users from "@/store/users";
import breadcrumb from "@/store/breadcrumb";
import thread from "@/store/thread";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {read,users,breadcrumb,thread
  }
})
