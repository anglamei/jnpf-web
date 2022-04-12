/**
 * Created by jacky on 2016/7/9.
 */
export function alert(msg) {
    toastr.options = {
        closeButton: false,
        debug: false,
        progressBar: false,
        positionClass: "toast-top-center",
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
    toastr.error(msg);
    // const dialog = buildDialog('消息提示',msg);
    // dialog.modal('show');
};

export function successAlert(msg) {
    toastr.options = {
        closeButton: false,
        debug: false,
        progressBar: false,
        positionClass: "toast-top-center",
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
    toastr.success(msg);
};

export function confirm(msg, callback) {
    const dialog = buildDialog('确认提示', msg, [{
        name: '确认',
        click: function () {
            callback.call(this);
        }
    }]);
    dialog.modal('show');
};

export function dialog(title, content, callback) {
    const dialog = buildDialog(title, content, [{
        name: '确认',
        click: function () {
            callback.call(this);
        }
    }]);
    dialog.modal('show');
};

export function showDialog(title, dialogContent, buttons, events, large) {
    const dialog = buildDialog(title, dialogContent, buttons, large);
    dialog.modal('show');
    if (events) {
        for (let event of events) {
            dialog.on(event.name, event.callback);
        }
    }
};

function buildDialog(title, dialogContent, buttons, large) {
    const className = 'modal-dialog' + (large ? ' modal-lg' : '');
    let modal = $(`<div class="modal fade data-report-modal" tabindex="-1" role="dialog" aria-hidden="true"></div>`);
    let dialog = $(`<div class="${className}" style="width: 390px;"></div>`);
    modal.append(dialog);
    let content = $(`<div class="modal-content">
         <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                <i class="report-icon report-icon-huaban16fuben4"></i>
            </button>
            <h4 class="modal-title">
               ${title}
            </h4>
         </div>
         <div class="modal-body">
            ${typeof(dialogContent)==='string' ? dialogContent : ''}
         </div>`);
    if (typeof (dialogContent) === 'object') {
        content.find('.modal-body').append(dialogContent);
    }
    dialog.append(content);
    let footer = $(`<div class="modal-footer"></div>`);
    content.append(footer);
    if (buttons) {
        buttons.forEach((btn, index) => {
            let button = $(`<button type="button" class="el-button el-button--primary el-button--small">${btn.name}</button>`);
            button.click(function (e) {
                btn.click.call(this);
                if (!btn.holdDialog) {
                    modal.modal('hide');
                }
            }.bind(this));
            footer.append(button);
        });
    } else {
        let okBtn = $(`<button type="button" class="el-button el-button--primary el-button--small" data-dismiss="modal">确定</button>`);
        footer.append(okBtn);
    }

    modal.on("show.bs.modal", function () {
        var index = 1050;
        $(document).find('.modal').each(function (i, d) {
            var zIndex = $(d).css('z-index');
            if (zIndex && zIndex !== '' && !isNaN(zIndex)) {
                zIndex = parseInt(zIndex);
                if (zIndex > index) {
                    index = zIndex;
                }
            }
        });
        index++;
        modal.css({
            'z-index': index
        });
    });
    return modal;
};