<script setup lang="ts">
import { ref, onMounted, defineProps } from "vue";

import BpmnModeler from "bpmn-js/lib/Modeler";
import panel from "./panel/index.vue";

import flowableModdle from "@/libs/flowable.json";
import { xmlStr } from "@/mock/xmlStr";
import customTranslate from "@/libs/customTranslate";

import type { UploadFile } from "element-plus";
import { ElMessage } from "element-plus";

const props = defineProps(["users", "groups", "categorys", "xml", "isView"]);

const bpmnCanvasRef = ref(null);
const saveXmlRef = ref(null);
const modeler = ref<typeof BpmnModeler>(null);
const createNewDiagram = async () => {
  try {
    const result = await modeler.value.importXML(xmlStr(), (err: any) => {
      if (err) {
        // console.error(err)
      } else {
        // 这里是成功之后的回调, 可以在这里做一系列事情
        cacheCurrentBpmnToXml((err: any, xml: any) => {
          generateData(saveXmlRef.value, "test.xml", err ? null : xml);
        });

        // 每当画布发生变化时, 会触发这个事件
        modeler.value.on("commandStack.changed", () => {
          cacheCurrentBpmnToXml((err: any, xml: any) => {
            generateData(saveXmlRef.value, "test.xml", err ? null : xml);
          });
        });
      }
    });
    const { warnings } = result;
    console.log(warnings);
  } catch (err: any) {
    console.log(err.message, err.warnings);
  }
};

// 当前内容转换为XML
const generateData = (
  link: any,
  name: string,
  data: string | number | boolean
) => {
  const encodedData = encodeURIComponent(data);
  let xmlFile = new File([data as BlobPart], "test.xml");
  console.log(xmlFile);
  if (data) {
    link.className = "downloadXml active";
    link.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
    link.download = name;
  }
};

// 缓存当前的XML
const cacheCurrentBpmnToXml = (cb: Function) => {
  modeler.value.saveXML({ format: true }, function (err: any, xml: any) {
    cb(err, xml);
  });
};

onMounted(() => {
  modeler.value = new BpmnModeler({
    container: bpmnCanvasRef.value,
    propertiesPanel: {
      parent: "#js-properties-panel",
    },
    additionalModules: [
      {
        translate: ["value", customTranslate],
      },
    ],
    moddleExtensions: {
      flowable: flowableModdle,
    },
  });
  createNewDiagram();
});
</script>

<template>
  <div class="bpmn-container">
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

<style scoped lang="scss">
.bpmn-container {
  width: 100%;
  height: 100%;
}
#bpmnCanvas {
  width: 100%;
  height: 100%;
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
