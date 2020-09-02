<?php

/**
 * @param $className
 */
function ical_autoload($className)
{
    $classPath = explode('\\', $className);
    if ($classPath[0] != 'Eluceo') {
        return;
    }
    // Drop 'Davaxi', and maximum file path depth in this project is 1
    //$classPath = array_slice($classPath, 1, 3); //艹他妈的，3写成2
    $filePath = dirname(__FILE__) . '/' . implode('/', $classPath) . '.php';
    
    //print_r("try to load:".$filePath);
    
    if (file_exists($filePath)) {
        require_once($filePath);
    }
}
spl_autoload_register('ical_autoload');