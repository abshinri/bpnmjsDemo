<script setup lang="ts">
import { defineProps, reactive, ref } from "vue";

const props = defineProps(["visible", "closeDialog", "close"]);

const closeDialog = () => {
  props.close();
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
      label: "字段名",
      isRequired: true,
      type: "chname",
      dic: [
        { label: "start", value: "start" },
        { label: "end", value: "end" },
        { label: "take", value: "take" },
      ],
    },
    {
      prop: "type",
      width: "",
      label: "字段英文名",
      isRequired: true,
      type: "input",
      dic: [
        { label: "类", value: "class" },
        { label: "表达式", value: "expression" },
        { label: "委托表达式", value: "delegateExpression" },
      ],
    },
    { prop: "className", width: "", label: "字段规则样例", type: "input" },
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
    @closed="closeDialog()"
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

              <el-tooltip
                v-else-if="item.type === 'input'"
                :content="scope.row[item.prop]"
                placement="top"
                effect="light"
              >
                <el-input
                  v-model="scope.row[item.prop]"
                  placeholder="请输入内容"
                />
              </el-tooltip>
              <el-input-number
                v-else-if="item.type === 'input-number'"
                :min="1"
                :max="255"
                v-model="scope.row[item.prop]"
                placeholder="请输入内容"
                controls-position="right"
              />
              <el-input
                v-else-if="item.type === 'dialog'"
                v-model="scope.row[item.prop]"
                readonly
                placeholder="请输入内容"
              >
                <template v-slot:suffix>
                  <i class="iconfont icon-shouye_dongtaihui" />
                </template>
              </el-input>
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
