<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="cateList" :columns="columns"
        :selection-type="false" :expand-type="false" border
        show-index index-text="#" :show-row-hover="false">
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color:lightgreen"
            v-if="!scope.row.cat_delete">
          </i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total"
        :current-page="queryInfo.pagenum" :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
     <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form ref="addCateFormRef" label-width="80px" :model="addCateForm" :rules="addCateFormRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader :options="parentCateList"
            :props="cascaderProps" v-model="selectedKeys" clearable
             @change="parentCateChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCate">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      total: 0,
      queryInfo: {
        pagenum: 1,
        pagesize: 10
      },
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          // 表示当前列模板使用名称
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          // 表示当前列模板使用名称
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          // 表示当前列模板使用名称
          template: 'opt'
        }
      ],
      addDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        // 分类等级默认为1级分类
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      selectedKeys: []
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
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pageNum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentcateList()
      this.addDialogVisible = true
    },
    addDialogClosed() {
      this.addCateForm = {
        cat_name: '',
        cat_pid: 0,
        // 分类等级默认为1级分类
        cat_level: 0
      }
      this.selectedKeys = ''
    },
    // 获取父级分类的数据列表
    async getParentcateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.parentCateList = res.data
      console.log(this.parentCateList)
    },
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCate() {
      // validate中有一个回调函数来接收
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.addDialogVisible = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
