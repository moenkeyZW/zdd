// pages/analysis/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    userInfo: '',
    stype:'',
    analysisData: {
      body: {
        bmi: 19.2, //BMI=体重（kg）÷身高^2（m） 
        bmiLevel: 3, // 0对应<19，1对应19-24，2对应24-29，3对应>29,
        bf: 20.2, //体脂
        bfLevel: 2,
        bmr: 962, // 基础代谢率,
        dreamWeight: 50.2,
        suggestion: '降低热量的摄取,少吃脂肪类食物,减少食物的摄入量。',
        title:'',
        color:'',
        tz:'',
        yuan:'',
      },
      eat: {
        calorie: 1000,
        calOne: 1000,
        calTwo: 1000,
        eatSuggestion: '降低热量的摄取,少吃脂肪类食物,减少食物的摄入量',
      },
      sport: {
        countOne: 110,
        countTwo: 140,
        sportSuggestion: '降低热量的摄取,少吃脂肪类食物,减少食物的摄入量'
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + '/get_test_info',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        console.log(res)
        var userInfo=res.data.userinfo;
        var gender = userInfo.gender;
        if (userInfo.gender == 2) {
          gender = 0;
        } else {
          gender = 1;
        }
        userInfo.height = res.data.userinfo.height;
        userInfo.weight = res.data.userinfo.weight;
        userInfo.age = res.data.userinfo.age;;
        var bmr = 0;
        if (gender == 0) {
          bmr = (655.1 + (9.56 * userInfo.weight) + (1.85 * userInfo.height) - (4.86 * userInfo.age)).toFixed(1);
        } else {
          bmr = (66.5 + (13.7 * userInfo.weight) + (5 * userInfo.height) - (6.8 * userInfo.age)).toFixed(1);
        }
        //计算BMI
        const bmi = (userInfo.weight / ((userInfo.height * userInfo.height) / 10000)).toFixed(1);
        var bmiLevel = Math.round((bmi - 14) / 0.2);
        if(bmiLevel>=95){
          bmiLevel=95
        } else if (bmiLevel<=5){
          bmiLevel = 5
        }else{
          bmiLevel = bmiLevel ;
        }
        var calorie = null;
        var suggestion = null;
        var eatSuggestion = null;
        var sportSuggestion = null;
        var color=null;
        var title=null;
        if (gender == 0) {
          if (bmi < 18.5) {
            color=0;
            calorie = (bmr * 1.2 + 500).toFixed(0);
            suggestion = '根据自己对身材期待，选择是增肌还是塑形，以力量训练为主，有氧为辅去锻炼，提高身体健康质量，维持体型。';
            title ='你的体重过轻';
            eatSuggestion = '增加膳食的摄入量，膳食内容应丰富多样，向机体提供合成组织所需要的各种营养素。在摄入足够蛋白质的情况下，宜多进食一些含脂肪、碳水化合物（即淀粉、糖类等）较丰富的食物。';
            sportSuggestion = '以力量训练为主，有氧为辅去锻炼。初级HIIT训练、跳绳、深蹲、游泳都是很合适的运动，建议坚持30分钟以上。';
          } else if (bmi <= 24) {
            color=1;
            calorie = (bmr * 1.2).toFixed(0);
            suggestion = '不需要刻意减肥。保持良好的饮食和运动习惯有助于你保持身材，远离亚健康。';
            title ='你的体重很标准',
            eatSuggestion = '注意增加优质蛋白、粗粮以及果蔬类的摄入，控制脂肪、高热量食物！';
            sportSuggestion = '有氧和无氧运动相结合，维持一周三次，每次30分的运动规律。慢跑、普拉提、游泳、羽毛球、舞蹈瑜伽都是比较适合的运动方式，注意控制运动时的燃脂心率';
          } else if (bmi <= 28) {
            color=2;
            calorie = (bmr * 1.2 - 400).toFixed(0);
            suggestion = '规律和节制的饮食以及适量的运动会帮助你减肥成功，建议你立刻减肥。';
            title ='你的体重已经超标'
            eatSuggestion = '少吃肥肉、油炸、膨化食品和碳酸饮料，尽量选择低脂蛋白质，比如牛肉、鸡脯肉等，多吃素材，粗粮。控制饮食是你成功减肥的关键。';
            sportSuggestion = '运动应该以有氧减脂为主，力量训练为辅。多进行跑步、游泳、单车等有氧运动，时间保持在30分钟以上；再适当进行力量训练，注意维持心率';
          } else {
            color=3;
            calorie = (bmr * 1.2 - 500).toFixed(0);
            suggestion = '肥胖会加重你患上糖尿病、高血压等心血管疾病的风险，规律和节制的饮食以及适量的运动会帮助你减肥成功，建议你立刻减肥。';
            title ='你的体重属于肥胖';
            eatSuggestion = '少吃肥肉、油炸、膨化食品和碳酸饮料，尽量选择低脂蛋白质，比如牛肉、鸡脯肉等，多吃素材，粗粮。控制饮食是你成功减肥的关键。';
            sportSuggestion = '根据你的身体情况，运动应该先进行低强度的速度较慢的运动，建立有氧运动能力；当身体具备一定的燃烧脂肪能力时，就可以参加速度较快的运动。一旦身体开始燃烧脂肪时，锻炼就进入巩固持续的减肥阶段。可参考的运动方式：快走、慢跑、羽毛球。';
          }
        } else {
          if (bmi < 18.5) {
            color = 0;
            calorie = (bmr * 1.2 + 500).toFixed(0);
            suggestion = '不需要减肥。身体太瘦容易引发多种疾病，合理增重可帮助你改善、恢复身体机能和精神状态。';
            title ='你的体重过轻';
            eatSuggestion = '增加膳食的摄入量，膳食内容应丰富多样，向机体提供合成组织所需要的各种营养素。在摄入足够蛋白质的情况下，宜多进食一些含脂肪、碳水化合物（即淀粉、糖类等）较丰富的食物。';
            sportSuggestion = '体重较轻，运动以力量训练为主，有氧为辅，重在增肌塑形，初级HIIT训练、跳绳、深蹲、游泳都是很适合这阶段的运动，时间坚持30分钟以上为佳。';
          } else if (bmi <= 24) {
            color = 1;
            calorie = (bmr * 1.2).toFixed(0);
            suggestion = '不需要刻意减肥。保持良好的饮食和运动习惯有助于你保持身材，远离亚健康。';
            title ='你的体重很标准';
            eatSuggestion = '注意增加优质蛋白、粗粮以及果蔬类的摄入，控制脂肪、高热量食物！';
            sportSuggestion = '有氧和无氧运动相结合，维持一周三次，每次30分的运动规律。慢跑、普拉提、游泳、羽毛球、舞蹈瑜伽都是比较适合的运动方式，注意控制运动时的燃脂心率';
          } else if (bmi <= 28) {
            color = 2;
            calorie = (bmr * 1.2 - 400).toFixed(0);
            suggestion = '规律和节制的饮食以及适量的运动会帮助你减肥成功，建议你立刻减肥。';
            title ='你的体重已经超标';
            eatSuggestion = '少吃肥肉、油炸、膨化食品和碳酸饮料，尽量选择低脂蛋白质，比如牛肉、鸡脯肉等，多吃素材，粗粮。控制饮食是你成功减肥的关键。';
            sportSuggestion = '运动应该以有氧减脂为主，力量训练为辅。多进行跑步、游泳、单车等有氧运动，时间保持在30分钟以上；再适当进行力量训练，注意维持心率';
          } else {
            color = 3;
            calorie = (bmr * 1.2 - 500).toFixed(0);
            suggestion = '肥胖会加重你患上糖尿病、高血压等心血管疾病的风险，规律和节制的饮食以及适量的运动会帮助你减肥成功，建议你立刻减肥。';
            title ='你的体重属于肥胖';
            eatSuggestion = '少吃肥肉、油炸、膨化食品和碳酸饮料，尽量选择低脂蛋白质，比如牛肉、鸡脯肉等，多吃素材，粗粮。控制饮食是你成功减肥的关键。睡前三小时内禁止进餐，夜宵最好不吃！';
            sportSuggestion = '根据你的身体情况，应先进行低强度运动，建立有氧运动能力；当身体具备一定的燃烧脂肪能力时，就可以参加速度较快的运动。一旦身体开始燃烧脂肪时，锻炼就进入巩固持续的减肥阶段。可参考的运动方式：快走、慢跑、羽毛球。';
          }
        }
        //计算体脂
        const bf = (1.2 * bmi + 0.23 * userInfo.age - 5.4 - 10.8 * gender).toFixed(1);
        var bfLevel = null;
        var tz=null;
        if (gender == 0) {
          var tz = Math.round((bf-5)/0.2);
          if(tz>=95){
            tz=95
          }else if(tz<=5){
            tz=5
          }else{
            tz=tz
          }
          if (bf < 15) {
            bfLevel = 0;
          } else if (bf <= 20) {
            bfLevel = 1;
          } else if (bf <= 25) {
            bfLevel = 2;
          } else {
            bfLevel = 3;
          }
        } else {
          var tz = Math.round((bf - 5) / 0.2);
          if (tz >= 95) {
            tz = 95
          } else if (tz <= 5) {
            tz = 5
          } else {
            tz = tz
          }
          if (bf < 10) {
            bfLevel = 0;
          } else if (bf <= 15) {
            bfLevel = 1;
          } else if (bf <= 20) {
            bfLevel = 2;
          } else {
            bfLevel = 3;
          }
        }
        var dreamWeight = 0;
        if (gender == 0) {
          dreamWeight = (19 * ((userInfo.height * userInfo.height) / 10000)).toFixed(1);
        } else {
          dreamWeight = (22 * ((userInfo.height * userInfo.height) / 10000)).toFixed(1);
        }

        const calOne = calorie - 150;
        const calTwo = Number(calorie) + 150;
        const countOne = ((220 - userInfo.age) * 0.6).toFixed(0);
        const countTwo = ((220 - userInfo.age) * 0.8).toFixed(0);

        that.setData({
          userInfo: res.data.userinfo,
          stype:res.data.type,
          'analysisData.body.bmi': bmi,
          'analysisData.body.bmiLevel': bmiLevel,
          'analysisData.body.bf': bf,
          'analysisData.body.bfLevel': bfLevel,
          'analysisData.body.bmr': bmr,
          'analysisData.body.suggestion': suggestion,
          'analysisData.body.title':title,
          'analysisData.body.tz': tz,
          'analysisData.body.color': color,
          'analysisData.body.dreamWeight': dreamWeight,
          'analysisData.eat.calorie': calorie,
          'analysisData.eat.calOne': calOne,
          'analysisData.eat.calTwo': calTwo,
          'analysisData.eat.eatSuggestion': eatSuggestion,
          'analysisData.sport.countOne': countOne,
          'analysisData.sport.countTwo': countTwo,
          'analysisData.sport.sportSuggestion': sportSuggestion,
        })
      }
    })

  },
  edit: function() {
    wx.navigateTo({
      url: '/pages/person/index',
    })
  },
  hisRecord:function(){
    wx.navigateTo({
      url: '/pages/record/index',
    })
  }
})