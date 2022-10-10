<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { FormItem, Category, SelectType } from "@/interface/bpmn";
import type { FormInstance, FormRules } from "element-plus";
import mixinPanel from "./mixins/panel";
import mixinExecutionListener from "./mixins/executionListener";
import { commonParse } from "./libs/parseElement";

const props = defineProps([
  "users",
  "groups",
  "categorys",
  "modeler",
  "element",
]);
const items: Array<FormItem> = [
  {
    type: "select",
    name: "processCategory",
    label: "流程分类",
    dic: { data: props.categorys, label: "name", value: "id" },
  },
  {
    type: "input",
    name: "id",
    label: "流程标识key",
    rules: [{ required: true, message: "Id 不能为空" }],
  },
  {
    type: "input",
    name: "name",
    label: "流程名称",
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
    type: "slot",
    name: "signal",
    label: "信号定义",
  },
];
const formData = ref<any>({});
const formRef = ref<FormInstance>();
const formRules = reactive<FormRules>({});

items.forEach((item: FormItem) => {
  formData.value[item.name] = "";
  if (item.rules) {
    formRules[item.name] = item.rules;
  }
});

formData.value = commonParse(props.element);

const { updateProperties } = mixinPanel(props, formData);
const { executionListenerDialog, dialogName, finishExecutionListener } =
  mixinExecutionListener(props.element);

watch(
  () => formData.value.processCategory,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:processCategory": val });
  }
);
</script>

<template>
  <div id="bpmp-process">
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
          <el-select
            v-if="item.type === 'select'"
            v-model="formData[item.name]"
          >
            <el-option
              v-for="dicItem in item.dic?.data"
              :key="dicItem[item.dic?.value as keyof typeof dicItem] "
              :label="dicItem[item.dic?.label as keyof typeof dicItem]"
              :value="dicItem[item.dic?.value as keyof typeof dicItem ]"
            />
          </el-select>
          <el-badge v-if="item.name === 'executionListener'">
            <el-button
              size="small"
              @click="dialogName = 'executionListenerDialog'"
              >编辑</el-button
            >
          </el-badge>
          <el-badge v-if="item.name === 'signal'">
            <el-button size="small">编辑</el-button>
          </el-badge>
        </el-form-item>
      </el-form>
    </div>
    <executionListenerDialog
      :visible="dialogName === 'executionListenerDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishExecutionListener"
    />
  </div>
</template>

<style scoped lang="scss"></style>
