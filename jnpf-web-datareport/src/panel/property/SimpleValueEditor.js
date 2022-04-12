/**
 * Created by Jacky.Gao on 2017-02-07.
 */
import {
    setDirty
} from '../../Utils.js';

export default class SimpleValueEditor {
    constructor(parentContainer, context) {
        this.context = context;
        this.container = $(`<div></div>`);
        parentContainer.append(this.container);
        this.container.hide();
        this.init();
    }

    init() {
        const _this = this;
        this.container.append(this.buildLineHeight());
        this.simpleContent = $(`<div class="custom-formitm"><label class="lab">${window.i18n.property.simple.content}</label></div>`);
        this.editor = $(`<textarea rows="5" cols="10" class="form-control ipt el-textarea__inner" style="display: inline-block;width: 278px;"></textarea>`);
        this.simpleContent.append(this.editor);
        this.container.append(this.simpleContent)

        this.editor.change(function () {
            const value = $(this).val();
            _this.cellDef.value.value = value;
            _this.context.hot.setDataAtCell(_this.rowIndex, _this.colIndex, value);
            setDirty();
        });
    }

    buildLineHeight() {
        const _this = this;
        const group = $(`<div class="form-group el-input--small custom-formitm"><label class="lab">${window.i18n.property.simple.lineHeight}</label></div>`);
        this.lineHeightEditor = $(`<input type="number" class="form-control ipt el-input__inner" placeholder="${window.i18n.property.simple.tip}" style="display: inline-block;width: 278px;font-size: 12px; padding-right: 3px">`);
        group.append(this.lineHeightEditor);
        this.lineHeightEditor.change(function () {
            const value = $(this).val();
            _this.cellDef.cellStyle.lineHeight = value;
            let td = _this.context.hot.getCell(_this.rowIndex, _this.colIndex);
            if (value === '') {
                $(td).css("line-height", '');
            } else {
                $(td).css("line-height", value);
            }
            _this.context.hot.render();
        });
        return group;
    }

    show(cellDef, rowIndex, colIndex, row2Index, col2Index) {
        this.cellDef = cellDef;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.container.show();
        $('.panel-base-tx').val(cellDef.value.value);
        this.lineHeightEditor.val(cellDef.cellStyle.lineHeight);
    }
    hide() {
        this.container.hide();
    }
}