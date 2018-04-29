

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: text/html");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Cache-Control: no-cache");
header("Pragma: no-cache");
header("X-XSS-Protection: 0");

if($_GET['start']!=='' && $_GET['start']==="Game_start"){
    ?>
    <!DOCTYPE html>
    <html lang="en" style="height: 100%">
    <head>
        <meta charset="UTF-8">
        <title>Loading...</title>
    </head>
    <body style="background-color: #0a0f15; width: 100%; text-align: center; margin: 0; height: 100%">
    <div style="display: table; width: 100%; height: 100%; margin: auto">
        <div style=" display: table-cell; vertical-align: middle;">
            <img src="./assets/icons/loader3.gif" alt="loading..." style="max-width: 100%; max-height: 330px;">
        </div>
    </div>
    </body>
    </html>
<?php }else if(isset($_POST['pdata']) && $_POST['pdata']!==''){
    $form =$_POST['pdata'];
    echo htmlspecialchars_decode($form);
}
else { ?>
    <!DOCTYPE html>
    <html lang="en" style="height: 100%">
    <script type="text/javascript">
        window.onerror = function (msg, url, lineNo, columnNo, error) {
            var string = msg.toLowerCase();
            var substring = "script error";
            if (string.indexOf(substring) > -1){
                console.info('%cScript Error: See Browser Console for Detail','font-size:18px;color:darkred');
            } else {
                var message = [
                    'Message: ' + msg,
                    'URL: ' + url,
                    'Line: ' + lineNo,
                    'Column: ' + columnNo,
                    'Error object: ' + JSON.stringify(error)
                ].join(' - ');

                console.log("%c Error JS:" + message,"font-size:18px;color:purple");
            }

            return true;
        };
    </script>
    <head>
        <meta charset="UTF-8">
        <title>Loading...</title>
    </head>
    <body style="background-color: #0a0f15; width: 100%; text-align: center; margin: 0; height: 100%">
    <div style="display: table; width: 100%; height: 100%; margin: auto">
        <div style=" display: table-cell; vertical-align: middle;">
            <img src="./assets/icons/loader3.gif" alt="loading..." style="max-width: 100%; max-height: 330px;">
        </div>
    </div>
    </body>
    </html>
<?php }?>
<?php
if(isset($_POST['pdata']) && $_POST['pdata']!==''){ ?>
<?php }else if(!isset($_GET['start']) && isset($_POST)){
    $param = '';
    foreach ($_POST as $key =>$val ){
        if($param===''){
            $param = $key.'='.$val;
        }else{
            $param .= '&'.$key.'='.$val;
        }
    }
    $param = preg_replace( "/\r|\n/", "", $param );


    ?>
    <script type="text/javascript">
        window.onerror = function (msg, url, lineNo, columnNo, error) {
            var string = msg.toLowerCase();
            var substring = "script error";
            if (string.indexOf(substring) > -1){
                console.info('%cScript Error: See Browser Console for Detail','font-size:18px;color:darkred');
            } else {
                var message = [
                    'Message: ' + msg,
                    'URL: ' + url,
                    'Line: ' + lineNo,
                    'Column: ' + columnNo,
                    'Error object: ' + JSON.stringify(error)
                ].join(' - ');

                console.log("%c Error JS:" + message,"font-size:18px;color:purple");
            }

            return true;
        };
    </script>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
    <script type="text/javascript">
        var domainString = 'hedgestonegroup.com';
        document.domain = domainString;
    </script>
    <script type="text/javascript">
        console.log("%cSend Hello Stage 3:","color:brown;");
        var param = "<?php echo $param; ?>";
        var transaction_id = '<?php echo $_GET['transaction_id'];?>';

        param +=(transaction_id==='')?'':("&transaction_id="+transaction_id);
        console.log("%cArived Params:" + param,"color:brown;");
        $.ajax({
            url: 'https://api.hedgestonegroup.com/api/layer/deposit_credit_card_return',
            type:'POST',
            data: param
        })
            .done(function(data, textStatus, jqXHR){
                console.log("%cAjax done 1:" + textStatus,"color:brown;");
                console.log("%cAjax done 2:" + JSON.stringify(data),"color:brown;");
                if(typeof data.success !== 'undefined')
                    parent.wakeUp(data.success);
                else
                    parent.wakeUp(data.deposit_success);
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                console.log("%cAjax failed:" + textStatus,"color:brown;");
                console.log("%cError failed:" + errorThrown,"color:brown;");
                parent.wakeUp("faile");
            })
            .always(function(a, textStatus, b){
                console.log("%cAjax always Status:" + textStatus,"color:brown;");
                console.log("%cAjax always Data:" + JSON.stringify(a),"color:brown;");
                console.log("%cAjax always Error:" + JSON.stringify(b),"color:brown;");
                if(textStatus==='error')
                    parent.wakeUp("faile");
            });


    </script>
<?php } ?>

