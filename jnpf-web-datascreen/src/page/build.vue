<template>
  <div class="build">
    <imglist ref="imglist" @change="handleSetimg"></imglist>
    <top ref="top"></top>
    <div class="app" :class="{ 'app--none': !menuFlag }">
      <div
        class="menu layout-sider"
        v-show="menuFlag"
        @click.self="handleMouseDown"
      >
        <p class="title">
          <img src="@/assets/layer.png" alt="" />
          <span>图层</span>
        </p>
        <layer ref="layer" :nav="nav"></layer>
      </div>
      <!-- 中间区域 -->
      <div class="wrapper" :style="wrapperHight" id="wrapper" ref="wrapper">
        <img
          :src="isShowReferLine ? imgOpenData : imgClose"
          class="refer-line-img"
          @click="imgClick"
        />
        <SketchRule
          :thick="thick"
          :scale="scale"
          :width="width"
          :height="height"
          :startX="startX"
          :startY="startY"
          :isShowReferLine="isShowReferLine"
          :palette="palette"
          :shadow="shadow"
          :horLineArr="lines.h"
          :verLineArr="lines.v"
        />
        <div
          ref="screensRef"
          id="screens"
          :class="dragSlide ? 'dragghanle' : ''"
          @mousedown.stop="dragMousedown"
          @mouseup="dragMouseup"
          @mousemove="dragMousemove"
          @wheel="handleWheel"
          @scroll="handleScroll"
        >
          <div ref="containerRef" class="screen-container">
            <div id="canvas" ref="canvas" :style="canvasStyle">
              <container ref="container" :wscale="scale"></container>
            </div>
          </div>
        </div>
      </div>
      <div class="menu params" v-show="menuFlag">
        <p class="title">
          <img src="@/assets/opration.png" alt="" />
          <span>操作</span>
        </p>
        <el-tabs class="tabs" stretch v-model="tabsActive">
          <el-tab-pane name="0">
            <span slot="label">配置</span>
            <el-form label-width="120px" label-position="left" size="small">
              <!-- 组件配置 -->
              <template v-if="!vaildProp('', [undefined])">
                <p class="title">{{ activeObj.title }}</p>
                <el-form-item label="图层名称">
                  <avue-input v-model="activeObj.name"></avue-input>
                </el-form-item>
                <el-form-item label="隐藏">
                  <avue-switch v-model="activeObj.display"></avue-switch>
                </el-form-item>
                <template v-if="vaildProp('colorList')">
                  <el-form-item label="系统配色">
                    <avue-switch
                      v-model="activeOption.switchTheme"
                    ></avue-switch>
                  </el-form-item>
                  <el-form-item
                    label="配色选择"
                    v-if="activeOption.switchTheme"
                  >
                    <avue-select
                      v-model="activeOption.theme"
                      :dic="dicOption.themeList"
                    >
                    </avue-select>
                  </el-form-item>
                </template>
                <component :is="activeComponent.prop + 'Option'"></component>
                <main-option></main-option>
              </template>
              <!-- 多选配置选项 -->
              <template v-else-if="isSelectActive">
                <el-form-item label="水平方式">
                  <el-tooltip content="左对齐" placement="top">
                    <i
                      class="el-icon-s-fold icon"
                      @click="$refs.container.handlePostionSelect('left')"
                    ></i>
                  </el-tooltip>
                  <el-tooltip content="居中对齐" placement="top">
                    <i
                      class="el-icon-s-operation icon"
                      @click="$refs.container.handlePostionSelect('center')"
                    ></i>
                  </el-tooltip>
                  <el-tooltip content="右对齐" placement="top">
                    <i
                      class="el-icon-s-unfold icon"
                      @click="$refs.container.handlePostionSelect('right')"
                    ></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="垂直方式">
                  <el-tooltip content="顶对齐" placement="top">
                    <i
                      class="el-icon-s-fold icon"
                      @click="$refs.container.handlePostionSelect('top')"
                    ></i>
                  </el-tooltip>
                  <el-tooltip content="中部对齐" placement="top">
                    <i
                      class="el-icon-s-operation icon"
                      @click="$refs.container.handlePostionSelect('middle')"
                    ></i>
                  </el-tooltip>
                  <el-tooltip content="底对齐" placement="top">
                    <i
                      class="el-icon-s-unfold icon"
                      @click="$refs.container.handlePostionSelect('bottom')"
                    ></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button
                    type="primary"
                    size="mini"
                    class="block"
                    @click="handleDeleteSelect"
                    >删除</el-button
                  >
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button
                    type="danger"
                    size="mini"
                    class="block"
                    @click="handleFloder"
                    >成组</el-button
                  >
                </el-form-item>
              </template>
              <!-- 主屏的配置项 -->
              <template v-else>
                <el-form-item label="大屏名称" :rules="[{ required: true }]">
                  <avue-input v-model="fullName" />
                </el-form-item>
                <el-form-item label="大屏分类" :rules="[{ required: true }]">
                  <avue-select
                    v-model="categoryId"
                    placeholder="请选择"
                    type="tree"
                    :props="apitProps"
                    :dic="categoryList"
                  />
                </el-form-item>
                <el-form-item label="大屏宽度">
                  <avue-input-number v-model="config.width" />
                </el-form-item>
                <el-form-item label="大屏高度">
                  <avue-input-number v-model="config.height" />
                </el-form-item>
                <el-form-item label="大屏状态">
                  <el-switch
                    v-model="enabledMark"
                    :active-value="1"
                    :inactive-value="0"
                  >
                  </el-switch>
                </el-form-item>
                <el-form-item label="大屏简介">
                  <avue-input
                    v-model="config.info"
                    type="textarea"
                    :min-rows="5"
                  ></avue-input>
                </el-form-item>
                <el-form-item label="背景颜色">
                  <avue-input-color
                    v-model="config.backgroundColor"
                  ></avue-input-color>
                </el-form-item>
                <el-form-item label="背景图片" prop="config.backgroundImage">
                  <img
                    :src="
                      define.comUploadUrl +
                      'bg/' +
                      config.backgroundImage
                    "
                    @click="handleOpenImg('config.backgroundImage', 'bg')"
                    alt=""
                    width="100%"
                    style="height: 100px"
                  />
                </el-form-item>
                <el-form-item label="缩放">
                  <el-slider
                    v-model="config.scale"
                    :max="200"
                    :format-tooltip="formatTooltip"
                  />
                </el-form-item>
              </template>
            </el-form>
          </el-tab-pane>
          <!-- 数据配置 -->
          <el-tab-pane name="1" v-if="vaildProp('dataList')">
            <span slot="label">数据</span>
            <el-form label-width="120px" label-position="left" size="mini">
              <el-form-item label="数据类型" style="display: none">
                <avue-radio
                  v-model="activeObj.dataType"
                  :dic="dicOption.dataType"
                ></avue-radio>
              </el-form-item>

              <el-form-item label="数据接口">
                <avue-input-tree
                  default-expand-all
                  :props="apitProps"
                  v-model="activeObj.dataInterfaceId"
                  :dic="dataInterface"
                  placeholder="请选择接口"
                  type="tree"
                  :node-click="handleApiSelect"
                  node-key="id"
                />
              </el-form-item>
              <el-form-item label="数据值" label-position="top">
                <el-button size="mini" type="primary" @click="openCode('data')"
                  >编辑</el-button
                >
              </el-form-item>
              <el-form-item label="接口地址" style="display: none">
                <avue-input
                  type="textarea"
                  :min-rows="6"
                  v-model="activeObj.url"
                ></avue-input>
              </el-form-item>
              <template v-if="activeObj.dataType === 1" style="display: none">
                <el-form-item label="接口方式">
                  <avue-radio
                    v-model="activeObj.dataMethod"
                    :dic="dicOption.dataMethod"
                  ></avue-radio>
                </el-form-item>
                <el-form-item label="接口参数">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="openCode('dataQuery')"
                    >编辑</el-button
                  >
                </el-form-item>
              </template>
              <el-form-item label="刷新时间">
                <avue-input-number v-model="activeObj.time"></avue-input-number>
              </el-form-item>
              <el-form-item label="数据处理" v-if="activeObj.dataType === 1">
                <el-button
                  size="mini"
                  type="primary"
                  @click="openCode('dataFormatter')"
                  >编辑</el-button
                >
              </el-form-item>
              <el-form-item label-width="0">
                <el-button
                  size="mini"
                  type="primary"
                  class="block"
                  @click="handleRefresh"
                  >刷新
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 交互事件配置 -->
          <el-tab-pane name="2" v-if="vaildProp('eventList')">
            <span slot="label">交互</span>
            <el-form label-width="120px" label-position="left" size="mini">
              <el-form-item label="子类">
                <avue-select
                  multiple
                  v-model="activeObj.child.index"
                  :dic="childList"
                  :props="childProps"
                >
                </avue-select>
              </el-form-item>
              <el-form-item label="参数名称">
                <avue-input v-model="activeObj.child.paramName"></avue-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 其他事件配置 -->
          <el-tab-pane name="3" v-if="vaildProp('formatterList')">
            <span slot="label">事件</span>
            <el-form label-width="120px" label-position="left" size="mini">
              <el-form-item label="提示事件">
                <el-button
                  size="mini"
                  type="primary"
                  @click="openCode('formatter')"
                  >编辑</el-button
                >
              </el-form-item>
              <el-form-item
                label="点击事件"
                v-if="vaildProp('clickFormatterList')"
              >
                <el-button
                  size="mini"
                  type="primary"
                  @click="openCode('clickFormatter')"
                  >编辑</el-button
                >
              </el-form-item>
              <el-form-item
                label="标题事件"
                v-if="vaildProp('labelFormatterList')"
              >
                <el-button
                  size="mini"
                  type="primary"
                  @click="openCode('labelFormatter')"
                  >编辑</el-button
                >
              </el-form-item>
              <el-form-item label-width="0">
                <el-button
                  size="mini"
                  type="primary"
                  class="block"
                  @click="handleRefresh"
                  >刷新</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 基本参数配置 -->
          <el-tab-pane name="4" v-if="isActive">
            <span slot="label">参数</span>
            <el-form label-width="120px" label-position="left" size="mini">
              <el-form-item label="序号">
                <avue-input v-model="activeObj.index" disabled></avue-input>
              </el-form-item>
              <el-form-item label="X位置">
                <avue-input-number v-model="activeObj.left"></avue-input-number>
              </el-form-item>
              <el-form-item label="Y位置">
                <avue-input-number v-model="activeObj.top"></avue-input-number>
              </el-form-item>
              <el-form-item label="宽度">
                <avue-input-number
                  v-model="activeComponent.width"
                ></avue-input-number>
              </el-form-item>
              <el-form-item label="高度">
                <avue-input-number
                  v-model="activeComponent.height"
                ></avue-input-number>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <codeedit
      @submit="codeClose"
      :type="code.type"
      v-model="code.obj"
      :visible.sync="code.box"
    ></codeedit>
    <contentmenu ref="contentmenu"></contentmenu>
  </div>
</template>
<script>
import layer from "./group/layer";
import top from "./group/top";
import imglist from "./group/imglist";
import contentmenu from "./group/contentmenu";
import codeedit from "./group/code";
import { dicOption } from "@/option/config";
import init from "@/mixins/";
import { uuid } from "@/utils/utils";
import components from "@/option/components";
import SketchRule from "vue-sketch-ruler";
import {
  getDataVTypeSelector,
  getDataInterfaceSelector,
  getDataInterfaceResponse,
} from "@/api/dataV";

export default {
  mixins: [init, components],
  data() {
    return {
      categoryList: [],
      dataInterface: [],
      keys: {
        ctrl: false,
      },
      loading: "",
      childProps: {
        label: "name",
        value: "index",
      },
      key: "",
      menuFlag: true,
      code: {
        box: false,
        type: "",
        obj: "",
      },
      form: {},
      apitProps: {
        children: "children",
        label: "fullName",
        value: "id",
      },
      dicOption: dicOption,
      tabsActive: 0,
      // 标尺
      scale: 0.9, //初始化标尺的缩放
      startX: 0, //x轴标尺开始的坐标数值
      startY: 0,
      lines: {
        //初始化水平标尺上的参考线
        h: [],
        v: [],
      },
      rendIndex: 0, //重新渲染组件
      shadow: { x: 0, y: 0 }, // 阴影大小
      thick: 20, //标尺的厚度
      width: 0, // 标尺宽,后面会初始化
      height: 0, // 标尺高,后面会初始化
      wrapperHight: "", // 标尺外部style
      isShowReferLine: true, // 显示参考线
      isImgOpen: true, //眼镜打开
      imgOpenData:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAbCAYAAAAOEM1uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAQNSURBVHja7JdvSON1HMdfP126/shSmaZ1ntuZbTLihOnSdJlPhIquB0VR1DZM9En0wCB3qCXKVOh86mmakdGDOqyHityBidYN1HPYZqbhOZprMGTOUk/9/XryWyxvek5NIu4Lg/H+fPj8Xt/P98/n8xUkSeK/PIT7gP8GoCAI8cTQAoWAHkgFRCAA3AKmgeBRA8VkOSZgMvAy8DZQCqQf4OcFRoDPgYmzAnwdaAAuxpFlCbgGfAR4ThUwYhcE4QngExnw71FWVuax2WwBk8mkSE9PV+7t7Ymrq6vbw8PD0uDgYO7CwsK5KPc14ENJkj497FtxAwqCYAK+kvcbANXV1U6Hw6HIyMh4GlAckJHwzMzMrM1my3a5XNoo01XgPUmSdk8MCLwEfAmoAPLz872jo6OrOTk5xVGBQ0tLS575+fnt7OzsRIPBcD4pKelctL2/v3+mtrbWLIpigixfA94BNk8C+JoMlyRn7WZvb68mISEhI+IQCASmKyoq0jweT25EU6lU4aGhoZnKykpzdNzl5eWbRqPxyWAwmCZL3wJvAHeOA/iCPMsHARwOx7jdbi+JXs7t7e3lrKys1LW1NVWsJXa73ZN6vb40WltfX3cbDIZ0r9ebKUv9wLvxAhYC1+V7je7u7rG6urrn9vu1tbWNNzU1lR90KgsLC5emp6cfB5TRejgc9mg0msyoTNYDXfEAjgFmQGxpaZlobm6OBbFrMpl+dTqd+YdcLztbW1ve5ORk7X6D3++f0ul0+aFQKAXYAF6RJOn6UQGDQBrgE0VRJQjCw7EAjUbj8tTUVN4hgLubm5u3lUrlhVjG+vr6ya6ursgWaJck6fJRAW8AzwNia2vrRGNjY8xltNvtEx0dHc8eRKfX62+73W418NB+m8/nm9LpdE+Fw+FHgD+AS/Fk8CJwI7IHe3t7x2pqau7agxsbG/NqtTp3a2tLGQtwcnJyvKSk5K7JhcPhnzQaTXYwGEyVpQ+AK8c5xd9EZt/e3v59Q0ND6f5LeXFx8cfy8vILfr9fHdEUCsVOX1/fhMViqdgfOxQKzRUUFKh9Pt+JTnHk76vyPZgcqR49PT3nExMTM/+x0XZ3fePj47/Mzc2RlZVFVVVVRkpKin5/3JWVFWdRUVFeIBCInN7v5NJ55ySV5EUZ8lEArVb728jIiDcvL++ZONqo0MDAwK2ampoyURQTZXlI7ob+PI1aXAR8AegiutVqdXZ2dt6zFs/OzrosFstjLpcr+iR3A+9LkrRzKs2CrGUCV4C3on3NZrPHarX+Xlxc/MARu5nLkiRdPbVuJsa4BDQCxjj6QRH4GvgY+PksOmqF3FG/KVcc9T066s+AH86y5Y8eOXI282XQyJtkRv6d/pvk/rPz/wT41wBibRrpeMs+PAAAAABJRU5ErkJggg==", // 左上角图片
      imgClose:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAPYSURBVHja7JVPTFRXFIe/+96gGRHEhQzBFMJKSKSkLTgtGxemSXcktohW2RBmTAjUClIYZ6Cxi+fQDgOCLJgJhqTSBAtLdjaxaSqQWnDSNp2U0I6FFh0SDdV0oMx7pwuZCUXjnyZNuvBsbnLvufe7555zfleJCP+1qReQfwVRSqWmqoFDIE3A+iZXQDbGlMmmNTatP5xPn/0ohOOgLgNtIB8DOlAKvAzsBTKBP4FF4Dvge1DrzwsBaAAuAJ8CxbpuezU/P397QcFLZGVlcf/+fRYXF1lc/G3VNJM/AJ8Dw8CdZ4QoQI4AIWBXaWkpQ0ND5v79+zW73Z5+n9XVVWZnb8rExIQ2MnKZWCz2M/Dhw1d4eiTngXafz2dmZ2ebPp9P6+vrl5qaI2p8fFyi0aheUlJiHj78tpaTs0sHJB6PW4HAJ3og0I2I+AHPkyAeu91uDA4OmrW1tRpAT09vsr29XXM4ciWZTJKXl2ctLCyoHTsy1ZUro+J0OjNSWR8ZGbFcLpeeSCTOAucfBykDpvr7+7c3NjamS+bevXvJ4uIS4vE7tra2tjW/32+7ffu21Ne7rJmZb7VIJKL27Nmjp0ADAwM0NjauAW+IyM2tkAGn8/WG69e/NjVNS20iHA6vd3Z2qrq6OtMwDFswGLROnz6dcffu3WRRUZEVCARwuVzbUv6WZVmVlZXa9PT0RRFp2gq56na7Dw0ODv6jGc6cOWNdu/Zl8saNb/RgMGi1tLSo7u5uaW5u1srLK8yDBw/aursD2ubmcbtPqnA4dFVE3twKuVBeXv7e5OSkabPZ0pGEQuG/WltbicV+0Xbv3m0LBnvWW1qatbNnvclLl4b0c+c+ErfblcoLa2trptPp1CORSEBEWrdCSoBpwzB2ejyedE6Wl5fNsrIyqaiokFAopBwOh/J4PKbf79/mcDiS0WiUnJwcWyoKr9erDMNYBg6ISOxx1dWg6/pAb2+vtZF8DWBqanr96NEalUgkpKCgQJaWljRN04jH43R1dcmpU6dsgBiGobxer3qoGnz2pD5pBfx1dXWaz+czi4qKNECtrKyYY2NjVjQa1fftK7aqq99hdHRUmpqaVEdHhzU/P58xPDycAN4Hws8iK28B/tzc3LJjx96lqqrKOnCggszMzLRmPHjwQM3MzFj19fX63NwcwDJQBUymK+ApEEDtBDkOnFBKvZafv9deWFhIdnYWKysr3Lr1K0tLvydE5CvgJ1AnQZqBi88DSV1aA0qAV4CCDRX+A1gAZoEfN/w/ALqAEyAjzwvZ8mc8KukblgGqD/gCZOyxkBd//P8G8vcAMK383pmr7aEAAAAASUVORK5CYII=",
      dragSlide: false, // 拖动滚动条标记
    };
  },
  components: {
    imglist,
    layer,
    codeedit,
    top,
    contentmenu,
    SketchRule,
  },
  computed: {
    isFolder() {
      return this.activeObj.children;
    },
    isActive() {
      return this.active.length !== 0;
    },
    isSelectActive() {
      return this.active.length > 1;
    },
    childList() {
      return this.list.filter((ele) => {
        if (["tabs"].includes(ele.component.prop)) {
          return false;
        }
        return true;
      });
    },
    activeComponent() {
      return this.activeObj.component || {};
    },
    activeOption() {
      return this.activeObj.option || {};
    },
    activeObj() {
      let result;
      if (this.validatenull(this.active)) {
        return {};
      }
      this.active.forEach((ele) => {
        const item = this.findnav(ele, true);
        if (this.active.length > 1) {
          if (!result) result = [];
          result.push(item.obj);
        } else {
          result = item.obj;
        }
      });
      return result;
    },
    /* 标尺用的 */
    palette() {
      return {
        bgColor: "#181b24", // ruler bg color
        longfgColor: "#BABBBC", // ruler longer mark color
        shortfgColor: "#9C9C9C", // ruler shorter mark color
        fontColor: "#DEDEDE", // ruler font color
        shadowColor: "#525252", // ruler shadow color
        lineColor: "#EB5648",
        borderColor: "#B5B5B5",
        cornerActiveColor: "#fff",
      };
    },
    // 画布大小,一定要是computer里面,否则缩放页面会失效
    canvasStyle() {
      return {
        width: window.innerWidth - 530 + "px", // 530为左边180+右边350
        height: window.innerHeight - 45 + "px", // 顶部下拉45
        transform: `scale(${this.scale})`,
      };
    },
  },
  watch: {
    menuFlag() {
      this.setResize();
    },
    overactive(n, o) {
      [o, n].forEach((ele, index) => {
        if (!ele) return;
        this.setActive(ele, index === 1, "setOverActive");
      });
    },
    active(n, o) {
      [o, n].forEach((ele, index) => {
        ele.forEach((item) => {
          this.setActive(item, index === 1, "setActive");
        });
      });
      //隐藏右键菜单
      this.$refs.contentmenu.hide();
      // 初始化选项卡
      this.tabsActive = "0";
    },
  },
  created() {
    this.listen();
    this.getCategoryList();
    this.getDataInterfaceList();
    this.iniresize();
  },
  mounted() {
    this.initFun();
    this.$nextTick(() => {
      this.initSize();
    });
  },
  methods: {
    getCategoryList() {
      getDataVTypeSelector().then((res) => {
        this.categoryList = res.data.list;
      });
    },
    getDataInterfaceList() {
      getDataInterfaceSelector().then((res) => {
        this.dataInterface = res.data;
      });
    },
    getDataInterfaceData(id) {
      getDataInterfaceResponse(id).then((res) => {
        let objData = res.data;
        if (typeof res.data === "string") objData = JSON.parse(res.data);
        this.activeObj.data = objData;
      });
    },
    handleApiSelect(data) {
      const responseUrl = `${this.define.comUrl}/api/DataInterface/${data.id}/Actions/Response`;
      this.activeObj.url = responseUrl;
      this.getDataInterfaceData(data.id);
    },

    codeClose(value) {
      if (this.code.type === "query") {
        this.config.query = value;
      } else {
        this.activeObj[this.code.type] = value;
      }
    },
    openCode(type) {
      this.code.type = type;
      if (type === "query") {
        this.code.obj = this.config.query;
      } else {
        this.code.obj = this.activeObj[type];
      }
      this.code.box = true;
    },
    initFun() {
      ["setScale", "setResize"].forEach((ele) => {
        this[ele] = this.$refs.container[ele];
      });
      ["handleAdd"].forEach((ele) => {
        this[ele] = this.$refs.top[ele];
      });
    },
    // 右键菜单
    handleContextMenu(e, item = {}) {
      if (!item.index) {
        return;
      }
      if (!this.isSelectActive) {
        this.active = [item.index];
      }
      setTimeout(() => {
        this.$refs.contentmenu.show(e.clientX, e.clientY);
      }, 0);
    },
    //监听键盘的按键
    listen() {
      document.onkeydown = (e) => {
        // 去掉默认滚动条按空格跳到后面行为
        if (e.target.nodeName == "TEXTAREA" || e.target.nodeName == "INPUT") {
          return;
        }
        // 按下空格键
        if (e.keyCode == 32) {
          e.preventDefault();
          this.keys.space = true;
        }
        // 如果是delete按键,那么调用删除组件按钮
        if (e.keyCode === 46) {
          this.deleteMethod();
        }
        this.keys.ctrl = e.keyCode === 17;
      };
      document.onkeyup = () => {
        this.keys.ctrl = false;
      };
    },
    deleteMethod() {
      this.active.forEach((index) => {
        const params = this.findnav(index);
        delete params.parent.splice(params.count, 1);
      });
      this.handleInitActive();
    },
    setActive(val, result, fun) {
      const obj = this.$refs.container.handleGetObj(val);
      if (!this.validatenull(obj)) obj[0][fun](result);
    },
    //批量成组
    handleFloder() {
      let floder = {
        title: "文件夹",
        name: "文件夹",
        index: uuid(),
        children: [],
      };
      this.active.forEach((index) => {
        const params = this.findnav(index);
        floder.children.push(params.obj);
        delete params.parent.splice(params.count, 1);
      });
      this.nav.push(floder);
      this.handleInitActive();
    },
    //批量删除
    handleDeleteSelect() {
      this.$confirm(`是否批量删除所选图层?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteMethod();
      });
    },
    vaildProp(name, list) {
      if (list) {
        return list.includes(this.activeComponent.prop);
      }
      return this.dicOption[name].includes(this.activeComponent.prop);
    },
    handleRefresh(tip) {
      this.$refs.container.handleRefresh(tip);
    },
    formatTooltip(val) {
      return parseInt(val);
    },
    //打开图库
    handleOpenImg(item, type) {
      this.$refs.imglist.openImg(item, type);
    },
    //图库框回调赋值
    handleSetimg(val, type) {
      if (type === "activeObj.data") {
        this.activeObj.data = `${this.define.comUploadUrl}border/${val}`;
      }
      if (type === "activeObj.data.value") {
        this.activeObj.data.value = `${this.define.comUploadUrl}source/${val}`;
      } else if (type === "activeOption.backgroundImage") {
        this.activeOption.backgroundImage = `${this.define.comUploadUrl}bg/${val}`;
      } else if (type === "activeOption.backgroundBorder") {
        this.activeOption.backgroundBorder = `${this.define.comUploadUrl}border/${val}`;
      } else if (type === "activeOption.empBackgroundBorder") {
        this.activeOption.empBackgroundBorder = `${this.define.comUploadUrl}bg/${val}`;
      } else if (type === "config.backgroundImage") {
        this.config.backgroundImage = val;
      } else if (type === "activeOption.symbol") {
        this.activeOption.symbol = `${this.define.comUploadUrl}source/${val}`;
      }
    },
    /* **************************标尺方法开始******************************* */
    // 滚轮触发
    handleScroll() {
      const screensRect = this.$refs.screensRef.getBoundingClientRect();
      const canvasRect = this.$refs.canvas.getBoundingClientRect();
      // 标尺开始的刻度
      const startX =
        (screensRect.left + this.thick - canvasRect.left) / this.scale;
      const startY =
        (screensRect.top + this.thick - canvasRect.top) / this.scale;
      this.startX = startX >> 0;
      this.startY = startY >> 0;
    },
    // 控制缩放值
    handleWheel(e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const nextScale = parseFloat(
          Math.max(0.2, this.scale - e.deltaY / 500).toFixed(2)
        );
        this.scale = nextScale;
      }
      this.$nextTick(() => {
        this.handleScroll();
      });
    },
    // 初始化标尺数值
    initSize() {
      const domW = this.$refs.wrapper;
      let width = window.innerWidth - 530;
      let height = window.innerHeight - 45;
      domW.style.width = width + "px";
      domW.style.height = height + "px";
      this.width = width - this.thick;
      this.height = height - this.thick;
      // 画布阴影部分
      this.shadow = { x: 0, y: 0, width, height };
      // 滚动居中
      let dom = this.$refs.containerRef.getBoundingClientRect();
      this.$refs.screensRef.scrollLeft = dom.width / 2 - this.thick;
      this.$refs.screensRef.scrollTop = dom.height / 2 - this.thick;
    },
    // resize
    iniresize() {
      window.addEventListener("resize", () => {
        let width = this.width;
        let height = this.height;
        this.initSize();
        let rate = Math.min(this.width / width, this.height / height);
        this.scale = rate > 1 ? rate * 0.5 : rate;
        this.rendIndex++;
      });
    },
    // 图片点击事件
    imgClick() {
      this.isShowReferLine = !this.isShowReferLine;
    },
    // 鼠标按下事件
    dragMousedown(e) {
      // 如果按下了空格键,且按下鼠标左键,那么鼠标变抓手,开启滚动条随鼠标拖动的操作
      if (this.keys.space) {
        this.dragSlide = true;
        window.stardragEvent = e;
        window.startSlideX = this.$refs.screensRef.scrollLeft;
        window.startSlideY = this.$refs.screensRef.scrollTop;
      }
    },
    //鼠标抬起操作
    dragMouseup() {
      this.dragSlide = false;
    },
    // 鼠标移动骚操作
    dragMousemove(e) {
      if (this.dragSlide) {
        let x = e.clientX - window.stardragEvent.clientX;
        let y = e.clientY - window.stardragEvent.clientY;
        this.$refs.screensRef.scrollLeft = window.startSlideX - x;
        this.$refs.screensRef.scrollTop = window.startSlideY - y;
      }
    },
  },
};
</script>
<style lang="scss">
@import "../styles/style.scss";
</style>
<style >
.params {
  z-index: 3;
  position: absolute;
  right: 0px;
}

.refer-line-img {
  position: absolute;
  left: 0;
  z-index: 5;
  width: 20px;
  height: 20px;
  /* background: #fff; */
}
#screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.screen-container {
  position: absolute;
  width: 5000px;
  height: 3000px;
}

.dragghanle {
  cursor: pointer;
}
#canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  background: lightblue;
  /* transform-origin: 50% 0; */
}
</style>
