import deviceUtil from "../../lin-ui-demo/miniprogram_npm/lin-ui/utils/device-util"
var recorderManager = wx.getRecorderManager()
Page({
	data: {
		avatarAuto: '/imgs/1.png', // 系统头像
		avatarUser: '/imgs/user.jpg', // 用户头像
		isAnimation: true, // 是否开启动画
		viewHeight: 0, // 设置srcoll-view的高度
		canSend: false, // 是否可发送
		chatDataArray: [], // 对话内容
		userMsg: '', // 用户输入框内的信息
		toView: 'toFooter', // 定位到底部，用于处理消息容器滑动到最底部
		serviceMsg: '你好呀，朋友！这里是您的海贝分小助手，智能客服小贝将竭诚为您服务。请问关于海贝分，您想了解些什么？', // 客服对话信息
		signature: '', //微信对话平台凭证
		speak: true,
		speak_time: 10,
		capsuleBarHeight: deviceUtil.getNavigationBarHeight(),
		speak_time: 0,
		// 获取到当前录音开始时间
		start_time: "",
		record_name: "按住 说话",
		// 录制最终时间
		speak_time: 0,
		//存储计时器
		setInter: '',
		speakingtag: false,
		num: 1,
		formFile: '',
		asrurl: 'http://mylifemeaning.cn:8888/asr',//语音识别api接口地址
		signatureurl: 'http://mylifemeaning.cn:8888/signature',
		fotterBottom:0
	},
	getsignature: function(e) {
		var that = this;
		wx.request({
			url:  that.data.signatureurl,
			method: 'POST',
			success: function (res) {
				that.data.signature = res.data.signature;
			},
			fail: function () {
				console.log("getsignature failed!")
			}
		})
	},

	// 监听 滑动事件
	scroll(e) {
		console.log(e)
	},

	// 处理 滑动到底部 动效
	tapMove() {
		this.setData({
			toView: 'toFooter'
		});
	},

	// 跳转到文档
	jumptodoc() {
		console.log("jump")
		wx.redirectTo({
			url: '/pages/detail/detail',
		})
	},

	//跳转到反馈中心
  jumptofb() {
		console.log("jump")
		wx.redirectTo({
			url: '/pages/feedback/feedback',
		})
	},

	// 改变 打字/语音 状态
	changespeaktag() {
		this.setData({
			speak: !this.data.speak
		})
	},

	// 手指按下
	touchdown: function (e) {
		var that = this;
		console.log('touchStart....')
		wx.getSetting({
			success(res) {
				if (res.authSetting['scope.record']) { //检查是否授权录音
					that.start(); //如果授权，开始录音
					that.data.setInter = setInterval(
						function () {
							var speak_time = that.data.speak_time + 1;
							that.setData({
								speak_time: parseInt(speak_time),
								record_name: "松开 发送",
								speakingtag: true
							});
							console.log(speak_time)

							if (that.data.speak_time >= 0 && that.data.speak_time <= 59) {
								// that.start();
							} else {
								clearInterval(that.data.setInter);
								// 获取到结束时间
								that.stop();
								that.setData({
									speakingtag: false
								})
								wx.showToast({
									title: '录音最长60S哦！',
									duration: 2000,
									icon: "none"
								})
							}
						}, 1000);//一秒一次调用
				} else {
					return;
				}
			}
		})
	},

	// 手指抬起  
	touchup: function () {
		var that = this;
		console.log("手指抬起了...", that.data.speak_time)
		//清除计时器  即清除setInter
		clearInterval(that.data.setInter);
		that.stop();
		if (that.data.speak_time > 1) {
			console.log(that.data.formFile)

		} else {
			wx.showToast({
				title: '请重新录制',
				duration: 2000,
				icon: "none"
			})
		}
		that.setData({
			speakingtag: false,
			record_name: "按住 说话",
			speak_time: "0"
		})

	},

	// 语音 录制开始
	start: function () {
		const options = {
			sampleRate: 16000, //采样率
			numberOfChannels: 1, //录音通道数
			format: 'pcm', //音频格式
			frameSize: 16, //指定帧大小，单位 KB
		}
		//开始录音
		this.setData({
			speak_time:0
		})
		recorderManager.start(options);
		recorderManager.onStart(() => {
			console.log('recorder start')
		});
		//错误回调
		recorderManager.onError((res) => {
			console.log(res);
		})
	},

	// 语音 录制结束
	stop: function () {
		var that = this;
		recorderManager.stop();
		recorderManager.onStop((res) => {
			wx.uploadFile({
        url: that.data.asrurl,
        filePath: res.tempFilePath,
        name: 'file',
        success:function(res){
						// console.log(res)
            // console.log(JSON.parse(res.data).result)
						that.sendspeakingMsg(JSON.parse(res.data).result)
        },
        fail:function(err){
            console.log(err)
        }
    })
			console.log('停止录音', res.tempFilePath)
		})
	},

	// 监听 底部输入框
	bindInputValue: function (e) {
		const userMsg = e.detail.value;
		if (userMsg.length !== 0) {
			this.setData({
				userMsg,
				canSend: true
			});
		} else {
			this.setData({
				canSend: false
			});
		}
	},

	// 发送 聊天信息 
	sendMsg: function (e) {
		const that = this,
			canSend = that.data.canSend;
		if (canSend) {
			let userMsg = that.data.userMsg,
				chatDataArray = that.data.chatDataArray,
				waitting = '正在处理...';
			let chatData = {
					serviceMsg: waitting,
					userMsg
				},
				oldChatDataArray = chatDataArray.concat(chatData);
			that.setData({
				userMsg: '',
				canSend: false,
				chatDataArray: oldChatDataArray
			});
			that.tapMove(); // 执行一次滑动 定位到底部
			// 接入微信对话平台
			let params = {
				"signature": that.data.signature,
				"query": userMsg
			};
			wx.request({
				url: 'https://openai.weixin.qq.com/openapi/aibot/xHhglGcCRPTjBpmIABAEgXqXjiBlKU',
				data: params,
				method: 'POST',
				success: function (res) {
					const serviceMsg = res.data.answer; // 得到微信接口返回的文本信息
					console.log(res.data)
					// 延迟0.1s 回复
					setTimeout(() => {
						// 修饰动画 - 正在回复中 变回原值
						const i = oldChatDataArray.length - 1;
						oldChatDataArray[i].serviceMsg = serviceMsg;
						that.setData({
							chatDataArray: oldChatDataArray
						});
						that.tapMove(); // 执行第二次滑动 定位到底部
					}, 100);
				},
				fail: function (e) {
					// fail  
					console.log(e)
				}
			});
		} else {
			console.log('当前还不能发送');
		}
	},

	// 发送 语音信息
	sendspeakingMsg: function (speakingMsg) {
		const that = this;
		let userMsg = speakingMsg,
			chatDataArray = that.data.chatDataArray,
			waitting = '正在处理...';
		let chatData = {
				serviceMsg: waitting,
				userMsg
			},
			oldChatDataArray = chatDataArray.concat(chatData);
		that.setData({
			chatDataArray: oldChatDataArray
		});
		// 接入微信对话平台
		let params = {
			"signature": that.data.signature,
			"query": userMsg
		};
		wx.request({
			url: 'https://openai.weixin.qq.com/openapi/aibot/xHhglGcCRPTjBpmIABAEgXqXjiBlKU',
			data: params,
			method: 'POST',
			success: function (res) {
				const serviceMsg = res.data.answer; // 得到微信接口返回的文本信息

				// 延迟0.1s 回复
				setTimeout(() => {
					// 修饰动画 - 正在回复中 变回原值
					const i = oldChatDataArray.length - 1;
					oldChatDataArray[i].serviceMsg = serviceMsg;
					that.setData({
						chatDataArray: oldChatDataArray
					});
					that.tapMove(); // 执行第二次滑动 定位到底部
				}, 100);
			},
			fail: function (e) {
				// fail  
				console.log(e)
			}
		});
	},

	// 处理 设备可显示高度
	getBtnHeight: function () {
		const that = this,
			query = wx.createSelectorQuery();
		query.select('#footerBtnGroup').boundingClientRect();
		query.selectViewport().scrollOffset();
		query.exec(function (res) {
			const _h = res[0].height * 2 - 15;
			console.log(_h)
			let windowHeight = wx.getSystemInfoSync().windowHeight;
			let windowWidth = wx.getSystemInfoSync().windowWidth;
			const viewHeight = parseInt(750 * (windowHeight - _h) / windowWidth);
			// console.log(viewHeight)
			that.setData({
				viewHeight
			});
			that.tapMove();
		});
	},

	//加载时
	onLoad: function (options) {
		const that = this;
		that.getBtnHeight(); // 处理 设备可显示高度
		that.getsignature();
	},

	//准备完毕
	onReady: function () {
		this.animation = wx.createAnimation(); // 创建动画。
	},

	//处理键盘弹起
	keyboardprocess: function(e){
		var that=this;
		if(e.type=='linfocus'){
			that.setData({
				fotterBottom:e.detail.height
			})
		}
		else{
			that.setData({
				fotterBottom: 0
			})
		}
		setTimeout(() => {
			that.tapMove();
		}, 10);
	}
})