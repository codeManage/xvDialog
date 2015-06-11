define('validateForm', function (require, exports, module) {
    require('jquery');

    var validateForm;

    function validateForm(formId, opts) {
        return new validateForm.fn.init(formId, opts)
    }

    validateForm.fn = validateForm.prototype = {
        init: function (formId, opts) {
            this.formObj = $(formId);
            this.formObj.result = {};
            this.handle(formId, opts);
        },
        resultStatus: function () {
            for (var i in this.formObj.result) {
                var promptObj = $("#validate_textPrompt-box" + this.formObj.attr('id') + i);
                if (!this.formObj.result[i]) {
                    var objIpt = this.objIpt(this.formObj,i);
                    objIpt.addClass("validate_textPrompt-boxError");
                    promptObj.show();
                    this.getPosition(promptObj,objIpt);
                    return false;
                }
            }
            return true;
        },

        objIpt:function(formObj,name){
            var objIpt;
                objIpt = formObj.find("input[name=" + name + "]");
                objIpt = objIpt.length > 0 ? objIpt : formObj.find("textarea[name=" + name + "]");
            return objIpt
        },

        handle: function (formId, opts) {
            var config = opts || {};
            var that = this;
            for (var i = 0; i < config.length; i++) {
                var objIpt = that.objIpt(that.formObj,config[i].name);
                if (objIpt.length > 0) {
                    config[i].objIpt = objIpt;
                    that.validateBox(that.formObj.attr('id'),config[i].name, objIpt, config[i].zIndex, config[i].margin);
                    var typeChk = (config[i].type == 'textArea' || !config[i].type) ? 'chktext' : 'chk' + config[i].type;
                    config[i].that = this;
                    var promptObj = $("#validate_textPrompt-box" + that.formObj.attr('id') + config[i].name);

                    if (config[i].defaultStatus == 'on') {
                        that[typeChk](config[i]);
                    } else if (config[i].defaultStatus == 'off') {
                        that[typeChk](config[i]);
                        objIpt.removeClass("validate_textPrompt-boxError");
                        promptObj.hide();
                    } else {
                        that[typeChk](config[i]);
                        promptObj.hide();
                    }

                    if (config[i].type == 'text' || config[i].type == 'date' || config[i].type == 'price' || config[i].type == 'number') {
                        $("input[name=" + config[i].name + "]").on('keyup', {opts: config[i]}, that[typeChk]);
                        $("input[name=" + config[i].name + "]").on('blur', {opts: config[i]}, that[typeChk]);
                    } else if (config[i].type == 'file') {
                        $("input[name=" + config[i].name + "]").on('change', {opts: config[i]}, that[typeChk]);
                    } else if (config[i].type == 'textArea') {
                        $("textarea[name=" + config[i].name + "]").on('keyup', {opts: config[i]}, that.chktext);
                        $("input[name=" + config[i].name + "]").on('blur', {opts: config[i]}, that[typeChk]);
                    } else if(config[i].type == 'select'){
                        $("input[name=" + config[i].name + "]").on('blur', {opts: config[i]}, that[typeChk]);
                    }
                }
            }
        },
        validateBox: function (formId,name, objIpt, zIndex, margin) {
            var html = '<div class="validate_textPrompt-box" id="validate_textPrompt-box' + formId + name + '" style="position: absolute;display:none;z-index:' + (zIndex || 99999) + '; margin:' + margin + '"><b><i></i></b><span></span></div>';
            var vBox = $(html).appendTo('body');
            var that = this;
            this.getPosition(vBox, objIpt);
            $(window).resize(function () {
                that.getPosition(vBox, objIpt);
            });
        },
        chktext: function (e) {
            //文本长度验证
            var config = e.data ? e.data.opts : e;
            var self = config.that;
            var obj = config.objIpt;
            var objValue = self.trim(obj.val());
            var promptObj = $("#validate_textPrompt-box" + self.formObj.attr('id') + config.name);
            obj.val(objValue);

            if (objValue) {
                var ppt = self.chkLength(objValue, config);
                if (ppt == 1) {
                    self.passHandle(obj, promptObj, config);
                    return;
                }
            } else if (config.empty != 'on' && !objValue) {
                var ppt = config.prompt || '不能为空！';
            } else {
                self.passHandle(obj, promptObj, config);
                return;
            }
            self.noPassHandle(obj, promptObj, config, ppt);
        },
        chkdate: function (e) {

            /*
             *type:'number',必填
             * name:'name',必填
             * empty:'on',选填，默认不可为空 ，如果'on',验证空的时候可通过
             * datePat：'-' 选填，默认'-',表示时间格式（1999-09-09）；
             * hms:'on',选填，默认为不带时分秒的时间，如果'on',表示开启时分秒格式
             * */

            var config = e.data ? e.data.opts : e;
            var self = config.that;
            var obj = config.objIpt;
            var objValue = config.that.trim(obj.val());
            var promptObj = $("#validate_textPrompt-box" + self.formObj.attr('id') +  config.name);
            var format = config.datePat ? config.datePat : '-';
            obj.val(objValue);

            var timesFat = config.hms == 'on' ? '(\\s){1}((0?[0-9])|(1[0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])' : '';
            var datesPat = new RegExp("^((19[0-9]{2})|(2[0-9]{3}))" + format + "((0?[1-9])|(1[0-2]))" + format + "((0?[1-9])|(1[0-9])|(2[0-9])|(3[0-1]))" + timesFat + "$");
            if (objValue) {
                if (datesPat.test(objValue)) {
                    self.passHandle(obj, promptObj, config);
                    return;
                } else {
                    var ppt = config.prompt || '请输入正确的时间格式!';
                }
            } else if ((config.empty != 'on') && (!objValue)) {
                var ppt = config.prompt || '请输入正确的时间格式!';

            } else {
                self.passHandle(obj, promptObj, config);
                return;
            }
            self.noPassHandle(obj, promptObj, config, ppt)
        },
        chknumber: function (e) {
            /*
             *type:'number',必填
             * name:'name',必填
             * empty:'on',选填，默认不可为空 ，如果'on',验证空的时候可通过
             * minLen:'6',
             * maxLen:'10',
             * */
            var config = e.data ? e.data.opts : e;
            var self = config.that;
            var obj = config.objIpt;
            var objValue = config.that.trim(obj.val());
            var promptObj = $("#validate_textPrompt-box" + self.formObj.attr('id') + config.name);
            if (objValue) {
                if ((/^(\d+)$/.test(objValue))) {
                    var ppt = config.that.chkLength(objValue, config);
                    if (ppt == 1) {
                        self.passHandle(obj, promptObj, config);
                        return;
                    }

                } else {
                    var ppt = config.prompt || '请填写数值！';
                }

            } else if (config.empty != 'on' && !objValue) {
                var ppt = config.prompt || '请填写数值！';
            } else {
                self.passHandle(obj, promptObj, config);
                return;
            }
            self.noPassHandle(obj, promptObj, config, ppt);
        },
        chkprice: function (e) {
            var config = e.data ? e.data.opts : e;
            var self = config.that;
            var obj = config.objIpt;
            var objValue = config.that.trim(obj.val());
            var promptObj = $("#validate_textPrompt-box" + self.formObj.attr('id') + config.name);
            obj.val(objValue);
            if (objValue) {
                var pri = Number(objValue);
                if (/^\d+(.?\d+)?$/.test(objValue) || objValue === '0' || pri > 0) {
                    obj.val(pri.toFixed(config.fixedNum));
                    self.passHandle(obj, promptObj, config);
                    return;
                } else {
                    var ppt = config.prompt || '请填写正确的价格！';
                }
            } else if (config.empty != 'on' && !objValue) {
                var ppt = config.prompt || '请填写价格！';

            } else {
                self.passHandle(obj, promptObj, config);
                return;
            }
            self.noPassHandle(obj, promptObj, config, ppt);
        },
        chkfile: function (e) {
            var config = e.data ? e.data.opts : e;
            var self = config.that;
            var obj = config.objIpt;
            var objValue = obj.val();
            var promptObj = $("#validate_textPrompt-box" +self.formObj.attr('id') +config.name);
            var filePat = new RegExp('.' + config.fileType);
            if (objValue) {
                if (filePat.test(objValue)) {
                    self.passHandle(obj, promptObj, config);
                    return;
                } else {
                    var ppt = config.prompt || '请出上传正确的文件！'
                }
            } else if (config.empty != 'on' && !objValue) {
                var ppt = config.prompt || '请出上传文件！';
            }
            self.noPassHandle(obj, promptObj, config, ppt);
        },
        chkselect: function (e) {//selectAuto组件中的验证，就是自定义select非默认select验证
            var config = e.data ? e.data.opts : e;
            var self = config.that;
            var obj = config.objIpt;
            var objValue = obj.val();
            var promptObj = $("#validate_textPrompt-box" + self.formObj.attr('id') +config.name);
            if (objValue) {
                self.passHandle(obj, promptObj, config);
            } else if (config.empty != 'on' && !objValue) {
                var ppt = config.prompt || '选择项不能为空！';
                self.noPassHandle(obj, promptObj, config, ppt);
            }
        },
        passHandle: function (obj, promptObj, config, ppt) {
            promptObj.hide();
            this.formObj.result[config.name] = true;
            obj.removeClass("validate_textPrompt-boxError");
            obj.off('blur mouseout',this.hidePromptObj);
            obj.off('mouseover' ,this.showPromptObj);
        },
        noPassHandle: function (obj, promptObj, config, ppt) {
            obj.addClass("validate_textPrompt-boxError");
            promptObj.show().find('span').text(ppt);
            obj.on('blur mouseout',{promptObj:promptObj},this.hidePromptObj);
            obj.on('mouseover',{promptObj:promptObj,obj:obj,that:config.that},this.showPromptObj);

            this.formObj.result[config.name] = false;
        },
        hidePromptObj:function(e){
            var config = e.data ? e.data : e;
            config.promptObj.hide();
        },
        showPromptObj:function(e){
            var config = e.data ? e.data : e;
            config.promptObj.show();
            config.that.getPosition(config.promptObj,config.obj);
        },
        chkLength: function (objValue, config) {
            if (config.minLen && objValue.length < config.minLen[0] && objValue.length > 0) {
                return config.minLen[1] || '长度不能小于' + config.minLen[0] + '位!';
            } else if (config.maxLen && objValue.length > config.maxLen[0]) {
                return  config.maxLen[1] || '长度不能大于' + config.maxLen[0] + '位!';
            } else {
                return 1;
            }
        },

        clearPrompt: function () {
            var allEls = this.formObj.result;

            for (var i in allEls) {
                $("#validate_textPrompt-box" +this.formObj.attr('id')+i).hide();
                this.formObj.find("input[name=" + i + "]").removeClass("validate_textPrompt-boxError");
                this.formObj.find("textarea[name=" + i + "]").removeClass("validate_textPrompt-boxError");
            }
        },
        trim: function (string) {
            return string.replace(/^(\s+)|(\s+)$/, '');
        },
        getPosition: function (obj, alignObj) {
            var alignObjP = {
                t: alignObj.offset().top,
                b: alignObj.outerHeight() + alignObj.offset().top,
                l: alignObj.offset().left,
                r: alignObj.offset().left + alignObj.outerWidth()
            };
            var compuP = $(window).width() - alignObjP.r;
            var objW = obj.outerWidth();
            if (compuP > objW) {
                var lft = alignObjP.r;
                tp = alignObjP.t;
            } else {
                var lft = alignObjP.l,
                    tp = alignObjP.b;
            }
            obj.css({'left': lft, 'top': tp});
        }
    };
    validateForm.fn.init.prototype = validateForm.fn;
    exports.validateForm = validateForm;
});
