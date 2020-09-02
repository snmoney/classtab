<?php

/**
 * "getics.php",{
        enddate: enddate,
        reminder: reminder,
        rows: rows
        
 * @author f77@outlook.com
 * @copyright 2020
 * 
 * 
 * 返回 link
 * 保存 成文件
 * 
 * 
 * 
 */

require(dirname(__FILE__).'/class/ical/src/autoload.php');
date_default_timezone_set('PRC');

$str_enddate = _POST("enddate",date("Y-m-d",time()+3600*24*180)); //默认取6个月
$reminder = _POST("reminder"); //暂不做正确性校验，不正确则不处理
$rows = _POST("rows");//

if(!$rows){
    endjson(500,"缺少参数rows");
}


$now = date("Y-m-d H:i:s");
$ts_tom = strtotime(date("Y-m-d",time()+3600*24));
$ts_mon = strtotime(date("Y-m-d",time()-3600*24*(((int) date("N")) - 1 ))); //取得本周的周一的 ts 


$vc = new \Eluceo\iCal\Component\Calendar('RY课程表');
//循环规则
$vr = new \Eluceo\iCal\Property\Event\RecurrenceRule();
$vr->setFreq(\Eluceo\iCal\Property\Event\RecurrenceRule::FREQ_WEEKLY)
    ->setUntil(new \DateTime($str_enddate)) //跳出循环日期
    ->setInterval(1); 


//提醒
//触发时间值 ["-PT10M","-PT30M","-PT1H","-PT2H","-P1D"]

if($reminder){
    $va = new \Eluceo\iCal\Component\Alarm();
    $va ->setAction('DISPLAY')
        ->setTrigger($reminder) 
        ->setDescription('课程提醒');
}else{
    $va = null;
}    


foreach($rows as $r){
    
    //处理时间
    $ct_parts = explode("-",$r["ctime"]);
    if(count($ct_parts)>=2){
        $ct_start = trim($ct_parts[0]);
        $ct_end = trim($ct_parts[1]);
        
        $dcount = 0;
        foreach($r["cnames"] as $cname){
            $str_date = date("Y-m-d", $ts_mon + 1 + $dcount*3600*24);
            $str_room = $r["crooms"][$dcount];
            
            if($cname){ //没有课程名称的不处理
                unset($ve);
                $ve = new \Eluceo\iCal\Component\Event();

                $ve ->setDtStart(new \DateTime($str_date." ".$ct_start))
                    ->setDtEnd(new \DateTime($str_date." ".$ct_end))
                    ->setCategories(['课程表'])
                    ->setLocation($str_room)
                    ->setRecurrenceRule($vr)                        
                    ->setSummary($cname);
                
                if($reminder)    
                    $ve ->addComponent($va);    
                
                $vc->addComponent($ve);                    
            }
                                    
            $dcount++;
        }
        
    }else{}//起止时间无法解析跳过    
}




//直接输出的方式
//header('Content-Type: text/calendar; charset=utf-8');
//header('Content-Disposition: attachment; filename="cal.ics"');
//echo $vc->render();

//保存文件的方式
$savepath = "ics/classtab".date("YmdHis").mt_rand(10000,99999).".ics";
$link = "https://gen8.orz.com.cn/beta/classtab/".$savepath;
file_put_contents($savepath,$vc->render());

endjson(200,"ok",array("link"=>$link));





//工具函数/////////////

/**
 * endjson()
 * 一个给json接口使用的标准化输出json的函数
 * 使用后会直接中止脚本的后续输出，会die($json) 
 * @param integer $code
 * @param string $desc
 * @param array $extraArray
 * @return void
 */
function endjson($code,$desc,$extraArray=null){
    unset($json);
    $json = array();
    $json["code"]=$code;
    $json["desc"]=$desc;
    if(is_array($extraArray)){
        foreach($extraArray as $k => $v){
            $json[$k] = $v;
        }
    }
    
    die(json_encode($json));   
}

function _POST($key,$def=null){
    return isset($_POST[$key])?$_POST[$key]:$def;
}
function _GET($key,$def=null){
    return isset($_GET[$key])?$_GET[$key]:$def;
}

?>