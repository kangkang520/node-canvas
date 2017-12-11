"use strict";
/**
 * 这个文件是一个工具集合
 */
Object.defineProperty(exports, "__esModule", { value: true });
var utils;
(function (utils) {
    /**
     * 比较buffer
     * @param buffer 要比较的buffer
     * @param from 开始位置
     * @param length 比较长度
     * @param compare 将buffer中的from~to中间的数据和此参数比较
     */
    function bufferSame(buffer, from, compare) {
        for (var i = 0; i < compare.length; i++) {
            //如果有一个不同则返回false
            if (buffer[i + from] != compare[i])
                return false;
        }
        //都相同返回true
        return true;
    }
    utils.bufferSame = bufferSame;
    /**
     * 从Buffer中取出整数
     * @param buffer 缓存
     * @param from 开始位置
     * @param length 读取长度
     */
    function bufferInt(buffer, from, length) {
        var result = 0;
        var d16 = 256; //16*16
        for (var i = 0; i < length; i++) {
            result = result * d16 + buffer[from + i];
        }
        return result;
    }
    utils.bufferInt = bufferInt;
    /**
     * 从Buffer中读取字符串
     * @param buffer 缓存
     * @param from 开始位置
     * @param length 读取长度
     */
    function bufferString(buffer, from, length) {
        var result = "";
        for (var i = 0; i < length; i++) {
            result += String.fromCharCode(buffer[from + i]);
        }
        return result;
    }
    utils.bufferString = bufferString;
})(utils || (utils = {}));
exports.default = utils;
