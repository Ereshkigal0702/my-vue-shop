<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeIndex*1" finish-status="success"  align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
        label-width="100px" label-position="top">
        <!-- tab栏 -->
        <el-tabs tab-position="left" v-model="activeIndex"
          :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- <div v-for="item in manyTableData" :key="item.attr_id" style="margin-bottom:10px">
              <h3 style="margin-left:10px;margin-bottom:10px">{{item.attr_name}}</h3>
              <el-tag v-for="(subItem,i) in item.attr_vals" :key="i"
                type="primary" style="margin-right:1px">
                {{subItem}}
              </el-tag>
            </div> -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb,i) in item.attr_vals" :key="i"
                  :label="cb" border>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData"
              :key="item.attr_id">
              <el-input v-model ="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3"></el-tab-pane>
          <el-tab-pane label="商品内容" name="4"></el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: []
      },
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      manyTableData: [],
      onlyTableData: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.cateList = res.data
    },
    // 级联选择器选中变化触发的函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        // return
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3 && oldActiveName === '0') {
        this.$message.error('请先选择商品分类!')
        return false
      }
    },
    async tabClicked() {
      // 访问动态参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.manyTableData = res.data
        for (let i = 0; i < this.manyTableData.length; i++) {
          if (this.manyTableData[i].attr_vals.length !== 0) {
            this.manyTableData[i].attr_vals = this.manyTableData[i].attr_vals.split(' ')
          } else {
            this.manyTableData[i].attr_vals = []
          }
        }
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.onlyTableData = res.data
        for (let i = 0; i < this.onlyTableData.length; i++) {
          if (this.onlyTableData[i].attr_vals.length !== 0) {
            this.onlyTableData[i].attr_vals = this.onlyTableData[i].attr_vals.split(' ')
          } else {
            this.onlyTableData[i].attr_vals = []
          }
        }
      }
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
</style>
