// By Raccoon
// include namespace

var framework = (function (framework) {
    framework.Sprite = function (options) {
        console.log(typeof  options);
        var texture = null;
        var type = null;
        if ((typeof options) === "string") {
            var image = document.createElement("img");
            image.src = options;
            texture = image;
            type = "image";
        }
        if ((typeof  options) === "canvas") {
            texture = options;
            type = "canvas";
        }
        return {
            index: 0,
            type: type,
            position: {
                x: 0,
                y: 0
            },
            rotation: 0.3,
            scale: 0.1,
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
                tmpContext.drawImage(this.texture, 300, -300);

                context.drawImage(tmpContext.canvas, this.position.x, this.position.y);
            }
        };
    };
    return framework;
})(framework || {});
