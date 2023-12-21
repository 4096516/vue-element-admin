<!-- src/views/employee/list.vue -->

<template>
  <!-- 员工列表视图 -->
  <div class="employee-list">
    <!-- 查询条件表单 -->
    <el-form :inline="true" class="employee-search-form">
      <!-- 查询条件项 - 姓名 -->
      <el-form-item label="姓名">
        <el-input v-model="queryParams.empName" clearable placeholder="请输入姓名"></el-input>
      </el-form-item>
      <!-- 查询条件项 - 部门 -->
      <el-form-item label="部门">
        <el-select v-model="queryParams.deptName" clearable placeholder="请选择部门">
          <el-option label="业务部" value="业务部"></el-option>
          <el-option label="后勤部" value="后勤部"></el-option>
          <el-option label="人事部" value="人事部"></el-option>
        </el-select>
      </el-form-item>
      <!-- 查询条件项 - 学历 -->
      <el-form-item label="学历">
        <el-select v-model="queryParams.empDegreeName" clearable placeholder="请选择学历">
          <el-option label="大专" value="大专"></el-option>
          <el-option label="本科" value="本科"></el-option>
          <el-option label="研究生" value="研究生"></el-option>
        </el-select>
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
        <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 员工信息表格 -->
    <el-table :data="employeeList" style="width: 100%">
      <!-- 表格列配置 -->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="empName" label="职工姓名"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="deptName" label="部门名称"></el-table-column>
      <el-table-column prop="empDegreeName" label="学历"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination @size-change="fetchEmployeeList" @current-change="fetchEmployeeList" :page-sizes="[10, 20, 30, 40]"
      :page-size.sync="queryParams.pageSize" :current-page.sync="queryParams.currentPage" background
      layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

    <!-- 添加/编辑职员对话框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" append-to-body>
      <!-- 表单 -->
      <el-form ref="currentEmployee" :model="currentEmployee" label-width="80px" :rules="rules">
        <!-- 表单行 - 姓名 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="empName" :rules="getRules('empName')">
              <el-input v-model="currentEmployee.empName" placeholder="请输入用户姓名" maxlength="30" />
            </el-form-item>
          </el-col>
          <!-- 表单行 - 性别 -->
          <el-col :span="12">
            <el-form-item label="性别" prop="sex" :rules="getRules('sex')">
              <el-input v-model="currentEmployee.sex" placeholder="请输入性别" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 表单行 - 年龄和部门 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age" :rules="getRules('age')">
              <el-input v-model="currentEmployee.age" placeholder="请输入年龄" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptName" :rules="getRules('deptName')">
              <el-select v-model="currentEmployee.deptName" placeholder="请选择部门">
                <el-option label="业务部" value="业务部"></el-option>
                <el-option label="后勤部" value="后勤部"></el-option>
                <el-option label="人事部" value="人事部"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 表单行 - 学历 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="学历" prop="empDegreeName" :rules="getRules('empDegreeName')">
              <el-select v-model="currentEmployee.empDegreeName" placeholder="请选择学历">
                <el-option label="大专" value="大专"></el-option>
                <el-option label="本科" value="本科"></el-option>
                <el-option label="研究生" value="研究生"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 操作按钮 -->
      <el-button type="primary" @click="handleSave">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </el-dialog>
  </div>
</template>

<script>
// import EmployeeDialog from "@/components/EmployeeDialog.vue";
import axios from 'axios';

export default {
  components: {
    // EmployeeDialog
  },
  data() {
    return {
      queryParams: {
        pageSize: 10,
        currentPage: 1,
        empName: null,
        deptName: null,
        empDegreeName: null,
      },
      employeeList: [], // 职工列表数据
      total: null,
      title: null,
      dialogVisible: false,
      currentEmployee: {}, // 当前编辑的职员信息
      rules: {
        empName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请输入性别', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        empDegreeName: [
          { required: true, message: '请选择学历', trigger: 'change' }
        ]
      }
    };
  },
  mounted() {
    this.fetchEmployeeList();
  },
  methods: {
    // 查询按钮点击事件
    handleQuery() {
      this.reset();
      this.fetchEmployeeList();
    },
    // 重置查询条件
    reset() {
      this.queryParams.currentPage = 1;
    },
    // 异步获取职工列表
    async fetchEmployeeList() {
      try {
        const response = await axios({
          method: 'get',
          url: 'http://localhost:8080/employee/list',
          params: this.queryParams,
        });
        this.employeeList = response.data.data.records;
        this.total = response.data.data.total;
      } catch (error) {
        console.error('获取职工列表失败', error);
      }
    },
    // 编辑按钮点击事件
    async handleEdit(row) {
      // try {
      //   console.response = axios({
      //     method: 'get' ,
      //     url: 'http://localhost:8080/employee/findById?id=' + row.id
      //   })

      let response = await axios({
        method: 'get',
        url: 'http://localhost:8080/employee/findById/' + row.id
      })
      console.log(response)
      this.currentEmployee = response.data.data

      this.dialogVisible = true;
      this.title = "修改用户";
      // } catch (error) {
      //   console.error('获取职员信息失败', error);
      // }
    },
    // 添加按钮点击事件
    handleAdd() {
      this.currentEmployee = {};
      this.dialogVisible = true;
      this.title = "新增用户";
    },
    // 删除按钮点击事件
    handleDelete(row) {
      try {
        console.log("删除");
        const response = axios({
          method: 'delete',
          url: 'http://localhost:8080/employee/deleteById/' + row.id,
        });
      } catch (error) {
        console.error('删除职员失败', error);
      }
    },
    // 对话框关闭事件
    handleClose() {
      this.dialogVisible = false;
      this.currentEmployee = {};
    },
    getRules(prop) {
      return this.rules[prop];
    },
    // 保存按钮点击事件
    async handleSave() {
      const isValid = await this.$refs.currentEmployee.validate();
      if (!isValid) {
        // 表单验证失败，不执行保存操作
        return;
      }
      if (this.currentEmployee.id == null) {
        try {
          console.log("新增");
          const response = axios({
            method: 'post',
            url: 'http://localhost:8080/employee/save',
            data: this.currentEmployee,
          });
        } catch (error) {
          console.error('新增职员失败', error);
        }
      } else {
        try {
          console.log("修改");
          const response = axios({
            method: 'put',
            url: 'http://localhost:8080/employee/update',
            data: this.currentEmployee,
          });
        } catch (error) {
          console.error('修改职员失败', error);
        }
      }
      this.dialogVisible = false;
      this.fetchEmployeeList();
    },
    // 导出按钮点击事件
    handleExport() {
      try {
        console.log("导出");
        const response = axios({
          method: 'get',
          url: 'http://localhost:8080/employee/export',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          responseType: 'blob'
        }).then(res => {
          console.log(res)
          var blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
          const contentDisposition = res.headers['content-disposition']

          var fileName = 'test'
          if (contentDisposition) {
            fileName = window.decodeURI(res.headers['content-disposition'].split('=')[1], 'UTF-8')
          }
          var url = window.URL.createObjectURL(blob)
          var aLink = document.createElement('a')
          aLink.style.display = 'none'
          aLink.href = url
          aLink.setAttribute('download', fileName)
          document.body.appendChild(aLink)
          aLink.click()
          document.body.removeChild(aLink) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        })
          ;
      } catch (error) {
        console.error('导出职工列表失败', error);
      }
    },
  },
};
</script>

<style scoped>
/* 样式可以根据实际需求自行调整 */
.employee-list {
  padding: 20px;
}

.employee-search-form {
  margin-bottom: 20px;
}
</style>
