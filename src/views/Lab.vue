<template>
  <!-- 进度条 -->
  <el-steps :active="phase" simple>
    <el-step title="信息录入" icon="el-icon-edit"></el-step>
    <el-step title="实验熟悉" icon="el-icon-chat-round"></el-step>
    <el-step title="进行实验" icon="el-icon-coordinate"></el-step>
    <el-step title="数据记录" icon="el-icon-data-board"></el-step>
  </el-steps>

  <!-- 填表 -->
  <lab-form @submit="handleForm($event)" v-show="phase == 0"></lab-form>

  <!-- 操作测试 -->
  <div class="example" v-if="phase == 1">
    <el-row gutter="48" justify="center" type="flex">
      <el-col :span="24">
        <h1>实验说明</h1>
        <div style="columns: 2; column-gap: 24px; column-fill: balance">
          <p>
            在实验过程中，请你完成一系列拖拽方块的任务，将交互目标<em>黑色方块</em>拖拽至<em>虚线方块</em>位置，若方块变为<em
              >绿色</em
            >
            则说明任务成功，若没有变化则需要继续调整交互目标，直至完成。
          </p>

          <p>
            实验中存在<em>不可见的网格</em>，网格有<em>大小两种尺寸</em>，可以通过按下
            <em> 左 Shift + P</em>
            进行转换。
          </p>
          <p>
            另外，任务中存在<em>网格吸附</em>功能，<em>开启后交互目标只能沿着网格顶点移动</em>。
          </p>

          <p>
            由于目标总是不在大网格的边上，因此根据两种功能的开启与否，共有三种任务类型：<em>无网格吸附</em>、<em>网格吸附-容易对齐（网格小）</em>、<em>网格吸附-较难对齐（网格大）</em>。请根据不同的任务选择恰当的操作。
          </p>
          <p>
            在完成拖拽任务后，会有数个测试问题，需要您根据自己的偏好进行选择。
          </p>
          <p>
            <em
              >请注意：在实验过程中，网格是不可见的，这意味着你只能通过尝试拖动来判断是否需要切换网格。</em
            >
          </p>
        </div>
        <h2>{{ example.title.value }}</h2>
      </el-col>
    </el-row>

    <drag
      :isSnapping="example.dragConfig.isSnapping"
      :smallGridOnStart="example.dragConfig.smallGridOnStart"
      @accomplish="example.exampleFinishHander($event)"
      :debug="false"
      :updateFlag="example.state.value"
    ></drag>
  </div>

  <!-- 实验区  -->
  <div class="task-set" id="task-set-1" v-if="phase == 2">
    <h1 v-if="!experiment.frameEffectAnswer.showConcentrateTest">
      任务组 {{ experiment.state.set + 1 }} - {{ experiment.type.value }}
      {{ experiment.state.number + 1 }}/12
    </h1>
    <drag
      :debug="false"
      :showGrid="false"
      :smallGridOnStart="experiment.dragConfig.smallGridOnStart"
      :isSnapping="experiment.dragConfig.isSnapping"
      @accomplish="experiment.finishHandler"
      :updateFlag="experiment.state.number"
    ></drag>
  </div>
  <el-dialog
    title="提示"
    v-model="experiment.frameEffectAnswer.showQuestion"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div style="text-align: left">
      {{
        experiment.frameEffectQuestion[experiment.subject.group] || "组别出错"
      }}
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="experiment.handleAnswer('on')">开启</el-button>
        <el-button @click="experiment.handleAnswer('off')">不开启</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    title="提示"
    v-model="experiment.frameEffectAnswer.showQuestion2"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div style="text-align: left">
      {{
        experiment.frameEffectQuestion[experiment.subject.group] || "组别出错"
      }}
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="experiment.handleAnswer2('on')">开启</el-button>
        <el-button @click="experiment.handleAnswer2('off')">不开启</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    :show-close="false"
    :close-on-click-modal="false"
    title="请回答"
    v-model="experiment.frameEffectAnswer.showConcentrateTest"
  >
    <div style="text-align: left">
      后续拖拽任务的总数是<el-input
        v-model="experiment.frameEffectAnswer.testNum"
        style="display: inline"
      ></el-input>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="
            experiment.handleTest(
              parseInt(experiment.frameEffectAnswer.testNum)
            )
          "
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
  <!-- 数据区  -->
  <div v-if="phase == 3">
    <el-result
      icon="success"
      title="已完成完全实验"
      subTitle="请配合工作人员下载实验数据文件，感谢您的参与！"
    >
      <!-- <template #extra>
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-download"
          @click="downlaodJSON"
          >下载实验数据</el-button
        >
      </template> -->
    </el-result>
    <el-button
      type="primary"
      size="medium"
      icon="el-icon-download"
      @click="downloadJSON"
      >下载实验数据</el-button
    >

    <VueJsonPretty :data="data"></VueJsonPretty>
  </div>

  <!-- debug 区 -->
  <div class="debugger" v-if="false">
    <h3>debugger</h3>
    <el-input-number
      v-model="phase"
      :min="0"
      :max="3"
      label="步骤"
    ></el-input-number>
    <div>group: {{ experiment.subject.group }}</div>
    <div>id: {{ experiment.subject.id }}</div>
    <div>set: {{ experiment.state.set }}</div>
    <div>number: {{ experiment.state.number }}</div>
    <div>type: {{ experiment.state.type }}</div>
    <VueJsonPretty :data="experiment.data"></VueJsonPretty>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import LabForm from "../components/LabForm.vue";
import { computed, inject, watchEffect } from "@vue/runtime-core";
import Drag from "../components/Drag.vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
export default {
  components: {
    LabForm,
    Drag,
    VueJsonPretty,
  },
  data() {
    return {
      phase: 0,
      subjectForm: Object,
      showQuestion: true,
    };
  },
  methods: {
    handleForm(event) {
      this.phase = 1;
      this.subjectForm = event;
      this.experiment.subject.id = event.id;
      this.experiment.subject.group = event.group;
    },
    nextPhase() {
      this.phase++;
    },
    downloadJSON() {
      function download(filename, text) {
        var pom = document.createElement("a");
        pom.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(text)
        );
        pom.setAttribute("download", filename);
        if (document.createEvent) {
          var event = document.createEvent("MouseEvents");
          event.initEvent("click", true, true);
          pom.dispatchEvent(event);
        } else {
          pom.click();
        }
      }

      let text = JSON.stringify(this.data);
      download(
        `编号${this.subjectForm.id}${this.subjectForm.group}.json`,
        text
      );
    },
  },
  computed: {
    data() {
      this.experiment.data.subject = this.subjectForm;
      return this.experiment.data;
    },
    dataJSON() {
      return JSON.stringify(this.experiment.data);
    },
  },
  watch: {
    "example.nextPhaseFlag.value"(newValue, oldValue) {
      if (newValue) {
        this.nextPhase();
      }
    },
    "experiment.finishFlag.value"(newValue) {
      if (newValue) {
        this.nextPhase();
      }
    },
  },
  setup(props, ctx) {
    let example = useExmaple(props, ctx);
    let experiment = useExperiment(props, ctx);
    return {
      example,
      experiment,
    };
  },
  async beforeRouteLeave() {
    const answer = window.confirm(
      "离开本页会丢失当前所有实验数据，确定离开吗？"
    );
    if (!answer) return false;
  },
};

function useExmaple() {
  let description =
    "实验任务中存在两种不同的功能设置：网格吸附（后台设置，不能操作）和网格缩放（按下 左 Shift + P 网格将由大变小）。根据两种功能的开启与否，共有三种任务类型：无网格吸附、网格吸附-容易对齐（网格小）、网格吸附-较难对齐（网格大）。请根据不同的任务选择恰当的操作。";

  let titles = [
    "1. 无网格吸附任务",
    "2. 网格吸附-容易对齐任务",
    "3. 网格吸附-较难对齐任务",
  ];

  let dragConfig = reactive({
    // 初试状态，中性
    isSnapping: false,
    smallGridOnStart: false,
  });

  function gotoExample1() {
    // 捕捉 密网格
    dragConfig.isSnapping = true;
    dragConfig.smallGridOnStart = true;
    console.log(1);
  }

  function gotoExample2() {
    // 捕捉 稀疏网格
    dragConfig.isSnapping = true;
    dragConfig.smallGridOnStart = false;
    console.log(2);
  }

  let title = ref("");
  let state = ref(0);
  watchEffect(() => {
    title.value = titles[state.value];
    switch (state.value) {
      case 0:
        console.log(0);
        break;
      case 1:
        gotoExample1();
        break;
      case 2:
        gotoExample2();
        break;
      default:
        alert("测试实验状态出错");
    }
  });

  let nextPhaseFlag = ref(false);

  function exampleFinishHander() {
    if (state.value < 2) {
      state.value++;
    } else {
      nextPhaseFlag.value = true;
    }
  }

  return {
    description,
    title,
    state,
    dragConfig,
    exampleFinishHander,
    nextPhaseFlag,
  };
}

function useExperiment(props) {
  let data = reactive({
    answer: "",
    answer2: "",
    test: {
      answer: 0,
      pass: false,
    },
    "task-set-1": {
      type: "",
      data: [],
    },
    "task-set-2": {
      type: "",
      data: [],
    },
    "task-set-3": {
      type: "frame",
      data: [],
    },
  });

  let subject = reactive({
    id: "",
    group: "",
  });

  let state = reactive({
    set: 0,
    type: "neutral",
    number: 0,
  });

  let dragConfig = reactive({
    isSnapping: false,
    smallGridOnStart: false,
  });

  let frameEffectQuestion = {
    A: "接下来你将被分配新一轮的 12 个拖拽任务：其中有 33% 的概率所有的任务都是容易对齐网格的，还有 66% 的概率没有任务是容易对齐的。你想要网格吸附功能开启还是关闭？",
    B: "接下来你将被分配新一轮的 12 个拖拽任务：其中有 66% 的概率所有的任务都是较难对齐网格的，还有 33% 的概率没有任务是较难对齐的。你想要网格吸附功能开启还是关闭？",
  };

  let frameEffectAnswer = reactive({
    group: "A",
    answer: "on",
    answer2: "on",
    testNum: "",
    showQuestion: false,
    showQuestion2: false,
    showTest: false,
    passTest: false,
  });

  let finishFlag = ref(false);

  let endNum = 11;

  function finishHandler(event) {
    if (state.set == 1 && state.number == (endNum ?? 11)) {
      data[`task-set-${state.set + 1}`].data.push({
        type: snapConfigArr[state.number] == 1 ? "small" : "large",
        time: event,
        snapping: dragConfig.isSnapping,
      });
      showQuestion();
      return;
    }

    if (state.number == (endNum ?? 11)) {
      if (state.set == 2) {
        // 任务组全部结束
        data[`task-set-${state.set + 1}`].data.push({
          type: snapConfigArr[state.number] == 1 ? "small" : "large",
          time: event,
          snapping: dragConfig.isSnapping,
        });
        frameEffectAnswer.showQuestion2 = true;
      } else {
        // 一个任务组结束
        data[`task-set-${state.set + 1}`].data.push({
          type: snapConfigArr[state.number] == 1 ? "small" : "large",
          time: event,
          snapping: dragConfig.isSnapping,
        });
        alert(
          "本次实验结束，即将进行下一次实验，请休息一会，准备好了请点击确认。"
        );
        state.set++;
        state.number = 0;
        data[`task-set-${state.set + 1}`].type = state.type;
      }
    } else {
      data[`task-set-${state.set + 1}`].data.push({
        type: snapConfigArr[state.number] == 1 ? "small" : "large",
        time: event,
        snapping: dragConfig.isSnapping,
      });
      state.number++;
    }
  }

  let snapConfigArr = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0].sort(() => {
    return Math.random() > 0.5 ? 1 : -1;
  });

  console.log(snapConfigArr);

  watchEffect(() => {
    if (state.set <= 1) {
      // 第一二次实验
      let isIDOdd = subject.id % 2 != 0;

      if (isIDOdd) {
        // 奇数组，先做中性任务
        data[`task-set-1`].type = "neutral";
        data[`task-set-2`].type = "snapping";
        if (state.set == 0) {
          // 第一组中性任务
          gotoNeturalExperiment();
        } else if (state.set == 1) {
          // 第二组吸附任务
          gotoSnappingExperiment(snapConfigArr[state.number] == 1);
          console.log(snapConfigArr[state.number] == 1 ? "small" : "large");
        }
      } else {
        // 偶数组，先做网格捕捉任务

        data[`task-set-1`].type = "snapping";
        data[`task-set-2`].type = "neutral";
        if (state.set == 0) {
          // 第一组吸附任务
          gotoSnappingExperiment(snapConfigArr[state.number] == 1);
        } else if (state.set == 1) {
          // 第二组中性任务
          gotoNeturalExperiment();
        }
      }
    } else {
      gotoFrameExperiment();
    }
  });

  function gotoNeturalExperiment() {
    dragConfig.isSnapping = false;
    dragConfig.smallGridOnStart = false;
    state.type = "neutral";
  }

  function gotoSnappingExperiment(gridConfig) {
    dragConfig.isSnapping = true;
    dragConfig.smallGridOnStart = gridConfig;
    state.type = "snapping";
  }

  let frameSmallFlag = Math.random() < 0.3333333 ? true : false;

  function gotoFrameExperiment() {
    dragConfig.isSnapping = data.answer == "on" ? true : false;
    dragConfig.smallGridOnStart = frameSmallFlag;
    state.type = "frame";
  }

  function showConcentrateTest() {
    frameEffectAnswer.showConcentrateTest = true;
  }

  function handleTest(answer) {
    console.log("被试的回答是", answer);
    frameEffectAnswer.showConcentrateTest = false;
    frameEffectAnswer.passTest = answer == 12 ? true : false;
    data.test.answer = answer;
    data.test.pass = answer == 12 ? true : false;
    state.set++;
    state.number = 0;
  }

  function showQuestion() {
    frameEffectAnswer.showQuestion = true;
  }

  function handleAnswer(answer) {
    // 记录结果
    console.log("被试的选择是", answer);
    data.answer = answer;
    frameEffectAnswer.answer = answer;
    frameEffectAnswer.showQuestion = false;
    showConcentrateTest();
  }

  function handleAnswer2(answer) {
    // 记录结果
    console.log("被试的选择是", answer);
    data.answer2 = answer;
    frameEffectAnswer.answer2 = answer;
    frameEffectAnswer.showQuestion2 = false;
    finishFlag.value = true;
  }

  let type = computed(() => {
    switch (state.type) {
      case "snapping":
        return "吸附实验";
      case "neutral":
        return "中性实验";
      case "frame":
        return "框架效应实验";
      default:
        return "实验文案出错";
    }
  });

  return {
    subject,
    state,
    dragConfig,
    frameEffectQuestion,
    frameEffectAnswer,
    finishFlag,
    finishHandler,
    handleAnswer,
    handleAnswer2,
    handleTest,
    data,
    type,
  };
}
</script>

<style lang="scss" scoped>
.example {
  text-align: left;
  em {
    font-weight: 900;
    // border-bottom: solid 8px #7ebf50;
    box-shadow: 0 -7px 0 #7ebf50 inset;
    // text-decoration: underline 6px #7ebf50;
  }
  p {
    margin: 0 1rem 1.5rem 1rem;
    line-height: 150%;
  }
}

.debugger {
  position: fixed;
  bottom: 16px;
  left: 16px;
  background-color: white;
  box-shadow: 0px 10px 20px rgba($color: #000, $alpha: 0.2);
  padding: 16px;
  border-radius: 8px;
  text-align: left;
  width: 300px;
}

.task-set {
  text-align: left;
}
</style>