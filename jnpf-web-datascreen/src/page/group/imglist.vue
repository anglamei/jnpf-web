<template>
  <el-dialog title="图库" width="80%" :visible.sync="imgVisible">
    <div style="margin: 0 auto">
      <el-upload
        class="upload-demo"
        :on-success="onSuccess"
        :show-file-list="false"
        :action="uploaderAction"
        multiple
        list-type="picture"
      >
        <el-button size="small" icon="el-icon-upload" type="primary"
          >点击上传</el-button
        >
      </el-upload>
    </div>
    <el-scrollbar class="imgList">
      <img
        :key="index"
        v-for="(item, index) in imgList"
        :src="define.comUploadUrl + type + '/' + item.fileName"
        :style="styleName"
        @click="handleSetimg(item.fileName)"
      />
    </el-scrollbar>
  </el-dialog>
</template>

<script>
import { getImgList } from "@/api/dataV";

export default {
  data() {
    return {
      imgVisible: false,
      imgObj: "",
      type: "",
      imgTabs: [],
      // 上传图片路径
      uploaderAction: "",
      // 显示的图片列表
      imgList: [],
    };
  },
  computed: {
    styleName() {
      if (this.type === "background") {
        return {
          width: "200px",
        };
      }
      return {};
    },
  },
  watch: {
    type: {
      handler() {
        if (this.type) {
          this.uploaderAction = `${this.define.comUploadUrl}/${this.type}/Uploader`;
          this.fetchImageList();
        }
      },
      immediate: true,
    },
  },
  methods: {
    fetchImageList() {
      let that = this;
      let type = that.type;
      this.imgList = [];
      getImgList(this.type).then((res) => {
        this.imgList = res.data;
      });
    },
    onSuccess(res) {
      this.fetchImageList();
    },
    openImg(item, type) {
      if (type === "") {
        this.type = "source";
      } else {
        this.type = type;
      }
      this.imgObj = item;
      this.imgVisible = true;
    },
    handleSetimg(item) {
      this.imgVisible = false;
      this.$emit("change", item, this.imgObj);
    },
  },
};
</script>

<style>
</style>
