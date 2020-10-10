<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="注意，只允许为第三级分类设置相关参数!" type="warning" :closable="false" show-icon></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span class="cat_span">选择商品分类:</span>
          <!-- 级联框 -->
          <el-cascader :options="cateList" :show-all-levels="false"
            :props="cascaderProps" v-model="selectedKeys" clearable
             @change="parentCateChange">
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button size="mini" type="primary" :disabled="isDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_values"
                  :key="i" closable @close="handleClose(i,scope.row)">
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag"
                  size="small" @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRow(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button size="mini" type="primary" :disabled="isDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_values"
                  :key="i" closable @close="handleClose(i,scope.row)">
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag"
                  size="small" @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRow(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog :title="title" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form ref="addFormRef" label-width="120px" :model="addForm" :rules="addFormRules">
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCate">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog :title="editTitle" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form ref="editFormRef" label-width="120px" :model="editForm" :rules="editFormRules">
        <el-form-item :label="editTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editCate">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { MessageBox } from 'element-ui'
export default {
  data() {
    return {
      queryInfo: {},
      cateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: false
      },
      selectedKeys: [],
      // 被激活的页签名称
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      },
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      },
      attrId: '',
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.cateList = res.data
    },
    parentCateChange() {
      this.getParamsData()
    },
    handleTabClick() {
      this.getParamsData()
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    showEditDialog(data) {
      console.log(data)
      this.attrId = data.attr_id
      debugger
      this.editForm.attr_name = data.attr_name
      this.editDialogVisible = true
    },
    // 获取参数列表数据
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      res.data.forEach(item => {
        item.attr_values = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') this.manyTableData = res.data
      if (this.activeName === 'only') this.onlyTableData = res.data
    },
    async addCate() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    editCate() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.attrId}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    deleteRow(data) {
      console.log(data)
      MessageBox.confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${data}`)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
          this.getParamsData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_values.push(row.inputValue.trim())
      this.saveAttrVals(row)
      row.inputValue = ''
      row.inputVisible = false
    },
    showInput(row) {
      row.inputVisible = true
      // $nextTick当页面上元素重新渲染后，才执行回调函数内的代码，
      // 如果不使用$nextTick,仅改变布尔值，页面可能没有完全渲染，
      // 此时操作dom可能会找不到dom而报错
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的选项
    async handleClose(i, row) {
      console.log(row)
      row.attr_values.splice(i, 1)
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_values.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals + ' ' + row.inputValue
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    }
  },
  computed: {
    isDisabled() {
      if (this.selectedKeys.length !== 3) return true
      return false
    },
    // 当前选中的三级分类的最后一项
    cateId() {
      if (this.selectedKeys.length === 3) return this.selectedKeys[this.selectedKeys.length - 1]
      return null
    },
    title() {
      if (this.activeName === 'many') {
        return '添加动态参数'
      } else {
        return '添加静态属性'
      }
    },
    editTitle() {
      if (this.activeName === 'many') {
        return '编辑动态参数'
      }
      return '编辑静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.cat_span {
  margin-right: 15px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>
