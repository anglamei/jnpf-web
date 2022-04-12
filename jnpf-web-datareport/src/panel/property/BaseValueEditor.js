/**
 * Created by Jacky.Gao on 2017-03-01.
 */
import {
    setDirty,
    getUrlParam
} from '../../Utils.js';
import PropertyConditionDialog from '../../dialog/PropertyConditionDialog.js';

export default class BaseValueEditor {
    _buildFillBlankRows(container) {
        this.fillGroup = $(`<div class="form-group custom-formitm"><label class="lab">${window.i18n.property.base.fillBlank}</label></div>`);
        this.fillGroupItx = $('<div class="ipt"></div>')
        this.fillGroup.append(this.fillGroupItx);
        this.enableFillRadio = $(`<label class="checkbox-inline" style="padding-left: 2px"><input type="radio" name="__fill_blank_row_radio" value="default">&nbsp;${window.i18n.property.base.open}</label>`);
        this.fillGroupItx.append(this.enableFillRadio);
        this.disableFillRadio = $(`<label class="checkbox-inline" style="padding-left: 2px"><input type="radio" name="__fill_blank_row_radio" value="custom">&nbsp;${window.i18n.property.base.close}</label>`);
        this.fillGroupItx.append(this.disableFillRadio);
        if (container) {
            container.append(this.fillGroup);
        } else {
            this.container.append(this.fillGroup);
        }
        const _this = this;
        this.enableFillRadio.children('input').click(function () {
            _this._setFillBlankRows(true);
            _this.multipleGroup.show();
        });
        this.disableFillRadio.children('input').click(function () {
            _this._setFillBlankRows(false);
            _this.multipleGroup.hide();
        });
        this.multipleGroup = $(`<span style="margin-left: 10px">${window.i18n.property.base.rowTimes}</span>`);
        this.fillGroup.append(this.multipleGroup);
        this.multipleEditor = $(`<input type="number" class="form-control" style="display: inline-block;width: 77px;height: 25px;padding: 3px;font-size: 12px">`);
        this.multipleGroup.append(this.multipleEditor);
        this.multipleEditor.on('change', () => {
            const value = $(this).val();
            for (let i = _this.rowIndex; i <= _this.row2Index; i++) {
                for (let j = _this.colIndex; j <= _this.col2Index; j++) {
                    const cellDef = _this.context.getCell(i, j);
                    if (!cellDef) {
                        continue;
                    }
                    cellDef.multiple = value;
                }
            }
            setDirty();
        });
    }

    _setFillBlankRows(value) {
        if (this.initialized) {
            return;
        }
        for (let i = this.rowIndex; i <= this.row2Index; i++) {
            for (let j = this.colIndex; j <= this.col2Index; j++) {
                const cellDef = this.context.getCell(i, j);
                if (!cellDef) {
                    continue;
                }
                cellDef.fillBlankRows = value;
                if (!cellDef.multiple) {
                    cellDef.multiple = 0;
                }
            }
        }
        setDirty();
    }

    _buildWrapCompute(container) {
        this.wrapGroup = $(`
            <div class="form-group custom-formitm">
                <label class="lab">${window.i18n.property.base.newLineCompute}</label>
                <div class="ipt">
                    <label class="checkbox-inline" style="padding-left: 2px">
                        <input type="radio" name="__wrap_compute_radio" id="__wrap_compute_radio_default" value="default" title="${window.i18n.property.base.newLineComputeTip}">&nbsp;${window.i18n.property.base.open}
                    </label>
                    <label class="checkbox-inline" style="padding-left: 2px">
                        <input type="radio" name="__wrap_compute_radio" id="__wrap_compute_radio_custom" value="custom">&nbsp;${window.i18n.property.base.close}
                    </label>
                </div>
            </div>`);
        // this.enableWrapComput = $(`
        //     `);
        // this.wrapGroup.append(this.enableWrapComput);
        // this.disableWrapComput = $(`
        //     <label class="checkbox-inline" style="padding-left: 2px">
        //         <input type="radio" name="__wrap_compute_radio" value="custom">&nbsp;${window.i18n.property.base.close}
        //     </label>`);
        // this.wrapGroup.append(this.disableWrapComput);
        if (container) {
            container.append(this.wrapGroup);
        } else {
            this.container.append(this.wrapGroup);
        }
        const _this = this;
        $('#__wrap_compute_radio_default').on('click', () => {
            _this._setWrapCompute(true);
        });
        $('#__wrap_compute_radio_custom').on('click', () => {
            _this._setWrapCompute(false);
        });
    }

    _setWrapCompute(wrapCompute) {
        if (this.initialized) {
            return;
        }
        for (let i = this.rowIndex; i <= this.row2Index; i++) {
            for (let j = this.colIndex; j <= this.col2Index; j++) {
                const cellDef = this.context.getCell(i, j);
                if (!cellDef) {
                    continue;
                }
                cellDef.cellStyle.wrapCompute = wrapCompute;
            }
        }
        setDirty();
    }

    _buildFormat(container) {
        const _this = this;
        this.formatGroup = $(`<div class="form-group el-input--small custom-formitm"><label class="lab">${window.i18n.property.base.format}</label></div>`);
        this.formatEditor = $(`<input type="text" class="ipt form-control el-input__inner" style="display: inline-block;width: 278px;font-size: 12px;" placeholder="${window.i18n.property.base.formatTip}">`);
        this.formatGroup.append(this.formatEditor);
        this.formatEditor.completer({
            source: [
                "yyyy/MM/dd",
                "yyyy/MM",
                "yyyy-MM",
                "yyyy",
                "yyyy-MM-dd HH:mm:ss",
                "yyyy年MM月dd日 HH:mm:ss",
                "yyyy-MM-dd",
                "yyyy年MM月dd日",
                "HH:mm",
                "HH:mm:ss",
                "#.##",
                "#.00",
                "##.##%",
                "##.00%",
                "##,###.##",
                "￥##,###.##",
                "$##,###.##",
                "0.00E00",
                "##0.0E0"
            ],
            complete: function () {
                let value = _this.formatEditor.val();
                _this._setFormat(value);
            },
            suggest: true,
            zIndex: 1200
        });
        if (container) {
            container.append(this.formatGroup);
        } else {
            this.container.append(this.formatGroup);
        }
        this.formatEditor.change(function () {
            _this._setFormat($(this).val());
        });
    }

    _buildConditionProperty(container) {
        const _this = this;
        const token = getUrlParam('token')
        const group = $(`<div class="form-group custom-formitm"><label class="lab">${window.i18n.property.base.conditionProp}</label></div>`);
        if (container) {
            container.append(group);
        } else {
            this.container.append(group);
        }
        const configButton = $(`<button type="button" class="ipt el-button el-button--primary el-button--mini is-plain"><i class="glyphicon glyphicon-filter"></i> ${window.i18n.property.base.configCondition}</button>`);
        group.append(configButton);
        const propertyConditionDialog = new PropertyConditionDialog();
        configButton.on('click', () => {
            const conditionPropertyItems = _this.cellDef.conditionPropertyItems || [];
            if (!_this.cellDef.conditionPropertyItems) {
                _this.cellDef.conditionPropertyItems = conditionPropertyItems;
            }
            let datasetName = '';
            if (_this.datasetSelect) {
                datasetName = _this.datasetSelect.val();
                propertyConditionDialog.show(_this.datasources, datasetName, conditionPropertyItems);
            } else {
                const expr = _this.codeMirror.getValue();
                if (expr && expr !== '') {
                    const url = window._server + '/designer/parseDatasetName';
                    $.ajax({
                        url,
                        type: 'POST',
                        data: {
                            expr
                        },
                        headers: {
                            'Authorization': token
                        },
                        success: function (result) {
                            datasetName = result.datasetName;
                            propertyConditionDialog.show(_this.datasources, datasetName, conditionPropertyItems);
                        },
                        error: function () {
                            propertyConditionDialog.show(_this.datasources, datasetName, conditionPropertyItems);
                        }
                    });
                }
            }
        });
    }

    _setFormat(format) {
        if (this.initialized) {
            return;
        }
        for (let i = this.rowIndex; i <= this.row2Index; i++) {
            for (let j = this.colIndex; j <= this.col2Index; j++) {
                const cellDef = this.context.getCell(i, j);
                if (!cellDef) {
                    continue;
                }
                cellDef.cellStyle.format = format;
            }
        }
        setDirty();
    }

    _buildScriptLintFunction() {
        return function (text, updateLinting, options, editor) {
            if (text === '') {
                updateLinting(editor, []);
                return;
            }
            if (!text || text === '') {
                return;
            }
            const url = window._server + '/designer/scriptValidation';
            const token = getUrlParam('token')
            $.ajax({
                url,
                data: {
                    content: text
                },
                type: 'POST',
                headers: {
                    'Authorization': token
                },
                success: function (result) {
                    if (result) {
                        for (let item of result) {
                            item.from = {
                                line: item.line - 1
                            };
                            item.to = {
                                line: item.line - 1
                            };
                        }
                        updateLinting(editor, result);
                    } else {
                        updateLinting(editor, []);
                    }
                },
                error: function () {
                    alert(`${window.i18n.property.base.syntaxError}`);
                }
            });
        };
    }
}