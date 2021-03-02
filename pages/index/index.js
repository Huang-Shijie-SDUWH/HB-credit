import deviceUtil from "../../lin-ui-demo/miniprogram_npm/lin-ui/utils/device-util"
var recorderManager = wx.getRecorderManager()
var fs = wx.getFileSystemManager()
const plugin = requirePlugin('WechatSI');
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
		start_time: "", // 获取到当前录音开始时间
		record_name: "按住 说话",
		speak_time: 0, // 录制最终时间
		setInter: '', // 存储计时器
		speakingtag: false,
		num: 1,
		formFile: '',
		asrurl: 'https://mylifemeaning.cn/soket_server/get_token', //语音识别api接口地址
		signatureurl: 'https://mylifemeaning.cn/soket_server/get_signature',
		fotterBottom: 0,
		token: '',
		src: '',
		playingtag: false,
		canspeaktag: 5,
		waitting_time: 0,
		showReminder: false,
		hassendtag: false,
		ReminderArray: []
	},

	// 获取 微信对话平台凭证
	getsignature: function (e) {
		var that = this;
		wx.request({
			url: that.data.signatureurl,
			method: 'GET',
			success: function (res) {
				// console.log(res)
				const signature = res.data.signature;
				that.setData({
					signature
				})
			},
			fail: function () {
				console.log("getsignature failed!")
			}
		})
	},

	// 获取 自训练语音识别平台凭证
	gettoken: function (e) {
		var that = this;
		wx.request({
			url: that.data.asrurl,
			method: 'GET',
			success: function (res) {
				const token = res.data.access_token;
				that.setData({
					token
				})
				// console.log(res.data)
			},
			fail: function () {
				console.log("gettoken failed!")
			}
		})
	},

	// 监听 滑动事件
	scroll(e) {
		// console.log(e)
	},

	// 处理 滑动到底部 动效
	tapMove() {
		this.setData({
			toView: 'toFooter'
		});
	},

	// 跳转 到文档
	jumptodoc() {
		console.log("jump")
		this.end();
		wx.redirectTo({
			url: '/pages/detail/detail',
		})
	},

	// 跳转 到反馈中心
	jumptofb() {
		console.log("jump")
		this.end();
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

	// 手指 按下语音按钮
	touchdown: function (e) {
		var that = this;
		that.end();
		console.log('touchStart....')
		that.start(); //如果授权，开始录音
		that.data.setInter = setInterval(
			function () {
				var speak_time = that.data.speak_time + 1;
				that.setData({
					speak_time: speak_time,
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
			}, 1000); //一秒一次调用
	},

	// 手指 抬起
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
			speak_time: 0
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
			console.log('停止录音', res.tempFilePath)
			const FilePath = res.tempFilePath
			fs.readFile({ //读取文件
				filePath: res.tempFilePath,
				success: res => {
					// var data = JSON.parse(res.data);//将JSON字符串转换为JSON对象
					// console.log(res.data)
					// console.log(res.data.length)
					console.log(res.data.byteLength)
					if (res.data.byteLength < 20000) return;
					that.ASRRequest(FilePath, res.data.byteLength)
				},
				fail: console.error
			})
			// that.sendspeakingMsg(JSON.parse(res.data).result)
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
		canSend = that.data.canSend
		console.log(this.data.chatDataArray)
		if (canSend) {
			that.setData({
				hassendtag: true
			})
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
						oldChatDataArray[i].list_options = res.data.list_options;
						if(res.data.ans_node_name[0]=='b'&&res.data.ans_node_name[1]=='i'&&res.data.ans_node_name[2]=='d'){// 屏蔽原生指令
							oldChatDataArray[i].serviceMsg="小海贝没有找到您想要的答案哦。您可以通过点击左上角的文档图标查阅更多信息，也可以点击反馈图标帮助小海贝提升自己哦。"
						}
						if(res.data.list_options)//高级问题
						{
							oldChatDataArray[i].options = res.data.options;
						}
						that.setData({
							chatDataArray: oldChatDataArray
						});
						that.tapMove(); // 执行第二次滑动 定位到底部
						that.tts(serviceMsg);
					}, 100);
				},
				fail: function (e) {
					// fail  
					console.log(e)
				}
			});
		} else {
			wx.showToast({
				title: '请输入内容',
				icon: 'none',
			})
			console.log('当前还不能发送');
		}
	},

	// 发送 语音信息
	sendspeakingMsg: function (speakingMsg) {
		const that = this;
		that.setData({
			hassendtag: true
		})
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
					oldChatDataArray[i].list_options = res.data.list_options;
					if(res.data.list_options)//高级问题
					{
						oldChatDataArray[i].options = res.data.options;
					}
					if(res.data.ans_node_name[0]=='b'&&res.data.ans_node_name[1]=='i'&&res.data.ans_node_name[2]=='d'){// 屏蔽原生指令
						oldChatDataArray[i].serviceMsg="小海贝没有找到您想要的答案哦。您可以通过点击左上角的文档图标查阅更多信息，也可以点击反馈图标帮助小海贝提升自己哦。"
					}
					that.setData({
						chatDataArray: oldChatDataArray
					});
					that.tapMove(); // 执行第二次滑动 定位到底部
					that.tts(serviceMsg);
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
			const _h = res[0].height;
			// console.log(_h)
			let windowHeight = wx.getSystemInfoSync().windowHeight;
			let windowWidth = wx.getSystemInfoSync().windowWidth;
			const navigationbarheight = deviceUtil.getNavigationBarHeight();
			const viewHeight = parseInt(750 * (windowHeight - _h) / windowWidth - 37 - navigationbarheight);
			// console.log(viewHeight)
			that.setData({
				viewHeight
			});
			that.tapMove();
		});
	},

	// 页面 加载时
	onLoad: function () {
		const that = this;
		that.getBtnHeight(); // 处理 设备可显示高度
		that.getsignature();
		that.gettoken();
		that.wordchange();
	},

	// 页面 准备完毕
	onReady: function () {
		var that = this;
		this.animation = wx.createAnimation(); // 创建动画。
		this.innerAudioContext = wx.createInnerAudioContext();
		this.tts(this.data.serviceMsg)
		this.innerAudioContext.onError(function (res) {
			console.log(res);
			wx.showToast({
				title: '语音播放失败',
				icon: 'none',
			})
		})
		this.innerAudioContext.onEnded(function (res) {
			that.setData({
				playingtag: false
			})
		})
		that.data.setInter2 = setInterval(
			function () {
				var waitting_time = that.data.waitting_time + 1
				if (that.data.hassendtag == true) {
					clearInterval(that.data.setInter2);
				}
				if (waitting_time >= 20 && that.data.hassendtag == false) {
					that.setData({
						showReminder: true
					})
					clearInterval(that.data.setInter2);
				}
				that.setData({
					waitting_time
				})
			}, 1000); //一秒一次调用
	},

	// 处理 键盘弹起
	keyboardprocess: function (e) {
		var that = this;
		if (e.type == 'linfocus') {
			that.setData({
				fotterBottom: e.detail.height
			})
		} else {
			that.setData({
				fotterBottom: 0
			})
		}
		setTimeout(() => {
			that.tapMove();
		}, 10);
	},

	// 自训练模型 语音识别
	ASRRequest: function (tempFilePath, len) {
		var that = this;
		var api = "nli";
		const LM_ID = 12681;
		var voice0 = fs.readFileSync(tempFilePath, "base64");
		var rqJson = {
			'dev_pid': 80001,
			"lm_id": LM_ID,
			'format': 'pcm',
			'rate': 16000,
			'token': that.data.token,
			'cuid': 'humor',
			'channel': 1,
			'len': len,
			'speech': voice0
		};
		var rq = JSON.stringify(rqJson);
		var ASRUrl = "https://vop.baidu.com/pro_api";
		console.log("[Console log]:ASRRequest(),URL:" + ASRUrl);
		wx.request({
			url: ASRUrl,
			data: rq,
			header: {
				'content-type': 'application/json'
			},
			method: 'POST',
			success: function (res) {
				console.log("[Console log]:ASTRequest() success...");
				console.log(res)
				that.sendspeakingMsg(res.data.result[0])
			},
			fail: function (res) {
				console.log("[Console log]:ASRRequest() failed...");
				console.error("[Console log]:Error Message:" + res.errMsg);
			},
			complete: function () {
				console.log("[Console log]:ASRRequest() complete...");
			}
		})
	},

	// 前端 点击播放录音
	taptoplay: function (event) {
		this.tts(event.currentTarget.dataset.detail)
	},

	// 语音 合成
	tts: function (content) {
		var that = this;
		plugin.textToSpeech({
			lang: "zh_CN",
			tts: true,
			content: content,
			success: function (res) {
				// console.log(res);
				console.log("succ tts", res.filename);
				that.setData({
					src: res.filename,
					playingtag: true
				})
				that.begin();

			},
			fail: function (res) {
				console.log("fail tts", res)
			}
		})
	},

	// 播放 语音
	begin: function (e) {
		if (this.data.src == '') {
			console.log(暂无语音);
			return;
		}
		this.innerAudioContext.src = this.data.src //设置音频地址
		this.innerAudioContext.play(); //播放音频
	},

	// 结束 语音播放
	end: function (e) {
		this.innerAudioContext.pause(); //暂停音频
		this.setData({
			playingtag: false
		})
	},

	// 发送 推荐问题
	sendreminderMsg: function (event) {
		this.sendspeakingMsg(event.currentTarget.dataset.detail)
	},

	// 改变 推荐问题
	wordchange: function () {
		var that = this
		var BackArray = ["海贝分是什么", "海贝分高有什么优惠福利", "在哪里可以查询海贝分", "进校园", "进企业", "进农村", "进机关", "进社区", "加分细则", "扣分细则"]
		const ReminderArray = RandomNumBoth(BackArray, 3)
		// console.log(ReminderArray)
		that.setData({
			ReminderArray
		})
	}

})
// 随机取样函数
function RandomNumBoth(arr, maxNum) {
	var numArr = [];
	var arrLength = arr.length;
	for (var i = 0; i < arrLength; i++) {
		var Rand = arr.length;
		var number = Math.floor(Math.random() * arr.length);
		numArr.push(arr[number]);
		arr.splice(number, 1);
		if (arr.length <= arrLength - maxNum) {
			return numArr;
		}
	}
}