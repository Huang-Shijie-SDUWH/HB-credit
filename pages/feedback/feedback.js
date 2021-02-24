
Page({
  data: {
    title: "反馈中心",
    describe: "Feedback"
  },
	jumptosiri() {
		console.log("jump")
		wx.redirectTo({
			url: '/pages/index/index'
    })
  },
  jumptodoc() {
		console.log("jump")
		wx.redirectTo({
			url: '/pages/detail/detail'
    })
  },
  quesiton() {
    wx.navigateTo({
			url: '/pages/feedback/form/form?id=1'
    })
  },
  advice() {
    wx.navigateTo({
			url: '/pages/feedback/form/form?id=2'
    })
  },
  help() {
    wx.navigateToMiniProgram({
      appId: 'wx9b8db7ebf5737e14',
    })
  }
})