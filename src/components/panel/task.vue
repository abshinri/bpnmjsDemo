<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { FormItem, Category } from "@/types/bpmn";
import type { FormInstance, FormRules } from "element-plus";
import mixinPanel from "./mixins/panel";
import { commonParse } from "./libs/parseElement";
const props = defineProps([
  "users",
  "groups",
  "categorys",
  "modeler",
  "element",
]);

const userTypeOption = [
  { label: "指定人员", value: "assignee" },
  { label: "候选人员", value: "candidateUsers" },
  { label: "候选组", value: "candidateGroups" },
];

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
    type: "slot",
    name: "taskListener",
    label: "任务监听器",
    show: !!showConfig["taskListener" as keyof typeof showConfig],
  },
  {
    type: "select",
    name: "userType",
    label: "人员类型",
    dic: { data: userTypeOption, label: "label", value: "value" },
    show: !!showConfig["userType" as keyof typeof showConfig],
  },
  {
    type: "select",
    name: "assignee",
    label: "指定人员",
    allowCreate: true,
    filterable: true,
    dic: { data: props.users, label: "name", value: "id" },
    show:
      !!showConfig["assignee" as keyof typeof showConfig] &&
      formData.value.userType === "assignee",
  },
  {
    type: "select",
    name: "candidateUsers",
    label: "候选人员",
    multiple: true,
    allowCreate: true,
    filterable: true,
    dic: { data: props.users, label: "name", value: "id" },
    show:
      !!showConfig["candidateUsers" as keyof typeof showConfig] &&
      formData.value.userType === "candidateUsers",
  },
  {
    type: "select",
    name: "candidateGroups",
    label: "候选组",
    multiple: true,
    allowCreate: true,
    filterable: true,
    dic: { data: props.groups, label: "name", value: "id" },
    show:
      !!showConfig["candidateGroups" as keyof typeof showConfig] &&
      formData.value.userType === "candidateGroups",
  },
  {
    type: "slot",
    name: "multiInstance",
    label: "多实例",
  },
  {
    type: "switch",
    name: "async",
    label: "异步",
    activeText: "是",
    inactiveText: "否",
    show: !!showConfig["async" as keyof typeof showConfig],
  },
  {
    type: "input",
    name: "priority",
    label: "优先级",
    show: !!showConfig["priority" as keyof typeof showConfig],
  },
  {
    type: "input",
    name: "formKey",
    label: "表单标识key",
    show: !!showConfig["formKey" as keyof typeof showConfig],
  },
  {
    type: "input",
    name: "skipExpression",
    label: "跳过表达式",
    show: !!showConfig["skipExpression" as keyof typeof showConfig],
  },
  {
    type: "switch",
    name: "isForCompensation",
    label: "是否为补偿",
    activeText: "是",
    inactiveText: "否",
    show: !!showConfig["isForCompensation" as keyof typeof showConfig],
  },
  {
    type: "switch",
    name: "triggerable",
    label: "服务任务可触发",
    activeText: "是",
    inactiveText: "否",
    show: !!showConfig["triggerable" as keyof typeof showConfig],
  },
  {
    type: "switch",
    name: "autoStoreVariables",
    label: "自动存储变量",
    activeText: "是",
    inactiveText: "否",
    show: !!showConfig["autoStoreVariables" as keyof typeof showConfig],
  },
  {
    type: "input",
    name: "ruleVariablesInput",
    label: "输入变量",
    show: !!showConfig["ruleVariablesInput" as keyof typeof showConfig],
  },
  {
    type: "input",
    name: "rules",
    label: "规则",
    show: !!showConfig["rules" as keyof typeof showConfig],
  },
  {
    type: "input",
    name: "resultVariable",
    label: "结果变量",
    show: !!showConfig["resultVariable" as keyof typeof showConfig],
  },
  {
    type: "switch",
    name: "exclude",
    label: "排除",
    activeText: "是",
    inactiveText: "否",
    show: !!showConfig["exclude" as keyof typeof showConfig],
  },
  {
    type: "input",
    name: "class",
    label: "类",
    show: !!showConfig["class" as keyof typeof showConfig],
  },
  {
    type: "datePicker",
    dateType: "datetime",
    name: "dueDate",
    label: "到期时间",
    show: !!showConfig["dueDate" as keyof typeof showConfig],
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

formData.value = commonParse(props.element);

watch(
  () => formData.value.initiator,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:initiator": val });
  }
);
watch(
  () => formData.value.formKey,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:formKey": val });
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

          <el-input
            v-if="item.type === 'input'"
            v-model="formData[item.name]"
          />
          <el-badge v-if="item.name === 'executionListener'">
            <el-button size="small">编辑</el-button>
          </el-badge>
          <el-badge v-if="item.name === 'taskListener'">
            <el-button size="small">编辑</el-button>
          </el-badge>
          <el-badge v-if="item.name === 'multiInstance'">
            <el-button size="small">编辑</el-button>
          </el-badge>

        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
