Page({
  data: {
    treeData: {
      text: '海贝分简介',
      id: 0,
      childMenus: [
        {
          text: '一、海贝分是什么？',
          id: 1,
          childMenus: [
            {
              text: '1.涵义',
              id: 2,
              childMenus: [
                {
                  text: '海贝，古时曾作货币，是中国古钱币历史的开端，代表着财富和信用；',
                  id: 3,
                },
                {
                  text: '威海市为海洋渔业大市，海洋文化浓郁，体现威海市资源及文化特色；',
                  id: 4,
                },
                {
                  text: '贝类是海洋的宝贝，信用是人类的宝贝。“海贝分”凸显了信用有价。',
                  id: 5,
                },
              ]
            },
            {
              text: '2.作用',
              id: 6,
              childMenus: [
                {
                  text: '作为威海市个人信用积分，反映了一个人的信用水平。',
                  id: 7,
                },
              ]
            }
          ]
        },
        {
          text: '二、海贝分有什么好处？',
          id: 8,
          childMenus: [
            {
              text: '信用等级为AA级以上的居民，在享受区级信用管理的统一激励政策、待遇的基础上优惠有：（点击展开） ',
              id: 9,
              childMenus:[
                    {
                      text:'（一）享受社区提供的各类上门工作服务；',
                      id: 10,
                    },
                    {
                      text:'（二）享受社区商家联盟提供的折扣优惠；',
                      id: 11,
                    },
                    {
                      text:'（三）优先受邀参加社区组织的各类活动； ',
                      id: 12,
                    },
                    {
                      text:'（四）优先列入文登好人、道德模范、党代表、人大代表和政协委员推荐名单。',
                      id: 13,
                    },
              ]
            },
          ]
        },
        {
          text: '三、海贝分低有什么惩戒？',
          id: 14,
          childMenus:[
            {
              text:'信用等级为C级以下的居民，在受到区级信用管理惩戒限制的同时：（点击展开） ',
              id: 15,
              childMenus:[
                {
                  text:'（一）受限参加社区组织的各类活动； ',
                  id: 16,
                },
                {
                  text:'（二）取消社区层面的评优评奖及需经社区辅助申请的一切荣誉、资格评定和优惠政策。 ',
                  id: 17,
                }
              ]
            }
          ]
        },
        {
          text: '四、海贝分的评价标准',
          id: 18,
          childMenus:[
            {
              text:'1.千分制',
              id: 19,
              childMenus:[
                {
                  text:'默认得分为1000分',
                  id: 20,
                },
              ]
            },
                {
                  text:'2.信用等级评价 ',
                  id: 21,
                  childMenus:[
                    {
                      text:'1.分为A、B、C、D 四类信用等级（点击展开）',
                      id: 22,
                      childMenus:[
                        {
                          text:'A级为诚信级别，分值为960至1029分；',
                          id: 23,
                        },
                        {
                          text:'B级为较诚信级别，分值为850至959分或者直接判级；',
                          id: 24,
                        },
                        {
                          text:'C级为诚信警示级别，分值为600至849分或者直接判级；',
                          id: 25,
                        },
                        {
                          text:'D级为不诚信级别，分值为599分及其以下或者直接判级。',
                          id: 26,
                        },
                      ]
                    },
                    {
                      text:'2.A类信用等级按积分不同，分为A、AA、AAA三类。（点击展开）',
                      id: 27,
                      childMenus:[
                        {
                          text:'AAA级为诚信模范级别，分值为1050分及其以上；',
                          id: 28,
                        },
                        {
                          text:'AA级为诚信优秀级别，分值为1030至1049分；',
                          id: 29,
                        },
                        {
                          text:'A级为默认级别，表示该信息主体无信息记录，或有不良记录但已经修复',
                          id: 30,
                        },
                      ]
                    },
                    {
                      text:'3.D类级别按降级前的级别以DA、DB、DC予以区别，分别表示由A、B、C级直接降至D级',
                      id: 31,
                    },
                  ]
                }
        
              
            
          ]

        }
      ]
    },
  },
  //事件处理函数
  tapItem: function (e) {
    console.log('index接收到的itemid: ' + e.detail.itemid);
  },
	jumptosiri() {
		console.log("jump")
		wx.redirectTo({
			url: '/pages/index/index',
		})
  },
  jumptofb() {
		console.log("jump")
		wx.redirectTo({
			url: '/pages/feedback/feedback',
		})
	},
  onLoad: function () {

  },
})