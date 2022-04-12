/**
 * Created by Jacky.Gao on 2017-02-06.
 */
import ParameterDialog from './ParameterDialog.js';

export default class ParameterTable{
    constructor(container,data){
        this.data=data;
        const addButton=$(`<button type="button" class="el-button el-button--primary el-button--mini"><i class="report-icon report-icon-add" /><span>${window.i18n.dialog.paramTable.addParam}</span></button>`);
        container.append(addButton);
        const _this=this;
        const table=$(`
            <table class="el-table el-table--fit el-table--border el-table--scrollable-y el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="margin-top: 10px">
                <thead class="el-table__header">
                    <tr>
                        <th>${window.i18n.dialog.paramTable.paramName}</th>
                        <th>${window.i18n.dialog.paramTable.paramDatatype}</th>
                        <th>${window.i18n.dialog.paramTable.defaultValue}</th>
                        <th style="width: 80px; text-align: center;">${window.i18n.dialog.paramTable.operator}</th>
                    </tr>
                </thead>
            </table>
        `);
        this.body=$(`<tbody class="el-table__body"></tbody>`);
        table.append(this.body);
        this._buildParameters();
        container.append(table);
        this.parameterDialog=new ParameterDialog(this.data);
        addButton.on('click',() =>{
            _this.parameterDialog.show(function(name,type,defaultValue){
                const obj={ name, type, defaultValue};
                _this.data.push(obj);
                const newTr=$(`<tr style="height: 35px;"></tr>`);
                const nameTd=$(`<td style="vertical-align: middle">${name}</td>`);
                const typeTd=$(`<td style="vertical-align: middle">${type}</td>`);
                const defaultValueTd=$(`<td style="vertical-align: middle">${defaultValue}</td>`);
                newTr.append(nameTd);
                newTr.append(typeTd);
                newTr.append(defaultValueTd);
                const opTd=$(`<td style="vertical-align: middle; text-align: center;"></td>`);
                const removeSpan=$(`<span><a href="javascript:;"><i class="glyphicon glyphicon-trash" title="${window.i18n.dialog.paramTable.delParam}" style="font-size: 12pt;color: #d30a16;"></a></span>`);
                opTd.append(removeSpan);
                newTr.append(opTd);
                _this.body.append(newTr);
                removeSpan.on('click',() =>{
                    let index=_this.data.indexOf(obj);
                    _this.data.splice(index,1);
                    newTr.remove();
                });
                const editSpan=$(`<span><a href="javascript:;"><i class="glyphicon glyphicon-edit" title="${window.i18n.dialog.paramTable.editParam}" style="font-size: 12pt;color: #005fd3;margin-left: 10px"></a></span>`);
                opTd.append(editSpan);
                editSpan.on('click',() =>{
                    _this.parameterDialog.show(function(name,type,defaultValue){
                        obj.name = name;
                        obj.type = type;
                        obj.defaultValue = defaultValue;
                        nameTd.html(name);
                        typeTd.html(type);
                        defaultValueTd.html(defaultValue);
                    },obj);
                });
            },null)
        });
    }
    refreshData(){
        this.body.empty();
        this.parameterDialog.data=this.data;
        this._buildParameters();
    }
    _buildParameters(){
        const _this=this;
        for(let param of this.data){
            const tr=$(`<tr style="height: 35px;"></tr>`);
            const nameTd=$(`<td style="vertical-align: middle">${param.name}</td>`);
            const typeTd=$(`<td style="vertical-align: middle">${param.type}</td>`);
            const defaultValueTd=$(`<td style="vertical-align: middle">${param.defaultValue}</td>`);
            tr.append(nameTd);
            tr.append(typeTd);
            tr.append(defaultValueTd);

            const opTd=$(`<td style="vertical-align: middle"></td>`);
            const deleteSpan=$(`<span><a href="javascript:;"><i class="glyphicon glyphicon-trash" title="${window.i18n.dialog.paramTable.delParam}" style="font-size: 12pt;color: #d30a16;"></a></span>`);
            opTd.append(deleteSpan);
            tr.append(opTd);
            deleteSpan.on('click',() =>{
                let index=_this.data.indexOf(param);
                _this.data.splice(index,1);
                tr.remove();
            });
            this.body.append(tr);

            const editSpan=$(`<span><a href="javascript:;"><i class="glyphicon glyphicon-edit" title="${window.i18n.dialog.paramTable.editParam}" style="font-size: 12pt;color: #005fd3;margin-left: 10px"></a></span>`);
            opTd.append(editSpan);
            editSpan.on('click',() =>{
                _this.parameterDialog.show(function(name,type,defaultValue){
                    param.name=name;
                    param.type=type;
                    param.defaultValue=defaultValue;
                    nameTd.html(name);
                    typeTd.html(type);
                    defaultValueTd.html(defaultValue);
                },param);
            });
        }
    }
}