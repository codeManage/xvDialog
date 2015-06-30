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
            maskTxtBox: 'xv_Mask_Txt_Box',
            maskTxt: 'xv_Mask_Txt',
            maskConBrd: 'xv_Mask_Border',
            maskBoxTit: 'xv_Mask_Box_Tit',
            maskBoxFoot: 'xv_Mask_Box_Foot',
            maskBoxTitMsg: 'xv_Mask_Box_Tit_Msg',
            maskBoxBtn: 'xv_Mask_Box_Btn',
            maskBoxCloseBtn: 'xv_Mask_Box_CloseBtn',
            maskBoxCancelBtn: 'xv_Mask_Box_CancelBtn',
            maskBoxOkBtn: 'xv_Mask_Box_OkBtn',
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
        defaultSize: {
            wh: {
                width: 200,
                height: 100
            },
            dltGap: 10,
            zIndex:19890620
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
            var _S = this;
            var tmpOps = {};
            _S.index = tmpOps.index = (Number(opts.index) >= 0) ? opts.index : xvDialog.index++;
            tmpOps.type = opts.type || 'alert';
            tmpOps.closeBtn = opts.closeBtn;
            tmpOps.drag = opts.drag;
            tmpOps.setTimes = opts.setTimes || '';
            tmpOps.content = opts.content || '';
            switch (tmpOps.type) {
                case 'alert':
                    tmpOps.title = (!opts.title && opts.title!==false)?'':opts.title;
                    tmpOps.icon = opts.icon;

                    tmpOps.buttons = (opts.buttons || opts.buttons === false) ? opts.buttons : [{
                        type: 'ok',
                        text: '确定',
                        cls: G.doms.maskBoxOkBtn
                    },
                        {
                            type: 'cancel',
                            text: '取消',
                            cls: G.doms.maskBoxCancelBtn,
                            callBack: function () {
                                _S.close();
                            }
                        }];

                    tmpOps.iconType = opts.iconType || 'success';
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

            //初始化boxsize
            if (Number(opts.width) > 0 || Number(opts.height) > 0) {
                tmpOps.wh = {
                    width: opts.width || 'auto',
                    height: opts.height || 'auto'
                }
            }
            tmpOps.contentMsg = opts.contentMsg || '';
            tmpOps.zIndex = parseInt(opts.zIndex) || G.defaultSize.zIndex;

            return tmpOps
        },
        building: function (options) {
            var _S = this;
            var opts = _S.config = _S.settings(options);
            var idx = _S.index;
            var doms = G.doms;
            var dType = G.type;
            var type = _S.currentType = dType[opts.type];
            var body = $('body');

            var contentMsg = opts.contentMsg ? "<pre>" + opts.contentMsg + "</pre>":'';
            var contentHtml = opts.content ?  opts.content :'';

            var mkBox = "<div id='" + doms.maskBox + '_' + idx + "' class='" + doms.maskBox + "' " + doms.type + "='" + type + "' " + doms.times + "='" + idx + "' style='z-index:" + (opts.zIndex + idx) + ";'></div>";
            var mkBoxCon = "<div class='" + doms.maskBoxCon + "' " + doms.type + "='" + type + "' " + doms.times + "='" + idx + "'  style='z-index:" + (opts.zIndex + idx + 1) + ";'><div class='" + doms.maskConBrd + "'><div class='" + doms.maskBoxMain + "'><div class='" + doms.maskTxtBox + "'>"+((opts.icon===false) ? " ": ("<i class='" + doms.icon + ' ' + doms.icon + '_' + opts.iconType + "'></i>"))+"<div class='" + doms.maskTxt + "'>" + (contentMsg || contentHtml)+ "</div></div></div><div class='" + doms.maskBoxFoot + "'></div></div></div>";

            var mkBoxTit = "<div class=" + doms.maskBoxTit + "><p class='" + doms.maskBoxTitMsg + "'>" + opts.title + "</p></div>";
            var closeBtn = "<div class='" + doms.maskBoxCloseBtn + "'>x</div>";


            switch (type) {
                case dType.alert :
                    mkBox = $(mkBox).appendTo(body);
                    mkBoxCon = $(mkBoxCon).appendTo(body);
                    var maskConBrd = mkBoxCon.find("." + doms.maskConBrd),
                        mkBoxMain = mkBoxCon.find("." + doms.maskBoxMain),
                        mkBoxTitMsg = mkBoxCon.find("." + doms.maskBoxTitMsg),
                        maskBoxFoot = mkBoxCon.find("." + doms.maskBoxFoot);
                        if(opts.content){mkBoxMain.html(contentHtml)}
                    _S.mkObj = {
                        body: body,
                        box: mkBox,
                        ctr: mkBoxCon,
                        brd: maskConBrd,
                        main: mkBoxMain
                    };
                    opts.title !== false ? _S.mkObj.tit = $(mkBoxTit).prependTo(maskConBrd):'';
                    opts.closeBtn !== false ? _S.mkObj.clsBtn = $(closeBtn).appendTo(maskConBrd):'';

                    if(opts.buttons !== false) {
                        _S.mkObj.ft = maskBoxFoot;
                        _S.mkObj.buttons =  _S.setButtons(maskBoxFoot);
                    }else{
                        maskBoxFoot.hide();
                    }
                    break;
                case dType.tips :
                    var tips = "<div id='" + doms.tip + '_' + idx + "' class='" + doms.tip + " " + doms.tipAlign + opts.align + "' " + doms.type + "='" + type + "' " + doms.times + "='" + idx + "' style='z-index:" + (opts.zIndex + idx) + ";'><i class='" + doms.icon + "'></i><em></em><div class='" + doms.tip + "_Container'><pre>" + opts.contentMsg + "</pre></div></div>";
                    tips = $(tips).appendTo(body);
                    _S.mkObj = {
                        body: body,
                        box: mkBox,
                        ctr: tips
                    };
                    opts.closeBtn !== false ? _S.mkObj.clsBtn = $(closeBtn).appendTo(tips):'';
                    break;
            }
            _S.resetEvent(type);
        },

        setButtons: function (ft) {
            var _S = this;
            var opts = _S.config;
            var tmpArr = [];
            /*按钮初始化*/
            for (var i = 0; i < opts.buttons.length; i++) {
                var buttons = opts.buttons[i];
                if (typeof buttons == 'object' && buttons.type) {
                    var btn = $("<span xv-button-type='" + buttons.type + "' class='" + G.doms.maskBoxBtn + " " + (buttons.cls || '') + "'>" + (buttons.text || '') + "</span>");
                    var callBack = buttons.callBack || '';
                    btn.appendTo(ft);
                    if (typeof callBack == 'function') {
                        btn.on('click', callBack);
                    }
                    tmpArr.push(btn);
                }
            }
            return tmpArr;
        },

        computeBoxSize: function () {
            var _O = this.mkObj,
                opts = this.config,
                brd = _O.brd,
                main = _O.main,
                ctr = _O.ctr,
                titH = _O.tit ? _O.tit.outerHeight() : 0,
                ftH = _O.ft ? _O.ft.outerHeight() : 0,
                /*ie下面中文标点符号产生空白符，引起换行，所以 brdW = brd.outerWidth()+5*/
                brdW = brd.outerWidth(),
                brdH = brd.outerHeight(),
                lineW = parseInt(_O.brd.css('borderLeftWidth'));
            lineW = lineW ? lineW : 0;

            /*获取弹出box尺寸*/
            if (opts.wh) {
                var setW = Number(opts.wh.width),
                    setH = Number(opts.wh.height);

                if (setW > 0) {
                    brdW = setW;
                    brd.outerWidth(brdW);
                }

                if (setH > 0) {
                    brdH = setH;
                    brd.outerHeight(brdH);
                }
            }

            /*计算弹出box内容的高度*/
            var mainH = brdH - lineW * 2 - ftH - titH;
            //var mainW = brdW - lineW * 2;
            main.outerHeight(mainH);
            /*设置弹出box尺寸*/
            ctr.height(brdH);
            ctr.width(brdW);
            return {w: brdW, h: brdH};
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
            var time = Number(opts.setTimes);
            if (type == 'alert') {
                var tit = _O.tit;

                /*初始化弹出框的尺寸*/

                _S.boxSize = _S.computeBoxSize();

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

                /*触发拖拽*/
                opts.drag !== false?_S.drag(tit):'';

            } else if (type == 'tips') {
                var tips = _O.ctr;
                var target = $(event.srcElement);
                var trtW = target.outerWidth();
                var trtH = target.outerHeight();
                var tipsW = tips.outerWidth();
                var tipsH = tips.outerHeight();
                var setP = opts.position;
                var tP = target.offset();
                var tmpP={left:0,top:0};
                var dltGap = G.defaultSize.dltGap;

                if (opts.align == 'left') {
                    tmpP = {
                        left: tP.left - tipsW + setP.left - dltGap,
                        top: tP.top + setP.top
                    }
                } else if (opts.align == 'top') {

                    tmpP = {
                        left: tP.left + setP.left,
                        top: tP.top - tipsH - setP.top - dltGap
                    };
                } else if (opts.align == 'bottom') {
                    tmpP = {
                        left: tP.left + setP.left,
                        top: tP.top + trtH + setP.top + dltGap
                    };
                } else {
                    tmpP = {
                        left: tP.left + trtW + setP.left + dltGap,
                        top: tP.top + setP.top
                    };
                }

                tips.css(tmpP);
            }

            if(time>0) {
                _S.timer = setTimeout(function () {
                    _S.close();

                }, time);
            }
            opts.closeBtn !== false ?_O.clsBtn.on('click', {that: _S}, _S.close):'';
        },

        close: function (e) {
            var _S = e && e.data ? e.data.that : this;
            xvDialog.close(_S.index);
            if(_S.timer){
                clearTimeout(_S.timer);
            }
        },

        on: function (type, func) {
            var _S = this;
            var buttons = _S.config.buttons;
            var btnObj = _S.mkObj.buttons;
            if (type && func) {
                for (var i = 0; i < buttons.length; i++) {
                    if ((buttons[i].type == type) && typeof func == 'function') {
                        btnObj[i].on('click', func);
                    }
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
