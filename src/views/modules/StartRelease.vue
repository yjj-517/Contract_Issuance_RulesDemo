<template>
  <div class="StartRelease">
    <div>{{ msg }}</div>
    <div class="StartRelease-btn">
      <p class="StartRelease-btn-seed">
        <el-button
          class="StartRelease-btn-seed-begin"
          type="primary"
          round
          @click="beginSeed"
          >开始释放种子轮合约</el-button
        >
        <el-button type="success" round @click="clearSeed">清除</el-button>
        <el-button type="warning" @click="phaseTrigger">触发释放</el-button>
      </p>
      <p class="StartRelease-Box-Recharge">
        <span>账户地址</span>
        <el-input
          clearable
          v-model="Raddress"
          class="StartRelease-Box-Recharge-addr"
        ></el-input>
        <span>数量</span>
        <el-input clearable v-model="Rnumber"></el-input>
        <el-button type="primary" round @click="rechargeS" plain>确认充值</el-button>
      </p>
      <p class="StartRelease-btn-active">
        <span>账户地址</span>
        <el-input type="primary" v-model="seedAddress" clearable></el-input>
        <el-button type="success" @click="activeRelease" plain>{{
          content
        }}</el-button>
      </p>
      <p class="StartRelease-btn-first">
        <span>首次释放:</span>
        <el-input v-model="firstNum" disabled></el-input>
        <span>本地时间:</span>
        <el-input v-model="firstTime" disabled></el-input>
      </p>
      <p class="StartRelease-btn-month">
        <span>每月释放:</span>
        <el-input v-model="monthNum" disabled></el-input>
        <span>总计:</span>
        <el-button type="info" disabled>{{ total }}</el-button>
        <span>本地时间:</span>
        <el-input
          class="StartRelease-btn-month-textarea"
          autosize
          type="textarea"
          disabled
          v-model="monthTime"
        ></el-input>
      </p>
      <el-divider></el-divider>
      <p>
        <el-button
          class="StartRelease-btn-begin"
          type="primary"
          round
          @click="beginPrivate"
          >开始释放私募合约</el-button
        >
        <el-button type="success" round @click="clearPrivate">清除</el-button>
      </p>
      <p class="StartRelease-Box-RechargePrivate">
        <span>账户地址</span>
        <el-input
          clearable
          v-model="Faddress"
          class="StartRelease-Box-RechargePrivate-addr"
        ></el-input>
        <span>数量</span>
        <el-input clearable v-model="Fnumber"></el-input>
        <el-button type="primary" round @click="rechargeF" plain>确认充值</el-button>
      </p>
      <el-divider></el-divider>
      <p>
        <el-button
          class="StartRelease-btn-begin"
          type="primary"
          round
          @click="beginTeam"
          >开始释放团队合约</el-button
        >
        <el-button type="success" round @click="clearTeam">清除</el-button>
      </p>
      <p class="StartRelease-Box-RechargeTeam">
        <span>账户地址</span>
        <el-input
          clearable
          v-model="Taddress"
          class="StartRelease-Box-RechargeTeam-addr"
        ></el-input>
        <span>数量</span>
        <el-input clearable v-model="Tnumber"></el-input>
        <el-button type="primary" round @click="rechargeT" plain>确认充值</el-button>
      </p>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers"; //引入ethers.js
import Web3Modal from "web3modal"; //引入Web3Modal
// SeedRound合约
import SeedRound from "../../abi/SeedRound.json"; // 引入abi
const seedRoundaddress = "0xeE160E90EE5fD40D352ea693D8eFf7e1687C8166";
// PrivateEquity合约
import PrivateEquity from "../../abi/PrivateEquity.json"; // 引入abi
const privateEquityaddress = "0x3a341B4AB6aF4De71e044e587BD17713f09Fd949";
// Team合约
import Team from "../../abi/Team.json"; // 引入abi
const teamaddress = "0xFdBC33b895Bf4122BD93d1e7aCb663E696327Ef2";

export default {
  name: "StartRelease",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      msg: "Welcome to Your Start Release Page",
      Raddress: "", // 种子轮投资者账户地址
      Faddress: "", // 私募投资者账户地址
      Taddress: "", // 团队投资者账户地址
      Rnumber: "", // 种子轮投资数量
      Fnumber: "", // 私募投资数量
      Tnumber: "", // 团队投资数量
      seedAddress: "", // 种子轮指定账户
      firstNum: "", // 首次释放数量
      firstTime: "", // 首次释放得到返回值的时间
      monthNum: "", // 每月释放数量
      monthTime: "", // 每月释放得到返回值的时间
      count: 12, // 循环的释放次数
      totalTime: 46, //记录具体倒计时时间
      // totalTimeM: 51, //记录每月具体倒计时时间
      content: "主动释放开始", // 按钮里显示的内容
      url: "http://8080", // 转账网络
      privateKey:
        "私钥地址", // 转账私钥
      total: 0, // 每月释放量总计
    };
  },
  // 方法
  methods: {
    // 开始释放种子轮合约
    async beginSeed() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const SeedRoundContract = new ethers.Contract(
        seedRoundaddress,
        SeedRound.abi,
        signer
      );
      // 调用智能合约开始计时(释放)
      let transaction = await SeedRoundContract.setClockStart();
      let data = await transaction.wait();
      console.log(data);
      if (data) {
        var myDate = new Date();
        var mytime = myDate.toLocaleTimeString();
        console.log(mytime);
        // 调用主动释放开始函数
        this.activeRelease();
      }
      // if (data) {
      //   setTimeout(() => {
      //     // 去种子轮合约页面
      //     this.$router.push("/index/SeedRoundContract");
      //   }, 5000);
      // }
    },
    // 清除种子轮合约的计时
    async clearSeed() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const SeedRoundContract = new ethers.Contract(
        seedRoundaddress,
        SeedRound.abi,
        signer
      );
      // 调用智能合约清除计时(释放)
      let transaction = await SeedRoundContract.testResetInvest();
      let data = await transaction.wait();
      console.log(data);
    },

    // 确认充值(种子轮)
    async rechargeS() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const SeedRoundContract = new ethers.Contract(
        seedRoundaddress,
        SeedRound.abi,
        signer
      );
      // 设置投资者(种子轮)
      let transaction = await SeedRoundContract.setInvestor(
        this.Raddress,
        this.Rnumber
      );
      console.log(transaction);
      let data = transaction.wait();
      console.log(data);
      // 清空
      this.Raddress = "";
      this.Rnumber = "";
    },

    // 主动释放(种子轮)
    async activeRelease() {
      if (this.seedAddress) {
        // 合约附加信息
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
        // 调用智能合约主动释放
        let transactionF = await SeedRoundContract.ownerRequestReleaseTo(
          this.seedAddress,
          overrides
        );
        let dataF = await transactionF.wait();
        console.log(dataF);
        if (dataF) {
          this.firstNum = dataF.events[1].args[0].toNumber() / 1000000000;
          var myDate = new Date();
          this.firstTime = myDate.toLocaleTimeString();
          console.log(this.firstTime);
        }
        this.content = "首次释放开始";
        this.clock1 = window.setInterval(async () => {
          this.totalTime--;
          this.content = this.totalTime + "秒";
          if (this.totalTime < 0) {
            this.content = "每月释放开始";
            this.totalTime = 51;
            //当时间小于0时清除定时器
            window.clearInterval(this.clock1);
            this.timer(); // 调用每月释放计时器
          }
        }, 1000);
      } else {
        this.$message({
          showClose: true,
          message: "请先输入投资者账户地址",
          type: "warning",
        });
      }
    },

    // 每月释放计时器(种子轮)
    async timer() {
      // 合约附加信息
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
      this.content = "每月释放开始";
      this.clock2 = window.setInterval(async () => {
        this.totalTime--;
        this.content = this.totalTime + "秒";
        if (this.totalTime < 0) {
          this.content = "每月释放开始";
          this.totalTime = 51;
          this.count--;
          // 调用智能合约主动释放
          let transactionM = await SeedRoundContract.ownerRequestReleaseTo(
            this.seedAddress,
            overrides
          );
          let dataM = await transactionM.wait();
          console.log(dataM);
          if (dataM) {
            this.monthNum +=
              dataM.events[1].args[0].toNumber() / 1000000000 + " ";
            this.total += dataM.events[1].args[0].toNumber() / 1000000000;
            var myDate = new Date();
            this.monthTime += myDate.toLocaleTimeString() + " ";
            console.log(this.monthTime);
          }
          if (this.count == 0) {
            //当计数等于0时清除定时器
            window.clearInterval(this.clock2);
            this.content = "主动释放开始";
            this.totalTime = 46;
          }
        }
      }, 1000);
    },

    // 阶段触发
    async phaseTrigger() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const SeedRoundContract = new ethers.Contract(
        seedRoundaddress,
        SeedRound.abi,
        signer
      );
      // 调用智能合约阶段触发
      let transaction = await SeedRoundContract.checkReleasePhase({});
      let data = await transaction.wait();
      console.log(data);
    },

    // ——————————————————————————————————————————————————————————————————————————

    // 开始释放私募合约
    async beginPrivate() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const PrivateEquityContract = new ethers.Contract(
        privateEquityaddress,
        PrivateEquity.abi,
        signer
      );
      // 调用智能合约开始计时(释放)
      let transaction = await PrivateEquityContract.setClockStart();
      let data = await transaction.wait();
      console.log(data);
    },
    // 清除私募合约的计时
    async clearPrivate() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const PrivateEquityContract = new ethers.Contract(
        privateEquityaddress,
        PrivateEquity.abi,
        signer
      );
      // 调用智能合约清除计时(释放)
      let transaction = await PrivateEquityContract.testResetInvest();
      let data = await transaction.wait();
      console.log(data);
    },

    // 确认充值(私募)
    async rechargeF() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const PrivateEquityContract = new ethers.Contract(
        privateEquityaddress,
        PrivateEquity.abi,
        signer
      );
      // 设置投资者(种子轮)
      let transaction = await PrivateEquityContract.setInvestor(
        this.Faddress,
        this.Fnumber
      );
      console.log(transaction);
      let data = transaction.wait();
      console.log(data);
      // 清空
      this.Faddress = "";
      this.Fnumber = "";
    },

    // ——————————————————————————————————————————————————————————————————————————

    // 开始释放团队合约
    async beginTeam() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const TeamContract = new ethers.Contract(teamaddress, Team.abi, signer);
      // 调用智能合约开始计时(释放)
      let transaction = await TeamContract.setClockStart();
      let data = await transaction.wait();
      console.log(data);
    },

    // 清除团队合约的计时
    async clearTeam() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const TeamContract = new ethers.Contract(teamaddress, Team.abi, signer);
      // 调用智能合约清除计时(释放)
      let transaction = await TeamContract.testResetInvest();
      let data = await transaction.wait();
      console.log(data);
    },

    // 确认充值(团队)
    async rechargeT() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const TeamContract = new ethers.Contract(teamaddress, Team.abi, signer);
      // 设置投资者(种子轮)
      let transaction = await TeamContract.setInvestor(
        this.Taddress,
        this.Tnumber
      );
      console.log(transaction);
      let data = transaction.wait();
      console.log(data);
      // 清空
      this.Taddress = "";
      this.Tnumber = "";
    },
  },
  // 创建后
  created() {},
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
};
</script>

<style lang="less" scoped>
.StartRelease-btn {
  margin-top: 2rem;
  .StartRelease-btn-seed {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    .StartRelease-btn-seed-begin {
      width: 10rem;
    }
  }
  .StartRelease-Box-Recharge {
    display: flex;
    align-items: center;
    span {
      padding-right: 1rem;
    }
    .el-input {
      width: 6rem;
      margin-right: 1rem;
    }
    .StartRelease-Box-Recharge-addr {
      width: 20rem;
    }
  }
  .StartRelease-btn-active {
    margin-top: 2rem;
    .el-input {
      width: 22rem;
      margin: 0 1rem;
    }
  }
  .StartRelease-btn-first {
    display: flex;
    align-items: center;
    margin: 1rem 0;
    span {
      padding-right: 1rem;
    }
    .el-input {
      width: 10rem;
      padding-right: 1rem;
    }
  }
  .StartRelease-btn-month {
    display: flex;
    align-items: center;
    margin: 1rem 0;
    span {
      padding-right: 1rem;
    }
    .el-input {
      width: 22rem;
      padding-right: 1rem;
    }
    .el-button {
      margin-right: 1rem;
      width: 4rem;
    }
    .StartRelease-btn-month-textarea {
      width: 20rem;
    }
  }
  .StartRelease-Box-RechargePrivate {
    display: flex;
    align-items: center;
    margin-top: 2rem;
    span {
      padding-right: 1rem;
    }
    .el-input {
      width: 6rem;
      margin-right: 1rem;
    }
    .StartRelease-Box-RechargePrivate-addr {
      width: 20rem;
    }
  }
  .StartRelease-Box-RechargeTeam {
    display: flex;
    align-items: center;
    margin-top: 2rem;
    span {
      padding-right: 1rem;
    }
    .el-input {
      width: 6rem;
      margin-right: 1rem;
    }
    .StartRelease-Box-RechargeTeam-addr {
      width: 20rem;
    }
  }
}
</style>
