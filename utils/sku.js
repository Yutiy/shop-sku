class SkuUtil {
	static skuResult = {};

	/**
	 * 初始化sku
	 * 
	 * @param {*} data 
	 */
	static initSku(data) {
		const skuKeys = Object.keys(data);

		skuKeys.forEach(skuKey => {
			const sku = data[skuKey];
			const skuKeyAttrs = skuKey.split(";");

			const combArr = this.combInArray(skuKeyAttrs);
			combArr.forEach(item => {
				this.add2SkuResult(item, sku);
			})

			// 将原始库存组合也加到结果集里面
			this.skuResult[skuKey] = sku;
		})

		return this.skuResult;
	}

	/**
	 * 获取所有的组合放到ArrayList里面
	 * 
	 * @param {*} skuKeyAttrs 单个被 ; 分割的数组
	 * @return Array
	 */
	static combInArray(skuKeyAttrs) {
		if (!skuKeyAttrs || skuKeyAttrs.length <= 0) return [];

		const len = skuKeyAttrs.length;
		const result = [];

		for (let n = 1; n < len; n++) {
			const flags = this.getCombFlags(len, n);

			flags.forEach(flag => {
				let comb = [];
				flag.forEach((item, index) => {
					if (item === 1) {
						comb.push(skuKeyAttrs[index])
					}
				})
				result.push(comb);
			})
		}

		return result;
	}

	/**
   * 算法拆分组合 用1和0 的移位去做控制
   *
   * @param len
   * @param n
   * @return Array
   */
	static getCombFlags(len, n) {
		if (n <= 0) return [];

		let result = [];
		let hasNext = true;
		let flag = [];
		let leftCnt = 0;

		// 初始化
		for (let i = 0; i < len; i++) {
			flag[i] = i < n ? 1 : 0;
		}

		result.push(flag.slice());
		while (hasNext) {
			leftCnt = 0;
			for (let i = 0; i < len - 1; i++) {
				if (flag[i] === 1 && flag[i + 1] === 0) {
					for (let j = 0; j < i; j++) {
						flag[j] = j < leftCnt ? 1 : 0;
					}

					flag[i] = 0;
					flag[i + 1] = 1;

					result.push(flag.slice());
					if (flag.slice(-n).join('').indexOf('0') === -1) {
						hasNext = false;
					}
					break;
				}
				if (flag[i] === 1) {
					leftCnt++;
				}
			}
		}

		return result;
	}

	/**
	 * 添加到数据集合
	 * 
	 * @param {*} combArrItem 
	 * @param {*} sku 
	 */
	static add2SkuResult(combArrItem, sku) {
		const key = combArrItem.join(';');
		if (this.skuResult[key]) {
			this.skuResult[key] = {
				...sku,
				stock: this.skuResult[key].stock + sku.stock,
			}
		} else {
			this.skuResult[key] = { ...sku };
		}
	}
}