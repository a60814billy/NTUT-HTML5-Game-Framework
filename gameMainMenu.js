/**
 * Created by Raccoon on 2014/1/24.
 */

var Framework = (function (Framework) {

    Framework.GameMainMenu = Framework.Class(Framework.Level , {
        __construct : function(){
            this.autoDelete = false;
        }
    });

    return Framework;
})(Framework || {});
