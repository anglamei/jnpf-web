/**
 * Created by Jacky.Gao on 2017-01-25.
 */
import Tool from './Tool.js';
import SaveDialog from '../dialog/SaveDialog.js';
import {
    alert
} from '../MsgBox.js';
import {
    resetDirty,
    tableToXml,
    getUrlParam
} from '../Utils.js';

export default class SaveTool extends Tool {
    execute() {}

    buildButton() {
        const group = $(`<div class="btn-group top-right-btns"></div>`);
        const mainBtn = $(`
            <button type="button" class="btn btn-default dropdown-toggle" style="border:none;border-radius:0;padding: 6px 8px;" data-toggle="dropdown" title="${window.i18n.tools.save.save}">
            <i class="ureport ureport-save" style="color: #0e90d2;"></i>
            <span class="caret"></span>
        </button>`);
        const ul = $(`<ul class="dropdown-menu" role="menu"></ul>`);
        const save = $(`<li id="__save_btn" class="disabled">
                <a href="javascript:">
                    <i class="ureport ureport-save" style="color: #0e90d2;"></i> ${window.i18n.tools.save.save}
                </a>
            </li>`);
        ul.append(save);
        const saveDialog = new SaveDialog();
        const _this = this;

        // 关闭
        $(".top-close-btn").on('click', () => {
            window.parent.postMessage('closeDialog', '*')
        })

        // 保存
        $(".top-save-btn").on('click', () => {
            $("select[name=categoryId]").empty();
            // 获取报表分类
            $.ajax({
                url: window._mainServer + '/api/System/DictionaryData/65e7917344fa460e8c487e45bbbab26f/Data/Selector',
                success: (res) => {
                    _this.context.categoryList = res.data.list
                    // console.log(_this.context)
                    const fileId = getUrlParam('id')
                    if (fileId) _this.context.baseInfo = _this.context.reportTable.baseInfo
                    const content = tableToXml(_this.context)
                    saveDialog.show(content, _this.context)
                },
                error: (response) => {
                    if (response && response.responseText) {
                        alert("服务端错误：" + response.responseText + "");
                    } else {
                        alert(`${window.i18n.dialog.save.loadFail}`);
                    }
                }
            });
        });
        const saveAs = $(`  
            <li>
                <a href="javascript:;">
                    <i class="glyphicon glyphicon-floppy-disk" style="color: #0e90d2;font-size: 16px"></i> ${window.i18n.tools.save.saveAs}
                </a>
            </li>`);
        ul.append(saveAs);
        saveAs.on('click', () => {
            const content = tableToXml(_this.context);
            saveDialog.show(content, _this.context);
        });

        group.append(mainBtn);
        group.append(ul);
        return group;
    }


    getTitle() {
        return `${window.i18n.tools.save.save}`;
    }
    getIcon() {
        return `<i class="ureport ureport-save" style="color: #0e90d2"></i>`;
    }
}