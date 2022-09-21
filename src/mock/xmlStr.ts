export const xmlStr = (process = 0, name = 0) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <definitions
        xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
        xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
        xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="http://www.flowable.org/processdef">
        <process id="process_${process}" name="name_${name}">
        </process>
        <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
            <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="process_${process}">
            </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
    </definitions>`;
};
