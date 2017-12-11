"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 这个文件用于处理png图像
 */
var image_1 = require("./image");
var utils_1 = require("./utils");
var zlib = require("zlib");
/**
 * 定义png图片类型
 */
var ColorType;
(function (ColorType) {
    ColorType[ColorType["greyscale"] = 0] = "greyscale";
    ColorType[ColorType["truecolor"] = 2] = "truecolor";
    ColorType[ColorType["indexedcolor"] = 3] = "indexedcolor";
    ColorType[ColorType["greyscale_alpha"] = 4] = "greyscale_alpha";
    ColorType[ColorType["truecolor_alpha"] = 6] = "truecolor_alpha";
})(ColorType || (ColorType = {}));
/**
 * 数据块处理类
 */
var DataBlock = (function () {
    /**
     * 构造一个数据块
     * @param buffer 文件缓冲
     * @param index 块的开始位置
     */
    function DataBlock(buffer, index) {
        //读取数据库长度
        this._size = utils_1.default.bufferInt(buffer, index, 4);
        //读取数据类型
        this._type = utils_1.default.bufferString(buffer, index + 4, 4);
        //数据缓冲
        this._buffer = buffer.slice(index + 8, index + 8 + this._size);
        //读取CRC
        this._crc = utils_1.default.bufferInt(buffer, index + 4 + 4 + this._size, 4);
        //计算总长度
        this._total = (this._type == 'IEND') ? (buffer.length - index) : (4 + 4 + this._size + 4);
    }
    Object.defineProperty(DataBlock.prototype, "total", {
        /**
         * 获取数据块的总长度
         */
        get: function () {
            return this._total;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataBlock.prototype, "type", {
        /**
         * 获取数据块类型
         */
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataBlock.prototype, "crc", {
        /**
         * 获取数据数据块的CRC
         */
        get: function () {
            return this._crc;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 从数据区域的某个位置读取整数
     * @param from 开始位置
     * @param length 读取长度
     */
    DataBlock.prototype.int = function (from, length) {
        //需要去掉开始的8个字节
        return utils_1.default.bufferInt(this._buffer, from, length);
    };
    /**
     * 从数据区域的某个位置开始读取字符串
     * @param from 开始位置
     * @param length 读取长度
     */
    DataBlock.prototype.string = function (from, length) {
        return utils_1.default.bufferString(this._buffer, from, length);
    };
    /**
     * 读取数据块某个位置的数据
     * @param index 所在位置
     */
    DataBlock.prototype.code = function (index) {
        return this._buffer[index];
    };
    Object.defineProperty(DataBlock.prototype, "size", {
        /**
         * 获取数据长度
         */
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 遍历数据缓存
     * @param callback 回调函数每次读取一个字节调用一次
     */
    DataBlock.prototype.forEach = function (callback) {
        this.buffer.forEach(callback);
    };
    /**
     * 数据缓冲的map操作，同数组的map
     * @param callback 回调函数
     */
    DataBlock.prototype.map = function (callback) {
        return this.buffer.map(callback);
    };
    Object.defineProperty(DataBlock.prototype, "buffer", {
        /**
         * 取得数据缓冲
         */
        get: function () {
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    return DataBlock;
}());
/**
 * 定义png图像的IHDR
 */
var IHDR = (function () {
    function IHDR(block) {
        this._width = block.int(0, 4);
        this._height = block.int(4, 4);
        this._bitdeep = block.code(8);
        this._color = block.code(9);
        this._compress = block.code(10);
        this._filter = block.code(11);
        this._interlace = block.code(12);
    }
    Object.defineProperty(IHDR.prototype, "size", {
        /**
         * 获取块长度
         */
        get: function () {
            return 17;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IHDR.prototype, "width", {
        /**
         * 获取图片宽度
         */
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IHDR.prototype, "height", {
        /**
         * 获取图片高度
         */
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IHDR.prototype, "bitDepth", {
        /**
         * 获取位深度
         */
        get: function () {
            return this._bitdeep;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IHDR.prototype, "colorType", {
        /**
         * 获取颜色类型
         */
        get: function () {
            return this._color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IHDR.prototype, "compress", {
        /**
         * 获取压缩方法
         */
        get: function () {
            return this._compress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IHDR.prototype, "filter", {
        /**
         * 获取滤波器方法
         */
        get: function () {
            return this._filter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IHDR.prototype, "interlace", {
        /**
         * 获取隔行扫描方法
         */
        get: function () {
            return this._interlace;
        },
        enumerable: true,
        configurable: true
    });
    return IHDR;
}());
var IDAT = (function () {
    function IDAT(block) {
        var buffer = block.buffer;
        console.log(buffer[buffer.length - 4], buffer[buffer.length - 3], buffer[buffer.length - 2], buffer[buffer.length - 1]);
        zlib.inflateSync(block.buffer);
        //e2 cc f3 4c
    }
    return IDAT;
}());
var Png = (function (_super) {
    __extends(Png, _super);
    function Png() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.idats = [];
        return _this;
    }
    Png.useable = function (content) {
        return utils_1.default.bufferSame(content, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    };
    /**
     * 从文件缓冲中构建png
     * @param content 文件缓冲
     */
    Png.fromBuffer = function (content) {
        var png = new Png();
        png.parseContent(content);
        return png;
    };
    /**
     * 转换一个png文件的内容
     * @param content 文件内容，有fs.readFile(Sync)取得
     */
    Png.prototype.parseContent = function (content) {
        var _this = this;
        //构建数据块（从8字节以后开始读取）
        var index = 8;
        var blocks = [];
        do {
            var block = new DataBlock(content, index);
            blocks.push(block);
            index += block.total;
        } while (index < content.length);
        //针对不同的数据块构建对应的数据类型
        blocks.forEach(function (block) {
            if (block.type == 'IHDR')
                _this.ihdr = new IHDR(block);
            else if (block.type == 'IDAT')
                _this.idats.push(new IDAT(block));
        });
    };
    return Png;
}(image_1.Image));
exports.Png = Png;
