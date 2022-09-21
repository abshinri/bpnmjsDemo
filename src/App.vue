<script setup lang="ts">
import { ref } from "vue";
import bpmn from "./components/bpmn.vue";

import { xmlStr } from "@/mock/xmlStr";
const xml = ref(xmlStr);
const users = ref([
  { name: "张三", id: "zhangsan" },
  { name: "李四", id: "lisi" },
  { name: "王五", id: "wangwu" },
]);
const groups = ref([
  { name: "web组", id: "web" },
  { name: "java组", id: "java" },
  { name: "python组", id: "python" },
]);
const categorys = ref([
  { name: "OA", id: "oa" },
  { name: "财务", id: "finance" },
]);
const saveModeler = (data: any) => {
  console.log(data);
};
</script>

<template>
  <div id="bpmp">
    <bpmn
      ref="refNode"
      :xml="xml"
      :users="users"
      :groups="groups"
      :categorys="categorys"
      :is-view="false"
      @save="saveModeler"
    />
  </div>
</template>

<style scoped lang="scss">
#bpmp {
  width: 100vw;
  height: 100vh;
}
</style>
