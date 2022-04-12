/**
 * Created by Jacky.Gao on 2017-02-12.
 */
import {
    formatDate,
    resetDirty,
    getUrlParam
} from '../Utils.js';
import {
    successAlert,
    alert
} from '../MsgBox.js';

export default class SaveDialog {
    constructor() {
        this.reportFilesData = {};
        this.dialog = $(`<div class="modal fade data-report-modal" role="dialog" aria-hidden="true" style="z-index: 10000">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                            <i class="report-icon report-icon-huaban16fuben4"></i>
                        </button>
                        <h4 class="modal-title">
                            ${window.i18n.dialog.save.title}
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div class="data-formitm">
                            <label class="lab">${window.i18n.dialog.save.fileName}</label>
                            <div class="ipt el-input--small">
                                <input type="text" class="el-input__inner js_save_fullName" id="fileFullName">
                            </div>
                        </div>
                        <div class="data-formitm">
                            <label class="lab">${window.i18n.dialog.save.source}</label>
                            <div class="ipt el-input--small">
                                <select class="form-control" style="display: inline-block;width:100%;" id="categoryId" name="categoryId"></select>
                            </div>
                        </div>
                        <div class="data-formitm">
                            <label class="lab">编码</label>
                            <div class="ipt el-input--small">
                                <input type="text" class="el-input__inner js_save_enCode">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>`);
        const footer = this.dialog.find(".modal-footer")
        this.initFooter(footer)
    }

    initFooter(footer) {
        const token = getUrlParam('token')
        const saveButton = $(`<button type="button" class="el-button el-button--primary el-button--small">${window.i18n.dialog.save.save}</button>`);
        footer.append(saveButton);
        const _this = this;
        saveButton.on('click', () => {
            let fullName = $('#fileFullName').val()
            let categoryId = $("#categoryId option:selected").val()
            let enCode = $('.js_save_enCode').val()

            if (fullName === '') {
                alert(`${window.i18n.dialog.save.nameTip}`);
                $('#fileFullName').focus()
                return;
            }
            if (categoryId === '') {
                alert(`分类不能为空`)
                return;
            }
            if (enCode === '') {
                alert(`编码不能为空`)
                $('.js_save_enCode').focus()
                return;
            }

            let postData = {}
            let updateData = {}
            const account = getUrlParam('account')
            const realName = decodeURI(decodeURI(getUrlParam('realName')))
            const userName = `${account}/${realName}`

            if (_this.context.baseInfo.id) {

                updateData = {
                    fullName,
                    categoryId,
                    enCode,
                    content: _this.content,
                }
                $.ajax({
                    url: `${window._server}/api/DataReport/${_this.context.baseInfo.id}`,
                    data: JSON.stringify(updateData),
                    contentType: "application/json",
                    dataType: "json",
                    type: 'PUT',
                    headers: {
                        'Authorization': token
                    },
                    success: (res) => {
                        if (res.code === 200) {
                            successAlert(`${window.i18n.tools.save.successSave}`);
                            _this.context.baseInfo = {
                                id: _this.context.baseInfo.id,
                                fullName,
                                categoryId,
                                enCode,
                            }

                            resetDirty();
                            _this.dialog.modal('hide');
                        } else {
                            alert(res.msg)
                        }
                    },
                    error: (response) => {
                        if (response && response.responseText) {
                            alert("服务端错误：" + response.responseText + "");
                        } else {
                            alert(`${window.i18n.tools.save.failSave}`);
                        }
                    }
                });
            } else {
                const creatorUser = userName
                postData = {
                    fullName,
                    categoryId,
                    enCode,
                    sortCode: 0,
                    enabledMark: 1,
                    content: _this.content,
                    creatorUser
                }

                $.ajax({
                    url: window._server + "/api/DataReport",
                    data: JSON.stringify(postData),
                    contentType: "application/json",
                    dataType: "json",
                    type: 'POST',
                    headers: {
                        'Authorization': token
                    },
                    success: (res) => {
                        console.log(res)
                        if (res.code === 200) {
                            successAlert(`${window.i18n.dialog.save.success}`);
                            _this.context.baseInfo = {
                                id: res.data,
                                fullName,
                                categoryId,
                                enCode: enCode,
                                sortCode: 0,
                                enabledMark: 1,
                            }

                            console.log(_this.context)
                            resetDirty();
                            _this.dialog.modal('hide');
                        } else {
                            alert(res.msg)
                        }

                    },
                    error: function (response) {
                        if (response && response.responseText) {
                            alert("服务端错误：" + response.responseText + "");
                        } else {
                            alert(`${window.i18n.dialog.save.fail}`);
                        }
                    }
                });
            }
        });
    }

    show(content, context) {
        this.content = content;
        this.context = context;
        this.reportFilesData = {};

        // 报表下拉渲染
        const optionList = context.categoryList
        optionList.forEach(item => {
            this.dialog.find('select[name=categoryId]').append(`<option value="${item.id}">${item.fullName}</option>`)
        })
        this.dialog.find('select[name=categoryId]').trigger('change')

        if (context.baseInfo.id) {
            const result = eval(context.baseInfo)
            this.dialog.find('select[name=categoryId]').val(result.categoryId)
            this.dialog.find('.js_save_fullName').val(result.fullName)
            this.dialog.find('.js_save_enCode').val(result.enCode)
            this.dialog.modal('show');
        } else {
            this.dialog.find('.js_save_fullName').val('')
            this.dialog.find('.js_save_enCode').val('')
            this.dialog.modal('show');
        }


    }
}