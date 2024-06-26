import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";
import { fetchUser, fetchUpdateUser, fetchFollowList } from "@/service";
export interface UserState {
  token: string;
  verifyLogin: boolean;
  userInfo: {};
  defaultAvatar: string;
  otherUserInfo: {};
  followList: [];
}
export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: "",
    verifyLogin: false,
    userInfo: {},
    defaultAvatar:
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp",
    otherUserInfo: "",
    followList: []
  }),
  getters: {},
  actions: {
    //

    setToken(token: string) {
      this.token = token;
    },
    // 设置用户信息
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    },
    // 获取用户信息
    async getUserInfo(id: string) {
      const res = await fetchUser(id);
      if (res.code !== 200) return res.success;
      this.otherUserInfo = res.data;
    },
    // 更新用户信息
    async updateUser(id: string, formData: any) {
      const res = await fetchUpdateUser(id, formData);
      if (res.code !== 200) return res.success;
    },
    //关注列表
    async getFollowList(id: string, params: { pagenum: number; pagesize: number }) {
      const res = await fetchFollowList(id, params);
      if (res.code !== 200) return res.success;
      this.followList = res.data.list;
    }
  },
  persist: piniaPersistConfig("user")
});
