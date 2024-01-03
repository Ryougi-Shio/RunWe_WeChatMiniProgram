// pages/home/index.js
var app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
    nickname:'',
    man:'男',
    region:'上海',
    avatorUrl:'http://www.28jy10gtt.cn/source/account.png', //用户头像地址
    running_data:'',
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(app.globalData.nickname);
        this.setData({
            nickname:app.globalData.nickname,
            avatorUrl:app.globalData.avatorUrl
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.get_runRecord();
    },
    get_runRecord: function(){
        var that=this;
        wx.cloud.callFunction({
            name:'user',
            data:{
                type:'get_runRecord',
                openid:app.globalData.openid,
            },
            success:function(res){
                console.log(res.result.data[0]);
                that.setData({
                    running_data:res.result.data,
                })
            },
            fail:console.error
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    get_bodydata(){
        wx.navigateTo({
            url:'../bodydata/bodydata',
        })
    }
})