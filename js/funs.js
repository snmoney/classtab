/**
 * Created by Flamen on 2019-12-27.
 */

var rowcount = 0;

$(function(){
    //...似乎没有需要初始化的
    rowcount = $(".ctime").length + 1;

    //添加行
    $(".btn_addrow").click(function(){
        rowcount++;
        var newctid = "ctime_"+rowcount;

        $("#row_template .ctime").attr("id",newctid);

        var html = $("#row_template tr:nth-child(1)").clone();

        $("#row_template .ctime").removeAttr("id");

        $("#tab_classes tbody").append(html);


        laydate.render({
            elem: '#'+newctid
            ,type: 'time'
            ,range: true
        });

        bind_delrow();

    });



    //初始化日期选择组件
    $("#tab_classes .ctime").each(function(){
       var ctid = $(this).attr("id");
        //时间范围
        laydate.render({
            elem: '#'+ctid
            ,type: 'time'
            ,range: true
        });
    });

    laydate.render({
        elem: '#enddate'
        ,type: 'date'
    });

    bind_delrow();

});

function bind_delrow(){
    $(".btn_delrow").unbind();
    $(".btn_delrow").click(function(){
        var row = $(this).parent().parent();
        mAlert("删除整行课程？","确定","取消",function(){
           $(row).remove();
        });
    });
}


function chkform(){

    var err = 0;
    $("#tab_classes .ctime").each(function(){
       if($(this).val()==''){
           err = 1;
           mAlert("有课程的时间未定义，请返回检查");
       }
    });

    if(err){
        return false;
    }

    var enddate = $("#enddate").val(); //如果没有值，设为6个月后
    var reminder = $("input[name='alarm']:checked").val(); //提醒的时间设置

    var rows = []; //
    $("#tab_classes tbody tr").each(function(n,row){
        var c_name = [];
        var c_room = [];

        $(row).find("input[name='c_name[]']").each(function(){
           c_name.push($(this).val());
        });
        $(row).find("input[name='c_room[]']").each(function(){
            c_room.push($(this).val());
        });

        var c_time = $(row).find(".ctime").val();

        var r = {ctime:c_time,cnames:c_name,crooms:c_room};
        rows.push(r);
    });

    console.log("rows", rows);


    //提交
    $("#btn_dl").prop("disabled",true);
    $("#btn_dl").html("正在提交...");
    $.post("getics.php",{
        enddate: enddate,
        reminder: reminder,
        rows: rows
    },function(res){
        //还原
        $("#btn_dl").html("保存导出为 .ICS 文件");
        $("#btn_dl").prop("disabled",false);
          if(res.code==200){

              $("#icslink").val(res.link);
              $("#icslink").parent().show();
              window.open(res.link,"_blank","");

          }else{
              mAlert(res.desc);
          }
    },"json");


}