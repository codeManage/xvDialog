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
            maskBoxTit: 'xv_Mask_Box_tit',
            maskBoxCloseBtn: 'xv_Mask_Box_CloseBtn',
            maskBoxCancelBtn: 'xv_Mask_Box_CancelBtn',
            maskBoxSureBtn: 'xv_Mask_Box_SureBtn'
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
            var mkBox = $("<div class='" + doms.maskBox + " " + doms.maskBox + '_' + idx + "'></div>").appendTo(body);
            var mkBoxCon = $("<div class='" + doms.maskBoxCon + "'><div class='" + doms.maskConBrd + "'><div class=" + doms.maskBoxTit + "></div><div class='" + doms.maskBoxMain + "'></div></div></div>").appendTo(body);
            var closebtn = "<div class='" + doms.maskBoxCloseBtn + "'></div>";
            var cancelBtn = "<div class='" + doms.maskBoxCancelBtn + "'></div>";
            var sureBtn = "<div class='" + doms.maskBoxSureBtn + "'></div>";
            var maskConBrd = mkBoxCon.find("." + doms.maskConBrd);
            var mkBoxMain = mkBoxCon.find("." + doms.maskBoxMain);
            var mkBoxTit = mkBoxCon.find("." + doms.maskBoxTit);

            _S.mkObj ={
                body:body,
                box:mkBox,
                ctr:mkBoxCon,
                brd:maskConBrd,
                main:mkBoxMain,
                tit:mkBoxTit,
                clsBtn:closebtn,
                cclBtn:cancelBtn,
                sBtn:sureBtn
            };




          /*  mkBox.click(function(){
                $(body).blur();
            });*/

            _S.resetEvent();


            //$('body').addClass('disSelectbody');
            /*document.body.onselectstart = document.body.ondrag = function(){
                return false;
            }*/
            /*$(window,document).on('scroll',function(e){
                e.preventDefault();
            })*/


            switch (type) {
                case dType.alert :
                    html = "<div></div>"
            }
        },


        computeSize:function(){
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

            return {w:mkConW,h:mkConH}
        },
        computePosition: function (opts ) {
            var type = opts.type || 'center';
            var w = opts.w || 0;
            var h = opts.h || 0;
            var $win = $(window);

            var position;
            switch (type) {
                case 'center':
                    var pL = $win.width() - w;
                    var pT = $win.height() - h;

                    position = {
                        left: pL > 0 ? pL / 2 : 0,
                        top: pT > 0 ? pT / 2 : 0
                    };
                    break;
            }

            return position;
        },


        setPosition:function(e,opts,flag){
            var data = e ? e.data : opts;
            var obj = data.obj;
            var _S = data.that || this;
            if(!flag){
                var p = obj.position = _S.computePosition(data);
            }else {
                p = obj.position = data;
            }
            obj.css({left: p.left, top: p.top});
        },
        resetEvent:function(){
            var _S = this;
            var _O = _S.mkObj;

            var ctr = _O.ctr;
            var tit = _O.tit;

            /*初始化弹出框的尺寸*/
            var boxSize = _S.computeSize();

            /*位置初始化*/
            ctr.position = {left:0,top:0};
            _S.setPosition('', {type: 'center', obj: ctr, w: boxSize.w, h: boxSize.h});
            $(window).on('resize', {type: 'center',that:this, obj: ctr, w: boxSize.w, h: boxSize.h}, _S.setPosition);

            tit.on('mousedown',function(e){
                var p = ctr.position;
                var left = p.left;
                var top = p.top;
                var startP = {left:e.clientX,top:e.clientY};
                $(document).mousemove(function(e){
                    var moveX = e.clientX-startP.left;
                    var moveY = e.clientY-startP.top;

                    if(ctr.position.left + boxSize.w > $(window).width()) {

                    }else{
                        _S.setPosition('', {left:parseInt(left + moveX),top:parseInt(top + moveY),obj:ctr},true);
                    }

                })
            });
            tit.mouseup(function(){
                $(document).off('mousemove');
            })




        },


        movePosition:function(){

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

    DialogBox.clone = function (obj) {//对象的拷贝
        var newObj = {};
        if (typeof (obj) != 'object' || obj == null) {
            return obj;
        }
        if (obj.length) {
            newObj = [];
            for (var j = 0; j < obj.length; j++) {
                newObj.push(GridTable.clone(obj[j]));
            }
        } else {
            for (var i in obj) {
                newObj[i] = GridTable.clone(obj[i]);
            }
        }
        return newObj;
    };


})(window, jQuery);
