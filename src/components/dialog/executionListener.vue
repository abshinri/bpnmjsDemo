<script setup lang="ts">
import { defineProps, reactive, ref, defineEmits } from "vue";

import { ElMessage, ElMessageBox } from "element-plus";
const props = defineProps(["visible", "closeDialog"]);
const emits = defineEmits(["close"]);
const tableRulesRef = ref();

const closeDialog = async () => {
  if (tableData.data.length > 0) {
    try {
      await tableRulesRef.value?.validate();

      emits("close");
      return tableData.data;
    } catch (error) {
      ElMessage.error("请检查拓展字段信息填写情况");
      return false;
    }
  } else {
    emits("close");
  }
};
// 新增一条数据
const addData = () => {
  tableData.data.push({});
};
/**
 *  删除当前行扩展字段
 */
const deleteExtItem = (index: number) => {
  tableData.data.splice(index, 1);
};
const tableData = reactive<any>({
  data: [],
  header: [
    {
      prop: "event",
      width: "",
      label: "事件",
      isRequired: true,
      type: "select",
      dic: [
        { label: "start", value: "start" },
        { label: "end", value: "end" },
        { label: "take", value: "take" },
      ],
    },
    {
      prop: "type",
      width: "",
      label: "类型",
      isRequired: true,
      type: "select",
      dic: [
        { label: "类", value: "class" },
        { label: "表达式", value: "expression" },
        { label: "委托表达式", value: "delegateExpression" },
      ],
      tooltip: `类：示例 com.company.MyCustomListener，自定义类必须实现 org.flowable.engine.delegate.TaskListener 接口 <br />
                              表达式：示例 \${myObject.callMethod(task, task.eventName)} <br />
                              委托表达式：示例 \${myListenerSpringBean} ，该 springBean 需要实现 org.flowable.engine.delegate.TaskListener 接口
                    `,
    },
    {
      prop: "className",
      width: "",
      label: "java 类名",
      type: "input",
      isRequired: true,
    },
    { prop: "", width: "100px", label: "参数", type: "params" },
    { prop: "", width: "100px", label: "操作", type: "operate" },
  ],
});

const getRules = (item: any) => {
  if (item.isRequired) {
    return [
      {
        required: true,
        message: "不能为空",
        trigger: `${item.type}` == "input" ? "blur" : "change",
      },
    ];
  } else {
    return [];
  }
};
</script>

<template>
  <el-dialog
    v-model="visible"
    title="执行监听器"
    width="900px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-button @click="addData">新增数据</el-button>
    <el-form ref="tableRulesRef" :model="tableData" size="default">
      <el-table
        :data="tableData.data"
        border
        class="module-table-uncollected"
        empty-text="暂无数据"
      >
        <el-table-column
          v-for="(item, index) in tableData.header"
          :key="index"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
        >
          <template v-slot:header>
            <span v-if="item.isRequired" class="color-danger">*</span>

            <span class="pl5" style="color: #333">{{ item.label }}</span>
            <el-tooltip
              v-if="item.tooltip"
              :content="item.tooltip"
              placement="top"
              effect="light"
            >
              ?
            </el-tooltip>
          </template>
          <template v-slot="scope">
            <el-form-item
              class="extshowcase-item"
              style="height: 70px"
              :prop="`data.${scope.$index}.${item.prop}`"
              :rules="getRules(item) as []"
            >
              <el-select
                v-if="item.type === 'select'"
                v-model="scope.row[item.prop]"
                placeholder="请选择"
              >
                <el-option
                  v-for="sel in item.dic"
                  :key="sel.id"
                  :label="sel.label"
                  :value="sel.value"
                />
              </el-select>

              <el-input
                v-if="item.type === 'input'"
                v-model="scope.row[item.prop]"
                placeholder="请输入内容"
              />

              <div class="ta-c" v-else-if="item.type === 'params'">
                <el-button size="small" link type="primary">配置</el-button>
              </div>
              <div class="ta-c" v-else-if="item.type === 'operate'">
                <el-button
                  size="small"
                  link
                  type="primary"
                  @click="deleteExtItem(scope.$index)"
                  >删除</el-button
                >
              </div>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="closeDialog()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
#bpmp {
  width: 100vw;
  height: 100vh;
}
</style>
