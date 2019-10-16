class Sku extends React.Component {
	state = {
		skuResult: SkuUtil.initSku(data.skuList),
		selectList: [],		// 是否选中数组
	}

	componentDidMount() {
		console.log(this.state.skuResult);
	}

	/**
	 * 处理规格选择
	 * 
	 * @param {*}} name 
	 * @param {*} index 
	 * @param {*} disabled 
	 */
	handleSpec(name, index, disabled) {
		if (disabled) return;
		const { selectList, skuResult } = this.state;

		// 选中及反选
		if (selectList[index] === name) {
			selectList[index] = '';
		} else {
			selectList[index] = name;
		}

		if (selectList.length) {
			// 用已选中的节点验证待测试节点 underTestObjs
			this.setState({ selectList });
		} else {
			this.setState({ selectInfo: {} });
		}
	}

	/**
	 * 处理是否可选
	 * 
	 * @param {*}} name 
	 * @param {*} index 
	 */
	handleDisabled(name, index) {
		const { selectList, skuResult } = this.state;
		if (!skuResult[name]) return true;

		const newSelectList = selectList.map(item => item);
		if (newSelectList[index] !== name) {
			newSelectList[index] = name;
			return !skuResult[newSelectList.filter(item => item).join(';')];
		}
	}

	render() {
		const { skuSpec } = data;
		const { skuResult, selectList } = this.state;

		const selectSpec = selectList.filter(item => item).join(';');
		const selectInfo = skuResult[selectSpec] || {};

		return (
			<div className="spec-list">
				{
					skuSpec.map((spec, index) => (
						<div className="row-center">
							<p>{spec.specName}:</p>
							<ul className="row-center" style={{ flex: 1, marginLeft: 16 }}>
								{
									spec.goodsSpecVals.map((item, subIndex) => {
										const disabled = this.handleDisabled(item.name, index)
										return (
											<li
												className={
													[
														'spec-item',
														disabled ? 'disabled' : '',
														selectList.indexOf(item.name) !== -1 ? 'active' : ''

													].join(' ')
												}
												onClick={(e) => this.handleSpec(item.name, index, disabled)}
											>
												{item.name}
											</li>
										)
									})
								}
							</ul>
						</div>
					))
				}

				<p>选择的规格: {selectSpec || '--'}</p>
				<p>价格: {selectInfo.price || '--'}</p>
			</div >
		)
	}
}

ReactDOM.render(
	<Sku />,
	document.getElementById('root')
);