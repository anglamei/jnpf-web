/**
 * Created by Jacky.Gao on 2017-02-05.
 */
import {
    alert
} from '../MsgBox.js';
import {
    setDirty,
    getUrlParam
} from '../Utils.js';

export default class DatasourceDialog {
    constructor(datasources) {
        this.datasources = datasources;
        this.dialog = $(`<div class="modal fade data-report-modal" role="dialog" aria-hidden="true" style="z-index: 10000">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                            <i class="report-icon report-icon-huaban16fuben4"/>
                        </button>
                        <h4 class="modal-title">
                            ${window.i18n.dialog.datasource.title}
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
        const dsRow = $(`<div class="data-formitm"><label class="lab">${window.i18n.dialog.datasource.name}</label></div>`);
        const dsNameGroup = $(`<div class="ipt el-input--small"></div>`);
        this.dsNameEditor = $(`<input type="text" class="el-input__inner">`);
        dsNameGroup.append(this.dsNameEditor);
        dsRow.append(dsNameGroup);
        body.append(dsRow);

        const usernameRow = $(`<div class="data-formitm"><label class="lab">${window.i18n.dialog.datasource.username}</label></div>`);
        const usernameGroup = $(`<div class="ipt el-input--small"></div>`);
        this.usernameEditor = $(`<input type="text" class="el-input__inner">`);
        usernameGroup.append(this.usernameEditor);
        usernameRow.append(usernameGroup);
        body.append(usernameRow);

        const passwordRow = $(`<div class="data-formitm"><label class="lab">${window.i18n.dialog.datasource.password}</label></div>`);
        const passwordGroup = $(`<div class="ipt el-input--small"></div>`);
        this.passwordEditor = $(`<input type="password" class="el-input__inner" />`);
        passwordGroup.append(this.passwordEditor);
        passwordRow.append(passwordGroup);
        body.append(passwordRow);

        const driverRow = $(`<div class="data-formitm"><label class="lab">${window.i18n.dialog.datasource.driver}</label></div>`);
        const driverGroup = $(`<div class="ipt el-input--small"></div>`);
        this.driverEditor = $(`<input type="text" class="el-input__inner" />`);
        driverGroup.append(this.driverEditor);
        driverRow.append(driverGroup);
        body.append(driverRow);

        const urlRow = $(`<div class="data-formitm"><label class="lab">${window.i18n.dialog.datasource.url}</label></div>`);
        const urlGroup = $(`<div class="ipt el-input--small"></div>`);
        this.urlEditor = $(`<input type="text" class="el-input__inner">`);
        urlGroup.append(this.urlEditor);
        urlRow.append(urlGroup);
        body.append(urlRow);

        const _this = this;
        const testButton = $(`<button type="button" class="el-button el-button--default el-button--small">${window.i18n.dialog.datasource.test}</button>`);
        footer.append(testButton);
        testButton.on('click', () => {
            const dsName = _this.dsNameEditor.val(),
                username = _this.usernameEditor.val(),
                password = _this.passwordEditor.val(),
                driver = _this.driverEditor.val(),
                url = _this.urlEditor.val();
            _this.testConnection(dsName, username, password, driver, url);
        });
        const saveButton = $(`<button type="button" class="el-button el-button--primary el-button--small">${window.i18n.dialog.datasource.save}</button>`);
        footer.append(saveButton);
        saveButton.on('click', () => {
            const name = _this.dsNameEditor.val(),
                username = _this.usernameEditor.val(),
                password = _this.passwordEditor.val(),
                driver = _this.driverEditor.val(),
                url = _this.urlEditor.val();
            _this.testConnection(name, username, password, driver, url, function () {
                _this.onSave.call(this, name, username, password, driver, url);
                setDirty();
                _this.dialog.modal('hide');
            });
        });
    }

    testConnection(dsName, username, password, driver, url, callback) {
        if (dsName === '') {
            alert(`${window.i18n.dialog.datasource.nameTip}`);
            return;
        }
        if (username === '') {
            alert(`${window.i18n.dialog.datasource.usernameTip}`);
            return;
        }
        if (driver === '') {
            alert(`${window.i18n.dialog.datasource.driverTip}`);
            return;
        }
        if (url === '') {
            alert(`${window.i18n.dialog.datasource.urlTip}`);
            return;
        }
        let check = false;
        if (!this.oldName || dsName !== this.oldName) {
            check = true;
        }
        if (check) {
            for (let source of this.datasources) {
                if (source.name === dsName) {
                    alert(`${window.i18n.dialog.datasource.datasource}[${dsName}]${window.i18n.dialog.datasource.existTip}`);
                    return;
                }
            }
        }
        const _this = this;
        const token = getUrlParam('token')
        $.ajax({
            url: window._server + "/datasource/testConnection",
            data: {
                username,
                password,
                driver,
                url
            },
            headers: {
                'Authorization': token
            },
            type: "POST",
            success: function (data) {
                if (callback) {
                    callback.call(_this);
                } else {
                    if (data.code === 200) {
                        alert(`${window.i18n.dialog.datasource.testSuccess}`)
                    } else {
                        alert(`${window.i18n.dialog.datasource.testFail}` + data.msg)
                    }
                }
            },
            error: function (response) {
                if (response && response.responseText) {
                    alert("服务端错误：" + response.responseText + "");
                } else {
                    alert(`${window.i18n.dialog.datasource.failTip}`);
                }
            }
        });
    }

    show(onSave, ds) {
        this.dialog.modal('show');
        this.onSave = onSave;
        if (ds) {
            this.oldName = ds.name;
            this.dsNameEditor.val(ds.name);
            this.usernameEditor.val(ds.username);
            this.passwordEditor.val(ds.password);
            this.driverEditor.val(ds.driver);
            this.urlEditor.val(ds.url);
        }
    }
}