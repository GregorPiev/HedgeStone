<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: text/html");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Cache-Control: no-cache");
header("Pragma: no-cache");
header("X-XSS-Protection: 0");
$redURL = "http://dev-gregori.hedgestonegroup.com/depositSpot.php?sendResult=1";
$post_string = "{'success':true,'error_message';''}";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $redURL);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_string);
$server_output = curl_exec($ch);

echo "Output:<pre>";
print_r($server_output);
echo "</pre>";

echo "Info:<pre>";
print_r(curl_getinfo($ch));
echo "</pre>";

echo "Error:<pre>";
echo curl_errno($ch) . '-' . curl_error($ch);
echo "</pre>";

//close the connection
curl_close($ch);
?>