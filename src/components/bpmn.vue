<script setup lang="ts">
import { ref, onMounted, defineProps, inject, computed } from "vue";

import BpmnModeler from "bpmn-js/lib/Modeler";
import panel from "./panel/index.vue";

import flowableModdle from "./common/flowable.json";
import getInitStr from "./common/init";
import customTranslate from "./common/customTranslate";
import minimapModule from "diagram-js-minimap";
import TokenSimulationModule from "bpmn-js-token-simulation";

import customModule from "./common/customBpmnModules";

import type { UploadFile } from "element-plus";
import { ElMessage } from "element-plus";

const props = defineProps(["users", "groups", "categorys", "xml", "isView"]);

const bpmnCanvasRef = ref(null);
const saveXmlRef = ref(null);

const modeler = inject<typeof BpmnModeler>("modeler");

const createNewDiagram = async (data: string) => {
  data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
    return str.replace(/</g, "&lt;");
  });
  try {
    const result = await modeler.value.importXML(data);
    const { warnings } = result;
    console.log("createNewDiagram");
    console.log(warnings);

    // 初始化
    cacheCurrentBpmnToXml((xml: any) => {
      generateData(saveXmlRef.value, "test.xml", xml);
    });

    // 每当画布发生变化时, 会触发这个事件
    modeler.value.on("commandStack.changed", () => {
      cacheCurrentBpmnToXml((xml: any) => {
        generateData(saveXmlRef.value, "test.xml", xml);
      });
    });

    // const result = await modeler.value.importXML(data);
    // const { warnings } = result;
    // console.log(warnings);
    // if (warnings) {
    //   ElMessage.error(warnings);
    // } else {
    //   // 这里是成功之后的回调, 可以在这里做一系列事情
    //   cacheCurrentBpmnToXml((err: any, xml: any) => {
    //     generateData(saveXmlRef.value, "test.xml", err ? null : xml);
    //   });

    //   // 每当画布发生变化时, 会触发这个事件
    //   modeler.value.on("commandStack.changed", () => {
    //     cacheCurrentBpmnToXml((err: any, xml: any) => {
    //       generateData(saveXmlRef.value, "test.xml", err ? null : xml);
    //     });
    //   });
    // }
  } catch (err: any) {
    ElMessage.error(err.message, err.warnings);
  }
  // const events = [
  //   "shape.added",
  //   "shape.move.end",
  //   "shape.removed",
  //   "connect.end",
  //   "connect.move",
  // ];
  // events.forEach(function (event) {
  //   modeler.value.on(event, (e: any) => {
  //     console.log(event, e);
  //     var elementRegistry = modeler.value.get("elementRegistry");
  //     var shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
  //     console.log("events.forEach");
  //     console.log(shape);
  //   });
  // });
};

// 当前内容转换为XML
const generateData = (link: any, name: string, data: { xml: string }) => {
  console.log("generateData");
  console.log(data);
  const encodedData = encodeURIComponent(data.xml);
  if (data) {
    link.className = "downloadXml active";
    link.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
    link.download = name;
  }
};

// 缓存当前的XML
const cacheCurrentBpmnToXml = async (cb: Function) => {
  try {
    await modeler.value.saveXML({ format: true }).then((res: any) => {
      cb(res);
    });
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  modeler.value = new BpmnModeler({
    container: bpmnCanvasRef.value,
    additionalModules: [
      customModule,
      minimapModule,
      TokenSimulationModule,
      {
        translate: ["value", customTranslate],
      },
    ],
    moddleExtensions: {
      flowable: flowableModdle,
    },
  });
  // 新增流程定义
  if (!props.xml) {
    createNewDiagram(getInitStr());
  } else {
    createNewDiagram(props.xml);
  }

  // let minimap: any | null = null;
  // const minimapStatus = computed(() => editor().getEditorConfig.miniMap)
  // const minimapToggle = () => {
  // !minimap && (minimap = modeler.value.get("minimap"));
  // minimap && minimap.toggle();
  // }
});

const toggleMode = () => {
  modeler.value.get("toggleMode").toggleMode();
};
</script>

<template>
  <div class="bpmn-container">
    <el-button @click="toggleMode()">Default</el-button>
    <a class="downloadXml" href="javascript:" ref="saveXmlRef">保存XML</a>
    <div ref="bpmnCanvasRef" id="bpmnCanvas"></div>
    <panel
      v-if="modeler"
      :modeler="modeler"
      :users="users"
      :groups="groups"
      :categorys="categorys"
    ></panel>
  </div>
</template>

<style lang="scss">
@import "../assets/canvas.scss";
@import "diagram-js-minimap/assets/diagram-js-minimap.css";
@import "bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css";

.bpmn-container {
  width: 100%;
  height: 100%;
}
#bpmnCanvas {
  width: 100%;
  height: 100%;

  .djs-minimap {
    right: 350px;
    z-index: 100;
  }
}

.downloadXml {
  position: absolute;
  left: 30px;
  bottom: 30px;
  z-index: 1000;
  color: #999;
  cursor: disabled;
  &.active {
    color: rgb(12, 75, 134);
    cursor: pointer;
  }
}
</style>
