/**
 * Created by Jacky.Gao on 2017-02-07.
 */
import {
    alert,
    confirm
} from '../MsgBox.js';
import {
    setDirty
} from '../Utils.js';
import URLParameterItemDialog from './URLParameterItemDialog.js';

export default class URLParameterDialog {
    constructor() {
        this.urlParameterItemDialog = new URLParameterItemDialog();
        this.dialog = $(`<div class="modal fade data-report-modal" role="dialog" aria-hidden="true" style="z-index: 11001">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                            <i class="report-icon report-icon-huaban16fuben4"/>
                        </button>
                        <h4 class="modal-title">
                            ${window.i18n.dialog.urlParam.title}
                        </h4>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                    </div>
                </div>
            </div>
        </div>`);
        const body = this.dialog.find('.modal-body'),
            footer = this.dialog.find(".modal-footer");
        this.initBody(body, footer);
    }
    initBody(body, footer) {
        const addButton = $(`
        <button type="button" class="el-button el-button--primary el-button--small" style="float: right;margin-bottom: 10px;">
            <i class="report-icon report-icon-add" title="${window.i18n.dialog.urlParam.add}"></i>&nbsp;<span>${window.i18n.dialog.urlParam.add}</span>
        </button>`);
        const _this = this;
        addButton.on('click', () => {
            const param = {
                name: '',
                value: ''
            };
            _this.urlParameterItemDialog.show(function () {
                _this.parameters.push(param);
                const tr = $(`<tr style="height: 30px"></tr>`);
                const nameTD = $(`<td style="vertical-align: middle">${param.name}</td>`);
                const valueTD = $(`<td style="vertical-align: middle">${param.value}</td>`);
                tr.append(nameTD);
                tr.append(valueTD);
                _this.tbody.append(tr);
                const td = $(`<td style="vertical-align: middle"></td>`);
                const edit = $(`<a href="javascript:;" class="editTxt">编辑</a>`);
                td.append(edit);
                edit.on('click', () => {
                    _this.urlParameterItemDialog.show(function () {
                        nameTD.html(param.name);
                        valueTD.html(param.value);
                    }, param, 'edit');
                });
                const del = $(`<a href="javascript:;" class="delTxt">删除</a>`);
                td.append(del);
                del.on('click', () => {
                    confirm(`${window.i18n.dialog.urlParam.delTip}`, function () {
                        const index = _this.parameters.indexOf(param);
                        _this.parameters.splice(index, 1);
                        tr.remove();
                    });
                });
                tr.append(td);
            }, param, 'add');
        });
        body.append(addButton);
        const table = $(`<table class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table--small">
            <thead class="el-table__header">
                <tr>
                    <th>${window.i18n.dialog.urlParam.name}</th>
                    <th>${window.i18n.dialog.urlParam.expr}</th>
                    <th style="width:90px;">${window.i18n.dialog.urlParam.op}</th>
                </tr>
            </thead>
        </table>`);
        this.tbody = $(`<tbody class="el-table__body"></tbody>`);
        table.append(this.tbody);
        body.append(table);
    }
    show(parameters) {
        this.parameters = parameters;
        this.dialog.modal('show');
        this.tbody.empty();
        const _this = this;
        for (let param of parameters) {
            const tr = $(`<tr style="height: 30px"></tr>`);
            const nameTD = $(`<td style="vertical-align: middle">${param.name}</td>`);
            const valueTD = $(`<td style="vertical-align: middle">${param.value}</td>`);
            tr.append(nameTD);
            tr.append(valueTD);
            _this.tbody.append(tr);
            const td = $(`<td style="vertical-align: middle"></td>`);
            const edit = $(`<a href="javascript:;" class="editTxt">编辑</a>`);
            td.append(edit);
            edit.on('click', () => {
                _this.urlParameterItemDialog.show(function () {
                    nameTD.html(param.name);
                    valueTD.html(param.value);
                }, param, 'edit');
            });
            const del = $(`<a href="javascript:;" class="delTxt">删除</a>`);
            td.append(del);
            del.on('click', () => {
                confirm(`${window.i18n.dialog.urlParam.delTip}`, function () {
                    const index = _this.parameters.indexOf(param);
                    _this.parameters.splice(index, 1);
                    tr.remove();
                });
            });
            tr.append(td);
        }
    }
}