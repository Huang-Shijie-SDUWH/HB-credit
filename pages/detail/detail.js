var local_doc=require("./doc.js")
Page({
  data: {
    searchingtag: false,
    items: {},
    searchkeyword: ''
  },
  //事件处理函数
  // tapItem: function (e) {
  //   console.log('index接收到的itemid: ' + e.detail.itemid);
  // },
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
    var doc = local_doc.doc
    var items = Array()
    var front = ''
    for(var i =0;i<doc.tabs.length;i++){
      var tab = doc.tabs[i]
      var tabfront = front + tab.name
      for(var j = 0 ; j < tab.cards.length;j++){
        var card = tab.cards[j]
        var cardfront = tabfront + "-" + card.name
        for(var o = 0 ; o < card.items.length;o++){
          var item = card.items[o]
          var itemfront = cardfront + "-" + item.name
          items[items.length] = {
            title: itemfront,
            detail: item.detail,
            show: false
          }
        }
      }
    }
    this.setData({
      items
    })
    // console.log(this.data.items)
  },
  
  searchchange: function (e) {
    var that = this;
    var items = this.data.items;
    // console.log(e.detail)
    if(e.detail.cursor==0){
      that.setData({
        searchingtag: false
      })
    }
    else{
      that.setData({
        searchingtag: true,
        searchkeyword: e.detail.value
      })
    }
    var keyword = e.detail.value
    for(var i = 0;i < items.length;i++)
    {
      items[i].show = false
      console.log(KMP(items[i].title,keyword)!=false||KMP(items[i].detail,keyword)!=false)
      if(KMP(items[i].title,keyword)!=false||KMP(items[i].detail,keyword)!=false)
      {
        items[i].show = true
      }
    }
    this.setData({
      items
    })
  },
  searchcancel: function(e){
    console.log("cancel")
    this.setData({
      searchingtag: false,
      searchkeyword: ''
    })
  }
})
function kmpGetStrPartMatchValue(str) {
  var prefix = [];
  var suffix = [];
  var partMatch = [];
  for(var i=0;i<str.length;i++){
      var newStr = str.substring(0,i+1);
      if(newStr.length == 1){
          partMatch[i] = 0;
      } else {
          for(var k=0;k<i;k++){
              prefix[k] = newStr.slice(0,k+1);
              suffix[k] = newStr.slice(-k-1);
              if(prefix[k] == suffix[k]){
                  partMatch[i] = prefix[k].length;
              }
          }
          if(!partMatch[i]){
              partMatch[i] = 0;
          }
      }
  }
  prefix.length = 0;
  suffix.length = 0;
  return partMatch;
}
function KMP(sourceStr,targetStr){
  var partMatchValue = kmpGetStrPartMatchValue(targetStr);
  var result = false;
  for(var i=0;i<sourceStr.length;i++){
      for(var m=0;m<targetStr.length;m++){
          if(targetStr.charAt(m) == sourceStr.charAt(i)){
              if(m == targetStr.length-1){
                  result = i-m;
                  break;
              } else {
                  i++;
              }
          } else {
              if(m>0 && partMatchValue[m-1] > 0){
                  m = partMatchValue[m-1]-1;
              } else {
                  break;
              }
          }
      }
      if(result){
          break;
      }
  }
  return result;
}