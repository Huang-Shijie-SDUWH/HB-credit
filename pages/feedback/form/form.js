const filesystemmanager = wx.getFileSystemManager()
var uploadfile = require('../../../utils/upload')
Page({
  data: {
    title: "表单页面",
    describe: "Form",
    formtitle:'标题：',
    formdetail:'内容：',
    form: {
      title : "",
      detail: ""
    },
    uppath: 'test/'
  },
  submit(event){
    const {detail} = event;
    console.log(detail.values)
    console.log("提交")
    const code = new Date().getTime() + Math.floor(Math.random() * 150)
    filesystemmanager.writeFileSync(`${wx.env.USER_DATA_PATH}/info.txt`,detail.values.title+'\n'+detail.values.detail, 'utf8')
    uploadfile(`${wx.env.USER_DATA_PATH}/info.txt`, this.data.uppath + code + '.txt',
      function (result) {
        console.log("======上传成功文件地址为：", result);
        //这个result就是返给上传到oss上的地址链接
        wx.lin.showToast({
          title: '提交成功',
          icon: 'success'
        })
        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/feedback/feedback'
          })
        }, 1500);
      }, function (result) {
        console.log("======上传失败======", result);
        wx.lin.showToast({
          title: '提交失败，请联系工作人员',
          icon: 'error'
        })
      }
    )
  },
  onLoad: function (options) {
    wx.lin.initValidateForm(this)
    var that = this
    if(options.id==1){
      that.setData({
        title: "使用问题",
        describe: "Question",
        formtitle: "问题：",
        formdetail: "具体内容：",
        uppath: 'question/'
      })
    }
    if(options.id==2){
      that.setData({
        title: "投诉建议",
        describe: "Advice",
        formtitle: "建议：",
        formdetail: "具体内容：",
        uppath: 'advice/'
      })
    }
  },
})