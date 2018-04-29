<?php
if (isset($_GET['logout'])) {
    loggedOut();
    exit;
}

function loggedOut() {
    echo '
        <html>
            <head>

                <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
                <title>Platform Test</title>
                <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.js"></script>
                <script type="text/javascript" src="//spotplatform.hedgestonegroup.com/SpotOptionPlugin.js?ver=3.6.1"></script>

                <script type="text/javascript">
                    SO.load({
                        lang: "en",
                        cookieOptions: {
                            domain: ".hedgestonegroup.com"
                        },
                        packages: {
                            RegularPlatform: {
                                settings: {
                                    selector: "#so_container"
                                }
                            },
                            Clock: {},
                            Balance: {}
                        },
                        googleFonts: {
                            families: ["Roboto+Condensed:400,300,700:latin,latin-ext,cyrillic"]
                        }
                    });
                    $(document).bind("spotoptionPlugin.ready", function() {
                        if (SO.model.Customer.isLoggedIn()) {
                            SO.model.Customer.logout();
                        }
                    });
                </script>
            </head>
            <body>
                <div id="so_container"></div>
            </body>
        </html>';
}

$siteURL = "https://hedgestonegroup.com/about";
$sitePlatform = "http://spotplatform.hedgestonegroup.com";
$cookieDomain = ".hedgestonegroup.com";

if (isset($_POST['email']) && isset($_POST['password'])) {
    define('LOGINTYPE', 'byCredentials');
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $password = $_POST['password'];
    if ($email == false) {
        header('Location: ' . $siteURL);
    }
} else if (isset($_GET['token'])) {
    define('LOGINTYPE', 'byToken');
    $token = $_GET['token'];
} else
    header('Location: ' . $siteURL);

$lang = (isset($_REQUEST['lang']) && $_REQUEST['lang'] !== "") ? $_REQUEST['lang'] : 'en';
?>

<html>
    <head>

        <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
        <title>Platform Test</title>
        <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.js"></script>
        <script type="text/javascript" src="//spotplatform.hedgestonegroup.com/SpotOptionPlugin.js?ver=3.6.1"></script>

        <script type="text/javascript">
            function decorateLog() {
                var platformConsoleTypeLog = 5;
                var plarformConsoleTypeError = 6;
                var originalFuncLog = console.log;
                var originalFuncError = console.error;
                console.log = function () {
                    var message = [].concat([].slice.call(arguments));
                    var server = 'https://api.hedgestonegroup.com'; // Delete it.
//                    $.post(server + '/api/layer/getConsoleLogToDB', {message: JSON.stringify(message), "console_type": platformConsoleTypeLog, origin: 1, "user_data": new Date()})
//                            .success(function (response) {
//                                originalFuncLog.apply(console, ['Platform log id: ' + response.id]);
//                            }).fail(function (response) {
//                        originalFuncLog.apply(console, message);
//                    });
                };

                console.error = function () {
                    var message = [].concat([].slice.call(arguments));
                    var server = 'https://api.hedgestonegroup.com'; // Delete it.
//                    $.post(server + '/api/layer/getConsoleLogToDB', {message: JSON.stringify(message), "console_type": this.plarformConsoleTypeError, origin: 1, "user_data": new Date()})
//                            .success(function (response) {
//                                originalFuncError.apply(console, ['Platform error id: ' + response.id]);
//                            }).fail(function (response) {
//                        originalFuncError.apply(console, message);
//                    });
                };
            }

            var QueryString = function () {
                // This function is anonymous, is executed immediately and
                // the return value is assigned to QueryString!
                var query_string = {};
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    // If first entry with this name
                    if (typeof query_string[pair[0]] === "undefined") {
                        query_string[pair[0]] = decodeURIComponent(pair[1]);
                        // If second entry with this name
                    } else if (typeof query_string[pair[0]] === "string") {
                        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                        query_string[pair[0]] = arr;
                        // If third or later entry with this name
                    } else {
                        query_string[pair[0]].push(decodeURIComponent(pair[1]));
                    }
                }
                return query_string;
            }();
            if (window.location.origin === 'https://hedgestonegroup.com' || window.location.origin === 'https://www.hedgestonegroup.com' && Boolean(QueryString.debug) !== true)
                decorateLog();

            SO.load({
                lang: 'en',
                cookieOptions: {
                    domain: '<?php echo $cookieDomain; ?>'
                },
                packages: {
                    RegularPlatform: {
                        settings: {
                            selector: "#so_container"
                        }
                    },
                    Clock: {},
                    Balance: {}
                },
                googleFonts: {
                    families: ['Roboto+Condensed:400,300,700:latin,latin-ext,cyrillic']
                }
            });
        </script>
    </head>
    <style>
        .loader {
            width: 150px;
            height: 150px;
            line-height: 150px;
            margin: 15px auto;
            position: relative;
            box-sizing: border-box;
            text-align: center;
            z-index: 0;
            text-transform: uppercase;
        }

        .loader:before,
        .loader:after {
            opacity: 0;
            box-sizing: border-box;
            content: "\0001";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 100px;
            border: 5px solid #050505;
            box-shadow: 0 0 50px #050505, inset 0 0 50px #050505;
        }

        .loader:after {
            z-index: 1;
            -webkit-animation: gogoloader 3s infinite 1s;
        }

        .loader:before {
            z-index: 2;
            -webkit-animation: gogoloader 3s infinite;
        }

        @-webkit-keyframes gogoloader {
            0% {
                -webkit-transform: scale(0);
                opacity: 0;
            }
            50% {
                opacity: 1;
            }
            100% {
                -webkit-transform: scale(1);
                opacity: 0;
            }
        }

        #so_container {
            background-color: transparent !important;
        }

    </style>
    <body>
        <script type="text/javascript">

            $(document).bind('spotoptionPlugin.ready', function () {
                if (!SO.model.Customer.isLoggedIn()) {
                    logMeIn();
                    setTimeout(function () {
                        initPopup();
                    }, 0);
                } else {
                    firefoxRefresh();
                    var obj = {
                        loggedIn: true,
                        balance: $('#userBalance').text()
                    };
                    var objStr = JSON.stringify(obj);
                    parent.postMessage(objStr, '*');
                    $('#userBalance').bind('DOMNodeInserted', function (event) {
                        setTimeout(function () {
                            obj.balance = $('#userBalance').text();
                            objStr = JSON.stringify(obj);
                            parent.postMessage(objStr, '*');
                            console.log($('#userBalance').text())
                        }, 10);
                    });
                }
                setTimeout(function () {
                    initPopup();
                }, 0);
            });


            function logMeIn() {
                SO.model.Customer.loginByAuth({
                    auth: '<?php echo $token; ?>',
                    onSuccess: function () {
                        console.log('Success!');

                        firefoxRefresh();

                        var obj = {
                            loggedIn: true,
                            balance: $('#userBalance').text()
                        };
                        var objStr = JSON.stringify(obj);
                        parent.postMessage(objStr, '*');
                        $('#userBalance').bind('DOMNodeInserted', function (event) {
                            setTimeout(function () {
                                obj.balance = $('#userBalance').text();
                                objStr = JSON.stringify(obj);
                                parent.postMessage(objStr, '*');
                                console.log($('#userBalance').text())
                            }, 10);
                        });
                    },
                    onFail: function () {
                        console.log('Fail!');
                        console.log('document.cookie Platform.php 2', document.cookie);
                        parent.location.href = "https://hedgestonegroup.com/logout?login";
                    },
                    onError: function () {
                        console.log('Error!');
                        parent.location.href = "https://hedgestonegroup.com/about";
                    }
                });

            }

            function isIE(userAgent) {
                userAgent = userAgent || navigator.userAgent;
                return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("Edge/") > -1;
            }

            function firefoxRefresh() {
                if (typeof (Storage) !== "undefined" && navigator.userAgent.toLowerCase().indexOf('firefox') > -1 || typeof (Storage) !== "undefined" && isIE()) {
                    var timeStamp = Date.now();

                    if (typeof localStorage.timeStamp === 'undefined') {
                        console.log('timeStamp', timeStamp);
                        localStorage.setItem('timeStamp', timeStamp);
                        window.location.reload();
                    } else {
                        if (((timeStamp - localStorage.timeStamp) / 1000) >= 10) {
                            localStorage.removeItem('timeStamp');
                            window.location.reload();
                        }
                        localStorage.removeItem('timeStamp');
                    }
                }
            }

            function popup() {
                var noTrade = <?php echo $_GET['noTrade']; ?>;
                var tradeRisk = <?php echo $_GET['tradeRisk']; ?>;
                var obj = {}
                if (tradeRisk === 0)
                    obj.popupTerms = true;
                if (noTrade === 0)
                    obj.popupRegulation = true;
                parent.postMessage(JSON.stringify(obj), '*');
                console.log('obj', obj);
            }

            function tradeClicks() {
                $('.tradingZones > div:visible > :not(.hidden):not(#tradeBoxTemplate_forex)').find('.callButton, .putButton').click(popup);
            }

            function clearClickEvents() {
                var block = 0;
                var open = 1;
                var partialBlock = 2
                var noTrade = <?php echo $_GET['noTrade']; ?>;
                var tradeRisk = <?php echo $_GET['tradeRisk']; ?>;
                if (noTrade === 0 || tradeRisk === 0) {
                    var id = 1;
                    clickHandlers = [];
                    $positionButtons = $('.tradingZones > div:visible > :not(.hidden):not(#tradeBoxTemplate_forex)').find('.callButton:not(.invisible), .putButton:not(.invisible)');
                    $positionButtons.each(function () {
                        $(this).attr('data-position', id);
                        clickHandlers[$(this).attr('data-position')] = $._data(this, 'events').click[0].handler;
                        id++;
                    }).off('click').click(function (e) {
                        var clickFunction = clickHandlers[$(this).attr('data-position')];
                    });
                }
            }

            function initPopup() {
                clearClickEvents();
                tradeClicks();
                $('#zonesNav td, div[id^=assetTypeFilters] > a').click(function () {
                    //            clearClickEvents();
                    //            tradeClicks();
                    initPopup();
                });
            }

            var eventsList = SO.getSettings().events;
            //    $(document).bind(eventsList.sessionExpired, function () {
            //        parent.location.href = "https://hedgestonegroup.com/logout?login";
            //    });
        </script>
        <div id="so_container"></div>
        <span id="userBalance" style="visibility: hidden;"></span>
    </body>
</html>