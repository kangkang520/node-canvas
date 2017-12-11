/**
 * 这个文件是一个工具集合
 */

namespace utils {

	/**
	 * 比较buffer
	 * @param buffer 要比较的buffer
	 * @param from 开始位置
	 * @param length 比较长度
	 * @param compare 将buffer中的from~to中间的数据和此参数比较
	 */
	export function bufferSame(buffer: Buffer, from: number, compare: Array<number>): boolean {
		for (let i = 0; i < compare.length; i++) {
			//如果有一个不同则返回false
			if (buffer[i + from] != compare[i]) return false
		}
		//都相同返回true
		return true
	}

	/**
	 * 从Buffer中取出整数
	 * @param buffer 缓存
	 * @param from 开始位置
	 * @param length 读取长度
	 */
	export function bufferInt(buffer: Buffer, from: number, length: number): number {
		let result = 0;
		let d16 = 256;		//16*16
		for (let i = 0; i < length; i++) {
			result = result * d16 + buffer[from + i]
		}
		return result
	}

	/**
	 * 从Buffer中读取字符串
	 * @param buffer 缓存
	 * @param from 开始位置
	 * @param length 读取长度
	 */
	export function bufferString(buffer: Buffer, from: number, length: number): string {
		let result = ""
		for (let i = 0; i < length; i++) {
			result += String.fromCharCode(buffer[from + i])
		}
		return result
	}

}

export default utils