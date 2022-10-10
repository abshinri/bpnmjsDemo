<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { FormItem, Category } from "@/interface/bpmn";
import type { FormInstance, FormRules } from "element-plus";
import mixinPanel from "./mixins/panel";
import { commonParse, conditionExpressionParse } from "./libs/parseElement";
const props = defineProps([
  "users",
  "groups",
  "categorys",
  "modeler",
  "element",
]);

const formData = ref<any>({});
const { showConfig, updateProperties } = mixinPanel(props, formData);
const items: Array<FormItem> = [
  {
    type: "input",
    name: "id",
    label: "节点 id",
    rules: [{ required: true, message: "Id 不能为空" }],
  },
  {
    type: "input",
    name: "name",
    label: "节点名称",
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
  {
    type: "input",
    name: "conditionExpression",
    label: "跳转条件",
  },
  {
    type: "input",
    name: "skipExpression",
    label: "跳过表达式",
  },
];

const formRef = ref<FormInstance>();
const formRules = reactive<FormRules>({});

items.forEach((item: FormItem) => {
  formData.value[item.name] = "";
  if (item.rules) {
    formRules[item.name] = item.rules;
  }
});

formData.value = conditionExpressionParse(commonParse(props.element));

watch(
  () => formData.value.conditionExpression,
  (val: any) => {
    if (val) {
      const newCondition = props.modeler
        .get("moddle")
        .create("bpmn:FormalExpression", { body: val });

      console.log("newCondition");
      console.log(newCondition);
      updateProperties({ conditionExpression: newCondition });
    } else {
      updateProperties({ conditionExpression: null });
    }
  }
);

watch(
  () => formData.value.skipExpression,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:skipExpression": val });
  }
);
</script>

<template>
  <div id="bpmp-startEnd">
    <div class="form-container">
      <el-form
        :model="formData"
        ref="formRef"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item
          v-for="item in items"
          :label="item.label"
          :prop="item.name"
        >
          <el-input
            v-if="item.type === 'input'"
            v-model="formData[item.name]"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
