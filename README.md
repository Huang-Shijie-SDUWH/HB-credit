# 海贝分咨询小助手--智能客服小程序demo

## 项目综述

本项目使用Lin UI构建UI，服务端使用Django搭建凭证服务，使用阿里云oss服务管理上传的反馈建议及投诉，使用微信对话开放平台构建机器人客服逻辑，语音识别功能基于百度云EasyDL语音识别，语音合成功能调用微信同声传译插件。

## 核心亮点

| 特性           | 介绍                                                         |
| -------------- | ------------------------------------------------------------ |
| 自写UI         | 基于微信小程序原生组件与Lin UI组件搭建页面，可拓展性强       |
| 自训练语音模型 | 基于百度EasyDL平台训练威海市本地的语音识别模型，识别率高     |
| 适用范围大     | 小程序拥有当地人的语音数据训练的语音模型来达成语音输入功能与语音合成功能，与微信几乎一致的输入模式，无论是老人小孩，是否识字，都便于使用 |
| 用户体验好     | UI设计精美，易于操作，交互动画友好且动感                     |
| 数据管理方便   | 使用 阿里云oss 管理反馈建议，稳定可靠，结合python使用，可视化强 |
| 自动化作业     | 搭建了完善的由文档到微信对话平台，wxml的python项目，代码开源，任何政策文档变化利用此项目都能够极快响应。 |

## 功能体验

小程序二维码

![gh_d8781d57f431_258 (1)](C:\Users\Administrator\Downloads\gh_d8781d57f431_258 (1).jpg)



### 设计理念

**标语：简洁商务**

设计简单朴素，低调内敛，适用于所有年龄段。

1、上手轻松

输入框模拟微信底部输入框，贴近生活

2、简单易操作

不同于各类app的繁琐，小程序界面人性化，更简洁易操作

### 作品效果图

<img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210303210841670.png" alt="image-20210303210841670" style="zoom: 50%;" /><img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210303210925988.png" alt="image-20210303210925988" style="zoom:50%;" /><img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210303211031776.png" alt="image-20210303211031776" style="zoom:50%;" /><img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20210303211003309.png" alt="image-20210303211003309" style="zoom:50%;" />

### 产品介绍视频

[海贝分咨询小助手展示视频（含代码讲解）](https://www.bilibili.com/video/BV125411N7TA)

### 其它素材开源（语音数据，自动化处理项目，问卷小程序）

百度网盘链接：https://pan.baidu.com/s/1gXRUmLiMCMQqC4wPjPngdg 
提取码：xunz 

## 主创人员

**黄施捷，技术研发**

**罗宇轩，UI设计**

## 技术栈
* ❤️ UI侧 —— Lin UI，文档见 https://doc.mini.talelin.com/
* ❤️ 服务 —— Django，文档见 https://docs.djangoproject.com/zh-hans/3.1/
* ❤️ 部署 —— 基于 uWSGI 部署，文档见 https://uwsgi-docs-zh.readthedocs.io/zh_CN/latest/
* ❤️ 语音技术 —— 基于百度云EasyDL语音识别，主页见 https://ai.baidu.com/tech/smartasr
* ❤️ 内容存储 —— 基于阿里云oss，主页见 https://www.aliyun.com/product/oss/
* ❤️ 机器人技术 —— 基于 微信对话开发平台 管理机器人，文档见 https://developers.weixin.qq.com/doc/aispeech/platform/INTRODUCTION.html


## 部署方式

下载安装包后解压，使用微信开发者工具导入文件夹即可，开发权限请联系huang_shijie0001@163.com。


## RoadMap

🚀 表示已经实现的功能，👷 表示进行中的功能，⏳ 表示规划中的功能，🏹 表示技术方案设计中的功能。

| 功能                                           | 状态      | 发布版本 |
| ---------------------------------------------- | --------- | -------- |
| UI 重构、页面流程优化                          | 🚀 已实现  | V1.0     |
| 语音识别服务由服务端向百度云优化为直接向百度云 | 🚀 已实现  | V1.1     |
| 更详细的代码注释                               | 👷  进行中 | V2.0     |
| 语音合成功能                                   | 🚀 已实现  | V1.3     |
| 文档搜索功能，搜索结果关键字高亮               | 🚀 已实现  | V1.0     |
| 更像本地人说话的语音bot                        | ⏳  规划中 | V2.3     |
| 一段时间不问问题，自动推荐问题                 | 🚀 已实现  | V1.4     |
| 基于数学模型的智能文档问答                     | 🏹 设计中  | v3.0     |
| 语音客服人性化（智能表情）                     | 🏹 设计中  | V3.0     |

### 页面间调用关系

在`/`中，有以下文件（仅展示部分）

```
|-components 全局组件
|-imgs 图片存放处
|-lin-ui-demo Lin-UI组件库
|-miniprogram_npm npm组件库
|-node-modules nodejs文件
|-pages
|-|- index 客服页
|-|- detail 文档详情页
|-|-feedback
|-|- feedback 反馈中心
|-|-|- form 表单页
|-|-|- about 关于页
```

## 关于

本小程序为山东大学（威海）数据科学与人工智能实验班课程作业，由黄施捷同学与罗宇轩同学携手研发，排名顺序不分先后。
