/**
 * 仿iOS风格的提示窗 代替原声Alert(顶部显示域名)
 * 借鉴weui的风格设定
 * @Author f77#outlook.com
 * @version 3.0
 * @depends
 * 需要依赖jQuery或zepto
 * 需要加载样式表 malert.css
 *
 * update 3.0
 * 增加mHint()方法，弹出的提示若干秒后会自动消去
 *
 * update 2.1:
 * 增加消除对话窗的方法 mAlert_dismiss()
 *
 * update 2.0:
 * 增加窗体样式初始化方法 mAlert_init()
 *
*/

var def_btn_positive_str = "确定";
var def_btn_positive_color = "#009DB9";
var def_dialog_width = null;

var def_mhint_bg = "#F74819";
var def_mhint_color = "#fff";

/**
 * 比mAlert更简易的提示，无需操作显示若干时长后隐去
 */
function mHint(){
    var msg = arguments[0] ? arguments[0] : "hello!"; //必填，弹出的信息
    var dura = arguments[1] ? arguments[1] : 8; //可选，维持时间，默认8秒;
    var pos = arguments[2] ? arguments[2] : 'top'; //可选，显示位置 top(默认顶部居中), right-top,bottom;

    var html = "<div class=\"mh_body\">"+msg+"</div>";

    $("body").append(html);

    $(".mh_body").animate({
        top: "11px"
    }, 400, function(){
        var mh_obj = this;
        setTimeout(function(){
            $(mh_obj).fadeOut(600,function(){$(this).remove();});
        },dura*1000);
    });
    //console.log("mHint:"+msg); //debug
}

/**
 * 替代系统的alert()方法
 * 一共有5个参数，说明见下文备忘
 * 第一参数是必须的，和alert()一致
 */
function mAlert(){
    var msg = arguments[0] ? arguments[0] : "hello!"; //必填，弹窗显示的信息
    var btn_p = arguments[1] ? arguments[1] : def_btn_positive_str; //可选，主按钮的文字，默认显示为【确定】
    var btn_n = arguments[2] ? arguments[2] : ''; //可选，副按钮，不设置或传''时不显示，可以设定为【取消】之类字样
    var callback_p = arguments[3] ? arguments[3] : null; //可选，主按钮绑定的点击回调事件，必须传入一个函数 
    var callback_n = arguments[4] ? arguments[4] : null; //可选，副按钮点击回调，必须是函数。如第3参数未设置，此参数无效
    var callback_wait = arguments[5] ? true : false; //可选，是否等待主按钮的回调再关闭对话窗，默认否
    
    //构造弹窗本体
    var popMask = $('<div>', {'class': 'ma_mask'});
        var popDialog = $('<div>', {'class': 'ma_dialog'});
            var popMsg = $('<div>', {'class': 'ma_msg'});
            $(popMsg).html(msg);
            
            var popFeet = $('<div>', {'class': 'ma_ft'});
                var popBtn1 = $('<div>', {'id': 'ma_btn_positive'});
                $(popBtn1).html(btn_p);
                
                if(btn_n!=''){
                    var popBtn2 = $('<div>', {'id': 'ma_btn_negative'});
                    $(popBtn2).html(btn_n); 
                    $(popFeet).append(popBtn2);   
                }
                
                $(popFeet).append(popBtn1);
            
            $(popDialog).append(popMsg);
            $(popDialog).append(popFeet);
        
        //init css
        if(def_dialog_width) $(popDialog).css('max-width',def_dialog_width+"px"); //默认值300(px)
        if(def_btn_positive_color) $(popDialog).find("#ma_btn_positive").css("color",def_btn_positive_color);
        
        $(popMask).append(popDialog);
    
    $("body").append(popMask);
    $(popMask).show();
    $(popDialog).fadeIn(150);
    
    $(popBtn1).bind('click',function(){
        
        if(callback_p && callback_p instanceof Function){ 
            
            if(callback_wait){
                if(callback_p()){
                    $(popDialog).fadeOut(100,function(){ $(popMask).remove(); });
                }else{}
            }else{
                callback_p();
                $(popDialog).fadeOut(100,function(){ $(popMask).remove(); });    
            }
                        
            //callback_p();
        
        }else
        
            $(popDialog).fadeOut(100,function(){ $(popMask).remove(); });
        
    });
    
    $(popBtn2).bind('click',function(){
        
        if(callback_n && callback_n instanceof Function){ callback_n();}
        
        $(popDialog).fadeOut(100,function(){ $(popMask).remove(); });
        
    });
    
    
}

//初始化对话窗的样式,也可以不初始化
function mAlert_init(dialog_width,def_btn_color,def_btn_str){
    //if(dialog_width) $(".ma_dialog").css('max-width',dialog_width+"px"); //默认值300(px)
    //if(def_btn_color) $("#ma_btn_positive").css("color",def_btn_color);
    if(dialog_width) def_dialog_width = dialog_width;
    if(def_btn_color) def_btn_positive_color = def_btn_color;    
    if(def_btn_str) def_btn_positive_str = def_btn_str;
}


//解除malert的方法
function mAlert_dismiss(){
    $(".ma_dialog").fadeOut(100,function(){ $(".ma_mask").remove(); });
}