// By Raccoon
// include namespace

var Framework = (function (Framework) {

    Framework.Level = Framework.Class({
        /**
        * 遊戲關卡的Class, 一個Game中可能有無數個Level
        * (當然Game的開始和結束頁面也可以是一個Level)
        * 每個Level都會有 
        * {{#crossLink "Level/initializeProgressResource:method"}}{{/crossLink}},
        * {{#crossLink "Level/loadingProgress:method"}}{{/crossLink}},
        * {{#crossLink "Level/initialize:method"}}{{/crossLink}},
        * {{#crossLink "Level/update:method"}}{{/crossLink}},
        * {{#crossLink "Level/draw:method"}}{{/crossLink}},
        * 五個基本的生命週期
        * @class Level
        * @constructor 
        * @example
        *     new Framework.Level();
        * 
        */
        __construct: function () {
            /**
            * 每個Level一定會有一個rootScene, 
            * 建議所有的GameObject都應該要attach到rootScene上
            * @property rootScene 
            * @type Scene
            */
            this.rootScene = new Framework.Scene();
            this.autoDelete = true;
        },
        
        /**
        * 初始化loadingProgress事件中會用到的圖片素材, 
        * 建議降低此處要載入的圖片數量, 主要Game要用的圖片可以等到initialize再載入
        * @method initializeProgressResource   
        */
        initializeProgressResource: function () {
        },

        /**
        * 在載入圖片資源時, 要被繪製的畫面, 當不設定時, 會有預設的顯示畫面
        * 若不想要有該畫面, 可以override一個空的function
        * @param {Object} context 用來繪製的工具
        * @method loadingProgress   
        */
        loadingProgress: function (context) {
            context.font = "90px Arial";
            context.fillText(Framework.ResourceManager.getFinishedRequestPercent() + "%" , context.canvas.width/2 - 50 , context.canvas.height/2);
        },

        /**
        * 初始化整個Level, 並載入所有圖片資源
        * @method initialize   
        */
        initialize: function () {
        },

        /**
        * 用來撰寫遊戲邏輯, 不會去處理繪製的工作
        * 第一行必須撰寫 this.rootScene.update();
        * @method update   
        */
        update: function () {
        },

        /**
        * 用來繪製需要被繪製的GameObject
        * 第一行必須撰寫 this.rootScene.draw(context);
        * @param {Object} context 用來繪製的工具
        * @method draw   
        */
        draw: function () {
        },

        /**
        * 處理點擊的事件, 當mousedown + mouseup 都成立時才會被觸發
        * @event click
        * @param {Object} e 事件的參數, 會用到的應該是e.x和e.y兩個參數,
        * 表示的是目前點擊的絕對位置
        */
        click: function (e) {
        },

        /**
        * 處理滑鼠點下的事件
        * @event mousedown
        * @param {Object} e 事件的參數, 會用到的應該是e.x和e.y兩個參數,
        * 表示的是目前點擊的絕對位置
        */
        mousedown: function (e) {
        },

        /**
        * 處理滑鼠放開的事件
        * @event mouseup
        * @param {Object} e 事件的參數, 會用到的應該是e.x和e.y兩個參數,
        * 表示的是目前放開的絕對位置
        */
        mouseup: function (e) {
        },

        /**
        * 處理滑鼠移動的事件(不論是否有點下, 都會觸發該事件)
        * @event mousemove
        * @param {Object} e 事件的參數, 會用到的應該是e.x和e.y兩個參數,
        * 表示的是目前滑鼠的絕對位置
        */
        mousemove: function (e) {
        },

        /**
        * 處理觸控到螢幕時的事件, 若是在一般電腦上跑, 是不會觸發此事件的
        * (除非使用debugger模擬, https://developers.google.com/chrome-developer-tools/docs/mobile-emulation?hl=zh-TW)
        * @event touchstart
        * @param {Object} e 事件的參數, 
        * 會用到的應該是e.touches[0].clientX和e.touches[0].clientY兩個參數,
        * 表示的是目前觸控到的位置
        */
        touchstart: function (e) {
        },
        touchend: function (e) {
        },

        /**
        * 處理觸控到螢幕並移動時的事件, 若是在一般電腦上跑, 是不會觸發此事件的
        * (除非使用debugger模擬, https://developers.google.com/chrome-developer-tools/docs/mobile-emulation?hl=zh-TW)
        * @event touchmove
        * @param {Object} e 事件的參數, 
        * 會用到的應該是e.touches[0].clientX和e.touches[0].clientY兩個參數,
        * 表示的是目前最新觸控到的位置
        */
        touchmove: function (e) {
        },

        /**
        * 處理鍵盤被壓下按鈕的事件
        * @event keydown
        * @param {Object} e 改寫過後的事件的參數表示按下去的最後一個鍵, 其包含有
        * altKey, ctrlKey, shiftKey表示是否按下的狀態,
        * firstTimeStamp 表示剛按下去這個按鈕的時間, 
        * key 存的是按下去的鍵的string, 
        * lastTimeDiff 則為剛按下這個鍵到目前有多久了        
        * @param {Object} list 目前按下去所有可以被偵測到的鍵
        * @param {Object} oriE W3C定義的事件的e
        * 表示的是目前最新觸控到的位置
        * @example
        *     
        *     keydown: function(e, list) {
        *         if(e.key === 'A' && e.key.lastTimeDiff > 3000) {
        *             console.log('A');     //當A按下超過3秒, 才會印出A
        *         } 
        *         if(list.A && list.B) {
        *             console.log('A+B');   //當A和B都被按下時, 才會印出A+B
        *         }
        *     }         
        *     //FYI: 每個真正的keyCode與相對應的string
        *     _keyCodeToChar = {
        *         8:'Backspace',9:'Tab',13:'Enter',
        *         16:'shiftKey',17:'ctrlKey',18:'altKey',19:'Pause/Break',
        *         20:'Caps Lock',27:'Esc',32:'Space',33:'Page Up',34:'Page Down',
        *         35:'End',36:'Home',37:'Left',38:'Up',39:'Right',40:'Down',
        *         45:'Insert',46:'Delete',48:'0',49:'1',50:'2',51:'3',52:'4',
        *         53:'5',54:'6',55:'7',56:'8',57:'9',65:'A',66:'B',67:'C',
        *         68:'D',69:'E',70:'F',71:'G',72:'H',73:'I',74:'J',75:'K',
        *         76:'L',77:'M',78:'N',79:'O',80:'P',81:'Q',82:'R',83:'S',
        *         84:'T',85:'U',86:'V',87:'W',88:'X',89:'Y',90:'Z',91:'Windows',
        *         93:'Right Click',96:'Numpad 0',97:'Numpad 1',98:'Numpad 2',
        *         99:'Numpad 3',100:'Numpad 4',101:'Numpad 5',102:'Numpad 6',
        *         103:'Numpad 7',104:'Numpad 8',105:'Numpad 9',106:'Numpad *',
        *         107:'Numpad +',109:'Numpad -',110:'Numpad .',111:'Numpad /',
        *         112:'F1',113:'F2',114:'F3',115:'F4',116:'F5',117:'F6',118:'F7',
        *         119:'F8',120:'F9',121:'F10',122:'F11',123:'F12',144:'Num Lock',
        *         145:'Scroll Lock',182:'My Computer',
        *         183:'My Calculator',186:';',187:'=',188:',',189:'-',
        *         190:'.',191:'/',192:'`',219:'[',220:'\\',221:']',222:'\''
        *     };
        *     
        */
        keydown: function (e) {
        },

        /**
        * 處理鍵盤被壓下按鈕的事件, 除了W3C定義的參數外, 
        * Framework尚支援進階的功能history
        * @event keyup
        * @param {Object} e 原生的事件參數
        * @param {Object} history 儲存最近幾秒內keyup的按鍵 
        * (可以用來處理類似小朋友齊打交, 發動攻擊技能的Scenario)
        * history可以設定多久清除一次, 請參考 
        * {{#crossLink "KeyBoardManager/setClearHistoryTime:method"}}{{/crossLink}}
        * @example
        *     keyup: function(e, history) {
        *         var right = history.length >= 3, i;
        *         if (history.length > 2) {
        *             for (i = 3; i > 0; i--) {
        *                 right = right && (history[history.length - i].key === 'Right');
        *             }
        *         }
        *         if (right) {
        *             console.log(right);   //當一秒內按了右鍵超過3次, 才會印出true
        *         }
        *     },
        */
        keyup: function (e) {
        },
        keypress: function (e) {
        },
        teardown:function(){},
        autodelete : function(){
            for(var i in this.rootScene.attachArray){
                this.rootScene.attachArray[i].teardown();
                this.rootScene.attachArray[i] = null;
                delete this.rootScene.attachArray[i];                
            }
            this.rootScene.attachArray.length = 0;
            this.teardown();
        }
    });

    return Framework;
})(Framework || {});