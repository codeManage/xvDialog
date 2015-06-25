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
            maskMsgBox: 'xv_Mask_Msg_Box',
            icon: 'xv_Mask_Icon',
            waring: 'xv_Mask_Waring',
            tip: 'xv_Mask_Tip',
            tipAlign: 'xv_Tip_Align_',
            type: 'xvmktype',
            times: 'mktimes'
        },
        type: {
            alert: 'alert',
            confirm: 'confirm',
            message: 'message',
            tips: 'tips'
        },
        defaultNum:{
            wh:{
                width:200,
                height:100
            }
        }
    };

    win.xvDialog = {
        index: 0,
        alert: function (config) {
            var dfltOpts = {
                area: [],
                contentMsg: '...',
                icon: 'waring',
                button: ['yes', 'no', 'close']
            }
        }, tips: function (config) {
            var dfltOpts = {
                area: [],
                contentMsg: '...'
            }
        }, close: function (object) {
            if (!(object || object === 0)) {
                return false;
            }
            var ctr,
                idx = Number(object),
                type = G.doms['type'],
                attr = G.doms['times'];
            if (idx >= 0) {
                /*如果为数值*/
                ctr = $("[" + attr + "=" + idx + "]");
            } else if (typeof object == 'string') {
                if (object === 'all') {
                    ctr = $("[" + type + "]");
                } else {
                    ctr = $("[" + type + "=" + object + "]");
                }
            } else {
                if (!object.index) {
                    return false;
                }
                ctr = $("[" + attr + "=" + object.index + "]");
            }
            ctr.remove();
        }
    };


    //入口
    $.xvDialog = function (opts) {
        return new DialogBox(opts);
    };

    //主框架
    var DialogBox = function (options) {
        this.building(options);
    };

    DialogBox.pt = DialogBox.prototype = {
        settings: function (opts) {
            var tmpOps = {};
            this.index = tmpOps.index = (Number(opts.index)>=0) ? opts.index : xvDialog.index++;
            tmpOps.type = opts.type || 'alert';

            switch (tmpOps.type) {
                case 'alert':
                    tmpOps.width = opts.width;
                    tmpOps.height = opts.height;
                    tmpOps.title = opts.title || '';
                    break;
                case 'tips':
                    tmpOps.align = opts.align || 'right';
                    if (opts.position) {
                        var p = opts.position;
                        tmpOps.position = p;
                        tmpOps.position.left = p ? p.left : 0;
                        tmpOps.position.top = p ? p.top : 0;
                    } else {
                        tmpOps.position = {left: 0, top: 0};
                    }
            }
            tmpOps.contentMsg = opts.contentMsg || '';
            tmpOps.zIndex = parseInt(opts.zIndex) || 19890620;

           return tmpOps
        },
        building: function (options) {
            var _S = this;
            var opts = _S.config = _S.settings(options);
            var idx = _S.index;
            var doms = G.doms;
            var dType = G.type;
            var type = _S.currentType = dType[opts.type];
            var html;
            var body = $('body');


            var mkBox = "<div id='" + doms.maskBox + '_' + idx + "' class='" + doms.maskBox + "' " + doms.type + "='" + type + "' " + doms.times + "='" + idx + "' style='z-index:" + (opts.zIndex + idx) + ";'></div>";
            var mkBoxCon = "<div class='" + doms.maskBoxCon + "' " + doms.type + "='" + type + "' " + doms.times + "='" + idx + "'  style='z-index:" + (opts.zIndex + idx + 1) + ";'><div class='" + doms.maskConBrd + "'><div class=" + doms.maskBoxTit + "></div><p class='" + doms.maskBoxTitMsg + "'>"+opts.title+"</p><div class='" + doms.maskBoxMain + "'></div><div class='" + doms.maskBoxFoot + "'></div></div></div>";

            var closebtn = "<div class='" + doms.maskBoxCloseBtn + "'>x</div>";
            var sureBtn = "<span class='" + doms.maskBoxBtn + " " + doms.maskBoxSureBtn + "'>确定</span>";
            var cancelBtn = "<span class='" + doms.maskBoxBtn + " " + doms.maskBoxCancelBtn + "'>取消</span>";


            switch (type) {
                case dType.alert :
                    mkBox = $(mkBox).appendTo(body);
                    mkBoxCon = $(mkBoxCon).appendTo(body);
                    var maskConBrd = mkBoxCon.find("." + doms.maskConBrd),
                        mkBoxMain = mkBoxCon.find("." + doms.maskBoxMain),
                        mkBoxTit = mkBoxCon.find("." + doms.maskBoxTit),
                        mkBoxTitMsg = mkBoxCon.find("." + doms.maskBoxTitMsg),
                        maskBoxFoot = mkBoxCon.find("." + doms.maskBoxFoot);
                    closebtn = $(closebtn).appendTo(maskConBrd);
                    sureBtn = $("<span class='" + doms.maskBoxBtn + " " + doms.maskBoxSureBtn + "'>确定</span>").appendTo(maskBoxFoot);
                    cancelBtn = $("<span class='" + doms.maskBoxBtn + " " + doms.maskBoxCancelBtn + "'>取消</span>").appendTo(maskBoxFoot);

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

                    //mkBoxMain.append(html);
                    break;
                case dType.tips :
                    var tips = "<div id='" + doms.tip + '_' + idx + "' class='" + doms.tip + " " + doms.tipAlign + opts.align + "' " + doms.type + "='" + type + "' " + doms.times + "='" + idx + "' style='z-index:" + (opts.zIndex + idx) + ";'><i class='" + doms.icon + "'></i><em></em><div class='" + doms.tip + "_Container'>"+opts.contentMsg+"</div></div>";
                    tips = $(tips).appendTo(body);
                    closebtn = $(closebtn).appendTo(tips);
                    _S.mkObj = {
                        body: body,
                        box: mkBox,
                        clsBtn: closebtn,
                        ctr: tips
                    };
                    break;
            }

            _S.resetEvent(type);
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
        resetEvent: function (type) {
            var _S = this;
            var _O = _S.mkObj;
            var opts = _S.config;
            var ctr = _O.ctr;
            if (type == 'alert') {
                var tit = _O.tit;
                /*var clsBtn = _O.clsBtn;
                 var cclBtn = _O.cclBtn;
                 var sureBtn = _O.sBtn;*/

                /*初始化弹出框的尺寸*/
                _S.boxSize = _S.computeSize();

                /*位置初始化*/
                ctr.position = {left: 0, top: 0};

                /*位置居中*/
                _S.setPosition(_S.computeCenter());

                /*位置随着视口的变换自动居中*/
                $(window).on('resize', {auto: true, that: _S}, _S.setPosition);

                /*位置随着视口的变换自动居中*/
                $(window).on('scroll', function (e) {
                    $(this).scrollTop(0);
                    e.preventDefault()
                });

                _S.on('close',_S.close);

                /*触发拖拽*/
                _S.drag(tit);

            } else if (type == 'tips') {
                var tips = _O.ctr;
                var target = $(window.event.target);
                var trtW = target.outerWidth();
                var trtH = target.outerHeight();
                var tipsW = tips.outerWidth();
                var tipsH = tips.outerHeight();
                var setP = opts.position;
                var tP = target.offset();
                var tmpP;
                var dltGapW = 10;


                if (opts.align == 'left') {
                    tmpP = {
                        left: tP.left - tipsW + setP.left - dltGapW,
                        top: tP.top + setP.top
                    }
                }else if (opts.align == 'top') {
                    tmpP = {
                        left: tP.left + setP.left,
                        top: tP.top - tipsH + setP.top - dltGapW
                    };
                }else if (opts.align == 'bottom') {
                    tmpP = {
                        left: tP.left + setP.left,
                        top: tP.top + trtH + setP.top + dltGapW
                    };
                }else{
                    tmpP = {
                        left: tP.left + trtW + setP.left + dltGapW,
                        top: tP.top + setP.top
                    };
                }

                tips.css(tmpP);
                _S.on('close',_S.close);

               /* setTimeout(function () {
                    _S.close()
                }, 2000);*/
            }
        },

        close: function (e) {
            var _S = e && e.data ? e.data.that : this;
            xvDialog.close(_S.index);
        },

        on: function (evtName, func) {
            var _S = this;
            var mkObj = _S.mkObj;
            var evtObj = [];
            switch (evtName) {
                case 'close':
                    evtObj = [mkObj['clsBtn']];
                    break;
                case 'sure':
                    evtObj = [mkObj['sBtn']];
                    break;
                case 'cancel':
                    evtObj = [mkObj['cclBtn']];
                    break;
                case 'colseBefore':
                    evtObj = [mkObj['cclBtn'], mkObj['sBtn'], mkObj['clsBtn']];
                    break;
                default :
                    break;
            }

            if (func && typeof func == 'function') {
                for (var i = 0; i < evtObj.length; i++) {
                    evtObj[i].on('click', func);
                    evtObj[i].off('click', _S.close);
                    evtObj[i].on('click', {that: _S}, _S.close);
                }
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

                $(document).on('mouseup', {that: _S, objProt: objProt, doc: doc}, _S.clearDrag);

                doc.on('mousemove', {that: _S, win: $(window), disX: disX, disY: disY}, _S.moveFunc);

            });
        },


        clearDrag: function (e) {
            var opts = e.data,
                objProt = opts.objProt,
                doc = opts.doc,
                that = opts.that;
            if (objProt.releaseCapture) {
                objProt.releaseCapture();
            }
            doc.off('mousemove', that.moveFunc);
            $(document).off('mouseup', that.clearDrag);
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

})(window, jQuery);
