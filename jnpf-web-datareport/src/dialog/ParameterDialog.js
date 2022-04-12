/**
 * Created by Jacky.Gao on 2017-02-06.
 */
import {
    alert
} from '../MsgBox.js';

export default class ParameterDialog {
    constructor(data) {
        this.data = data;
        this.dialog = $(`<div class="modal fade data-report-modal" role="dialog" aria-hidden="true" style="z-index: 10000">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                            <i class="report-icon report-icon-huaban16fuben4"/>
                        </button>
                        <h4 class="modal-title">参数配置</h4>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>`);
        const body = this.dialog.find('.modal-body'),
            footer = this.dialog.find(".modal-footer");
        this.init(body, footer);
    }
    init(body, footer) {
        const nameRow = $(`<div class="data-formitm"><label class="lab">${window.i18n.dialog.sqlParam.name}</label></div>`);
        const nameGroup = $(`<div class="ipt el-input--small"></div>`);
        this.nameEditor = $(`<input type="text" class="el-input__inner">`);
        nameGroup.append(this.nameEditor);
        nameRow.append(nameGroup);
        body.append(nameRow);

        const typeRow = $(`<div class="data-formitm"><label class="lab">${window.i18n.dialog.sqlParam.datatype}</label></div>`);
        const typeGroup = $(`<div class="ipt el-input--small"></div>`);
        this.typeEditor = $(`<select class="form-control">
            <option>String</option>
            <option>Integer</option>
            <option>Float</option>
            <option>Boolean</option>
            <option>Date</option>
            <option>List</option>
        </select>`);
        typeGroup.append(this.typeEditor);
        typeRow.append(typeGroup);
        body.append(typeRow);

        const defaultValueRow = $(`<div class="data-formitm"><label class="lab">${window.i18n.dialog.sqlParam.defaultValue}</label></div>`);
        const defaultValueGroup = $(`<div class="ipt el-input--small"></div>`);
        this.defaultValueEditor = $(`<input type="text" placeholder="${window.i18n.dialog.sqlParam.tip}" class="el-input__inner">`);
        defaultValueGroup.append(this.defaultValueEditor);
        defaultValueRow.append(defaultValueGroup);
        body.append(defaultValueRow);

        const _this = this;
        const addButton = $(`<button class="el-button el-button--primary el-button--small">${window.i18n.dialog.sqlParam.ok}</button>`);
        footer.append(addButton);
        addButton.on('click', () => {
            const name = _this.nameEditor.val(),
                type = _this.typeEditor.val(),
                defaultValue = _this.defaultValueEditor.val();
            if (name === '') {
                alert(`${window.i18n.dialog.sqlParam.nameTip}`);
                return;
            }
            if (type === '') {
                alert(`${window.i18n.dialog.sqlParam.datatypeTip}`);
                return;
            }
            if (!_this.editData || name !== _this.editData.name) {
                for (let param of _this.data) {
                    if (param.name === name) {
                        alert(`${window.i18n.dialog.sqlParam.param}[${name}]${window.i18n.dialog.sqlParam.exist}`);
                        return;
                    }
                }
            }
            _this.onSave.call(this, name, type, defaultValue);
            _this.dialog.modal('hide');
        });
    }
    show(onSave, data) {
        this.onSave = onSave;
        this.dialog.modal('show');

        if (data) {
            this.editData = data;
            this.nameEditor.val(data.name);
            this.typeEditor.val(data.type);
            this.defaultValueEditor.val(data.defaultValue);
        } else {
            this.nameEditor.val('');
            this.typeEditor.val('String');
            this.defaultValueEditor.val("");
        }
    }
}