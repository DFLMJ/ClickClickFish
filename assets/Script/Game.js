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
            default: null,
            type: cc.Prefab,
            displayName: '鱼的预制资源'
        },
        timeFish:0

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 初始化渔网的对象池
        conf.FishnetNodePool = this.fnInitNodePool(conf.FishnetNum, this.Fishnet);
        // 初始化鱼的对象池
        conf.FishNodePool = this.fnInitNodePool(conf.FishNum, this.Fish);
        console.log(conf.FishnetNodePool);

        // 开启物理碰撞
        cc.director.getCollisionManager().enabled=true;

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

        let target = conf.FishNodePool.get(),
            winSize = cc.winSize,
            x = DBU.getRandomIntInclusive(0, 1) === 1 ? parseInt(winSize.width+target.width) : -parseInt(winSize.width),
        y=DBU.getRandomIntInclusive(-winSize.height+target.height,winSize.height-target.height);
        // ;
        // console.log('y');
        
        target.inX = x;
        target.parent = cc.find('Canvas/FishBox');
        target.setPosition(x, 12);
        // if( target.inX>0) target.rotation=180;
        target.inX>0?target.rotation=180:target.rotation=360;
        let c=x>0?(-x-target.width):Math.abs(x)+target.width;
        let act=cc.moveTo(DBU.getRandFload(25,35),c,y);
        if (c<winSize.width/2||c>(-winSize.width/2)) {
        console.log(c,y);
        }
        
        target.runAction(act)


    },
    update(dt) {
this.timeFish+=dt;        
        // console.log(dt);
        
        let length = cc.find('Canvas/FishBox').children.length;
        if (length < 30) {
            // 
            // console.log('没有小鱼了')
            if (this.timeFish>0.5) {
                this.timeFish=0;
                this.fnCreateFish();
                
            }
        }
    }
});
