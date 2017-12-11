
/**
 * 定义颜色类型
 */
type color = { a: number, r: number, g: number, b: number }

/**
 * 定义尺寸类型
 */
type size = { width: number, height: number }


/**
 * 定义一个抽象类用于处理图片的通用属性
 */
export abstract class Image {

	//图片宽高
	private _width: number
	private _height: number
	//图片像素
	private _piexls: Array<Array<color>> = []		//为了加快速度及方便取值设置成二维数组

	/**
	 * 创建一个rgb颜色，透明度为1
	 * @param r 红色值
	 * @param g 绿色值
	 * @param b 蓝色值
	 */
	protected rgb(r: number, g: number, b: number): color {
		return { r, g, b, a: 1 }
	}


	/**
	 * 创建一个rgba颜色
	 * @param r 红色值
	 * @param g 绿色值
	 * @param b 蓝色值
	 * @param a 透明度：0~1
	 */
	protected rgba(r: number, g: number, b: number, a: number): color {
		return { r, g, b, a }
	}

	/**
	 * 返回一个透明颜色
	 */
	protected transparent(): color {
		return { r: 255, g: 255, b: 255, a: 0 }
	}

	/**
	 * 获取某个像素的颜色值或给某个像素设置颜色值
	 * @param x 横坐标
	 * @param y 纵坐标
	 * @param color 要设置的颜色
	 */
	public color(x: number, y: number, color?: color): color | undefined {
		//如果有颜色则表示设置颜色
		if (color) {
			//设置像素
			this._piexls[x][y] = color
			//返回
			return;
		}
		//返回具体像素
		return this._piexls[x][y]
	}


	/**
	 * 分配颜色空间
	 * @param width 宽度
	 * @param height 高度
	 */
	public alloc(width: number, height: number) {
		if (this._piexls.length > 0) return
		for (let i = 0; i < width; i++) {
			let arr: Array<color> = []
			for (let j = 0; j < height; j++) {
				arr.push(this.transparent())
			}
			this._piexls.push(arr)
		}
	}


	/**
	 * 获取尺寸
	 */
	public get size(): size {
		return { width: this._width, height: this._height }
	}

	/**
	 * 检测文件是否可用，此方法需要子类实现，也就是文件是否符合所需的格式
	 * @param content 文件内容
	 */
	public static useable(content: Buffer): boolean {
		return false
	}
}