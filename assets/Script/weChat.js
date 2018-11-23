
var weChat = {


    /**
     * 此函数用 全屏按钮来获取用户的信息 使用 wx.getStorageSync('userInfoWx') 获取缓存的用户信息，用于不需要用token来解析隐私数据的游戏
     * @method loginSimplify
     * @returns {Object} 获取的用户信息对象
     */
    loginSimplify: function (callBackFn) {
        let exportJson = {};
        let sysInfo = wx.getSystemInfoSync();
        //获取微信界面大小
        let width = sysInfo.screenWidth;
        let height = sysInfo.screenHeight;
        // 首先获取微信的授权信息
        wx.getSetting({
            success(res) {
                console.log(res.authSetting);
                // 如果已经授权过获取用户信息就直接使用getuserinfo来获取
                if (res.authSetting["scope.userInfo"]) {
                    console.log("用户已授权");
                    wx.getUserInfo({
                        success(res) {
                            console.log(res);
                            wx.setStorageSync('userInfoWx', res.userInfo);
                            exportJson.userInfo = res.userInfo;
                            //此时可进行登录操作
                            // 加载指定的回调函数
                            callBackFn(exportJson.userInfo);
                        }
                    });
                } else {
                    console.log("用户未授权");
                    let button = wx.createUserInfoButton({
                        type: 'text',
                        text: '',
                        style: {
                            left: 0,
                            top: 0,
                            width: width,
                            height: height,
                            backgroundColor: '#00000000',//最后两位为透明度
                            color: '#ffffff',
                            fontSize: 20,
                            textAlign: "center",
                            lineHeight: height,
                        }
                    });
                    button.onTap((res) => {
                        if (res.userInfo) {
                            console.log("用户授权:", res);
                            wx.setStorageSync('userInfoWx', res.userInfo);
                            exportJson.userInfo = res.userInfo;
                            //此时可进行登录操作
                            // 加载指定的回调函数
                            callBackFn(exportJson.userInfo);
                            // 销毁按钮
                            button.destroy();
                        } else {
                            console.log("用户拒绝授权:", res);
                        }
                    });
                }
            }
        })
        return exportJson.userInfo;
    },
    checkSession: function () {
        wx.checkSession({
            success() {
                //session_key 未过期，并且在本生命周期一直有效
            },
            fail() {
                // session_key 已经失效，需要重新执行登录流程
                wx.login() //重新登录
            }
        })
    },
    /**
     * 监听微信被动转发
     * @method fnOnTranspond
     * @param {String} Txt Txt内容
     */
    fnOnTranspond(Txt) {
        console.log(Txt, '点击了');
        // 开启转发按钮
        wx.showShareMenu({
            withShareTicket: true,
            success: () => console.log('开启转发按钮成功'),
            fail: () => console.log('开启转发按钮失败'),

        })

        // 监听被动转发
        wx.onShareAppMessage(function () {
            return {
                title: Txt,
                imageUrl: canvas.toTempFilePathSync({
                    destWidth: 640,
                    destHeight: 1136
                })
            }
        })
    },
    /**
     * 监听微信主动转发
     * @method fnTranspond
     * @param {String} Txt Txt内容
     */
    fnTranspond(Txt) {
        console.log(Txt, '点击了主动转发');


        // 监听被动转发
        wx.shareAppMessage((function () {
            return {
                title: Txt,
                imageUrl: canvas.toTempFilePath({
                    x: 10,
                    y: 10,
                    width: 200,
                    height: 150,
                    destWidth: 400,
                    destHeight: 300,
                    success: (res) => {

                        return res.tempFilePath;

                    }
                })
            }
        }))
    },
    // 监听微信加速计
    fnStartAccelerometer(accClass) {
        wx.startAccelerometer(
            {
                interval: accClass, success: () => console.log('监听微信加速计成功')
            }
        )
    },
    // 取消监听微信加速计
    fnStopAccelerometer() {
        wx.stopAccelerometer(
            {
                success: () => console.log('取消监听微信加速计成功')
            }
        )
    },
    // 监听加速度数据事件
    fnOnAccelerometerChange(callBackFn) {
        wx.onAccelerometerChange(callBackFn)
    }

}

module.exports = weChat;