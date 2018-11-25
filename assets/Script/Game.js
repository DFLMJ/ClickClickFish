// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
let weChat = require('weChat'), DBU = require('DBUtility');
cc.Class({
    extends: cc.Component,

    properties: {
        Fishnet: {
            default: null,
            type: cc.Prefab,
            displayName: '渔网的预制资源'
        },
        Fish: {
            default: [],
            type: cc.Prefab,
            displayName: '鱼的预制资源'
        },
        background: {
            default: null,
            type: cc.Node,
            displayName: '背景'
        },
        item: {
            default: null,
            type: cc.Node,
            displayName: '测试点'
        },
        transpondBtn: {
            default: null,
            type: cc.Node,
            displayName: '分享按钮'
        },
        closeBtn: {
            default: null,
            type: cc.Node,
            displayName: '关闭按钮'
        },
        bet1Btn: {
            default: null,
            type: cc.Node,
            displayName: '下注1'
        },

        bet2Btn: {
            default: null,
            type: cc.Node,
            displayName: '下注2'
        },
        bet3Btn: {
            default: null,
            type: cc.Node,
            displayName: '下注3'
        },
        bet4Btn: {
            default: null,
            type: cc.Node,
            displayName: '下注4'
        },
        bet5Btn: {
            default: null,
            type: cc.Node,
            displayName: '下注5'
        },
        glodNum: {
            default: null,
            type: cc.Node,
            displayName: '金币'
        },
        wallet: {
            default: null,
            type: cc.Node,
            displayName: '红包'
        },
        taskFish: {
            default: null,
            type: cc.Node,
            displayName: '当前任务鱼UI'
        },
        taskSumNum: {
            default: null,
            type: cc.Node,
            displayName: '当前任务个数'
        },
        taskCompleted: {
            default: null,
            type: cc.Node,
            displayName: '已完成任务个数'
        },
        headPortraits: {
            default: null,
            type: cc.Node,
            displayName: '用户头像'
        },
        backBtn: {
            default: null,
            type: cc.Node,
            displayName: '返回按钮'
        },

        timeFish: 0,
        // 是否使用冰封万里的技能
        SuspendAction: false,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log(cc.sys.browserType, '这是游览器类型');

        // 初始化节点
        // var node = new cc.Node('Sprite');
        // node.name='FishBox';
        // node.width=640;
        // node.height=1136;
        // var sp = node.addComponent(cc.Sprite);

        // sp.spriteFrame = this.sprite;
        // node.parent = this.node;

        conf.yieldFish = true;

        // 初始化对象池
        //初始化鱼的对象池
        for (let index = 1; index <= this.Fish.length; index++) {
            // 赋值对象池
            conf[`fishLevel_${index}`] = this.fnInitNodePool(conf.fishArr[index - 1], this.Fish[index - 1], conf[`fishLevel_${index}`])
        }
        // 初始化渔网的对象池
        conf.FishnetNodePool = this.fnInitNodePool(conf.FishnetNum, this.Fishnet, conf.FishnetNodePool);

        // 开启物理碰撞
        cc.director.getCollisionManager().enabled = true;
        // 开启
        // cc.director.getCollisionManager().enabledDebugDraw=true;
        // 开启加速器事件监听
        cc.systemEvent.setAccelerometerEnabled(true);
        // 更改加速度计间隔值
        cc.systemEvent.setAccelerometerInterval(1 / 60);
        let self = this;
        // 判断是否为微信平台 如果是微信平台采用微信的重力感应
        if (cc.sys.browserType == 'wechatgame') {
            // 修改监听类型适配 ui 60帧
            weChat.fnStartAccelerometer('game')
            weChat.fnOnAccelerometerChange((e, node) => {
                this.background.setPosition(e.x * 50, e.y * 50, e.z * 50)
            });
        } else {
            // 监听重力感应
            cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.fnOnDeviceMotion, this);
        }



        // 监听主动分享
        this.transpondBtn.on('touchstart', () => {
            weChat.fnTranspond('转发就能获取金币噢');
        })
        // 预加载游戏界面
        cc.director.preloadScene('Play', () => {
            console.log('开始界面预加载完成');
        })
        // 监听返回按钮
        this.backBtn.on('touchstart', () => {

            try {
            // 取消微信监听
            weChat.fnStopAccelerometer()    
            } catch (error) {
                console.log('请在微信客服端打开');
                
            }
            

            conf.yieldFish = false;
            cc.director.getCollisionManager().enabled = false;
            // 清空节点
            cc.find('Canvas/FishBox').children.forEach(item => {
                item.destroy();
            })
            // 清空对象池
            for (let index = 1; index <= this.Fish.length; index++) {
                conf[`fishLevel_${index}`].clear();
            }

            // conf.FishnetNodePool.clear();


            cc.director.loadScene('Play')
        })
        // 更换用户头像
        try {
            DBU.loadUrl(conf.userInfo.avatarUrl, this.headPortraits)

        } catch (error) {
            console.log('请在微信开发端中打开');

        }
    },
    // 重力感应函数
    fnOnDeviceMotion(event) {
        this.background.setPosition(event.acc.x * 50, event.acc.y * 50, event.acc.z * 50)
        // cc.find('Canvas/camera').setPosition(event.acc.x * 50, event.acc.y * 50, event.acc.z * 50)
        // this.item.active=false;
    },


    // 技能函数 冰封万里 停止所有动画并在5s后恢复
    fnSuspendAction(e) {
        console.log('点击了技能');
        // 判断是否使用技能
        if (this.SuspendAction) {
            console.log('你已经使用此技能');

            return;
        }
        console.log('---------------');

        // 变化标识符
        this.SuspendAction = true;
        // 获取
        let ActionManager = cc.director.getActionManager();
        cc.find('Canvas/FishBox').children.forEach(item => {
            // 暂停鱼的动作
            ActionManager.pauseTarget(item);
            // 5s后恢复动作
            setTimeout(() => {
                // 变化标识符
                this.SuspendAction = false;
                ActionManager.resumeTarget(item)
            }, conf.SuspendActionNum)
        })
    },

    // 初始化对象池
    fnInitNodePool(num, Pre, nodes) {
        // 为nodes创建对象池
        nodes = new cc.NodePool();
        // 生成对象
        for (let index = 0; index < num; index++) {

            // 创建节点
            let item = cc.instantiate(Pre);
            // 放入对象池
            nodes.put(item);
        }
        // console.log(num, nodes);

        // 返回对象池
        return nodes;
    },

    start() {
        cc.director.setDisplayStats(false)
    },
    fnClickAnimation(e) {
        console.log('我发射了渔网');
    },
    fnGetFishRandomNum() {
        let nameArr = [];
        this.Fish.forEach(element => {
            nameArr.push(parseInt(element.data.name))
        });
        // console.log(nameArr);

        return DBU.getRandomProb(nameArr, conf.fishProb);
    },
    // 生成小鱼
    fnCreateFish(num) {
        // console.log(conf.FishNodePool._pool.length);
        //获取对象池
        if (!conf[`fishLevel_${num}`].size()) {
            let item = cc.instantiate(this.Fish[num - 1]);
            conf[`fishLevel_${num}`].put(item);
        }

        var target = conf[`fishLevel_${num}`].get(),
            speed = DBU.getRandFload(15, 25),
            // 获取设备屏幕大小
            winSize = cc.winSize,
            // 初始化预置点坐标
            x = DBU.getRandomIntInclusive(0, 1) === 1 ? parseInt(winSize.width / 2 + target.width) : -parseInt(winSize.width / 2 + target.width),
            y = DBU.getRandomIntInclusive(-winSize.height / 2 + target.height, winSize.height / 2 - target.height);


        // 设置鱼的游动动画速度
        target.getChildByName('item').getChildByName('fish').getComponent(sp.Skeleton).timeScale = speed * 0.05
        // 给预置点赋值新的初始坐标属性
        target.inX = x;
        // 给予父级
        target.parent = cc.find('Canvas/FishBox');
        // 设置预置点的坐标
        target.setPosition(x, y);
        // 根据初始化坐标判断鱼的朝向
        target.inX > 0 ? change(1) : change(0);
        function change(num) {
            target.rotation = num == 1 ? 360 : 180; target.scaleY = num == 0 ? -1 : 1
        }
        // 设置终点的X坐标为原来的相反值
        let c = x > 0 ? (-x) : Math.abs(x);
        // console.log('起点', target.getPositionX(), target.getPositionY());
        // console.log('终点', x, c, y);
        // 创建动画
        let ay = DBU.getRandomIntInclusive(-winSize.height / 2 + target.height, winSize.height / 2 - target.height);
        target.mjAct = cc.sequence(cc.moveTo(speed, c, ay), cc.callFunc(function () {
            // console.log('执行完毕');

        }, this));


        // 运行动画
        target.runAction(target.mjAct);
        // 判断是否使用冰封万里技能，若是使用就暂停小鱼
        if (this.SuspendAction) {
            cc.director.getActionManager().pauseTarget(target);
        }

    },
    update(dt) {
        this.timeFish += dt;
        // console.log(dt);
        let FishBox = cc.find('Canvas/FishBox').children;
        if (FishBox == null ? 0 : FishBox.length < conf.FishNum && conf.yieldFish) {

            // console.log('没有小鱼了')
            if (this.timeFish > 0.5) {
                this.timeFish = 0;
                this.fnCreateFish(this.fnGetFishRandomNum());

            }


        }

    }
});
