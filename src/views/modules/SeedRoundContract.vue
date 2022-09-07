<template>
  <div class="SeedRoundContract">
    <div>{{ msg }}</div>
    <div class="SeedRoundContract-Box">
      <p class="SeedRoundContract-Box-first">
        <span>首次释放(20%) :</span>
        <el-input v-model="firstNum" disabled></el-input>
        <el-button type="primary" plain @click="beginFirst" :disabled="status">{{
          contentFirst
        }}</el-button>
        <span>本地时间 :</span>
        <el-input v-model="firstTime" disabled></el-input>
      </p>
      <el-divider></el-divider>
      <p class="SeedRoundContract-Box-month">
        <span>每月释放 :</span>
        <el-input v-model="monthNum" disabled></el-input>
        <el-button type="primary" plain disabled>{{ contentMonth }}</el-button>
        <span>总计 :</span>
        <el-button
          class="SeedRoundContract-Box-month-Btn"
          type="info"
          disabled
          >{{ total }}</el-button
        >
        <span>本地时间 :</span>
        <el-input
          autosize
          class="SeedRoundContract-Box-month-textarea"
          type="textarea"
          disabled
          v-model="monthTime"
        ></el-input>
      </p>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers"; //引入ethers.js
// import Web3Modal from "web3modal"; //引入Web3Modal
// SeedRound合约
import SeedRound from "../../abi/SeedRound.json"; // 引入abi
const seedRoundaddress = "0xeE160E90EE5fD40D352ea693D8eFf7e1687C8166";
export default {
  name: "SeedRoundContract",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      msg: "Welcome to Your Seed Round Contract Page",
      firstNum: "", // 首次释放数量
      monthNum: "", // 每月释放数量
      total: 0, // 每月释放总量
      contentFirst: "开始", // 按钮里显示的内容
      totalTime1: 46, //记录具体倒计时时间
      contentMonth: "倒计时", // 按钮里显示的内容
      totalTime2: 51, //记录具体倒计时时间
      canClick: true, //添加canClick
      count: 12, // 循环的释放次数
      url: "http://8080", // 转账网络
      privateKey:
        "私钥地址", // 转账私钥
      firstTime: "", // 首次释放得到返回值的时间
      monthTime: "", // 每月释放得到返回值的时间
      status:false, // 开始按钮的禁用状态
    };
  },
  // 方法
  methods: {
    // 首次释放
    async firstRelease() {
      // const web3Modal = new Web3Modal({
      //   network: "mainnet",
      //   cacheProvider: true,
      // });
      // const connection = await web3Modal.connect();
      // const provider = new ethers.providers.Web3Provider(connection);
      // const signer = provider.getSigner();

      // const SeedRoundContract = new ethers.Contract(
      //   seedRoundaddress,
      //   SeedRound.abi,
      //   signer
      // );
      let overrides = {
        gasLimit: 2100000,
        gasPrice: 8000000000,
      };

      //私钥签署
      var provider = new ethers.providers.JsonRpcProvider(this.url);
      const wallet = new ethers.Wallet(this.privateKey, provider);
      //定义合约
      const SeedRoundContract = new ethers.Contract(
        seedRoundaddress,
        SeedRound.abi,
        wallet
      );
      // 调用智能合约获取首次释放
      let transaction = await SeedRoundContract.requestReleaseAll(overrides);
      console.log(transaction);
      let data = await transaction.wait();
      console.log(data);
      console.log(data.events[1].args[0].toNumber());
      if (data) {
        this.firstNum = data.events[1].args[0].toNumber() / 1000000000;
        var myDate = new Date();
        this.firstTime = myDate.toLocaleTimeString();
        console.log(this.firstTime);
        this.status = true; // 禁用开始按钮
      }
    },

    // 每月释放
    async monthRelease() {
      // const web3Modal = new Web3Modal({
      //   network: "mainnet",
      //   cacheProvider: true,
      // });
      // const connection = await web3Modal.connect();
      // const provider = new ethers.providers.Web3Provider(connection);
      // const signer = provider.getSigner();

      // const SeedRoundContract = new ethers.Contract(
      //   seedRoundaddress,
      //   SeedRound.abi,
      //   signer
      // );
      //私钥签署
      let overrides = {
        gasLimit: 2100000,
        gasPrice: 8000000000,
      };
      var provider = new ethers.providers.JsonRpcProvider(this.url);
      const wallet = new ethers.Wallet(this.privateKey, provider);
      //定义合约
      const SeedRoundContract = new ethers.Contract(
        seedRoundaddress,
        SeedRound.abi,
        wallet
      );
      // 调用智能合约获取每月一次释放
      let transaction = await SeedRoundContract.requestReleaseAll(overrides);
      console.log(transaction);
      let data = await transaction.wait();
      console.log(data);
      if (data) {
        this.monthNum += data.events[1].args[0].toNumber() / 1000000000 + " ";
        this.total += data.events[1].args[0].toNumber() / 1000000000;
        var myDate = new Date();
        this.monthTime += myDate.toLocaleTimeString() + " ";
        console.log(this.monthTime);
      }
    },

    // 开始倒计时
    async beginFirst() {
      // 调用函数获取首次释放
      this.firstRelease();
      this.contentFirst = "开始";
      this.clock = window.setInterval(() => {
        this.totalTime1--;
        this.contentFirst = this.totalTime1 + "秒";
        if (this.totalTime1 < 0) {
          //当倒计时小于0时清除定时器
          window.clearInterval(this.clock);
          this.contentFirst = "开始";
          this.totalTime1 = 101;
          this.times();
        }
      }, 1000);
    },
    //计时器
    times() {
      this.contentMonth = "倒计时";
      this.clock2 = window.setInterval(() => {
        this.totalTime2--;
        this.contentMonth = this.totalTime2 + "秒";
        if (this.totalTime2 < 0) {
          // 调用函数获取每月释放
          this.monthRelease();
          this.contentMonth = "倒计时";
          this.totalTime2 = 51;
          this.count--;
          if (this.count == 0) {
            //当计数等于0时清除定时器
            window.clearInterval(this.clock2);
            this.status = false;// 解开开始按钮
          }
        }
      }, 1000);
    },
  },
  // 创建后
  created() {},
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
  // 销毁前
  beforeDestroy() {
    // 清除定时器
    if (this.clock || this.clock2) {
      window.clearInterval(this.clock);
      window.clearInterval(this.clock2);
    }
  },
};
</script>

<style lang="less" scoped>
.SeedRoundContract-Box {
  width: 100%;
  height: 100%;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  .SeedRoundContract-Box-first {
    display: flex;
    align-items: center;
    .el-input {
      width: 10rem;
      margin: 0 1rem;
    }
    .el-button {
      width: 5rem;
      margin-right: 1rem;
    }
  }
  .SeedRoundContract-Box-month {
    display: flex;
    align-items: center;
    .el-input {
      width: 20rem;
      margin: 0 1rem;
    }
    .el-button {
      width: 5rem;
      margin-right: 1rem;
    }
    .SeedRoundContract-Box-month-textarea {
      width: 20rem;
      margin-left: 1rem;
    }
    .SeedRoundContract-Box-month-Btn {
      width: 4rem;
      height: 2.5rem;
      margin-left: 1rem;
    }
  }
}
</style>
