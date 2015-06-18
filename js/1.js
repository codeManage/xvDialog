var mkBox = $("<div id='"+ doms.maskBox + '_' + idx+"' class='" + doms.maskBox + " "  + "' style='z-index:"+(opts.zIndex+idx)+";'></div>").appendTo(body);
var mkBoxCon = $("<div class='" + doms.maskBoxCon + "' style='z-index:"+(opts.zIndex+idx+1)+";'><div class='" + doms.maskConBrd + "'><div class=" + doms.maskBoxTit + "></div><p class='" + doms.maskBoxTitMsg + "'>提示框</p><div class='" + doms.maskBoxMain + "'></div><div class='" + doms.maskBoxFoot + "'></div></div></div>").appendTo(body);

var maskConBrd = mkBoxCon.find("." + doms.maskConBrd);
var mkBoxMain = mkBoxCon.find("." + doms.maskBoxMain);
var mkBoxTit = mkBoxCon.find("." + doms.maskBoxTit);
var mkBoxTitMsg = mkBoxCon.find("." + doms.maskBoxTitMsg);
var maskBoxFoot = mkBoxCon.find("." + doms.maskBoxFoot);
var closebtn = $("<div class='" + doms.maskBoxCloseBtn +"'>x</div>").appendTo(maskConBrd);
var sureBtn = $("<span class='" + doms.maskBoxBtn +" "+doms.maskBoxSureBtn+ "'>确定</span>").appendTo(maskBoxFoot);
var cancelBtn = $("<span class='" + doms.maskBoxBtn +" "+doms.maskBoxCancelBtn+ "'>取消</span>").appendTo(maskBoxFoot);



html = "<div class="+doms.maskMsgBox+">" +
"<i class='"+doms.icon+" "+doms.waring+"'></i>" +
"<span> 未经权益所有人同意，不得将资源中的内容挪作商业或盈利用途</span>" +
"</div>";