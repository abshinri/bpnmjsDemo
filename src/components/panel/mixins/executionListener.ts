import executionListenerDialog from "../../dialog/executionListener.vue";
import { ref } from "vue";
export default (element: any) => {
  const dialogName = ref("");
  const executionListenerLength = ref(0);

  const computedExecutionListenerLength = () => {
    executionListenerLength.value =
      element.businessObject.extensionElements?.values?.length ?? 0;
  };
  const finishExecutionListener = () => {
    alert("finishExecutionListener");
    if (dialogName.value === "executionListenerDialog") {
      computedExecutionListenerLength();
    }
    dialogName.value = "";
  };
  return {
    dialogName,
    executionListenerLength,
    executionListenerDialog,
    finishExecutionListener,
  };
};
