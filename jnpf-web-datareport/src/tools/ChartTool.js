/**
 * Created by Jacky.Gao on 2017-01-25.
 */
import {undoManager} from '../Utils.js';
import Tool from './Tool.js';
import {setDirty} from '../Utils.js';
import Handsontable from 'handsontable';

export default class ChartTool extends Tool{
    execute(){

    }
    buildButton(){
        const _this=this;
        const group=$(`<div class="btn-group"></div>`);
        const mainBtn=$(`<button type="button" class="btn btn-default dropdown-toggle" style="border:none;border-radius:0;padding: 6px 5px;" data-toggle="dropdown" title="${window.i18n.tools.chart.chart}">
            <i class="report-icon report-icon-pie"></i>
            <span class="caret"></span>
        </button>`);
        const ul=$(`<ul class="dropdown-menu" role="menu"></ul>`);
        const pie=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-pie"></i> ${window.i18n.tools.chart.pie}
                </a>
            </li>`);
        ul.append(pie);
        pie.click(function(){
            _this._doClick('pie');
        });
        const doughnut=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-doughnut"></i> ${window.i18n.tools.chart.doughnut}
                </a>
            </li>`);
        ul.append(doughnut);
        doughnut.click(function(){
            _this._doClick('doughnut');
        });
        const line=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-diagram"></i> ${window.i18n.tools.chart.line}
                </a>
            </li>`);
        ul.append(line);
        line.click(function(){
            _this._doClick('line');
        });
        const bar=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-column"></i> ${window.i18n.tools.chart.bar}
                </a>
            </li>`);
        ul.append(bar);
        bar.click(function(){
            _this._doClick('bar');
        });
        const horBar=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-horizontal-column"></i> ${window.i18n.tools.chart.horizontalBar}
                </a>
            </li>`);
        ul.append(horBar);
        horBar.click(function(){
            _this._doClick('horizontalBar');
        });
        const area=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-area"></i> ${window.i18n.tools.chart.area}
                </a>
            </li>`);
        ul.append(area);
        area.click(function(){
            _this._doClick('area');
        });
        const radar=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-radar"></i> ${window.i18n.tools.chart.radar}
                </a>
            </li>`);
        ul.append(radar);
        radar.click(function(){
            _this._doClick('radar');
        });
        const polar=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-polar-plot"></i> ${window.i18n.tools.chart.polar}
                </a>
            </li>`);
        ul.append(polar);
        polar.click(function(){
            _this._doClick('polarArea');
        });
        const scatter=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-scatter"></i> ${window.i18n.tools.chart.scatter}
                </a>
            </li>`);
        ul.append(scatter);
        scatter.click(function(){
            _this._doClick('scatter');
        });
        const bubble=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-bubble"></i> ${window.i18n.tools.chart.bubble}
                </a>
            </li>`);
        ul.append(bubble);
        bubble.click(function(){
            _this._doClick('bubble');
        });

        group.append(mainBtn);
        group.append(ul);
        return group;
    }
    _doClick(category){
        if(!this.checkSelection()){
            return;
        }
        const _this=this;
        const hot=_this.context.hot;
        const selected=hot.getSelected();
        const startRow=selected[0],startCol=selected[1],endRow=selected[2],endCol=selected[3];
        let cellDef=_this.context.getCell(startRow,startCol);
        let oldValue=cellDef.value,oldCellData=hot.getDataAtCell(startRow,startCol);
        hot.setDataAtCell(startRow,startCol,'');
        cellDef.value={
            type:'chart',
            chart:this._newChart(category)
        };
        hot.render();
        setDirty();
        Handsontable.hooks.run(hot, 'afterSelectionEnd',startRow,startCol,endRow,endCol);
        undoManager.add({
            redo:function(){
                cellDef=_this.context.getCell(startRow,startCol);
                oldValue=cellDef.value,oldCellData=hot.getDataAtCell(startRow,startCol);
                hot.setDataAtCell(startRow,startCol,'');
                cellDef.value={
                    type:'chart',
                    chart:_this._newChart(category)
                };
                hot.render();
                setDirty();
                Handsontable.hooks.run(hot, 'afterSelectionEnd',startRow,startCol,endRow,endCol);
            },
            undo:function(){
                cellDef=_this.context.getCell(startRow,startCol);
                cellDef.value=oldValue;
                hot.setDataAtCell(startRow,startCol,oldCellData);
                hot.render();
                setDirty();
                Handsontable.hooks.run(hot, 'afterSelectionEnd',startRow,startCol,endRow,endCol);
            }
        })
    }
    _newChart(category){
        return {
            dataset:{
                type:category
            }
        };
    }
}