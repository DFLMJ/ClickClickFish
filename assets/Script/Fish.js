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
        selfX: 0,
        selfY: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 启用物理引擎相关功能  
        cc.director.getPhysicsManager().enabled = true;
    },

    start() {

    },

    fnClickfish(e) {
        console.log('你点中了');
        // 回收小鱼
        conf.FishNodePool.put(e.target);
    },
    // 碰撞开始前
    onCollisionEnter(other, self) {
        this.selfX = other.node.x;
        this.selfY = other.node.y;
        let otherName = other.node.name;
        // console.log('发生了碰撞', otherName);

    },
    onCollisionExit: function (other, self) {
        // if (this.selfX < self.node.x) {
        //     // console.log('向右');
        //     if (other.node.name == 'right') {
        //         // 回收鱼放入对象池方便下次生成
        //         conf.FishNodePool.put(self.node)
        //         console.log('我已经回收了');

        //     }
        // } else {
        //     if (other.node.name == 'left') {
        //         // 回收鱼放入对象池方便下次生成
        //         conf.FishNodePool.put(self.node)
        //     }
        // }
        switch (other.node.name) {
            case 'right':
                if (this.selfX < self.node.x) {
                    conf.FishNodePool.put(self.node)
                }
                break;
                case 'left':
                if (this.selfX > self.node.x) {
                    conf.FishNodePool.put(self.node)
                }
                break;
                case 'top':
                case 'bottom':
                    conf.FishNodePool.put(self.node);
                break;

            default:
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
