/**
 * Created by ZhangDawei on 2015/3/18.
 */

(function (win, $) {
    //常用dom字符
    var G = {//可以自己配置适合自己的结构名称
        doms: {
            maskDrag: 'xv_Mask_Drag',
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
            maskIframe: 'xv_Mask_Iframe',
            iframeName: 'xv_Mask_Iframe_Name_',
            iframeId: 'xv_Mask_Iframe_Id_',
            icon: 'xv_Mask_Icon',
            waring: 'xv_Mask_Waring',
            tip: 'xv_Mask_Tip',
            tipTxt: 'xv_Mask_Tip_Txt',
            tipAlign: 'xv_Tip_Align_',
            type: 'xvmktype',
            times: 'mktimes',
            mkAnimate:'xv_dlt_animate'
        },
        type: {
            dialog: 'dialog',
            iframe: 'iframe',
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
            zIndex: 19890620
        }
    };

    win.xvDialog = {
        index: 0,
        alert: function (config) {

        }, tips: function (config) {

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
            tmpOps.type = opts.type || 'dialog';
            tmpOps.closeBtn = opts.closeBtn || '';
            tmpOps.closeTimes = opts.closeTimes || '';
            tmpOps.closeAction = opts.closeAction || '';
            tmpOps.esc = opts.esc || '';
            tmpOps.drag = (opts.drag || opts.drag === false) ? opts.drag : '';
            tmpOps.content = opts.content || '';
            tmpOps.contentMsg = opts.contentMsg || '';
            tmpOps.animate = (opts.animate || opts.animate === false) ? opts.animate : G.doms.mkAnimate;
            tmpOps.zIndex = parseInt(opts.zIndex) || G.defaultSize.zIndex;
            switch (tmpOps.type) {
                case 'dialog':
                    tmpOps = _S.pubOptions('dialog', tmpOps, opts);
                    break;
                case 'iframe':
                    tmpOps = _S.pubOptions('iframe', tmpOps, opts);
                    break;
                case 'tips':
                    tmpOps.align = opts.align || 'right';
                    tmpOps.follow = opts.follow || '';
                    if (opts.position) {
                        var p = opts.position;
                        tmpOps.position = p;
                        tmpOps.position.left = p ? p.left : 0;
                        tmpOps.position.top = p ? p.top : 0;
                    } else {
                        tmpOps.position = {left: 0, top: 0};
                    }
                    break;
            }

            //初始化boxsize
            if (Number(opts.width) > 0 || Number(opts.height) > 0) {
                tmpOps.wh = {
                    width: opts.width || 'auto',
                    height: opts.height || 'auto'
                }
            }

            return tmpOps
        },

        pubOptions: function (type, tmpOps, opts) {
            var _S = this;
            tmpOps.load = (opts.load && typeof opts.load === 'function') ? opts.load : '';
            tmpOps.title = (!opts.title && opts.title !== false) ? '' : opts.title;
            tmpOps.icon = opts.icon;
            tmpOps.scroll = opts.scroll !== false;
            tmpOps.scrollX = opts.scrollX !== false;
            tmpOps.scrollY = opts.scrollY !== false;
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
                }
            ];

            if (type === 'iframe') {
                tmpOps.iframe = opts.iframe || '';
            }

            tmpOps.iconType = opts.iconType || 'success';

            return tmpOps;
        },

        building: function (options) {
            var _S = this;
            var opts = _S.config = _S.settings(options);
            var idx = _S.index;
            var doms = G.doms;
            var dType = G.type;
            var type = _S.currentType = dType[opts.type];
            var body = $('body');


            var mkBox = "<div id='" + doms.maskBox + '_' + idx + "' class='" + doms.maskBox + "' " + doms.type + "='" + type + "' " + doms.times + "='" + idx + "' style='z-index:" + (opts.zIndex + idx) + ";'></div>";
            var mkBoxCon = "<div class='" + doms.maskBoxCon + "' " + doms.type + "='" + type + "' " + doms.times + "='" + idx + "'  style='z-index:" + (opts.zIndex + idx + 1) + ";'><div class='" + doms.maskConBrd + "'><div class='" + doms.maskBoxMain + "'><div class='" + doms.maskTxtBox + "'>" + ((opts.icon === false) ? " " : ("<i class='" + doms.icon + ' ' + doms.icon + '_' + opts.iconType + "'></i>")) + "<div class='" + doms.maskTxt + "'></div></div></div><div class='" + doms.maskBoxFoot + "'></div></div></div>";


            var closeBtn = "<div class='" + doms.maskBoxCloseBtn + "'>x</div>";

            switch (type) {
                case dType.dialog :
                    _S.mkObj = {
                        body: body
                    };
                    _S.pubDlgArea(dType['dialog'], closeBtn, mkBoxCon, mkBox);
                    break;
                case dType.tips :
                    var tips = "<div id='" + doms.tip + '_' + idx + "' class='" + doms.tip + " " + doms.tipAlign + opts.align + "' " + doms.type + "='" + type + "' " + doms.times + "='" + idx + "' style='z-index:" + (opts.zIndex + idx) + ";'><i class='" + doms.icon + "'></i><em></em><div class='" + doms.tipTxt + "'>" + opts.contentMsg + "</div></div>";
                    tips = $(tips).appendTo(body);
                    _S.mkObj = {
                        body: body,
                        ctr: tips
                    };
                    opts.closeBtn !== false ? _S.mkObj.clsBtn = $(closeBtn).appendTo(tips) : '';
                    break;
                case dType.iframe:
                    _S.mkObj = {
                        body: body
                    };
                    _S.pubDlgArea(dType['iframe'], closeBtn, mkBoxCon, mkBox);
                    break;
            }
            _S.resetEvent(type);
        },

        pubDlgArea: function (type, closeBtn, mkBoxCon, mkBox) {

            var _S = this;
            var idx = _S.index;
            var opts = _S.config;
            var doms = G.doms;
            var mkBoxTit = "<div class=" + doms.maskBoxTit + "><p class='" + doms.maskBoxTitMsg + "'>" + opts.title + "</p></div>";

            var contentHtml = opts.content ? opts.content : '';
            var contentMsg = opts.contentMsg ? opts.contentMsg : '';

            var iframeHtml = opts.iframe && opts.iframe.src ? "<iframe id='" + (opts.iframe.id || doms.iframeId + idx) + "' name='" + (opts.iframe.name || doms.iframeName + idx) + "' frameborder='0' src='" + opts.iframe.src + "' width='" + ( opts.iframe.width || 'auto') + "' height='" + ( opts.iframe.height || 'auto') + "'></iframe>" : '';

            var mkBoxCon = $(mkBoxCon).appendTo(_S.mkObj.body),
                maskConBrd = mkBoxCon.find("." + doms.maskConBrd),
                mkBoxMain = mkBoxCon.find("." + doms.maskBoxMain),
                maskBoxFoot = mkBoxCon.find("." + doms.maskBoxFoot),
                overF = {'overflow':'auto'};

            if (type === 'dialog' || type === 'iframe') {
                if (opts.scroll === false) {
                    overF['overflow'] = 'hidden';
                } else if (opts.scrollX === false) {
                    overF['overflow-x'] = 'hidden';
                } else if (opts.scrollY === false) {
                    overF['overflow-y'] = 'hidden';
                }
                mkBoxMain.css(overF);
                if (contentHtml) {
                    mkBoxMain.html(contentHtml);
                    opts.load ? opts.load(_S,$(contentHtml)) : '';
                }
                if(contentMsg) {
                    $('<div></div>').text(contentMsg).appendTo(mkBoxMain.find("."+doms.maskTxt));
                }
            }

            if (type === 'iframe') {
                if (iframeHtml) {
                    mkBoxMain.html(iframeHtml);
                    var iframe = mkBoxMain.find('iframe');

                    iframe.load(function () {
                        var that = $(this);
                        var childWin = self.frames[that.attr('name')];
                        _S.frameWindow = $(childWin);
                        _S.frameBody = $(childWin.document.body);
                        opts.load ? opts.load(_S,_S.frameWindow, _S.frameBody) : '';
                    })
                }
            }

            _S.mkObj.ctr = mkBoxCon;
            _S.mkObj.brd = maskConBrd;
            _S.mkObj.main = mkBoxMain;

            /*遮罩box*/
            _S.mkObj.mkBox = $(mkBox).appendTo(_S.mkObj.body);

            /*弹出层标题*/
            opts.title !== false ? _S.mkObj.tit = $(mkBoxTit).prependTo(maskConBrd) : '';

            /*弹出层关闭按钮*/
            opts.closeBtn !== false ? _S.mkObj.clsBtn = $(closeBtn).appendTo(maskConBrd) : '';

            /*弹出层脚部按钮*/
            if (opts.buttons !== false) {
                _S.mkObj.ft = maskBoxFoot;
                _S.mkObj.buttons = _S.setButtons(maskBoxFoot);
            } else {
                maskBoxFoot.hide();
            }
        },

        setButtons: function (ft) {
            /*设置弹出层的按钮*/
            var _S = this;
            var opts = _S.config;
            var tmpArr = [];
            var buttons = opts.buttons;
            /*按钮初始化*/
            for (var i = 0; i < buttons.length; i++) {
                var button = opts.buttons[i];
                if (typeof button === 'object' && button.type) {
                    var btn = $("<span xv-button-type='" + button.type + "' class='" + G.doms.maskBoxBtn + " " + (button.cls || '') + "'>" + (button.text || '') + "</span>");
                    var fn = button.callBack || '';
                    btn.appendTo(ft);
                    if (typeof fn == 'function') {
                        btn.on('click', {callback: fn}, function (e) {
                            e.data.callback(_S);
                        });
                    }
                    tmpArr.push(btn);
                }
            }
            return tmpArr;
        },

        computeBoxSize: function () {
            /*计算整个弹出层的尺寸，进行初始化*/
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

            /*获取弹出层尺寸*/
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
            var mainW = brdW - lineW * 2;
            main.outerHeight(mainH);
            //todo:人生总会遇到这样那样的奇葩问题，ie7下面须要先进行计算一次clientWidth,何解？
            /*为了计算出浏览器的滚动条宽度*/
            var cliW = main[0].clientWidth;
            var scrollW = mainW - main[0].clientWidth;
            if (scrollW > 0) {
                brdW = brdW + scrollW;
            }

            /*设置弹出box尺寸*/
            ctr.height(brdH);
            ctr.width(brdW);
            return {w: brdW, h: brdH};
        },

        computeCenter: function (obj) {
            /*计算obj居中的位置并返回*/
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
                p = data;
            }
            _S.mkObj.ctr.ps = {
                left: p.left,
                top: p.top
            };
            obj.css({left: p.left, top: p.top});
        },

        /*初始化事件*/
        resetEvent: function (type) {
            var _S = this;
            var _O = _S.mkObj;
            var opts = _S.config;
            var ctr = _O.ctr;
            var time = Number(opts.closeTimes);
            if (type == 'dialog' || type == 'iframe') {
                var tit = _O.tit;

                /*初始化弹出框的尺寸*/
                _S.boxSize = _S.computeBoxSize();

                /*位置初始化*/
                ctr.ps = {left: 0, top: 0};

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
                opts.drag !== false ? _S.drag(tit) : '';
                opts.animate !== false ? ctr.addClass(opts.animate) : ctr.css({opacity:1});

            } else if (type == 'tips') {
                var tips = _O.ctr;
                var target = $(opts.follow);
                var trtW = target.outerWidth();
                var trtH = target.outerHeight();
                var tipsW = tips.outerWidth();
                var tipsH = tips.outerHeight();
                var setP = opts.position;
                var tP = target.offset();
                var tmpP = {left: 0, top: 0};
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

                tmpP.opacity = 1;
                if(opts.animate === false){
                    tips.css(tmpP);
                }else{
                    tips.css({left:tmpP.left+10,top:tmpP.top-20}).addClass(opts.animate);
                    var tipsTimer = setTimeout(function(){tips.css(tmpP);tipsTimer=null},30);
                }

            }

            if (time > 0) {
                _S.timer = setTimeout(function () {
                    _S.close();
                }, time);
            }

            opts.closeBtn !== false ? _O.clsBtn.on('click', {that: _S}, _S.close) : '';
            opts.esc !== false ? $(document).on('keyup',{that: _S},_S.close) : '';

        },

        /*关闭*/
        close: function (e) {
            if(e && e.keyCode){
                var isEsc;
                if(e.keyCode !== 27) {
                    return false;
                }else{
                    isEsc = true;
                }
            }
            var _S = e && e.data ? e.data.that : this;
            xvDialog.close(_S.index);
            _S.timer ? clearTimeout(_S.timer):'';
            isEsc ? $(document).off('keyup',_S.close):'';
        },

        /*按钮监听事件的添加*/
        on: function (type, func) {
            var _S = this;
            var buttons = _S.config.buttons;
            var btnObj = _S.mkObj.buttons;
            if (type && func) {
                for (var i = 0; i < buttons.length; i++) {
                    if ((buttons[i].type == type) && typeof func == 'function') {
                        btnObj[i].on('click', function () {
                            func(_S)
                        });
                    }
                }
            }
        },

        drag: function (obj) {
            var _S = this,
                ctr = _S.mkObj.ctr;
            obj.on('mousedown', function (e) {
                e.preventDefault();
                var p = ctr.ps,
                    disX = e.clientX - p.left,
                    disY = e.clientY - p.top,
                    doc;

                var dragBox = $("<div class='" + G.doms.maskDrag + " '></div>").appendTo($('body'));
              var objProt = dragBox.get(0);
                dragBox.outerWidth(_S.boxSize.w);
                dragBox.outerHeight(_S.boxSize.h);
                dragBox.css({left: p.left, top: p.top});

                if (objProt.setCapture) {
                    doc = dragBox;
                    objProt.setCapture();
                } else {
                    doc = $(document);
                }

                $(document).on('mouseup', {that: _S, objProt: objProt, doc: doc, dragBox: dragBox}, _S.clearDrag);

                doc.on('mousemove', {that: _S, win: $(window),dragBox: dragBox, disX: disX, disY: disY}, _S.moveFunc);
            });
        },

        clearDrag: function (e) {
            var opts = e.data,
                objProt = opts.objProt,
                doc = opts.doc,
                dragBox = opts.dragBox,
                that = opts.that,
                p = that.mkObj.ctr.ps;

            if (objProt.releaseCapture) {
                objProt.releaseCapture();
            }

            that.mkObj.ctr.css({left: p.left, top: p.top});
            dragBox.remove();
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

            that.setPosition({left: boxL, top: boxT, obj: opts.dragBox});
            e.preventDefault();
        }
    };

})(window, jQuery);
