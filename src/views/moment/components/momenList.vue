<script setup>
import { ref, onMounted, defineEmits } from "vue";
import { IconHeart, IconMessage, IconHeartFill } from "@arco-design/web-vue/es/icon";
import { useUserStore } from "@/stores";
import { fetchFollowUser } from "@/service";
import { Message } from "@arco-design/web-vue";
const userStore = useUserStore();
const likes = ref({});
const onLikeChange = id => {
  if (!likes.value[id]) return (likes.value[id] = true);
  likes.value[id] = !likes.value[id];
};
defineProps({
  moments: {
    type: Object,
    default: () => ({})
  },
  isShowLoading: {
    type: Boolean,
    default: true
  }
});

const emits = defineEmits(["loadMoment"]);
function loadMomentFn(obj) {
  emits("loadMoment", obj);
}
const loadingRef = ref();
onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        loadMomentFn({ pagesize: 15, observer });
      }
    },
    { threshold: 1 }
  );
  observer.observe(loadingRef.value);
});
// 关注用户
const toFollow = async id => {
  if (id !== userStore.userInfo.id) {
    await fetchFollowUser(id);
    Message.success("关注用户成功");
    document.querySelectorAll(".follwed-button").forEach(element => {
      element.style.display = "none";
    });
  }
};
</script>

<template>
  <div class="content">
    <a-comment v-for="item in moments" :key="item.id" class="content-item" align="right">
      <template #actions>
        <a-tag v-for="(tag, i) in item.labels" :key="i">{{ tag }}</a-tag>
        <span class="action" key="heart" @click="onLikeChange(item.id)">
          <span v-if="likes[item.id]">
            <IconHeartFill :style="{ color: '#f53f3f' }" />
          </span>
          <span v-else>
            <IconHeart />
          </span>
          {{ item.likes }}
        </span>
        <span class="action" key="reply"> <IconMessage /> {{ item.commentCount }} </span>
      </template>
      <template #avatar> </template>
      <template #content>
        <div class="moment-content">
          <a-button
            v-if="item.userId !== userStore.userInfo.id"
            class="follwed-button"
            shape="round"
            @click="toFollow(item.userId)"
            >关注
          </a-button>
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
            <router-link :to="`/detail/${item.id}`" target="_blank">
              {{ item.content }}
            </router-link>
          </div>
          <div v-if="item.images && item.images.length > 0">
            <router-link :to="`/detail/${item.id}`" target="_blank">
              <img class="content-img" v-for="(image, index) in item.images" :key="index" :src="image" alt="" />
            </router-link>
          </div>
          <span style="font-size: 12px; color: #777777">{{ item.createTime }}</span>
        </div>
      </template>
      <a-divider />
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
  position: relative;
  .follwed-button {
    position: absolute;
    margin-left: 600px;
  }
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
</style>
