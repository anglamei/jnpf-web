/**
 * Created by Jacky.Gao on 2017-01-25.
 */
import Tool from './Tool.js';
import {undoManager,setDirty} from '../Utils.js';
import {alert} from '../MsgBox.js';

export default class AlignLeftTool extends Tool{
    execute(){
        const cells=this.context.getSelectedCells();
        if(!cells){
            alert(`${window.i18n.selectTargetCellFirst}`);
            return;
        }
        for(const td of cells){
            let cellDef=td.cellDef.cellStyle;
            cellDef.align="left";
            $(td).css("text-align","left");
        }
    }

    buildButton(){
        const _this=this;
        this.align="left";
        const group=$(`<div class="btn-group"></div>`);
        const nameButton=$(`<button type="button" class="btn btn-default"
            style="border:none;border-radius:0;padding: 6px 1px 6px 5px;font-size: 12pt;" title="${window.i18n.tools.alignLeft.upDownAlign}">
            <i class="report-icon report-icon-align-left" id="align_button"></i>
            </button>`);
        group.append(nameButton);
        const mainBtn=$(`<button type="button" class="btn btn-default dropdown-toggle" style="border:none;border-radius:0;padding: 6px 5px;" data-toggle="dropdown" title="${window.i18n.tools.alignLeft.leftRightAlign}">
            <span class="caret"></span>
            <span class="sr-only">${window.i18n.tools.alignLeft.changeMenu}</span>
        </button>`);
        const ul=$(`<ul class="dropdown-menu" role="menu"></ul>`);
        const left=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-align-left"></i> ${window.i18n.tools.alignLeft.leftAlign}
                </a>
            </li>`);
        ul.append(left);
        nameButton.click(function(){
            const selectedCells=_this.context.hot.getSelected();
            if(!selectedCells || selectedCells.length===0){
                alert(`${window.i18n.selectTargetCellFirst}`);
                return;
            }
            const align=_this.align;
            let oldAligns=_this._buildCellAlign(_this.context,_this.align);
            undoManager.add({
                undo:function(){
                    oldAligns=_this._buildCellAlign(_this.context,null,oldAligns);
                    setDirty();
                },
                redo:function(){
                    oldAligns=_this._buildCellAlign(_this.context,align);
                    setDirty();
                }
            });
            setDirty();
        });
        left.click(function(){
            const selectedCells=_this.context.hot.getSelected();
            if(!selectedCells || selectedCells.length===0){
                alert(`${window.i18n.selectTargetCellFirst}`);
                return;
            }
            let oldAligns=_this._buildCellAlign(_this.context,"left");
            undoManager.add({
                undo:function(){
                    oldAligns=_this._buildCellAlign(_this.context,null,oldAligns);
                    setDirty();
                },
                redo:function(){
                    oldAligns=_this._buildCellAlign(_this.context,"left");
                    setDirty();
                }
            });
            setDirty();
        });
        const center=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-align-center"></i> ${window.i18n.tools.alignLeft.centerAlign}
                </a>
            </li>`);
        center.click(function(){
            const selectedCells=_this.context.hot.getSelected();
            if(!selectedCells || selectedCells.length===0){
                alert(`${window.i18n.selectTargetCellFirst}`);
                return;
            }
            let oldAligns=_this._buildCellAlign(_this.context,"center");
            undoManager.add({
                undo:function(){
                    oldAligns=_this._buildCellAlign(_this.context,null,oldAligns);
                    setDirty();
                },
                redo:function(){
                    oldAligns=_this._buildCellAlign(_this.context,"center");
                    setDirty();
                }
            });
            setDirty();
        });
        ul.append(center);
        const right=$(`<li>
                <a href="javascript:;">
                    <i class="report-icon report-icon-align-right"></i> ${window.i18n.tools.alignLeft.rightAlign}
                </a>
            </li>`);
        right.click(function(){
            const selectedCells=_this.context.hot.getSelected();
            if(!selectedCells || selectedCells.length===0){
                alert(`${window.i18n.selectTargetCellFirst}`);
                return;
            }
            let oldAligns=_this._buildCellAlign(_this.context,"right");
            undoManager.add({
                undo:function(){
                    oldAligns=_this._buildCellAlign(_this.context,null,oldAligns);
                    setDirty();
                },
                redo:function(){
                    oldAligns=_this._buildCellAlign(_this.context,"right");
                    setDirty();
                }
            });
            setDirty();
        });
        ul.append(right);
        group.append(mainBtn);
        group.append(ul);
        return group;
    }


    refresh(startRow,startCol,endRow,endCol){
        let tmp=endRow;
        if(startRow>endRow){
            endRow=startRow;
            startRow=tmp;
        }
        tmp=endCol;
        if(startCol>endCol){
            endCol=startCol;
            startCol=tmp;
        }
        for(let i=startRow;i<=endRow;i++) {
            for (let j = startCol; j <= endCol; j++) {
                let cellDef = this.context.getCell(i, j);
                if (!cellDef) {
                    continue;
                }
                let cellStyle=cellDef.cellStyle;
                const align=cellStyle.align || "left";
                $("#align_button").removeClass().addClass("report-icon report-icon-align-"+align);
                this.align=align;
                break;
            }
            break;
        }
    }


    _buildCellAlign(context,align,prevAligns){
        const oldAligns={},selected=context.hot.getSelected();
        let startRow=selected[0],startCol=selected[1],endRow=selected[2],endCol=selected[3];
        let tmp=endRow;
        if(startRow>endRow){
            endRow=startRow;
            startRow=tmp;
        }
        tmp=endCol;
        if(startCol>endCol){
            endCol=startCol;
            startCol=tmp;
        }
        for(let i=startRow;i<=endRow;i++){
            for(let j=startCol;j<=endCol;j++){
                let cellDef=context.getCell(i,j);
                let td=context.hot.getCell(i,j);
                if(!cellDef){
                    continue;
                }
                const cellStyle=cellDef.cellStyle;
                oldAligns[i+","+j]=cellStyle.align || "";
                if(prevAligns){
                    align=prevAligns[i+","+j];
                }
                $(td).css("text-align",align);
                cellStyle.align=align;
                $("#align_button").removeClass().addClass("report-icon report-icon-align-"+align);
                this.align=align;
            }
        }
        return oldAligns;
    }

    getTitle(){
        return `${window.i18n.tools.alignLeft.leftRightAlign}`;
    }
    getIcon(){
        return `<i class="report-icon report-icon-align-left"></i>`;
    }
}