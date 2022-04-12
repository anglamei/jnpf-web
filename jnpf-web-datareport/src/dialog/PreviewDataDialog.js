/**
 * Created by Jacky.Gao on 2017-02-07.
 */
export default class PreviewDataDialog {
    constructor() {
        const w = $(window).width(),
            h = $(window).height();
        this.dialog = $(`<div class="modal fade data-report-modal" role="dialog" aria-hidden="true" style="z-index: 10000">
            <div class="modal-dialog modal-lg" style="width: ${w-100}px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                            <i class="report-icon report-icon-huaban16fuben4"/>
                        </button>
                        <h4 class="modal-title">
                            ${window.i18n.dialog.preview.title}
                        </h4>
                    </div>
                    <div class="modal-body" style="height: 600px; overflow: auto"></div>
                    <div class="modal-footer">
                    </div>
                </div>
            </div>
        </div>`);
        this.body = this.dialog.find('.modal-body');
        const footer = this.dialog.find(".modal-footer");
        this.initBody();
        this.initButton(footer);
    }
    initBody() {
        this.body.append(`${window.i18n.dialog.preview.load}`);
    }

    initButton(footer) {
        const button = $(`<button class="el-button el-button--primary el-button--small">${window.i18n.dialog.preview.ok}</button>`);
        footer.append(button);
        const _this = this;
        button.on('click', () => {
            _this.dialog.modal('hide');
        });
    }

    showData(result) {
        this.body.empty();
        const data = result.data;
        this.body.append(`<div style="height: 30px;background: #fdfdfd;">
        <span style="margin: 4px;">${window.i18n.dialog.preview.total}${result.total}${window.i18n.dialog.preview.totalMid}${result.currentTotal}${window.i18n.dialog.preview.item}</span>
        </div>`);
        const div = $(`<div style="overflow-x: auto"></div>`);
        this.body.append(div);
        const table = $('<table class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="table-layout: fixed"></table>');
        div.append(table);
        const fields = result.fields;
        const header = $(`<tr></tr>`);
        for (let field of fields) {
            header.append(`<th style="word-wrap:break-word;width: 120px">${field}</th>`);
        }
        const theader = $(`<thead class="el-table__header"></thead>`);
        theader.append(header);
        table.append(theader);
        const body = $(`<tbody class="el-table__body"></tbody>`);
        table.append(body);
        for (let item of data) {
            const row = $(`<tr></tr>`);
            for (let field of fields) {
                row.append(`<td style="word-wrap:break-word">${item[field]}</td>`);
            }
            body.append(row);
        }
    }
    showError(errorInfo) {
        this.body.empty();
        this.body.append(errorInfo);
    }

    show() {
        this.dialog.modal('show');
    }
}