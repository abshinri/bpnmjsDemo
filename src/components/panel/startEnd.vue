<script setup lang="ts">
import { reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
interface FormItem {
  type: string;
  name: string;
  label?: string;
  rules?: any;
}

const items: Array<FormItem> = [
  {
    type: "input",
    name: "id",
    label: "节点 id",
    rules: [{ required: true, message: "Id 不能为空" }],
  },
  {
    type: "input",
    name: "documentation",
    label: "节点描述",
  },
  {
    type: "slot",
    name: "executionListener",
    label: "执行监听器",
  },
];

const formData = reactive<any>({});
items.forEach((item: FormItem) => {
  formData[item.name] = "";
});
</script>

<template>
  <div id="bpmp-startEnd">
    <div class="form-container">
      <el-form :model="formData" label-width="120px">
        <el-form-item v-for="item in items" :label="item.label">
          <el-input
            v-if="item.type === 'input'"
            v-model="formData.id"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
