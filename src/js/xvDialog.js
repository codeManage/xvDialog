/**
 * Dates
 * author       : xv
 * description  : '日期控件'
 * date         : 2015-3-18
 * version      : 1.0
 * email        : zhangdw620@sina.com
 */

(function (win, $) {

    //常用dom字符
    var G = {//可以自己配置适合自己的结构名称
        doms: {

            /*整体框架公用Class*/
            maskDrag: 'xv_Mask_Drag',
            maskBox: 'xv_Mask_Box',
            maskConBrd: 'xv_Mask_Border',
            maskBoxCon: 'xv_Mask_Container',
            maskBoxMain: 'xv_Mask_Main',
            maskMsgBox: 'xv_Mask_Msg_Box',

            /*标题和标题的详细内容*/
            maskBoxTit: 'xv_Mask_Box_Tit',
            maskBoxTitMsg: 'xv_Mask_Box_Tit_Msg',

            /*弹出一般对话框、或提示框的文本box和内容*/
            maskTxtBox: 'xv_Mask_Txt_Box',
            maskTxt: 'xv_Mask_Txt',

            /*框架弹层*/
            maskIframe: 'xv_Mask_Iframe',
            iframeName: 'xv_Mask_Iframe_Name_',
            iframeId: 'xv_Mask_Iframe_Id_',

            /*tips*/
            tip: 'xv_Mask_Tip',
            tipTxt: 'xv_Mask_Tip_Txt',
            tipAlign: 'xv_Tip_Align_',

            /*弹出层底部按钮*/
            maskBoxFoot: 'xv_Mask_Box_Foot',
            maskBoxBtn: 'xv_Mask_Box_Btn',
            maskBoxCloseBtn: 'xv_Mask_Box_CloseBtn',
            maskBoxCancelBtn: 'xv_Mask_Box_CancelBtn',
            maskBoxOkBtn: 'xv_Mask_Box_OkBtn',

            /*弹出框的icon*/
            icon: 'xv_Mask_Icon',
            waring: 'xv_Mask_Waring',

            /*公用默认配置标识*/
            type: 'xvmktype',
            times: 'mktimes',
            mkrAnimate: 'xv_reset_animate',
            mkAnimate: 'xv_dlt_animate'
        },
        type: {
            /*所有弹出框类型*/
            dialog: 'dialog',
            iframe: 'iframe',
            tips: 'tips',
            /*待增加...*/
            confirm: 'confirm',
            message: 'message'
        },

        /*默认的一些基础size*/
        defaultSize: {
            wh: {
                width: 200,
                height: 100
            },
            /*默认的tips弹出间隙*/
            dltGap: 10,
            /*默认初始化的层级索引*/
            zIndex: 19890620
        }
    };

    /*对外公共方法*/
    win.xvDialog = {
        index: 0,
        mkSign: 0,
        alert: function (config) {
            var config = config || {};
            var dltConfig = {
                title: '提示信息',
                iconType: 'info'/*,
                width: 300,
                height: 200*/
            };
            if (config.size === 'auto') {
                delete dltConfig.width;
                delete dltConfig.height;
            }
            config = $.extend(dltConfig, config, {type: 'dialog', contentId: '', content: ''});
            return $.xvDialog(config);
        },
        contentPage: function (config) {
            var config = config || {};
            var dltConfig = {
                closeAction: 'hide',
                title: false,
                buttons: false
            };

            config = $.extend(dltConfig, config, {type: 'dialog', contentMsg: ''});
            return $.xvDialog(config);
        },
        iframe: function (config) {

            var config = config || {};
            var dltConfig = {
                title: false,
                buttons: false
            };
            config = $.extend(dltConfig, config, {type: 'iframe'});
            return $.xvDialog(config);
        }
        ,
        tips: function (config) {
            var config = config || {};
            var dltConfig = {
                align: 'right',
                mask: false,
                position: {left: 0, top: 0}
            };
            config = $.extend(dltConfig, config, {type: 'tips'});
            return $.xvDialog(config);

            /*待增加...*/
        }, close: function (object, closeType) {


            if (!(object || object === 0)) {
                return false;
            }
            var ctr, idx = Number(object), type = G.doms['type'], attr = G.doms['times'];
            if (idx >= 0) {
                /*如果为数值,通过弹出层的序号来关闭对应的弹出层*/
                ctr = $("[" + attr + "=" + idx + "]");
            } else if (typeof object == 'string') {
                /*通过类型来关闭对应的弹出层*/
                if (object === 'all') {
                    ctr = $("[" + type + "]");
                } else {
                    ctr = $("[" + type + "=" + object + "]");
                }
            } else {
                if (Number(object.index) >= 0) {
                    /*通过实例来进行删除对应的弹出层*/
                    ctr = object.config.body.find("[" + attr + "=" + object.index + "]");
                }
            }

            /*关闭类型：hide|remove*/
           (closeType && closeType === 'hide') ? ctr.hide() : ctr.remove();
        }
    };

    /*入口*/
    $.xvDialog = function (opts) {
        var xv;
        var uniq = opts.contentId || opts.id;
        if (opts.closeAction == 'hide' && uniq) {
            var isExit = $('#' + uniq).parents('.' + G.doms.maskBoxCon);
            if (isExit.length) {
                xv = xvDialog['xvmksign' + isExit.attr('xvmksign')];
                xv.show();
                return xv;
            }
            xv = xvDialog['xvmksign' + xvDialog.mkSign++] = new DialogBox(opts);
            return xv;
        }
        return new DialogBox(opts);
    };

    /*主框架*/
    var DialogBox = function (options) {
        this.building(options);
    };

    /*原型结构*/
    DialogBox.pt = DialogBox.prototype = {
        /*传参的过滤*/
        settings: function (opts) {
            var _S = this;
            var tmpOps = {};
            _S.index = tmpOps.index = (Number(opts.index) >= 0) ? opts.index : xvDialog.index++;
            tmpOps.type = opts.type || 'dialog';
            tmpOps.closeBtn = (opts.closeBtn || opts.closeBtn === false) ? opts.closeBtn : '';
            tmpOps.mask = (opts.mask === false) ? opts.mask : '';
            tmpOps.closeTimes = opts.closeTimes || '';
            tmpOps.closeAction = opts.closeAction || '';
            tmpOps.openWindow = opts.openWindow || window;
            tmpOps.esc = opts.esc || '';
            tmpOps.id = opts.id || '';
            tmpOps.drag = (opts.drag || opts.drag === false) ? opts.drag : '';
            tmpOps.content = opts.content || '';
            tmpOps.contentMsg = opts.contentMsg || '';
            tmpOps.contentId = opts.contentId || '';
            tmpOps.animate = (opts.animate || opts.animate === false) ? opts.animate : [G.doms.mkrAnimate, G.doms.mkAnimate];

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

        /*一些弹出层类型的公用参数过滤*/
        pubOptions: function (type, tmpOps, opts) {
            var _S = this;
            tmpOps.load = (opts.load && typeof opts.load === 'function') ? opts.load : '';
            tmpOps.title = (!opts.title && opts.title !== false) ? '' : opts.title;
            tmpOps.icon = opts.icon;
            tmpOps.scroll = opts.scroll !== false;
            tmpOps.scrollX = opts.scrollX !== false;
            tmpOps.scrollY = opts.scrollY !== false;
            tmpOps.showAlign = opts.showAlign || '';
            tmpOps.buttons = (typeof(opts.buttons) === 'object' || opts.buttons === false) ? opts.buttons : [
                {
                    type: 'ok',
                    text: opts.okText || '确定',
                    cls: G.doms.maskBoxOkBtn,
                    callback: function () {
                        var result = typeof opts.okBtn === 'function' ? opts.okBtn(_S) : '';
                        if (result !== false) {
                            _S.close();
                        }
                    }
                },
                {
                    type: 'cancel',
                    text: opts.cancelText || '取消',
                    cls: G.doms.maskBoxCancelBtn,
                    callback: function () {
                        var result = typeof opts.cancelBtn === 'function' ? opts.cancelBtn(_S) : '';
                        if (result !== false) {
                            _S.close();
                        }
                    }
                }
            ];

            if (type === 'iframe') {
                tmpOps.iframe = opts.iframe || '';
            }

            tmpOps.iconType = opts.iconType || 'success';
            return tmpOps;
        },

        /*构建弹出层框架结构*/
        building: function (options) {
            var _S = this;
            var isRepeatObj;
            var opts = _S.config = _S.settings(options);
            var idx = _S.index;
            var doms = G.doms;
            var dType = G.type;
            var type = _S.currentType = dType[opts.type];
            var body = _S.config.body = $('body', opts.openWindow.document);
            _S.config.openWindow = $(opts.openWindow);
            _S.config.currentWindow = $(window);


            var rAnimate = opts.animate === false ? '' : (opts.animate[0] || doms.mkrAnimate);
            var mkBox = "<div id='" + doms.maskBox + '_' + idx + "' class='" + doms.maskBox + "' " + doms.type + "='" + type + "' " + doms.times + "='" + idx + "' xvmksign='" + (xvDialog.mkSign++) + "' style='z-index:" + (opts.zIndex + idx) + ";'></div>";
            var mkBoxCon = "<div class='" + doms.maskBoxCon + " " + rAnimate + "' " + doms.type + "='" + type + "' " + doms.times + "='" + idx + "' xvmksign='" + (xvDialog.mkSign) + "' style='z-index:" + (opts.zIndex + idx + 1) + ";'><div class='" + doms.maskConBrd + "'><div class='" + doms.maskBoxMain + "' id='" + (opts.id || (doms.maskBoxMain + idx)) + "'><div class='" + doms.maskTxtBox + "'>" + ((opts.icon === false) ? " " : ("<i class='" + doms.icon + ' ' + doms.icon + '_' + opts.iconType + "'></i>")) + "<div class='" + doms.maskTxt + "'></div></div></div><div class='" + doms.maskBoxFoot + "'></div></div></div>";

            var closeBtn = "<div class='" + doms.maskBoxCloseBtn + "'>x</div>";

            if (opts.closeAction === 'hide') {
                xvDialog['xvmksign' + xvDialog.mkSign] = _S;
            }
            _S.mkObj = {};
            switch (type) {
                case dType.dialog :
                    isRepeatObj = _S.pubDlgArea(dType['dialog'], closeBtn, mkBoxCon, mkBox);
                    break;
                case dType.tips :
                    var tips = "<div id='" + doms.tip + '_' + idx + "' class='" + doms.tip + " " + doms.tipAlign + opts.align + "' " + doms.type + "='" + type + "' " + doms.times + "='" + idx + "' style='z-index:" + (opts.zIndex + idx + 1) + ";'><i class='" + doms.icon + "'></i><em></em><div class='" + doms.tipTxt + "'>" + opts.contentMsg + "</div></div>";
                    tips = $(tips).appendTo(body);
                    _S.mkObj = {
                        ctr: tips
                    };
                    opts.closeBtn !== false ? _S.mkObj.clsBtn = $(closeBtn).appendTo(tips) : '';
                    break;
                case dType.iframe:
                    isRepeatObj = _S.pubDlgArea(dType['iframe'], closeBtn, mkBoxCon, mkBox);
                    break;
            }

            /*遮罩box*/
            (opts.mask === false) ? '' : _S.mkObj.mkBox = $(mkBox).appendTo(body);
            _S.resetEvent(type);
        },

        /*一些弹出层类型公用的结构初始化*/
        pubDlgArea: function (type, closeBtn, mkBoxCon) {

            var _S = this;
            var idx = _S.index;
            var opts = _S.config;
            var doms = G.doms;
            var mkBoxTit = "<div class=" + doms.maskBoxTit + "><p class='" + doms.maskBoxTitMsg + "'>" + opts.title + "</p></div>";

            var contentHtml = opts.content ? opts.content : '';
            var contentMsg = opts.contentMsg ? opts.contentMsg : '';
            var contentId = opts.contentId ? opts.contentId : '';

            var iframeHtml = opts.iframe && opts.iframe.src ? "<iframe id='" + (opts.iframe.id || doms.iframeId + idx) + "' name='" + (opts.iframe.name || doms.iframeName + idx) + "' frameborder='0' src='" + opts.iframe.src + "' width='" + ( opts.iframe.width || 'auto') + "' height='" + ( opts.iframe.height || 'auto') + "'></iframe>" : '';


            var mkBoxCon = $(mkBoxCon).appendTo(opts.body),
                maskConBrd = mkBoxCon.find("." + doms.maskConBrd),
                mkBoxMain = mkBoxCon.find("." + doms.maskBoxMain),
                maskBoxFoot = mkBoxCon.find("." + doms.maskBoxFoot),
                overF = {'overflow': 'auto'};

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
                    opts.load ? opts.load(_S) : '';
                }
                if (contentMsg) {
                    $('<div></div>').text(contentMsg).appendTo(mkBoxMain.find("." + doms.maskTxt));
                }
                if (contentId) {
                    mkBoxMain.html($('#' + contentId));
                }
            }

            if (type === 'iframe') {
                if (iframeHtml) {
                    mkBoxMain.html(iframeHtml);
                    var iframe = mkBoxMain.find('iframe');
                    iframe.load(function () {
                        opts.load ? opts.load(_S, opts.openWindow ,opts.currentWindow) : '';
                    })
                }
            }

            _S.mkObj.ctr = mkBoxCon;
            _S.mkObj.brd = maskConBrd;
            _S.mkObj.main = mkBoxMain;

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

        /*设置弹出层底部按钮*/
        setButtons: function (ft) {
            /*设置弹出层的按钮*/
            var _S = this;
            var opts = _S.config;
            var tmpArr = [];
            var buttons = opts.buttons;
            /*按钮初始化*/
            for (var i = 0; i < buttons.length; i++) {
                var button = opts.buttons[i];
                var buttonId = button.id ? " id='" + button.id + "' " : "id='" + button.type + '_' + _S.index + '_' + i + "'";
                if (typeof button === 'object' && button.type) {
                    var btn = $("<button " + (buttonId || '') + "xv-button-type='" + button.type + "' class='" + G.doms.maskBoxBtn + " " + (button.cls || '') + "'>" + (button.text || '') + "</button>");
                    var fn = button.callback || '';
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

        /*计算弹出层的尺寸，并进行初始化尺寸设置*/
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

        /*居中计算*/
        computeCenter: function (obj) {
            /*计算obj居中的位置并返回*/
            var w,
                h,
                pL,
                pT,
                $win = this.config.openWindow;
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

        /*弹出层位置的计算*/
        setPosition: function (opts) {
            var data = opts.data ? opts.data : opts;
            var p, tmpPs = {}, tmpL, tmpT;
            var _S = data.that || this;
            var obj = data.obj ? data.obj : _S.mkObj.ctr;
            var $win = _S.config.openWindow;

            if (opts.data && opts.data.auto) {
                /*对元素居中处理*/
                p = _S.computeCenter();
            } else {
                p = data;
            }

            /*分别判断拖拽和窗口特殊定位*/
            if (Number(p.right) >= 0) {
                tmpL = $win.width() - _S.boxSize.w - p.right;
                tmpPs.right = p.right;
            } else if (Number(p.left) >= 0) {
                tmpL = p.left;
                tmpPs.left = p.left;
            }

            if (Number(p.bottom) >= 0) {
                tmpT = $win.height() - _S.boxSize.h - p.bottom;
                tmpPs.bottom = p.bottom;
            } else if (Number(p.top) >= 0) {
                tmpT = p.top;
                tmpPs.top = p.top;
            }

            _S.mkObj.ctr.ps = {
                left: tmpL,
                top: tmpT
            };

            obj.css(_S.mkObj.ctr.ps);

            if (p.type) {
                obj.css(tmpPs);
            }
        },

        /*初始化事件*/
        resetEvent: function (type) {
            var _S = this;
            var _O = _S.mkObj;
            var opts = _S.config;
            var openWin = opts.openWindow;
            var body = opts.body;
            var ctr = _O.ctr;
            var autoP;
            var time = Number(opts.closeTimes);
            if (type == 'dialog' || type == 'iframe') {

                /*初始化弹出框的尺寸*/
                _S.boxSize = _S.computeBoxSize();

                /*位置初始化*/
                ctr.ps = {left: 0, top: 0};

                /*判断初始化的弹层的位置，默认居中*/
                /*位置随着视口的变换自动居中*/
                if (opts.showAlign) {
                    _S.setPosition(opts.showAlign);
                    autoP = $.extend(opts.showAlign, {type: true, that: _S});
                } else {
                    _S.setPosition(_S.computeCenter());
                    autoP = {auto: true, type: true, that: _S}
                }
                openWin.on('resize', autoP, _S.setPosition);

                /*滚动条位置置顶，并组织滚动条默认事件*/
                openWin.on('scroll', function (e) {

                    /*e.returnvalue=false;
                     //$(this).scrollTop(0);
                     return false;*/
                });

                /*触发拖拽*/
                (_O.tit && (opts.drag !== false)) ? _S.drag(_O.tit) : '';

                /*是否开启动画*/
                opts.animate !== false ? ctr.addClass(opts.animate[1] || opts.animate) : ctr.css({opacity: 1});
            } else if (type == 'tips') {
                var tips = _O.ctr;
                var target = body.find(opts.follow);
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
                if (opts.animate === false) {
                    tips.css(tmpP);
                } else {
                    tips.css({left: tmpP.left + 10, top: tmpP.top - 20}).addClass(opts.animate[1]);
                    var tipsTimer = setTimeout(function () {
                        tips.css(tmpP);
                        tipsTimer = null
                    }, 30);
                }
            }

            if (time > 0) {
                _S.timer = setTimeout(function () {
                    _S.close();
                }, time);
            }

            opts.closeBtn !== false ? _O.clsBtn.on('click', {that: _S}, _S.close) : '';
            opts.esc !== false ? openWin.on('keyup', {that: _S}, _S.close) : '';

        },

        /*关闭*/
        close: function (e) {
            if (e && e.keyCode) {
                var isEsc;
                if (e.keyCode !== 27) {
                    return false;
                } else {
                    isEsc = true;
                }
            }
            var _S = e && e.data ? e.data.that : this;
            /*弹出层位置初始化*/
            var opts = _S.config;
            if (opts.closeAction === 'hide' && opts.animate[1]) {
                _S.mkObj.ctr.removeClass(opts.animate[1]);
                xvDialog.close(_S, 'hide')
            } else {
                xvDialog.close(_S);
            }
            _S.timer ? clearTimeout(_S.timer) : '';
            isEsc ? opts.openWindow.off('keyup', _S.close) : '';
        },

        /*层关闭类型为hide的时候，可以通过show来恢复显示层*/
        show: function () {
            var _S = this;
            var mkObj = _S.mkObj;
            mkObj.ctr.show();
            mkObj.mkBox ? mkObj.mkBox.show() : '';
            _S.resetEvent(_S.currentType);
        },

        /*按钮监听事件的添加*/
        on: function (id, func) {
            var _S = this;
            var buttons = _S.config.buttons;
            var btnObj = _S.mkObj.buttons;
            if (id && func) {
                for (var i = 0; i < buttons.length; i++) {
                    if ((buttons[i].id == id) && typeof func == 'function') {
                        btnObj[i].on('click', function () {
                            func(_S);
                        });
                        break;
                    }
                }
            }
        },

        /*拖拽*/
        drag: function (obj) {
            var _S = this,
                ctr = _S.mkObj.ctr,
                opts = _S.config,
                $win = opts.openWindow;
            if (!obj.length) {
                return false
            }
            obj.on('mousedown', function (e) {
                e.preventDefault();
                var p = ctr.ps,
                    disX = e.clientX - p.left,
                    disY = e.clientY - p.top,
                    doc;
                var dragBox = $("<div class='" + G.doms.maskDrag + " '></div>").appendTo(opts.body);
                var objProt = dragBox.get(0);
                dragBox.outerWidth(_S.boxSize.w);
                dragBox.outerHeight(_S.boxSize.h);
                dragBox.css(p);
                if (objProt.setCapture) {
                    doc = dragBox;
                    objProt.setCapture();
                } else {
                    doc = $win;
                }


                $win.on('mouseup', {that: _S, objProt: objProt, doc: doc, dragBox: dragBox}, _S.clearDrag);
                doc.on('mousemove', {
                    that: _S,
                    win: opts.openWindow,
                    scrollT: $win.scrollTop(),
                    dragBox: dragBox,
                    disX: disX,
                    disY: disY
                }, _S.moveFunc);
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
            that.config.openWindow.off('mouseup', that.clearDrag);
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
