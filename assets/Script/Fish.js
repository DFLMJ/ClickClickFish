// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        this.node.on('touchstart',(e)=>{
            console.log('你点中了');
            // 回收小鱼
            this.put(this);
        })
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
        conf.FishNodePool.put(self.node);
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
console.log(other.node.name);

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
