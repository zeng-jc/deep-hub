<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// arco-design
import { Message } from "@arco-design/web-vue";

// 子组件
import verifyNickname from "./components/verify-nickname.vue";
import verifyEmail from "./components/verify-email.vue";
import verifyUsername from "./components/verify-username.vue";
import verifyPassword from "./components/verify-password.vue";
// 网络请求
import { fetchSignupUser } from "@/service";

const router = useRouter();
const current = ref(1);
const verifyNicknameRef = ref();
const verifyEmailRef = ref();
const verifyUsernameRef = ref();
const verifyPasswordRef = ref();
const loading = ref(false);
const onPrev = () => {
  current.value = Math.max(1, current.value - 1);
};
const onNext = async () => {
  switch (current.value) {
    case 1:
      verifyUsernameRef.value.verifyUsernameInput(verifyUsernameRef.value.usernameVal);
      if (!verifyUsernameRef.value.isVerify) return;
      break;
    case 2:
      verifyNicknameRef.value.verfiyNicknameInput(verifyNicknameRef.value.nicknameVal);
      if (!verifyNicknameRef.value.isVerify) return;
      break;
    case 3:
      verifyEmailRef.value.verifyEmailInput(
        verifyEmailRef.value.emailVal,
        verifyEmailRef.value.codeVal,
        verifyEmailRef.value.uuIdVal
      );
      if (!verifyEmailRef.value.isVerify) return;
      break;
    case 4:
      verifyPasswordRef.value.verifyPasswordInput(verifyPasswordRef.value.pwdVal);
      if (!verifyPasswordRef.value.isVerify) return;
      break;
  }
  current.value = Math.min(5, current.value + 1);
  if (current.value === 5) {
    console.log(verifyEmailRef.value);
    try {
      const res = await fetchSignupUser({
        username: verifyUsernameRef.value.usernameVal,
        password: verifyPasswordRef.value.pwdVal,
        nickname: verifyNicknameRef.value.nicknameVal,
        email: verifyEmailRef.value.emailVal,
        uuid: verifyEmailRef.value.uuIdVal,
        verificationCode: verifyEmailRef.value.codeVal
      });
      if (res.code !== 200) return Message.error(res.msg);
      Message.success("注册成功");
      router.push("/signin");
      loading.value = false;
    } catch (error) {
      Message.error("服务器异常");
      loading.value = false;
    }
  }
};

const toSignin = () => {
  router.push("/signin");
};
</script>

<template>
  <div class="signupView">
    <div class="frame-body">
      <a-steps :current="current">
        <a-step description="验证用户名">用户名</a-step>
        <a-step description="验证昵称">用户昵称</a-step>
        <a-step description="验证邮箱">电子邮箱</a-step>
        <a-step description="验证密码">用户密码</a-step>
      </a-steps>
      <div class="frame-main">
        <div class="frame-content">
          <verifyUsername ref="verifyUsernameRef" v-show="current === 1" />
          <verifyNickname ref="verifyNicknameRef" v-show="current === 2" />
          <verifyEmail ref="verifyEmailRef" v-show="current === 3" />
          <verifyPassword ref="verifyPasswordRef" v-show="current === 4" />
        </div>
        <a-space size="large">
          <a-button type="secondary" :disabled="current <= 1" @click="onPrev"> <IconLeft /> Back </a-button>
          <a-button type="primary" :disabled="current >= 5" @click="onNext" v-if="current === 4" :loading="loading">
            完成注册
          </a-button>
          <a-button html-type="submit" type="primary" :disabled="current >= 4" @click="onNext" v-else>
            Next <IconRight />
          </a-button>
        </a-space>
        <div class="login-text">
          已有账号？
          <span class="toSignin" @click="toSignin">立即登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.signupView {
  background: var(--color-bg-2);
  margin-top: 18vh;
  .frame-body {
    width: 50vw;
    margin: 0 auto;
    .frame-main {
      text-align: center;
      color: #c2c7cc;
      .frame-content {
        width: 45%;
        margin: 40px auto;
      }
      .login-text {
        margin-top: 25px;
        color: var(--color-text-1);
        .toSignin {
          color: rgb(var(--primary-6));
          cursor: pointer;
        }
      }
    }
  }
}
</style>
