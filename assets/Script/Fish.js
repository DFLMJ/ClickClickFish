// 导入插件
let DBU = require('DBUtility');

cc.Class({
    extends: cc.Component,

    properties: {

        selfX: 0,
        selfY: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 启用物理引擎相关功能  
        cc.director.getPhysicsManager().enabled = true;
        // 监听点击事件
        let touchstartCall = (e) => {
            // console.log('你点中了', conf.fishHit[parseInt(e.target.name)], e.target.name);

            // 计算是否捕获
            let res = DBU.getRandomProb([0, 1], [1 - conf.fishHit[parseInt(e.target.name)], conf.fishHit[parseInt(e.target.name)]]);
            console.log(res, '你点中了', conf.fishHit[parseInt(e.target.name)], e.target.name);

            // 捕获鱼之后就执行的效果
            if (res) {
                // 取消注册监听
                e.target.off('touchstart', this.touchstartCall, this);
                
// 执行屏幕震动动画
let camera=cc.find('camera'),Vibration=cc.sequence(cc.moveBy(0.2,30,-30),cc.moveBy(0.2,-60,60),cc.moveBy(0.2,30,-50),cc.moveBy(0.2,0,+20))
camera.runAction(Vibration);
                // 执行消失动作
                let ActionManager = cc.director.getActionManager();
                ActionManager.resumeTarget(e.target);
                ActionManager.removeAllActionsFromTarget(e.target);

                let act = cc.sequence(cc.blink(0.5, 10), cc.callFunc(() => {
                    // 回收小鱼
                    this.put(this);
                }))
                // 执行消失动画
                e.target.runAction(act)

            }

        };
        this.node.on('touchstart', touchstartCall, this);
    },

    start() {
    },


    // 碰撞开始前
    onCollisionEnter(other, self) {
        this.selfX = other.node.x;
        this.selfY = other.node.y;
        let otherName = other.node.name;
        // console.log('发生了碰撞', otherName);

    },
    // 回收节点
    put: function (self) {
        // 停止这个节点上的所有动画
        self.node.stopAllActions();
        // 将节点放入对象池
        conf[`fishLevel_${self.node.name}`].put(self.node)
        // conf.FishNodePool.put();
        console.log('进入回收');

    },
    onCollisionExit: function (other, self) {
        // if (this.selfX < self.node.x) {
        //     // console.log('向右');
        //     if (other.node.name == 'right') {
        //         // 回收鱼放入对象池方便下次生成
        //         conf.FishNodePool.put(self.node)
        // console.log('我已经回收了');

        //     }
        // } else {
        //     if (other.node.name == 'left') {
        //         // 回收鱼放入对象池方便下次生成
        //         conf.FishNodePool.put(self.node)
        //     }
        // }
        // console.log(other.node.name);

        switch (other.node.name) {
            case 'right':
                if (this.selfX < self.node.x) {
                    this.put(self);
                }
                break;
            case 'left':
                if (this.selfX > self.node.x) {
                    this.put(self);

                }
                break;
            case 'top':
            case 'bottom':
                this.put(self);

                break;
            default:
                console.log('特殊');
                break;
        }

        // console.log('碰撞结束', self.node.x, self.node.y);

    }

    // update (dt) {

    //     if (this.node.inX>0) {
    //         console.log('我在右边',this.node.inX);

    //     }else{
    //         console.log('我在左边');

    //     }

    // },
});
