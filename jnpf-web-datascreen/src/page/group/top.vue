<template>
  <div class="top-nav">
    <div class="logo">
      <img src="@/assets/logo.png" alt="JNPF开发平台" />
      <span> · 大屏设计</span>
    </div>

    <el-menu
      class="nav"
      mode="horizontal"
      background-color="#050607"
      text-color="#fff"
      active-text-color="#050607"
      @mousedown="contain.handleMouseDown"
    >
      <el-submenu
        class="nav-tools"
        :index="index + ''"
        v-for="(item, index) in baseList"
        :key="index"
      >
        <template slot="title">
          <div class="icon-txt">
            <img :src="item.picUrl" alt="" />
            <label>{{ item.label }}</label>
          </div>
        </template>
        <!--sub menu-->
        <div class="tools-sub">
          <el-menu-item
            v-for="(citem, cindex) in item.children"
            @click="handleAdd(citem.option, true)"
            :key="cindex"
            class="menu-inline"
            :index="`${index}-${cindex}`"
          >
            <div class="usehove">
              <img :src="citem.option.img" class="inside-img" />
              <div class="bottom-text">{{ citem.label }}</div>
            </div>
          </el-menu-item>
        </div>
      </el-submenu>
    </el-menu>
    <div class="options">
      <div class="item" @click="handleReset" v-show="!contain.menuFlag">
        <img src="@/assets/back.png" alt="" />
        <span>返回</span>
      </div>
      <div class="item" @click="handleView" v-show="contain.menuFlag">
        <img src="@/assets/preview.png" alt="" />
        <span>预览</span>
      </div>
      <div class="item" @click="handleBuild">
        <img src="@/assets/save.png" alt="" />
        <span>保存</span>
      </div>

      <div class="item" @click="handleExit">
        <img src="@/assets/exit.png" alt="" />
        <span>关闭</span>
      </div>
    </div>
  </div>
</template>

<script>
import { uuid } from "@/utils/utils";
import baseList from "@/option/base";
import { updateDataV, savaScreenShot, createDataV } from "@/api/dataV";
import { getUrlParam } from '@/utils/utils'

export default {
  inject: ["contain"],
  data() {
    return {
      baseList: baseList,
    };
  },
  methods: {
    vaildData(id) {
      const list = [];
      for (var i = 0; i < 20; i++) {
        list.push(i + "");
      }
      return list.includes(id);
    },
    handleView() {
      this.contain.menuFlag = false;
      this.contain.handleInitActive();
      // this.contain.setScale(document.body.clientWidth);
    },
    handleReset() {
      this.contain.menuFlag = true;
      this.contain.setScale(this.contain.contentWidth);
    },
    // 退出
    handleExit() {
      window.parent.postMessage("closeDialog", "*");
    },
    handleBuild() {
      this.contain.handleInitActive();
      if (this.contain.fullName && this.contain.categoryId) {
        const loading = this.$loading({
          lock: true,
          text: "正在保存配置，请稍后",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });

        this.$nextTick(() => {
          html2canvas(document.getElementById("content"), {
            useCORS: true,
            backgroundColor: null,
            allowTaint: true,
          }).then((canvas) => {
            function dataURLtoFile(dataurl, filename) {
              let arr = dataurl.split(","),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              return new File([u8arr], filename, { type: mime });
            }

            let file = dataURLtoFile(
              canvas.toDataURL("image/jpeg", 0.1),
              new Date().getTime() + ".jpg"
            );
            let formdata = new FormData();
            formdata.append("file", file);
            let dataId = getUrlParam('id');
            savaScreenShot(formdata)
              .then((res) => {
                const data = res.data;
                const screenShotName = data.fileName;
                const formdata = {
                  id: dataId,
                  fullName: this.contain.fullName,
                  categoryId: this.contain.categoryId,
                  enabledMark: this.contain.enabledMark,
                  detail: JSON.stringify(this.contain.config),
                  component: JSON.stringify(this.contain.nav),
                  screenShot: screenShotName,
                };
                if (dataId) {
                  return updateDataV(formdata, dataId);
                } else {
                  createDataV(formdata).then((res) => {
                    this.contain.id = res.data.id;
                  });
                }
                // return updateComponent(formdata);
              })
              .then(() => {
                loading.close();
                this.$confirm("保存成功大屏配置, 是否打开预览?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                  .then(() => {
                    let routeUrl = this.$router.resolve({
                      path: "/view/" + this.contain.id + "?token="+ getUrlParam('token')
                    });
                    window.open(routeUrl.href, "_blank");
                  })
                  .catch(() => {
                    loading.close();
                    window.parent.postMessage("closeDialog", "*");
                  });
              })
              .catch(() => {
                loading.close();
              });
          });
        });
      } else {
        this.$message.error("大屏名称和分类必填！");
      }
    },
    handleAdd(option, first = false) {
      let obj = this.deepClone(option);
      obj.left = 0;
      obj.top = 0;
      obj.index = uuid();
      if (first) {
        this.contain.nav.unshift(obj);
      } else {
        this.contain.nav.push(obj);
      }
    },
  },
};
</script>

<style lang='scss'>
.top-nav {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: #050607;

  .logo {
    width: 210px;
    display: flex;
    align-items: center;
    span {
      font-size: 18px;
      color: #fff;
    }
  }
  .options {
    display: flex;
    flex: 0 0 1;
    text-align: right;
    color: #fff;
    .item {
      display: inline-block;
      width: 70px;
      height: 60px;
      text-align: center;
      font-size: 0;
      img {
        width: 28px;
        height: 28px;
        margin-top: 6px;
      }
      span {
        display: inline-block;
        width: 100%;
        font-size: 12px;
        height: 20px;
      }
    }
    .item:hover {
      cursor: pointer;
      background-color: #409eff;
    }
  }
  .nav {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 0 !important;
    height: 60px;
    overflow: hidden;
    .nav-tools {
      color: #fff;
      vertical-align: middle;
      .icon-txt {
        display: inline-flex;
        flex-direction: column;
        width: 30px;
        height: 52px;
        padding-top: 6px;
        text-align: center;
        line-height: normal;
        img {
          display: inline;
          overflow: hidden;
          clear: both;
        }
        label {
          display: inline;
          line-height: 14px;
          font-size: 10px;
          color: #fff !important;
        }
      }
      .el-menu--popup-bottom-start {
        background-color: #fff !important;
      }
    }
  }
  .nav__icon {
    margin-right: 5px;
  }
  .nav .el-submenu .el-submenu__title,
  .nav .el-menu-item {
    height: 60px;
    font-size: 12px;
  }

  .el-menu-item {
    height: 100px !important;
  }
}

.el-menu--horizontal {
  .tools-sub {
    width: 360px;
    padding-top: 10px;
  }
  .el-menu {
    background-color: #fff !important;
    .el-menu-item {
      background-color: #fff !important;
    }
  }
  .menu-inline {
    text-align: center;
    display: inline-block !important;
    background-color: #fff !important;
  }
  .bottom-text {
    color: #b1b1b1;
    line-height: 20px;
    padding: 2px 0 6px 0;
    font-size: 12px;
    overflow: hidden;
  }
  .inside-img {
    width: 70px;
    height: 50px;
    border: 2px solid #f2f6fc;
    box-sizing: border-box;
  }
  .inside-img:hover {
    border-color: #006eff;
  }
  .usehove:hover {
    .bottom-text {
      color: #333;
    }
  }
}
</style>
