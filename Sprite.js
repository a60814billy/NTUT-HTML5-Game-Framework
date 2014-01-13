// By Raccoon
// include namespace

var Framework = (function (Framework) {
    Framework.Sprite = function (options) {
        var _texture = null,
            _type = null,
            _id,
            _url;

        if (Framework.Util.isString(options)) {
            _id = options;
            _url = options;
            Framework.ResourceManager.loadImage({id:options, url:options});
            _type = 'image';
           /* var image = document.createElement("img");
            image.src = options;
            texture = image;
            type = "image";*/
        } else if(Framework.Util.isUndefined(options)) {
            // = sense
        }else{
            Framework.DebugInfo.Log.error("Sprite 不支援的參數 " + options);
        }

        return {
            index: 0,
            type: _type,
            position: {
                x: 0,
                y: 0
            },
            rotation: 0,
            scale: 1,
            texture: _texture,
            update: function () {
            },
            draw: function (context) {
                this.texture = Framework.ResourceManager.getResource(_id);
                if(this.type == "image"){
                    var tmp = document.createElement("canvas");
                    tmp.width = this.texture.width;
                    tmp.height = this.texture.height;
                    var tmpContext = tmp.getContext("2d");
                    tmpContext.scale(this.scale, this.scale);
                    tmpContext.rotate(this.rotation);
                    tmpContext.drawImage(this.texture, 0, 0);
                    context.drawImage(tmpContext.canvas, this.position.x, this.position.y);
                }else if(this.type=="canvas"){
                    context.drawImage(this.texture, this.position.x, this.position.y);
                }
            }
        };
    };
    return Framework;
})(Framework || {});
