// By Raccoon
// include namespace

var Framework = (function (Framework) {
    Framework.Sprite = function (options) {
        var texture = null,
            type = null;

        if (Framework.Util.isString(options)) {
            var image = document.createElement("img");
            image.src = options;
            texture = image;
            type = "image";
        } else {
            Framework.DebugInfo.Log.error("Sprite 不支援的參數 " + options);
        }

        return {
            index: 0,
            type: type,
            position: {
                x: 0,
                y: 0
            },
            rotation: 0,
            scale: 1,
            texture: texture,
            update: function () {
            },
            draw: function (context) {
                var tmp = document.createElement("canvas");
                tmp.width = this.texture.width;
                tmp.height = this.texture.height;
                var tmpContext = tmp.getContext("2d");
                tmpContext.scale(this.scale, this.scale);
                tmpContext.rotate(this.rotation);
                tmpContext.drawImage(this.texture, 0, 0);
                context.drawImage(tmpContext.canvas, this.position.x, this.position.y);
            }
        };
    };
    return Framework;
})(Framework || {});
