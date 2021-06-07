<template>
  <div class="form">
    <h1>信息录入</h1>
    <p>
      为保证实验的准确性，请在下方如实填写你的信息。<br />
      <em>请放心，其中不包含任何可能透漏个人隐私的问题。</em>
    </p>
    <el-row>
      <el-col :span="12">
        <el-card shadow="never">
          <el-form class="el-form" label-width="80px" :rules="rules">
            <el-form-item label="实验编号" prop="id">
              <el-input v-model="form.id" style="width: 100px"></el-input>
            </el-form-item>

            <el-form-item label="实验组" prop="group">
              <el-radio v-model="form.group" label="A">A</el-radio>
              <el-radio v-model="form.group" label="B">B</el-radio>
            </el-form-item>

            <el-form-item label="性别" prop="gender">
              <el-radio v-model="form.gender" label="male">男</el-radio>
              <el-radio v-model="form.gender" label="female">女</el-radio>
              <el-radio v-model="form.gender" label="other">其他</el-radio>
            </el-form-item>

            <el-form-item label="年龄" prop="age">
              <el-select v-model="form.age" placeholder="请选择">
                <el-option
                  v-for="item in ages"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="显示设备" prop="monitor" style="width: 300px">
              <el-select v-model="form.monitor" placeholder="请选择">
                <el-option
                  v-for="item in monitors"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="输入设备" prop="input" style="width: 300px">
              <el-select v-model="form.input" placeholder="请选择">
                <el-option
                  v-for="item in inputs"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-button
            :type="'primary'"
            :disabled="!ready"
            icon="el-icon-success"
            @click="$emit('submit', form)"
            >提交</el-button
          ></el-card
        >
      </el-col>
    </el-row>
  </div>
</template>
<script>
let ages = [];
for (let index = 18; index <= 40; index++) {
  ages.push(index);
}
export default {
  data() {
    return {
      form: {
        id: "22",
        group: "A",
        gender: "male",
        age: "20",
        monitor: "显示器（26 寸以上）",
        input: "触控板",
      },
      ages: (() => {
        let ages = [];
        for (let index = 18; index <= 40; index++) {
          ages.push(index);
        }
        return ages;
      })(),
      monitors: [
        "笔记本（小于 16 寸）",
        "显示器（20 - 26 寸）",
        "显示器（26 寸以上）",
        "其他",
      ],
      inputs: ["鼠标", "触控板", "轨迹球", "触屏", "其他"],
      rules: {
        id: {
          required: true,
          trigger: "change",
        },
        group: { required: true, trigger: "change" },
        gender: {
          required: true,
          trigger: "change",
        },
        age: {
          required: true,
          trigger: "change",
        },
        monitor: {
          required: true,
          trigger: "change",
        },
        input: {
          required: true,
          trigger: "change",
        },
      },
    };
  },
  computed: {
    ready() {
      let flag = true;
      for (let key in this.form) {
        flag = flag && this.form[key];
      }
      return flag;
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  text-align: left;
}

.el-form {
  width: 40%;
}
</style>
