let weChat = require('weChat')
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 启用物理引擎相关功能  
        cc.director.getPhysicsManager().enabled = true;
        this.linearVelocity = 80;

        // cc.find('Canvas/user/mark/img').getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(cc.url.raw('https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKgdEKzY1AAmq5OLicC7QibZ6LSEHvqTEt6NLh8wkiboBYd4G5JZBfFicrTeTEDT4lz6zddev8XO7XbOA/132'))
    //     cc.loader.load('http://www.10tiao.com/assets/images/icon/qrcode200.png',function (err, texture) {
    //         var frame=new cc.SpriteFrame(texture);
    //         cc.find('Canvas/user/mark/img').getComponent(cc.Sprite).spriteFrame=frame;
    //    });


    // cc.loader.load( 'http://www.10tiao.com/assets/images/icon/qrcode200.png', (e, texture) => {
    //     cc.find('Canvas/user/mark/img').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
    // });


        // cc.loader.loadRes('background/hd', cc.SpriteFrame, (err, data) => {
        //     // console.log(data, 55);

        //     cc.find('Canvas/user/mark/img').getComponent(cc.Sprite).spriteFrame = data;

        // });
    },

    start() {
        // 获取用户信息 并储存到缓存中 可在全局变量中获取到
        conf.userInfo= weChat.loginSimplify();

        // cc.loader.load( conf.userInfo.rawData.avatarUrl, (e, texture) => {
        //     cc.find('Canvas/user/mark/img').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        // });






    },

    // update (dt) {},
});
