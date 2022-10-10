<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import type { FormItem, Category } from "@/interface/bpmn";
import type { FormInstance, FormRules } from "element-plus";
import mixinPanel from "./mixins/panel";
import { commonParse,userTaskParse } from "./libs/parseElement";
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
const dialogName = ref<string>("");
// 执行监听器数量
const executionListenerLength = ref<number>(0);
// 任务监听器数量
const taskListenerLength = ref<number>(0);
// 是否存在多任务
const hasMultiInstance = ref<boolean>(false);

const formData = ref<any>({});
const { showConfig, updateProperties } = mixinPanel(props, formData);
const items = computed<FormItem[]>(() => {
  return [
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
      show: !!showConfig.value["taskListener" as keyof typeof showConfig],
    },
    {
      type: "select",
      name: "userType",
      label: "人员类型",
      dic: { data: userTypeOption, label: "label", value: "value" },
      show: !!showConfig.value["userType" as keyof typeof showConfig],
    },
    {
      type: "select",
      name: "assignee",
      label: "指定人员",
      allowCreate: true,
      filterable: true,
      dic: { data: props.users, label: "name", value: "id" },
      show:
        !!showConfig.value["assignee" as keyof typeof showConfig] &&
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
        !!showConfig.value["candidateUsers" as keyof typeof showConfig] &&
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
        !!showConfig.value["candidateGroups" as keyof typeof showConfig] &&
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
      show: !!showConfig.value["async" as keyof typeof showConfig],
    },
    {
      type: "input",
      name: "priority",
      label: "优先级",
      show: !!showConfig.value["priority" as keyof typeof showConfig],
    },
    {
      type: "input",
      name: "formKey",
      label: "表单标识key",
      show: !!showConfig.value["formKey" as keyof typeof showConfig],
    },
    {
      type: "input",
      name: "skipExpression",
      label: "跳过表达式",
      show: !!showConfig.value["skipExpression" as keyof typeof showConfig],
    },
    {
      type: "switch",
      name: "isForCompensation",
      label: "是否为补偿",
      activeText: "是",
      inactiveText: "否",
      show: !!showConfig.value["isForCompensation" as keyof typeof showConfig],
    },
    {
      type: "switch",
      name: "triggerable",
      label: "服务任务可触发",
      activeText: "是",
      inactiveText: "否",
      show: !!showConfig.value["triggerable" as keyof typeof showConfig],
    },
    {
      type: "switch",
      name: "autoStoreVariables",
      label: "自动存储变量",
      activeText: "是",
      inactiveText: "否",
      show: !!showConfig.value["autoStoreVariables" as keyof typeof showConfig],
    },
    {
      type: "input",
      name: "ruleVariablesInput",
      label: "输入变量",
      show: !!showConfig.value["ruleVariablesInput" as keyof typeof showConfig],
    },
    {
      type: "input",
      name: "rules",
      label: "规则",
      show: !!showConfig.value["rules" as keyof typeof showConfig],
    },
    {
      type: "input",
      name: "resultVariable",
      label: "结果变量",
      show: !!showConfig.value["resultVariable" as keyof typeof showConfig],
    },
    {
      type: "switch",
      name: "exclude",
      label: "排除",
      activeText: "是",
      inactiveText: "否",
      show: !!showConfig.value["exclude" as keyof typeof showConfig],
    },
    {
      type: "input",
      name: "class",
      label: "类",
      show: !!showConfig.value["class" as keyof typeof showConfig],
    },
    {
      type: "datePicker",
      dateType: "datetime",
      name: "dueDate",
      label: "到期时间",
      show: !!showConfig.value["dueDate" as keyof typeof showConfig],
    },
  ];
});

const formRef = ref<FormInstance>();
const formRules = reactive<FormRules>({});

items.value.forEach((item: FormItem) => {
  formData.value[item.name] = "";
  if (item.rules) {
    formRules[item.name] = item.rules;
  }
});

formData.value = userTaskParse(commonParse(props.element));

const computedExecutionListenerLength = () => {
  executionListenerLength.value =
    props.element.businessObject.extensionElements?.values?.filter(
      (item: any) => item.$type === "flowable:ExecutionListener"
    ).length ?? 0;
};
const computedTaskListenerLength = () => {
  taskListenerLength.value =
    props.element.businessObject.extensionElements?.values?.filter(
      (item: any) => item.$type === "flowable:TaskListener"
    ).length ?? 0;
};
const computedHasMultiInstance = () => {
  if (props.element.businessObject.loopCharacteristics) {
    hasMultiInstance.value = true;
  } else {
    hasMultiInstance.value = false;
  }
};

watch(
  () => formData.value.userType,
  (val, oldVal) => {
    if (oldVal) {
      const types = ["assignee", "candidateUsers", "candidateGroups"];
      types.forEach((type) => {
        delete props.element.businessObject.$attrs[`flowable:${type}`];
        delete formData.value[type];
      });
    }
    updateProperties({ "flowable:userType": val });
  }
);
watch(
  () => formData.value.assignee,
  (val) => {
    if (formData.value.userType !== "assignee") {
      delete props.element.businessObject.$attrs[`flowable:assignee`];
      return;
    }
    updateProperties({ "flowable:assignee": val });
  }
);
watch(
  () => formData.value.candidateUsers,
  (val) => {
    if (formData.value.userType !== "candidateUsers") {
      delete props.element.businessObject.$attrs[`flowable:candidateUsers`];
      return;
    }
    updateProperties({ "flowable:candidateUsers": val?.join(",") });
  }
);
watch(
  () => formData.value.candidateGroups,
  (val) => {
    if (formData.value.userType !== "candidateGroups") {
      delete props.element.businessObject.$attrs[`flowable:candidateGroups`];
      return;
    }
    updateProperties({ "flowable:candidateGroups": val?.join(",") });
  }
);

watch(
  () => formData.value.async,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:async": val });
  }
);
watch(
  () => formData.value.dueDate,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:dueDate": val });
  }
);
watch(
  () => formData.value.formKey,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:formKey": val });
  }
);
watch(
  () => formData.value.priority,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:priority": val });
  }
);
watch(
  () => formData.value.skipExpression,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:skipExpression": val });
  }
);
watch(
  () => formData.value.isForCompensation,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:isForCompensation": val });
  }
);
watch(
  () => formData.value.triggerable,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:triggerable": val });
  }
);
watch(
  () => formData.value.class,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:class": val });
  }
);
watch(
  () => formData.value.autoStoreVariables,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:autoStoreVariables": val });
  }
);
watch(
  () => formData.value.exclude,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:exclude": val });
  }
);
watch(
  () => formData.value.ruleVariablesInput,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:ruleVariablesInput": val });
  }
);
watch(
  () => formData.value.rules,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:rules": val });
  }
);
watch(
  () => formData.value.resultVariable,
  (val: any) => {
    if (val === "") val = null;
    updateProperties({ "flowable:resultVariable": val });
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
        <template v-for="item in items">
          <el-form-item
            v-if="item.show !== false"
            :label="item.label"
            :prop="item.name"
          >
            <el-input
              v-if="item.type === 'input'"
              v-model="formData[item.name]"
            />

            <el-select
              v-if="item.type === 'select'"
              :multiple="item.multiple"
              :filterable="item.filterable"
              :allow-create="item.allowCreate"
              v-model="formData[item.name]"
            >
              <el-option
                v-for="dicItem in item.dic?.data"
                :key="dicItem[item.dic?.value as keyof typeof dicItem] "
                :label="dicItem[item.dic?.label as keyof typeof dicItem]"
                :value="dicItem[item.dic?.value as keyof typeof dicItem ]"
              />
            </el-select>

            <el-switch
              v-if="item.type === 'switch'"
              v-model="formData[item.name]"
              :active-text="item.activeText"
              :inactive-text="item.inactiveText"
            />

            <el-date-picker
            
            v-if="item.type === 'datePicker'"
                v-model="formData[item.name]"
                type="datetime"
                placeholder="到期时间"
              />

            <el-badge
              v-if="item.name === 'executionListener'"
              :value="executionListenerLength"
            >
              <el-button size="small">编辑</el-button>
            </el-badge>
            <el-badge
              v-if="item.name === 'taskListener'"
              :value="taskListenerLength"
            >
              <el-button size="small">编辑</el-button>
            </el-badge>
            <el-badge
              v-if="item.name === 'multiInstance'"
              :is-dot="hasMultiInstance"
            >
              <el-button size="small">编辑</el-button>
            </el-badge>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
