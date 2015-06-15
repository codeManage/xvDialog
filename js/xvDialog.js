/**
 * Created by ZhangDawei on 2015/3/18.
 */

(function (win, $) {
    //常用dom字符
    var G = {//可以自己配置适合自己的结构名称
        doms: {
            maskBox: 'xv_Mask_Box',
            maskBoxCon: 'xv_Mask_Container',
            maskBoxMain: 'xv_Mask_Main',
            maskConBrd: 'xv_Mask_Border',
            maskBoxTit: 'xv_Mask_Box_Tit',
            maskBoxFoot: 'xv_Mask_Box_Foot',
            maskBoxTitMsg: 'xv_Mask_Box_Tit_Msg',
            maskBoxBtn: 'xv_Mask_Box_Btn',
            maskBoxCloseBtn: 'xv_Mask_Box_CloseBtn',
            maskBoxCancelBtn: 'xv_Mask_Box_CancelBtn',
            maskBoxSureBtn: 'xv_Mask_Box_SureBtn',
            maskMsgBox:'xv_Mask_Msg_Box',
            icon:'xv_Mask_Icon',
            waring:'xv_Mask_Waring'
        },
        type: {
            alert: 'alert'
        }
    };


    //入口
    win.xvDialog = function (opts) {
        return new DialogBox(opts);
    };

    xvDialog.index = 0;

    xvDialog.alert = function (type) {

    };

    //主框架
    var DialogBox = function (options) {
        var _this = this;
        _this.building(options);
    };

    DialogBox.pt = DialogBox.prototype = {
        settings: function (opts) {
            opts.type = opts.type || 'alert';
            opts.width = opts.width;
            opts.height = opts.height;
            return opts;
        },
        building: function (opts) {
            var _S = this;
            var idx = xvDialog.index++;
            var opts = _S.settings(opts);
            var doms = G.doms;
            var dType = G.type;
            var type = dType[opts.type];
            var html;
            var body = $('body');
            var mkBox = $("<div id='"+ doms.maskBox + '_' + idx+"' class='" + doms.maskBox + " "  + "'></div>").appendTo(body);
            var mkBoxCon = $("<div class='" + doms.maskBoxCon + "'><div class='" + doms.maskConBrd + "'><div class=" + doms.maskBoxTit + "></div><p class='" + doms.maskBoxTitMsg + "'>提示框</p><div class='" + doms.maskBoxMain + "'></div><div class='" + doms.maskBoxFoot + "'></div></div></div>").appendTo(body);
            var maskConBrd = mkBoxCon.find("." + doms.maskConBrd);
            var mkBoxMain = mkBoxCon.find("." + doms.maskBoxMain);
            var mkBoxTit = mkBoxCon.find("." + doms.maskBoxTit);
            var mkBoxTitMsg = mkBoxCon.find("." + doms.maskBoxTitMsg);
            var maskBoxFoot = mkBoxCon.find("." + doms.maskBoxFoot);
            var closebtn = $("<div class='" + doms.maskBoxCloseBtn +"'>x</div>").appendTo(maskConBrd);
            var sureBtn = $("<span class='" + doms.maskBoxBtn +" "+doms.maskBoxSureBtn+ "'>确定</span>").appendTo(maskBoxFoot);
            var cancelBtn = $("<span class='" + doms.maskBoxBtn +" "+doms.maskBoxCancelBtn+ "'>取消</span>").appendTo(maskBoxFoot);

            _S.mkObj = {
                body: body,
                box: mkBox,
                ctr: mkBoxCon,
                brd: maskConBrd,
                main: mkBoxMain,
                tit: mkBoxTit,
                clsBtn: closebtn,
                cclBtn: cancelBtn,
                sBtn: sureBtn
            };

            _S.resetEvent();

            switch (type) {
                case dType.alert :
                        html = "<div class="+doms.maskMsgBox+">" +
                        "<i class='"+doms.icon+" "+doms.waring+"'></i>" +
                        "<span> 未经权益所有人同意，不得将资源中的内容挪作商业或盈利用途</span>" +
                        "</div>";
                    mkBoxMain.append(html);
                    break;
            }
        },

        computeSize: function () {
            var _O = this.mkObj;

            var brd = _O.brd;
            var main = _O.main;
            var ctr = _O.ctr;

            var brdW = parseInt(_O.brd.css('borderLeftWidth'));
            brdW = brdW ? brdW : 0;
            var mkConW = main.outerWidth() + brdW * 2;
            var mkConH = main.outerHeight() + brdW * 2;

            brd.outerWidth(mkConW);
            brd.outerHeight(mkConH);
            ctr.width(mkConW);
            ctr.height(mkConH);

            return {w: mkConW, h: mkConH}
        },

        computeCenter: function (obj) {
            var w,
                h,
                pL,
                pT,
                $win = $(window);
            if (obj && obj.length) {
                w = obj.outerWidth();
                h = obj.outerHeight();
            } else {
                w = this.boxSize.w;
                h = this.boxSize.h;
            }

            pL = $win.width() - w;
            pT = $win.height() - h;

            return {
                left: pL > 0 ? pL / 2 : 0,
                top: pT > 0 ? pT / 2 : 0
            };
        },

        /*
         * setPosition：计算obj的位置
         * opt ｛object｝
         * */
        setPosition: function (opts) {

            var data = opts.data ? opts.data : opts;
            var p;
            var _S = data.that || this;
            var obj = data.obj ? data.obj : _S.mkObj.ctr;

            if (opts.data && opts.data.auto) {
                /*对元素居中处理*/
                p = _S.computeCenter();
            } else {
                data = opts;
                p = data;
            }
            obj.position = {
                left: p.left,
                top: p.top
            };
            obj.css({left: p.left, top: p.top});
        },
        resetEvent: function () {
            var _S = this;
            var _O = _S.mkObj;

            var ctr = _O.ctr;
            var tit = _O.tit;
            var clsBtn = _O.clsBtn;
            var cclBtn = _O.cclBtn;
            var sureBtn = _O.sBtn;

            /*初始化弹出框的尺寸*/
            _S.boxSize = _S.computeSize();

            /*位置初始化*/
            ctr.position = {left: 0, top: 0};

            /*位置居中*/
            _S.setPosition(_S.computeCenter());

            /*位置随着视口的变换自动居中*/
            $(window).on('resize', {auto: true, that: _S}, _S.setPosition);

            /*位置随着视口的变换自动居中*/
            $(window).on('scroll',function(e){$(this).scrollTop(0);e.preventDefault()});

            /*关闭弹窗*/
            clsBtn.on('click',function(){_S.close();});
            cclBtn.on('click',function(){_S.close();});


            /*触发拖拽*/
            _S.drag(tit);

        },
        close:function(e){
            var _S =e? e.data.that:this;
            _S.mkObj.box.remove();
            _S.mkObj.ctr.remove();

        },
        on:function(evtName,func){
            var _S = this;
            var mkObj = _S.mkObj;
            var evtObj=[];
            switch (evtName){
                case 'close':
                    evtObj = mkObj['clsBtn'];
                    break;
                case 'sure':
                    evtObj = mkObj['sBtn'];
                    break;
                case 'cancel':
                    evtObj = mkObj['cclBtn'];
                    break;
                case 'colseBefore':
                    _S.listeners = _S.listeners || {};
                    _S.listeners.colseBefore = func;
                    break;
                default :
                    break;
            }

            if(evtObj.length && func && typeof func == 'function') {
                evtObj.on('click',func);
                evtObj.on('click',{that:_S},_S.close);
            }
        },

        drag: function (obj) {
            var _S = this,
                ctr = _S.mkObj.ctr;
            obj.on('mousedown', function (e) {
                var p = ctr.position,
                    disX = e.clientX - p.left,
                    disY = e.clientY - p.top,
                    doc,
                    objProt = obj.get(0);

                if (objProt.setCapture) {
                    doc = obj;
                    objProt.setCapture();
                } else {
                    doc = $(document);
                }

                $(document).on('mouseup',{that:_S,objProt:objProt,doc:doc},_S.clearDrag);

                doc.on('mousemove',{that:_S,win:$(window),disX:disX,disY:disY},_S.moveFunc);

            });
        },
        clearDrag:function (e) {
                var opts = e.data,
                    objProt = opts.objProt,
                    doc = opts.doc,
                    that = opts.that;
                if (objProt.releaseCapture) {
                    objProt.releaseCapture();
                }
                doc.off('mousemove',that.moveFunc);
                $(document).off('mouseup',that.clearDrag);
        },
        moveFunc: function (e) {
                var opts = e.data,
                    $win = opts.win,
                    that = opts.that,
                    disX = opts.disX,
                    disY = opts.disY,
                    boxSize = that.boxSize,
                    boxL = e.clientX - disX,
                    boxT = e.clientY - disY,
                    maxL = $win.width() - boxSize.w,
                    maxT = $win.height() - boxSize.h;

                if (boxL <= 0) {
                    boxL = 0;
                } else if (boxL >= maxL) {
                    boxL = maxL;
                }

                if (boxT <= 0) {
                    boxT = 0;
                } else if (boxT >= maxT) {
                    boxT = maxT;
                }
                that.setPosition({left: boxL, top: boxT});
                e.preventDefault();
            }
    };


    //公共属性(方法)
    DialogBox.isArray = function (arr) {//判断是否为数组，且数组不为空
        return arr && (typeof arr == 'object') && arr.length;
    };
    DialogBox.isObject = function (obj) {//判断是否为object
        return obj && typeof obj == 'object' && !obj.length;
    };

    DialogBox.isType = function (obj, type) {
        return Object.prototype.toString.call(obj) == "[object " + type + "]";
    };

})(window, jQuery);
