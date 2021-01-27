Page({
	data: {
		avatarAuto: '/imgs/HB.jpg', // 系统头像
		avatarUser: '/imgs/user.jpg', // 用户头像
		isAnimation: true, // 是否开启动画
		viewHeight: 0, // 设置srcoll-view的高度
		canSend: false, // 是否可发送
		chatDataArray: [], // 对话内容
		useMsg: '', // 用户输入框内的信息
		toView: 'toFooter', // 定位到底部，用于处理消息容器滑动到最底部
		serviceMsg: '你好呀，朋友！这里是您的海贝分小助手，智能客服小贝将竭诚为您服务。请问关于海贝分，您想了解些什么？', // 客服对话信息
		signature: ''//微信对话平台凭证
	},
	getsignature: function(e) {
		var that = this;
		wx.request({
			data:{
				userid: 'dbhPNfrE0WE'
			},
			url: 'https://openai.weixin.qq.com/openapi/sign/xHhglGcCRPTjBpmIABAEgXqXjiBlKU',
			method: 'POST',
			success: function (res) {
				that.data.signature=res.data.signature;
			},
			fail: function () {
				// fail  
			},
			complete: function () {
				// complete  
			}
		})
	},

	// 监听 滑动事件
	scroll(e) {
		console.log(e)
	},

	// 处理 滑动到底部 动效
	tapMove() {
		this.setData({ toView: 'toFooter' });
	},

	// 监听 底部输入框
	bindInputValue: function (e) {
		const useMsg = e.detail.value;
		if (useMsg.length !== 0) {
			this.setData({ useMsg, canSend: true });
		} else {
			this.setData({ canSend: false });
		}
	},

	// 发送聊天信息 
	formSubmit: function (e) {
		const that = this, canSend = that.data.canSend;
		if (canSend) {
			let useMsg = that.data.useMsg, serviceMsg = that.data.serviceMsg, chatDataArray = that.data.chatDataArray, waitting = '正在输入...';
			let chatData = { serviceMsg: waitting, useMsg }, oldChatDataArray = chatDataArray.concat(chatData);
			that.setData({ useMsg: '', canSend: false, chatDataArray: oldChatDataArray });
			that.tapMove(); // 执行第一次滑动 定位到底部
			// 接入微信对话平台
			let params = {
				"signature" : that.data.signature,
				"query" : useMsg
			};
			// console.log(that.data.chatDataArray)
			wx.request({
				url: 'https://openai.weixin.qq.com/openapi/aibot/xHhglGcCRPTjBpmIABAEgXqXjiBlKU',
				data: params,
				method: 'POST',
				success: function (res) {
					const serviceMsg = res.data.answer;  // 得到微信接口返回的文本信息

					// 延迟1s 回复
					setTimeout(() => {
						// 修饰动画 - 正在回复中 变回原值
						const i = oldChatDataArray.length - 1;
						oldChatDataArray[i].serviceMsg = serviceMsg;
						that.setData({ chatDataArray: oldChatDataArray });
						that.tapMove(); // 执行第二次滑动 定位到底部
					}, 1000);
				},
				fail: function () {
					// fail  
				},
				complete: function () {
					// complete  
				}
			});
		} else {
			console.log('当前还不能发送');
		}

	},

	// 处理 设备可显示高度
	getBtnHeight: function () {
		const that = this, query = wx.createSelectorQuery();
		query.select('#footerBtnGroup').boundingClientRect();
		query.selectViewport().scrollOffset();
		query.exec(function (res) {
			const _h = res[0].height * 2 - 15;
			let windowHeight = wx.getSystemInfoSync().windowHeight;
			let windowWidth = wx.getSystemInfoSync().windowWidth;
			const viewHeight = parseInt(750 * windowHeight / windowWidth - _h);
			that.setData({ viewHeight });
			that.tapMove();
		});
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		const that = this;
		that.getBtnHeight();  // 处理 设备可显示高度
		that.getsignature();
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {
		this.animation = wx.createAnimation(); // 创建动画。

	},

})