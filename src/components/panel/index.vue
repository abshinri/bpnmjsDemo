<script setup lang="ts">
import { NodeName } from "../common/zh";
import { ref, defineProps, computed, nextTick, onMounted } from "vue";

import taskPanel from "./task.vue";
import startEndPanel from "./startEnd.vue";
import processPanel from "./process.vue";
import sequenceFlowPanel from "./sequenceFlow.vue";
import gatewayPanel from "./gateway.vue";

const panel = {
  taskPanel,
  startEndPanel,
  processPanel,
  sequenceFlowPanel,
  gatewayPanel,
};

const props = defineProps(["users", "groups", "categorys", "modeler"]);
const element = ref<any>(null);

const form = ref({
  id: "",
  name: "",
  color: null,
});
const roles = ref([
  { value: "manager", label: "经理" },
  { value: "personnel", label: "人事" },
  { value: "charge", label: "主管" },
]);

const nodeName = computed(() => {
  if (element.value) {
    const bizObj = element.value.businessObject;
    const type = bizObj?.eventDefinitions
      ? bizObj.eventDefinitions[0].$type
      : bizObj.$type;
    return NodeName[type as keyof typeof NodeName] || type;
  }
  return "";
});

const getComponent = computed(() => {
  const type = element.value?.type;
  if (
    [
      "bpmn:IntermediateThrowEvent",
      "bpmn:StartEvent",
      "bpmn:EndEvent",
    ].includes(type)
  ) {
    return "startEndPanel";
  }
  if (
    [
      "bpmn:UserTask",
      "bpmn:Task",
      "bpmn:SendTask",
      "bpmn:ReceiveTask",
      "bpmn:ManualTask",
      "bpmn:BusinessRuleTask",
      "bpmn:ServiceTask",
      "bpmn:ScriptTask",
      // 'bpmn:CallActivity',
      // 'bpmn:SubProcess'
    ].includes(type)
  ) {
    return "taskPanel";
  }
  if (type === "bpmn:SequenceFlow") {
    return "sequenceFlowPanel";
  }
  if (
    [
      "bpmn:InclusiveGateway",
      "bpmn:ExclusiveGateway",
      "bpmn:ParallelGateway",
      "bpmn:EventBasedGateway",
    ].includes(type)
  ) {
    return "gatewayPanel";
  }
  if (type === "bpmn:Process") {
    return "processPanel";
  }
  return null;
});

// 初始化属性面板
const handleModeler = () => {
  props.modeler.on("root.added", (e: any) => {
    if (e.element.type === "bpmn:Process") {
      element.value = null;
      console.log(e.element);
      nextTick(() => {
        element.value = e.element;
      });
    }
  });
  props.modeler.on("element.click", (e: any) => {
    if (e.element.type === "bpmn:Process") {
      nextTick(() => {
        element.value = e.element;
      });
    }
  });
  props.modeler.on("selection.changed", (e: any) => {
    // hack 同类型面板不刷新
    element.value = null;
    const _element = e.newSelection[0];
    if (_element) {
      nextTick(() => {
        element.value = _element;
      });
    }
  });
};

onMounted(() => {
  handleModeler();
});
</script>

<template>
  <div id="bpnml-panel">
    <div class="node-name" v-if="nodeName">{{ nodeName }}</div>
    <component
      v-if="element && getComponent"
      :is="panel[getComponent]"
      :element="element"
      :modeler="modeler"
      :users="users"
      :groups="groups"
      :categorys="categorys"
    ></component>
  </div>
</template>

<style scoped lang="scss">
#bpnml-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  $ph: 20px;
  height: calc(100vh - $ph * 2);
  padding: $ph 20px;
  // reset element css
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .el-form-item {
    margin-bottom: 6px;
  }
  .tab-table .el-form-item {
    margin-bottom: 16px;
  }
  .node-name {
    border-bottom: 1px solid #ccc;
    padding: 0 0 10px 20px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #444;
  }
}
</style>
