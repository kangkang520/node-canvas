/**
 * 这个文件用于处理png图像
 */
import { Image } from './image'
import utils from './utils'
import * as zlib from 'zlib'

/**
 * 定义png图片类型
 */
enum ColorType {
	greyscale = 0,				//灰阶
	truecolor = 2,				//真彩
	indexedcolor = 3,			//索引色
	greyscale_alpha = 4,		//灰阶+alpha
	truecolor_alpha = 6,		//真彩+alpha
}

/**
 * 数据块处理类
 */
class DataBlock {
	private _size: number			//数据块长度
	private _type: string			//数据库类型
	private _crc: number			//循环冗余校验
	private _buffer: Buffer			//数据缓冲区
	private _total: number			//结束数据块长度，如果是结束数据块

	/**
	 * 构造一个数据块
	 * @param buffer 文件缓冲
	 * @param index 块的开始位置
	 */
	constructor(buffer: Buffer, index: number) {
		//读取数据库长度
		this._size = utils.bufferInt(buffer, index, 4)
		//读取数据类型
		this._type = utils.bufferString(buffer, index + 4, 4)
		//数据缓冲
		this._buffer = buffer.slice(index + 8, index + 8 + this._size)
		//读取CRC
		this._crc = utils.bufferInt(buffer, index + 4 + 4 + this._size, 4)
		//计算总长度
		this._total = (this._type == 'IEND') ? (buffer.length - index) : (4 + 4 + this._size + 4)
	}

	/**
	 * 获取数据块的总长度
	 */
	public get total(): number {
		return this._total
	}

	/**
	 * 获取数据块类型
	 */
	public get type(): string {
		return this._type
	}

	/**
	 * 获取数据数据块的CRC
	 */
	public get crc(): number {
		return this._crc
	}

	/**
	 * 从数据区域的某个位置读取整数
	 * @param from 开始位置
	 * @param length 读取长度
	 */
	public int(from: number, length: number): number {
		//需要去掉开始的8个字节
		return utils.bufferInt(this._buffer, from, length)
	}

	/**
	 * 从数据区域的某个位置开始读取字符串
	 * @param from 开始位置
	 * @param length 读取长度
	 */
	public string(from: number, length: number): string {
		return utils.bufferString(this._buffer, from, length)
	}

	/**
	 * 读取数据块某个位置的数据
	 * @param index 所在位置
	 */
	public code(index: number): number {
		return this._buffer[index]
	}

	/**
	 * 获取数据长度
	 */
	public get size(): number {
		return this._size
	}

	/**
	 * 遍历数据缓存
	 * @param callback 回调函数每次读取一个字节调用一次
	 */
	public forEach(callback: (code: number, N: number) => any) {
		this.buffer.forEach(callback)
	}

	/**
	 * 数据缓冲的map操作，同数组的map
	 * @param callback 回调函数
	 */
	public map<T>(callback: (code: number, N?: number) => T): Array<T> {
		return this.buffer.map(callback as any) as any
	}


	/**
	 * 取得数据缓冲
	 */
	public get buffer(): Buffer {
		return this._buffer
	}
}


/**
 * 定义png图像的IHDR
 */
class IHDR {
	//图片宽高
	private _width: number
	private _height: number
	//位深度
	private _bitdeep: number
	//颜色类型
	private _color: ColorType
	//压缩方法
	private _compress: number
	//过滤方法
	private _filter: number
	//隔行扫描算法
	private _interlace: number


	constructor(block: DataBlock) {
		this._width = block.int(0, 4)
		this._height = block.int(4, 4)
		this._bitdeep = block.code(8)
		this._color = block.code(9)
		this._compress = block.code(10)
		this._filter = block.code(11)
		this._interlace = block.code(12)
	}

	/**
	 * 获取块长度
	 */
	public get size(): number {
		return 17;
	}

	/**
	 * 获取图片宽度
	 */
	public get width(): number {
		return this._width
	}

	/**
	 * 获取图片高度
	 */
	public get height(): number {
		return this._height
	}

	/**
	 * 获取位深度
	 */
	public get bitDepth(): number {
		return this._bitdeep
	}

	/**
	 * 获取颜色类型
	 */
	public get colorType(): ColorType {
		return this._color
	}

	/**
	 * 获取压缩方法
	 */
	public get compress(): number {
		return this._compress
	}

	/**
	 * 获取滤波器方法
	 */
	public get filter(): number {
		return this._filter
	}

	/**
	 * 获取隔行扫描方法
	 */
	public get interlace() {
		return this._interlace
	}
}


class IDAT {
	constructor(block: DataBlock) {
		let buffer = block.buffer
		console.log(buffer[buffer.length - 4], buffer[buffer.length - 3], buffer[buffer.length - 2], buffer[buffer.length - 1])
		let result = zlib.inflateSync(block.buffer)
		console.log(result + '')
		//e2 cc f3 4c
	}
}

export class Png extends Image {

	public static useable(content: Buffer): boolean {
		return utils.bufferSame(content, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
	}

	/**
	 * 从文件缓冲中构建png
	 * @param content 文件缓冲
	 */
	public static fromBuffer(content: Buffer): Png {
		let png = new Png()
		png.parseContent(content)
		return png
	}

	//图片的IHDR
	private ihdr: IHDR

	private idats: Array<IDAT> = []

	/**
	 * 转换一个png文件的内容
	 * @param content 文件内容，有fs.readFile(Sync)取得
	 */
	private parseContent(content: Buffer) {
		//构建数据块（从8字节以后开始读取）
		let index = 8
		let blocks: Array<DataBlock> = []
		do {
			let block = new DataBlock(content, index)
			blocks.push(block)
			index += block.total
		} while (index < content.length)
		//针对不同的数据块构建对应的数据类型
		blocks.forEach(block => {
			if (block.type == 'IHDR') this.ihdr = new IHDR(block)
			else if (block.type == 'IDAT') this.idats.push(new IDAT(block))
		})
	}

}