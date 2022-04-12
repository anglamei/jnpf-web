/**
 * Created by Jacky.Gao on 2017-01-25.
 */
import {alert} from '../MsgBox.js';

export default class Tool{
    constructor(context){
        this.context=context;
    }
    buildButton(){
        const btn=$(`<span class="tool-item" title="${this.getTitle()}">
             ${this.getIcon()}
        </span>`);
        const _this=this;
        btn.click(function(){
            _this.execute();
        });
        return btn;
    }
    checkSelection(){
        const selected=this.context.hot.getSelected();
        if(!selected || selected.length===0){
            alert(`${window.i18n.selectTargetCellFirst}`);
            return false;
        }else{
            return true;
        }
    }
};