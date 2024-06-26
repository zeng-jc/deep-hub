<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUserStore, useQuestionStore } from "@/stores";
import { Notification } from "@arco-design/web-vue";

const route = useRoute();
const userStore = useUserStore();
const questionStore = useQuestionStore();
const likes = ref({});
const onLikeChange = id => {
  if (!likes.value[id]) return (likes.value[id] = true);
  likes.value[id] = !likes.value[id];
};
defineProps({
  answerList: {
    type: Object,
    default: () => ({})
  },
  isShowLoading: {
    type: Boolean,
    default: true
  }
});
const emits = defineEmits(["loadAnswer"]);
function loadAnswerFn(obj) {
  emits("loadAnswer", obj);
}

const loadingRef = ref();
onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        loadAnswerFn({ observer });
      }
    },
    { threshold: 1 }
  );
  observer.observe(loadingRef.value);
});
const visible = ref(false);
const curCommentId = ref("");
// 删除按钮
const deleteBtn = id => {
  console.log(id);
  curCommentId.value = id;
  visible.value = true;
};
// 确认删除
const deleteOk = async () => {
  visible.value = false;
  const msg = await questionStore.removeAnswer(curCommentId.value);
  if (msg) return Notification.error("删除失败");
  await questionStore.getAnswerList(route.params.id, { pagenum: 1, pagesize: 15 });
  Notification.success("删除成功");
};
</script>

<template>
  <a-modal v-model:visible="visible" @ok="deleteOk" type="warning" :simple="true">
    <div><icon-exclamation-circle-fill style="color: rgb(var(--warning-6))" /> 你确定要删除此评论吗?</div>
  </a-modal>
  <div class="content">
    <a-comment v-for="item in answerList" :key="item.id" class="content-item" align="right">
      <template #actions>
        <span class="action" key="heart" @click="onLikeChange(item.id)">
          <span v-if="likes[item.id]">
            <IconHeartFill :style="{ color: '#f53f3f' }" />
          </span>
          <span v-else>
            <IconHeart />
          </span>
          {{ item.likes }}
        </span>
        <a-popover>
          <div style="cursor: pointer">...</div>
          <template #content>
            <div
              class="delete"
              v-if="userStore.token && userStore.userInfo.username === item.user.username"
              @click="deleteBtn(item.id)"
            >
              删除
            </div>
            <div class="report" v-if="userStore.token">举报</div>
          </template>
        </a-popover>
      </template>
      <template #content>
        <div class="moment-content">
          <router-link :to="`/user/${item.user.nickname}/?id=${item.userId}&username=${item.user.username}`" target="_blank">
            <div class="author-info">
              <a-avatar :size="32">
                <img alt="avatar" :src="item.user.avatar ? item.user.avatar : userStore.defaultAvatar" />
              </a-avatar>
              <div class="author-right">
                <router-link
                  :to="`/user/${item.user.nickname}/?id=${item.userId}&username=${item.user.username}`"
                  target="_blank"
                >
                  {{ item.user.nickname }}
                </router-link>
              </div>
            </div>
          </router-link>
          <div>
            {{ item.content }}
          </div>
          <span style="font-size: 12px; color: #777777">{{ item.createTime }}</span>
        </div>
      </template>
    </a-comment>
    <div class="loading" ref="loadingRef" v-if="isShowLoading">
      <a-spin dot />
    </div>
    <h3 v-else style="color: var(--color-text-3); text-align: center">
      <icon-info-circle />
      已经加载到底部了
    </h3>
  </div>
</template>

<style lang="scss" scoped>
.content {
  width: 60%;
  padding: 20px;
  margin: 0 15px;
  background-color: var(--theme-bg1);
  .content-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    .content-img {
      width: 100px;
      height: 100px;
      margin-right: 10px;
    }
  }
}
.action {
  display: inline-block;
  padding: 0 4px;
  line-height: 24px;
  color: var(--color-text-1);
  cursor: pointer;
  background: transparent;
  border-radius: 2px;
  transition: all 0.1s ease;
}
.action:hover {
  background: var(--color-fill-3);
}
.moment-content {
  .author-info {
    display: flex;
    margin-bottom: 10px;
    &:hover a {
      color: rgb(var(--primary-6));
    }
    .author-right {
      margin-left: 10px;
    }
  }
}
.loading {
  text-align: center;
}
.action-comment {
  display: flex;
  justify-content: space-between;
  .delete {
    color: rgb(var(--danger-6));
  }
}
.report:hover,
.delete:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
