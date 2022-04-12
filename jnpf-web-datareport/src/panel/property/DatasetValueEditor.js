/**
 * Created by Jacky.Gao on 2017-02-07.
 */
import ConditionDialog from '../../dialog/ConditionDialog.js';
import {
    alert,
    confirm
} from '../../MsgBox.js';
import uuid from 'node-uuid';
import {
    setDirty
} from '../../Utils.js';
import BaseValueEditor from './BaseValueEditor.js';
import CustomGroupDialog from '../../dialog/CustomGroupDialog.js';
import MappingDialog from '../../dialog/MappingDialog.js';

export default class DatasetValueEditor extends BaseValueEditor {
    constructor(parentContainer, context) {
        super();
        this.context = context;
        this.container = $(`<div style="margin: 5px;"></div>`);
        parentContainer.append(this.container);
        this.mappingDialog = new MappingDialog();
        this._init();
        this.container.hide();
    }
    _init() {
        const _this = this;

        const tab = $(`<ul class="nav nav-tabs">
            <li class="active"><a href="#__dataset_config" data-toggle="tab">${window.i18n.property.dataset.datasetConfig}</a></li>
            <li><a href="#__filter_condition" data-toggle="tab">${window.i18n.property.dataset.filterCondition}</a></li>
            <li><a href="#__data_mapping" data-toggle="tab">${window.i18n.property.dataset.mapping}</a></li>
        </ul>`);
        this.container.append(tab);
        const tabContainer = $(`<div class="tab-content"></div>`);
        this.container.append(tabContainer);

        const dsContainer = $(`<div id="__dataset_config" class="tab-pane fade in active"></div>`);
        tabContainer.append(dsContainer);
        const conditionContainer = $(`<div id="__filter_condition" class="tab-pane fade"></div>`);
        tabContainer.append(conditionContainer);
        this._buildConditionTable(conditionContainer);
        const mappingContainer = $(`<div id="__data_mapping" class="tab-pane fade"></div>`);
        tabContainer.append(mappingContainer);
        this._buildMappingTable(mappingContainer);

        const datasetGroup = $(`<div class="custom-formitm" style="margin-top: 10px"><label class="lab">${window.i18n.property.dataset.dataset}</label></div>`);
        this.datasetSelect = $(`<select class="form-control ipt" style="display: inline-block;width:278px;padding:3px;font-size: 12px;height: 32px"></select>`);
        datasetGroup.append(this.datasetSelect);
        dsContainer.append(datasetGroup);

        const propertyGroup = $(`<div class="custom-formitm"><label class="lab">${window.i18n.property.dataset.property}</label></div>`);
        this.propertySelect = $(`<select class="form-control ipt" style="display: inline-block;width:278px;padding: 3px;font-size: 12px;height: 32px"></select>`);
        propertyGroup.append(this.propertySelect);
        dsContainer.append(propertyGroup);

        this.datasetSelect.change(function () {
            _this.propertySelect.empty();
            const dsName = $(this).val();
            let fields = [];
            for (let ds of _this.datasources) {
                let datasets = ds.datasets || [];
                for (let dataset of datasets) {
                    if (dataset.name === dsName) {
                        fields = dataset.fields || [];
                        break;
                    }
                }
                if (fields.length > 0) {
                    break;
                }
            }
            for (let field of fields) {
                _this.propertySelect.append(`<option>${field.name}</option>`);
            }
            _this.propertySelect.append(`<option selected></option>`);
            _this._setDatasetName(dsName);
        });

        this.propertySelect.change(function () {
            const value = $(this).val();
            _this._setProperty(value);
        });

        const aggregateGroup = $(`<div class="custom-formitm"><label class="lab">${window.i18n.property.dataset.aggregateType}</label></div>`);
        this.aggregateSelect = $(`<select class="form-control ipt" style="display: inline-block;width: 142px;font-size: 12px;height: 32px;padding: 3px;">
            <option value="select">${window.i18n.property.dataset.select}</option>
            <option value="group">${window.i18n.property.dataset.group}</option>
            <option value="customgroup">${window.i18n.property.dataset.customGroup}</option>
            <option value="sum">${window.i18n.property.dataset.sum}</option>
            <option value="count">${window.i18n.property.dataset.count}</option>
            <option value="max">${window.i18n.property.dataset.max}</option>
            <option value="min">${window.i18n.property.dataset.min}</option>
            <option value="avg">${window.i18n.property.dataset.avg}</option>
        </select>`);
        aggregateGroup.append(this.aggregateSelect);
        const customGroupButton = $(`<button type="button" class="el-button el-button--primary el-button--mini is-plain" style="margin-left: 10px;">${window.i18n.property.dataset.configCustomGroup}</button>`);
        this.aggregateSelect.change(function () {
            const value = $(this).val();
            _this.cellDef.value.aggregate = value;
            if (value === 'customgroup') {
                customGroupButton.show();
            } else {
                customGroupButton.hide();
            }
            if (value === 'group' || value === 'select') {
                _this.mappingGroup.show();
            } else {
                _this.mappingGroup.hide();
            }
            if (value === 'sum' || value === 'count' || value === 'max' || value === 'min' || value === 'avg') {
                sortGroup.hide();
                expandGroup.hide();
            } else {
                expandGroup.show();
                sortGroup.show();
            }
            _this._setAggregate(value);
        });
        const customGroupDialog = new CustomGroupDialog();
        customGroupButton.on('click', () => {
            if (!_this.cellDef.value.groupItems) {
                _this.cellDef.value.groupItems = [];
            }
            let fields = _this._buildFields();
            customGroupDialog.show(_this.cellDef, fields);
            setDirty();
        });
        aggregateGroup.append(customGroupButton);
        dsContainer.append(aggregateGroup);

        const sortGroup = $(`<div class="custom-formitm"><label class="lab">${window.i18n.property.dataset.sortType}</label></div>`);
        this.sortGroupItx = $(`<div class="ipt"></div>`)
        sortGroup.append(this.sortGroupItx);

        this.noneSortRadio = $(`<label class="checkbox-inline" style="padding-left: 2px"><input type="radio" name="__sort_radio" value="asc">&nbsp;${window.i18n.property.dataset.notSort}</label>`);
        this.sortGroupItx.append(this.noneSortRadio);
        this.noneSortRadio.children('input').on('click', () => {
            _this._setOrder('none');
        });
        this.ascSortRadio = $(`<label class="checkbox-inline" style="padding-left: 2px"><input type="radio" name="__sort_radio" value="asc">&nbsp;${window.i18n.property.dataset.asc}</label>`);
        this.sortGroupItx.append(this.ascSortRadio);
        this.ascSortRadio.children('input').on('click', () => {
            _this._setOrder('asc');
        });
        this.descSortRadio = $(`<label class="checkbox-inline" style="padding-left: 2px"><input type="radio" name="__sort_radio" value="desc">&nbsp;${window.i18n.property.dataset.desc}</label>`);
        this.sortGroupItx.append(this.descSortRadio);
        this.descSortRadio.children('input').on('click', () => {
            _this._setOrder('desc');
        });
        dsContainer.append(sortGroup);

        const expandGroup = $(`<div class="form-group custom-formitm"><label class="lab">${window.i18n.property.dataset.expand}</label></div>`);
        this.expandItx = $(`<div class="ipt"></div>`)
        expandGroup.append(this.expandItx);
        this.downExpandRadio = $(`<label class="checkbox-inline" style="padding-left: 2px"><input type="radio" name="__expand_radio" value="Down">&nbsp;${window.i18n.property.dataset.down}</label>`);
        this.expandItx.append(this.downExpandRadio);
        this.downExpandRadio.children('input').on('click', () => {
            _this._setExpand('Down');
        });
        this.rightExpandRadio = $(`<label class="checkbox-inline" style="padding-left: 2px"><input type="radio" name="__expand_radio" value="Right">&nbsp;${window.i18n.property.dataset.right}</label>`);
        this.expandItx.append(this.rightExpandRadio);
        this.rightExpandRadio.children('input').on('click', () => {
            _this._setExpand('Right');
        });
        this.noneExpandRadio = $(`<label class="checkbox-inline" style="padding-left: 2px"><input type="radio" name="__expand_radio" value="None">&nbsp;${window.i18n.property.dataset.noneExpand}</label>`);
        this.expandItx.append(this.noneExpandRadio);
        this.noneExpandRadio.children('input').on('click', () => {
            _this._setExpand('None');
        });
        dsContainer.append(expandGroup);
        dsContainer.append(this.buildLineHeight());

        this._buildWrapCompute(dsContainer);
        this._buildFormat(dsContainer);
        this._buildFillBlankRows(dsContainer);
        this._buildConditionProperty(dsContainer);
    }

    buildLineHeight() {
        const _this = this;
        const group = $(`<div class="custom-formitm el-input--small"><label class="lab">${window.i18n.property.dataset.lineHeight}</label></div>`);
        this.lineHeightEditor = $(`<input type="number" class="form-control ipt el-input__inner" placeholder="${window.i18n.property.dataset.lineHeightTip}" style="display: inline-block;width: 278px;padding-right: 3px">`);
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

    _setDatasetName(datasetName) {
        if (this.initialized) {
            return;
        }
        const hot = this.context.hot;
        for (let i = this.rowIndex; i <= this.row2Index; i++) {
            for (let j = this.colIndex; j <= this.col2Index; j++) {
                const cellDef = hot.context.getCell(i, j);
                if (!cellDef) {
                    continue;
                }
                const valueType = cellDef.value.type;
                if (valueType === 'dataset') {
                    cellDef.value.datasetName = datasetName;
                }
            }
        }
        this._updateTableData();
        setDirty();
    }
    _setProperty(property) {
        if (this.initialized) {
            return;
        }
        const hot = this.context.hot;
        for (let i = this.rowIndex; i <= this.row2Index; i++) {
            for (let j = this.colIndex; j <= this.col2Index; j++) {
                const cellDef = hot.context.getCell(i, j);
                if (!cellDef) {
                    continue;
                }
                const valueType = cellDef.value.type;
                if (valueType === 'dataset') {
                    cellDef.value.property = property;
                }
            }
        }
        this._updateTableData();
        setDirty();
    }
    _setAggregate(aggregate) {
        if (this.initialized) {
            return;
        }
        const hot = this.context.hot;
        let none = false;
        for (let i = this.rowIndex; i <= this.row2Index; i++) {
            for (let j = this.colIndex; j <= this.col2Index; j++) {
                const cellDef = hot.context.getCell(i, j);
                if (!cellDef) {
                    continue;
                }
                const valueType = cellDef.value.type;
                if (valueType === 'dataset') {
                    cellDef.value.aggregate = aggregate;
                    if (aggregate === 'sum' || aggregate === 'count' || aggregate === 'max' || aggregate === 'min' || aggregate === 'avg') {
                        cellDef.value.order = 'none';
                        cellDef.expand = 'None';
                        none = true;
                    }
                }
            }
        }
        if (none) {
            this.noneSortRadio.children('input').trigger('click');
            this.noneExpandRadio.children('input').trigger('click');
        }
        this._updateTableData();
        hot.render();
        setDirty();
    }

    _setOrder(order) {
        if (this.initialized) {
            return;
        }
        const hot = this.context.hot;
        for (let i = this.rowIndex; i <= this.row2Index; i++) {
            for (let j = this.colIndex; j <= this.col2Index; j++) {
                const cellDef = hot.context.getCell(i, j);
                if (!cellDef) {
                    continue;
                }
                const valueType = cellDef.value.type;
                if (valueType === 'dataset') {
                    cellDef.value.order = order;
                }
            }
        }
        setDirty();
    }

    _setExpand(expand) {
        if (this.initialized) {
            return;
        }
        const hot = this.context.hot;
        for (let i = this.rowIndex; i <= this.row2Index; i++) {
            for (let j = this.colIndex; j <= this.col2Index; j++) {
                const cellDef = hot.context.getCell(i, j);
                if (!cellDef) {
                    continue;
                }
                const valueType = cellDef.value.type;
                if (valueType === 'dataset' || valueType === 'expression') {
                    cellDef.expand = expand;
                }
            }
        }
        hot.render();
        setDirty();
    }

    _buildConditionTable(container) {
        const _this = this;
        const group = $(`<div class="form-group" style="margin-bottom: 10px;"></div>`);
        const conditionGroup = $(`<span style="float: right;padding: 10px 0"></span>`);
        group.append(conditionGroup);
        const addButton = $(`<button type="button" class="el-button el-button--default el-button--mini" title="${window.i18n.property.dataset.addFilterCondition}">
            <i class="report-icon report-icon-add"></i>
        </button>`);
        conditionGroup.append(addButton);
        this.conditionList = $(`<select class="form-control" size="5" style="height: 100px;"></select>`);
        addButton.on('click', () => {
            let fields = _this._buildFields();
            if (!fields) {
                return;
            }
            const conditions = _this.cellDef.value.conditions;
            const conditionDialog = new ConditionDialog(conditions);
            conditionDialog.show(function (left, op, right, join) {
                const c = {
                    left,
                    operation: op,
                    right,
                    join,
                    id: uuid.v1()
                };
                conditions.push(c);
                let text = left + " " + op + " " + right;
                if (join) {
                    text = join + " " + text;
                }
                const option = $(`<option>${text}</option>`);
                option.data(c);
                _this.conditionList.append(option);
            }, fields);
        });
        const editButton = $(`<button type="button" class="el-button el-button--default el-button--mini" title="${window.i18n.property.dataset.editFilterCondition}">
            <i class="report-icon report-icon-bianji"></i></button>`);
        conditionGroup.append(editButton);
        editButton.on('click', () => {
            const option = _this.conditionList.find('option:selected');
            if (option.length === 0) {
                alert(`${window.i18n.property.dataset.selectFilterConditionTip}`);
                return;
            }
            const condition = option.data();
            let fields = _this._buildFields();
            if (!fields) {
                return;
            }
            const conditions = _this.cellDef.value.conditions;
            const conditionDialog = new ConditionDialog(conditions);
            conditionDialog.show(function (left, op, right, join) {
                let targetCondition = null;
                for (let i = 0; i < conditions.length; i++) {
                    let c = conditions[i];
                    if (c.id === condition.id) {
                        targetCondition = c;
                        break;
                    }
                }
                targetCondition.left = left;
                targetCondition.operation = op;
                targetCondition.right = right;
                targetCondition.join = join;
                let text = left + " " + op + " " + right;
                if (join) {
                    text = join + " " + text;
                }
                option.data(targetCondition);
                option.html(text);
                setDirty();
            }, fields, condition);
        });

        const delButton = $(`<button type="button" class="el-button el-button--default el-button--mini" title="${window.i18n.property.dataset.delFilterCondition}">
            <i class="report-icon report-icon-shanchu"></i></button>`);
        conditionGroup.append(delButton);
        delButton.on('click', () => {
            const option = _this.conditionList.find('option:selected');
            if (option.length === 0) {
                alert(`${window.i18n.property.dataset.delFilterConditionTip}`);
                return;
            }
            const condition = option.data();
            const conditions = _this.cellDef.value.conditions;
            let index = -1;
            for (let i = 0; i < conditions.length; i++) {
                let c = conditions[i];
                if (c.id === condition.id) {
                    index = i;
                    break;
                }
            }
            conditions.splice(index, 1);
            option.remove();
            setDirty();
        });
        group.append(this.conditionList);
        container.append(group);
    }

    _buildMappingTable(container) {
        this.mappingGroup = $(`<div class="form-group" style="padding-top: 10px"></div>`);
        const _this = this;

        const typeGroup = $(`<div class="custom-formitm"><label class="lab">${window.i18n.property.dataset.mappingType}</label></div>`);
        this.typeGroupItx = $(`<div class="ipt"></div>`)
        this.mappingGroup.append(typeGroup);
        typeGroup.append(this.typeGroupItx);
        this.simpleMappingRadio = $(`<label class="checkbox-inline" style="padding-left: 2px"><input type="radio" name="__data_mapping_radio" value="Down">&nbsp;${window.i18n.property.dataset.simple}</label>`);
        this.typeGroupItx.append(this.simpleMappingRadio);
        this.simpleMappingRadio.children('input').on('click', () => {
            _this.sampleMappingGroup.show();
            _this.datasetMappingGroup.hide();
            const datasetValue = _this.cellDef.value;
            datasetValue.mappingType = 'simple';

        });
        this.datasetMappingRadio = $(`<label class="checkbox-inline" style="padding-left: 2px"><input type="radio" name="__data_mapping_radio" value="Right">&nbsp;${window.i18n.property.dataset.ds}</label>`);
        this.typeGroupItx.append(this.datasetMappingRadio);
        this.datasetMappingRadio.children('input').on('click', () => {
            _this.sampleMappingGroup.hide();
            _this.datasetMappingGroup.show();
            const datasetValue = _this.cellDef.value;
            datasetValue.mappingType = 'dataset';
        });

        this.sampleMappingGroup = $(`<div class="form-group" style="padding-top: 1px"></div>`);
        this.mappingGroup.append(this.sampleMappingGroup);
        const addButton = $(`<button type="button" class="el-button el-button--default el-button--mini" style="float: right;margin-bottom: 10px;" title="${window.i18n.property.dataset.addMappping}"><i class="report-icon report-icon-add"></i></button>`);
        this.sampleMappingGroup.append(addButton);
        addButton.on('click', () => {
            const newItem = {
                value: '',
                label: ''
            };
            _this.mappingDialog.show(function () {
                const datasetValue = _this.cellDef.value;
                if (!datasetValue.mappingItems) {
                    datasetValue.mappingItems = [];
                }
                datasetValue.mappingItems.push(newItem);
                const tr = $(`<tr style="height: 30px"></tr>`);
                const valueTd = $(`<td style="vertical-align: middle">${newItem.value}</td>`);
                const labelTd = $(`<td style="vertical-align: middle">${newItem.label}</td>`);
                tr.append(valueTd);
                tr.append(labelTd);
                _this.mappingTbody.append(tr);
                const td = $(`<td style="vertical-align: middle"></td>`);
                tr.append(td);
                const delLink = $(`<a href="javascript:;">删除</a>`);
                td.append(delLink);
                delLink.click(function () {
                    confirm(`${window.i18n.property.dataset.delConfirm}`, function () {
                        const index = datasetValue.mappingItems.indexOf(newItem);
                        datasetValue.mappingItems.splice(index, 1);
                        tr.remove();
                    });
                });

                const editLink = $(`<a href="javascript:;" style="margin-left: 10px">编辑</a>`);
                td.append(editLink);
                editLink.on('click', () => {
                    _this.mappingDialog.show(function () {
                        valueTd.html(newItem.value);
                        labelTd.html(newItem.label);
                    }, newItem, 'edit');
                });
            }, newItem, 'add');
        });
        const mappingTable = $(`
            <table class="el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition el-table--small">
                <thead class="el-table__header">
                    <tr>
                        <th style="width: 130px;vertical-align: middle">${window.i18n.property.dataset.realValue}</th>
                        <th style="width: 170px;vertical-align: middle">${window.i18n.property.dataset.displayValue}</th>
                        <th style="vertical-align: middle">${window.i18n.property.dataset.op}</th>
                    </tr>
                </thead>
            </table>`);
        this.mappingTbody = $(`<tbody class="el-table__body"></tbody>`);
        mappingTable.append(this.mappingTbody);
        this.sampleMappingGroup.append(mappingTable);

        this.datasetMappingGroup = $(`<div class="form-group" style="padding-top: 1px"></div>`);
        this.mappingGroup.append(this.datasetMappingGroup);

        const datasetGroup = $(`<div class="custom-formitm"><label class="lab">${window.i18n.property.dataset.dataset}</label></div>`);
        this.mappingDatasetSelect = $(`<select class="form-control ipt" style="display: inline-block;width:266px;padding:2px;font-size: 12px;height: 32px"></select>`);
        datasetGroup.append(this.mappingDatasetSelect);
        this.datasetMappingGroup.append(datasetGroup);

        const keyPropertyGroup = $(`<div class="custom-formitm"><label class="lab">${window.i18n.property.dataset.realValueProp}</label></div>`);
        this.mappingKeyPropertySelect = $(`<select class="form-control ipt" style="display: inline-block;width:266px;padding: 2px;font-size: 12px;height: 32px"></select>`);
        keyPropertyGroup.append(this.mappingKeyPropertySelect);
        this.datasetMappingGroup.append(keyPropertyGroup);

        const valuePropertyGroup = $(`<div class="custom-formitm"><label class="lab">${window.i18n.property.dataset.displayValueProp}</label></div>`);
        this.mappingValuePropertySelect = $(`<select class="form-control ipt" style="display: inline-block;width:266px;padding: 2px;font-size: 12px;height: 32px"></select>`);
        valuePropertyGroup.append(this.mappingValuePropertySelect);
        this.datasetMappingGroup.append(valuePropertyGroup);

        this.mappingDatasetSelect.change(function () {
            _this.mappingKeyPropertySelect.empty();
            _this.mappingValuePropertySelect.empty();
            const dsName = $(this).val();
            const datasetValue = _this.cellDef.value;
            datasetValue.mappingDataset = dsName;
            let fields = [];
            for (let ds of _this.datasources) {
                let datasets = ds.datasets || [];
                for (let dataset of datasets) {
                    if (dataset.name === dsName) {
                        fields = dataset.fields || [];
                        break;
                    }
                }
                if (fields.length > 0) {
                    break;
                }
            }
            for (let field of fields) {
                _this.mappingKeyPropertySelect.append(`<option>${field.name}</option>`);
                _this.mappingValuePropertySelect.append(`<option>${field.name}</option>`);
            }
            _this.mappingKeyPropertySelect.append(`<option selected></option>`);
            _this.mappingValuePropertySelect.append(`<option selected></option>`);
        });

        this.mappingKeyPropertySelect.change(function () {
            const datasetValue = _this.cellDef.value;
            datasetValue.mappingKeyProperty = $(this).val();
        });
        this.mappingValuePropertySelect.change(function () {
            const datasetValue = _this.cellDef.value;
            datasetValue.mappingValueProperty = $(this).val();
        });

        container.append(this.mappingGroup);
    }

    _buildFields() {
        const _this = this;
        let fields = [],
            datasetName = _this.datasetSelect.val();
        if (datasetName === '') {
            alert(`${window.i18n.property.dataset.bindDatasetTip}`);
            return null;
        }
        for (let ds of _this.datasources) {
            let datasets = ds.datasets || [];
            for (let dataset of datasets) {
                if (dataset.name === datasetName) {
                    fields = dataset.fields || [];
                    break;
                }
            }
            if (fields.length > 0) {
                break;
            }
        }
        return fields;
    }

    _updateTableData() {
        const hot = this.context.hot,
            cellList = this.context.cellList;
        for (let i = this.rowIndex; i <= this.row2Index; i++) {
            for (let j = this.colIndex; j <= this.col2Index; j++) {
                const cellDef = hot.context.getCell(i, j);
                if (!cellDef) {
                    continue;
                }
                const value = cellDef.value,
                    valueType = cellDef.value.type;
                let data = '';
                if (valueType === 'simple') {
                    data = value.value;
                } else if (valueType === 'dataset') {
                    data = value.datasetName + "." + value.aggregate + "(" + value.property + ")";
                } else if (valueType === 'expression') {
                    data = value.value;
                }
                hot.setDataAtCell(cellDef.rowNumber - 1, cellDef.columnNumber - 1, data);
            }
        }
    }

    show(cellDef, rowIndex, colIndex, row2Index, col2Index) {
        let cellStyle = cellDef.cellStyle;
        if (cellStyle.wrapCompute) {
            $('#__wrap_compute_radio_default').prop('checked', true);
            // this.enableWrapComput.children('input').prop('checked', true);
        } else {
            $('#__wrap_compute_radio_custom').prop('checked', true);
            // this.disableWrapComput.children('input').prop('checked', true);
        }
        if (cellStyle.lineHeight) {
            this.lineHeightEditor.val(cellStyle.lineHeight);
        } else {
            this.lineHeightEditor.val('');
        }
        if (cellStyle.format) {
            this.formatEditor.val(cellStyle.format);
        } else {
            this.formatEditor.val('');
        }
        this.initialized = true;
        this.cellDef = cellDef;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.row2Index = row2Index;
        this.col2Index = col2Index;
        this.container.show();
        this.datasetSelect.empty();
        this.mappingDatasetSelect.empty();
        this.propertySelect.empty();
        this.mappingKeyPropertySelect.empty();
        this.mappingValuePropertySelect.empty();
        this.datasources = this.context.reportDef.datasources;
        for (let ds of this.datasources) {
            let datasets = ds.datasets || [];
            for (let dataset of datasets) {
                this.datasetSelect.append(`<option>${dataset.name}</option>`);
                this.mappingDatasetSelect.append(`<option>${dataset.name}</option>`);
            }
        }
        if (cellDef.fillBlankRows) {
            this.enableFillRadio.trigger("click");
            this.multipleEditor.val(cellDef.multiple);
            this.multipleGroup.show();
        } else {
            this.disableFillRadio.trigger("click");
            this.multipleGroup.hide();
        }
        const expand = cellDef.expand;
        if (expand === 'None') {
            this.noneExpandRadio.trigger('click');
        } else if (expand === 'Down') {
            this.downExpandRadio.trigger('click');
        } else if (expand === 'Right') {
            this.rightExpandRadio.trigger('click');
        }
        const value = cellDef.value;
        this.datasetSelect.val(value.datasetName);
        this.datasetSelect.trigger('change');
        this.propertySelect.val(value.property);
        this.aggregateSelect.val(value.aggregate);
        this.aggregateSelect.trigger('change');
        this.mappingDatasetSelect.val(value.mappingDataset);
        this.mappingDatasetSelect.trigger('change');
        this.mappingKeyPropertySelect.val(value.mappingKeyProperty);
        this.mappingValuePropertySelect.val(value.mappingValueProperty);
        if (!value.mappingType || value.mappingType === 'simple') {
            this.simpleMappingRadio.trigger('click');
        } else {
            this.datasetMappingRadio.trigger('click');
        }
        const order = value.order;
        if (order === 'none') {
            this.noneSortRadio.trigger('click');
        } else if (order === 'desc') {
            this.descSortRadio.trigger('click');
        } else if (order === 'asc') {
            this.ascSortRadio.trigger('click');
        }
        this.initialized = false;
        this.conditionList.empty();
        const conditions = this.cellDef.value.conditions;
        for (let condition of conditions) {
            if (!condition.id) {
                condition.id = uuid.v1();
            }
            const op = condition.operation;
            let text = condition.left + ' ' + op + " " + condition.right;
            if (condition.join) {
                text = condition.join + ' ' + text;
            }
            const option = $(`<option>${text}</option>`);
            option.data(condition);
            this.conditionList.append(option);
        }
        this.mappingTbody.empty();
        const datasetValue = this.cellDef.value;
        const mappingItems = datasetValue.mappingItems || [];
        const _this = this;
        for (let item of mappingItems) {
            const tr = $(`<tr style="height: 30px"></tr>`);
            const valueTd = $(`<td style="vertical-align: middle">${item.value}</td>`);
            const labelTd = $(`<td style="vertical-align: middle">${item.label}</td>`);
            tr.append(valueTd);
            tr.append(labelTd);
            this.mappingTbody.append(tr);
            const td = $(`<td style="vertical-align: middle"></td>`);
            tr.append(td);
            const delLink = $(`<a href="javascript:;"><i class="glyphicon glyphicon-trash" style="font-size: 16px;color: #d30e00;"></i></a>`);
            td.append(delLink);
            delLink.on('click', () => {
                confirm(`${window.i18n.property.dataset.delConfirm}`, function () {
                    const index = datasetValue.mappingItems.indexOf(item);
                    datasetValue.mappingItems.splice(index, 1);
                    tr.remove();
                });
            });

            const editLink = $(`<a href="javascript:;" style="margin-left: 10px"><i class="glyphicon glyphicon-pencil" style="font-size: 16px;color: #005fd3;"></i></a>`);
            td.append(editLink);
            editLink.on('click', () => {
                _this.mappingDialog.show(function () {
                    valueTd.html(item.value);
                    labelTd.html(item.label);
                }, item, 'edit');
            });
        }
        if (!value.mappingType || value.mappingType === 'simple') {
            this.sampleMappingGroup.show();
            this.datasetMappingGroup.hide();
        } else {
            this.sampleMappingGroup.hide();
            this.datasetMappingGroup.show();
        }
    }
    hide() {
        this.container.hide();
    }
}