<script setup>
import { ref } from "vue";
const nicknameVal = ref("");
const isVerify = ref(false);
const tipRef = ref("");
import { debounce } from "lodash";

function verfiyNicknameInput() {
  if (!/^[a-zA-Z0-9\u0391-\uFFE5]{1,10}$/.test(nicknameVal.value)) {
    tipRef.value.textContent = "昵称长度1~10，不能包含空格";
    tipRef.value.style.color = " rgb(var(--danger-6))";
    return (isVerify.value = false);
  }
  tipRef.value.style.color = "rgb(var(--success-6))";
  tipRef.value.textContent = "用户昵称符合要求";
  isVerify.value = true;
}
// 对昵称验证进行防抖处理
const verfiyNicknameInput_debounce = debounce(verfiyNicknameInput, 500);

defineExpose({
  verfiyNicknameInput,
  nicknameVal,
  isVerify
});
</script>

<template>
  <div class="Nickname">
    <a-input
      @input="verfiyNicknameInput_debounce"
      v-model="nicknameVal"
      placeholder="请输入昵称"
      :style="{ width: '320px' }"
      allow-clear
      autocomplete
    >
      <template #prefix>
        <icon-info-circle />
      </template>
    </a-input>
    <div class="tip" ref="tipRef">昵称长度1~10，不能包含空格</div>
  </div>
</template>

<style scoped>
.tip {
  font-size: 10px;
  text-align: center;
  margin-top: 3px;
}
</style>
