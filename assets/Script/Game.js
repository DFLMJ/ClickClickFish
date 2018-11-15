// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
let DBU = require('DBUtility');
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
        timeFish: 0

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 初始化对象池
        for (let index = 1; index < 21; index++){
            const element = array[index];
            conf[`fishLevel_${i}`]=this.fnInitNodePool(conf.fishArr[], this.Fishnet)
1           
        }




        // 初始化渔网的对象池
        conf.FishnetNodePool = this.fnInitNodePool(conf.FishnetNum, this.Fishnet);
        // 初始化鱼的对象池
        conf.FishNodePool = this.fnInitNodePool(conf.FishNum, this.Fish);
        // console.log(conf.FishnetNodePool);

        // 开启物理碰撞
        cc.director.getCollisionManager().enabled = true;

        // 开启
        // cc.director.getCollisionManager().enabledDebugDraw=true;
    },
    // 初始化对象池
    fnInitNodePool(num, Pre) {

        let nodes = new cc.NodePool();
        for (let index = 0; index < num; index++) {

            // 创建节点
            let item = cc.instantiate(Pre);
            // 放入对象池
            nodes.put(item);
        }

        return nodes;
    },

    start() {
        cc.director.setDisplayStats(false)
    },
    fnClickAnimation(e) {
        console.log('我发射了渔网');
    },
    fnCreateFish() {
        // console.log(conf.FishNodePool._pool.length);
        //获取对象池
        let target = conf.FishNodePool.get(),
            speed = DBU.getRandFload(15, 25),
            // 获取设备屏幕大小
            winSize = cc.winSize,
            // 初始化预置点坐标
            x = DBU.getRandomIntInclusive(0, 1) === 1 ? parseInt(winSize.width / 2 + target.width) : -parseInt(winSize.width / 2 + target.width),
            y = DBU.getRandomIntInclusive(-winSize.height / 2 + target.height, winSize.height / 2 - target.height);
        // 设置鱼的游动动画速度
        target.getChildByName('fish').getComponent(sp.Skeleton).timeScale = speed * 0.12
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
        let act = cc.sequence(cc.moveTo(speed, c, ay), cc.callFunc(function () {
            console.log('执行完毕');

        }, this));
        // 运行动画
        target.runAction(act)
      



    },
    update(dt) {
        this.timeFish += dt;
        // console.log(dt);

        let length = cc.find('Canvas/FishBox').children.length;
        if (length < conf.FishNum) {
            // 
            // console.log('没有小鱼了')
            if (this.timeFish > 0.5) {
                this.timeFish = 0;
                this.fnCreateFish();

            }

        }
    }
});
