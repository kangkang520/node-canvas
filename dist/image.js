"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 定义一个抽象类用于处理图片的通用属性
 */
var Image = /** @class */ (function () {
    function Image() {
        //图片像素
        this._piexls = []; //为了加快速度及方便取值设置成二维数组
    }
    /**
     * 创建一个rgb颜色，透明度为1
     * @param r 红色值
     * @param g 绿色值
     * @param b 蓝色值
     */
    Image.prototype.rgb = function (r, g, b) {
        return { r: r, g: g, b: b, a: 1 };
    };
    /**
     * 创建一个rgba颜色
     * @param r 红色值
     * @param g 绿色值
     * @param b 蓝色值
     * @param a 透明度：0~1
     */
    Image.prototype.rgba = function (r, g, b, a) {
        return { r: r, g: g, b: b, a: a };
    };
    /**
     * 返回一个透明颜色
     */
    Image.prototype.transparent = function () {
        return { r: 255, g: 255, b: 255, a: 0 };
    };
    /**
     * 获取某个像素的颜色值或给某个像素设置颜色值
     * @param x 横坐标
     * @param y 纵坐标
     * @param color 要设置的颜色
     */
    Image.prototype.color = function (x, y, color) {
        //如果有颜色则表示设置颜色
        if (color) {
            //设置像素
            this._piexls[x][y] = color;
            //返回
            return;
        }
        //返回具体像素
        return this._piexls[x][y];
    };
    /**
     * 分配颜色空间
     * @param width 宽度
     * @param height 高度
     */
    Image.prototype.alloc = function (width, height) {
        if (this._piexls.length > 0)
            return;
        for (var i = 0; i < width; i++) {
            var arr = [];
            for (var j = 0; j < height; j++) {
                arr.push(this.transparent());
            }
            this._piexls.push(arr);
        }
    };
    Object.defineProperty(Image.prototype, "size", {
        /**
         * 获取尺寸
         */
        get: function () {
            return { width: this._width, height: this._height };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 检测文件是否可用，此方法需要子类实现，也就是文件是否符合所需的格式
     * @param content 文件内容
     */
    Image.useable = function (content) {
        return false;
    };
    return Image;
}());
exports.Image = Image;
