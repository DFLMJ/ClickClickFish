let weChat = require('weChat'), DBU = require('DBUtility');
cc.Class({
    extends: cc.Component,

    properties: {
        headPortraits: {
            default: null,
            type: cc.Node,
            displayName: '用户头像'
        },
        userName: {
            default: null,
            type: cc.Node,
            displayName: '用户名'
        },
        playBtn: {
            default: null,
            type: cc.Node,
            displayName: '开始按钮'
        },
        rankBtn: {
            default: null,
            type: cc.Node,
            displayName: '排行榜按钮'
        },
        honorBtn: {
            default: null,
            type: cc.Node,
            displayName: '荣耀按钮'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 启用物理引擎相关功能  
        cc.director.getPhysicsManager().enabled = true;
        this.linearVelocity = 80;
        try {
        // 监听被动分享
        weChat.fnOnTranspond('转发就能获取金币噢');    
        } catch (error) {
            console.log('请在微信开发者工具打开', error);
            
        }
        
        let self = this;
        // 载入用户信息
        function loadInfo() {
            // 载入用户头像
            DBU.loadUrl(conf.userInfo.avatarUrl, self.headPortraits);
            // 载入用户姓名
            DBU.loadTxt(conf.userInfo.nickName, self.userName);
        }
        //确保在非微信环境下运行时不会报错
        try {
            // 获取用户信息 并储存到缓存中 可在全局变量中获取到
            if (wx.getStorageSync('userInfoWx')) {
                conf.userInfo = wx.getStorageSync('userInfoWx')
                loadInfo()
            } else {
                weChat.loginSimplify(
                    (info) => {
                        // 储存用户信息到全局变量中
                        conf.userInfo = info;
                        loadInfo();
                    }
                );
            }

        } catch (error) {
            console.log('请在微信开发者工具打开', error);
        }

        // try {
        // 预加载游戏界面
        cc.director.preloadScene('Game', () => {
            console.log('游戏界面预加载完成');
        })
        // 预加载排行榜界面
        cc.director.preloadScene('Rank', () => {
            console.log('排行榜界面预加载完成');
        })
        // 预加载收藏品界面界面
        cc.director.preloadScene('Collect', () => {
            console.log('收藏品荣誉界面预加载完成');
        })
        // } catch (error) {
        //     console.log(error);

        // }

        try {
            // 监听 开始游戏按钮
            this.playBtn.on('touchstart', e => {
                cc.director.loadScene('Game')
            })
            // 监听 排行榜按钮
            this.rankBtn.on('touchstart', e => {
                cc.director.loadScene('Rank')
            })
            // 监听 荣誉按钮
            this.honorBtn.on('touchstart', e => {
                cc.director.loadScene('Honor')
            })

        } catch (error) {
            console.log(error);

        }









    },

    // update (dt) {},
});
