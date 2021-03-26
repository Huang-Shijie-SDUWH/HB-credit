var fileHost = "https://hb-credit.oss-cn-qingdao.aliyuncs.com/";//你的oss地址
var config = {
  //aliyun OSS config
  uploadImageUrl: `${fileHost}`,
  AccessKeySecret: '',//登录oss控制台查看
  OSSAccessKeyId: '',//登录oss控制台查看
  timeout: 87600
};
module.exports = config