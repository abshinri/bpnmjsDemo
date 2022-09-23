import type BpmnModeler from "bpmn-js/lib/Modeler";
import { reactive, watch, computed, toRefs, inject } from "vue";
import _showConfig from "../libs/showConfig";
export default (props: any, formData: any) => {
  const modeler = inject<typeof BpmnModeler>("modeler");

  // 找到节点,并修改XML属性
  const updateProperties = (properties: any) => {
    const { element } = toRefs(props);

    const elementRegistry = modeler.value.get("elementRegistry");
    const eventElement = elementRegistry.get(element.value.id);

    const modeling = modeler.value.get("modeling");
    modeling.updateProperties(eventElement, properties);
  };

  watch(
    () => formData.value.id,
    (val: any) => {
      updateProperties({ id: val });
    }
  );

  watch(
    () => formData.value.name,
    (val: any) => {
      updateProperties({ name: val });
    }
  );

  watch(
    () => formData.value.documentation,
    (val: []) => {
      if (!val) {
        updateProperties({ documentation: [] });
        return;
      }
      const documentationElement = props.modeler
        .get("moddle")
        .create("bpmn:Documentation", { text: val });
      updateProperties({ documentation: [documentationElement] });
    }
  );

  const elementType = computed(() => {
    const bizObj: any = props.element.businessObject;
    return bizObj.eventDefinitions
      ? bizObj.eventDefinitions[0].$type
      : bizObj.$type;
  });

  const showConfig = computed<any>(() => {
    return _showConfig[elementType.value as keyof typeof _showConfig] || {};
  });

  return {
    showConfig,
    updateProperties,
  };
};
