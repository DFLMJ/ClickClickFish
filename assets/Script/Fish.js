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
        // cc.director.getPhysicsManager().enabled = true;

    },
    // 让实例的节点每次请求出来后都能执行的生命回调
    onEnable() {
        // 监听点击事件
        let touchstartCall = e => {
            // console.log('你点中了', conf.fishHit[parseInt(e.target.name)], e.target.name);

            // 判断剩余金币是否小于单次消耗金币 如果是就弹出看视频获取金币的窗口
            console.log(conf.expendGold, conf.userNetworkdata.gold, conf.userNetworkdata.sumGold);

            if (conf.userNetworkdata.gold < conf.expendGold) {
                cc.find('Canvas/testUI/noBg').active = true;
                DBU.fnZoom(cc.find('Canvas/testUI/noGlod'));
                DBU.fnShowTips('没有金币了哦');
                return;
            }
            conf.userNetworkdata.gold -= conf.expendGold;
            conf.userNetworkdata.sumGold += conf.expendGold;

            // 计算是否捕获
            let res = DBU.getRandomProb([0, 1], [1 - (conf.fishHit[parseInt(e.target.name) - 1]), conf.fishHit[parseInt(e.target.name - 1)]]);
            console.log(res, '你点中了', conf.fishHit[parseInt(e.target.name - 1)], e.target.name);
            // console.log(e);
            // 获取渔网
            let Fishnet = cc.find('Canvas/Fishnet');
            Fishnet.setPosition(e.target.getPosition());
            Fishnet.getComponent(cc.Animation).play('clickGuang');

            // let animation = Fishnet.getComponent(cc.Animation),callAni= function(){
            // //     setTimeout(()=>{

            //     console.log('渔网动画执行完毕');

            // // },100)
            // animation.off('finished',callAni)                
            // // console.log(this,3);

            // conf.FishnetNodePool.put(Fishnet);
            // // this.destroy()
            // };
            // animation.on('finished',callAni)
            // console.log(Fishnet,89);

            // 捕获鱼之后就执行的效果
            console.log('e.target.name', e.target.name * 2);

            if (res) {
                // 执行金币动画
                let goldArr = [], gold = cc.find('Canvas/goldBox'), goldBox = gold.getChildByName('gold'), yNum = 0, goldPosi = cc.find('Canvas/Top/img/gold');
                gold.setPosition(e.target.getPosition());
                gold.getChildByName('str').runAction(cc.fadeIn(0.3));
                DBU.loadTxt('+' + conf.expendGold * conf.fishAward[e.target.name - 1], gold.getChildByName('str'));
                DBU.loadTxt(conf.userNetworkdata.gold += conf.expendGold * conf.fishAward[e.target.name - 1], goldPosi);
                for (let i = 0; i < (e.target.name * 2); i++) {
                    goldArr.push(conf.goldPool.get());
                    goldArr[i].parent = goldBox;
                    // if (i==0) {
                    // goldArr[i].setPosition(0, 0);

                    // }else{

                    //     goldArr[i].setPosition(goldArr[goldArr.length - 2].getPositionX() + goldArr[i].width, 0);

                    // }
                    goldArr[i].setPosition(0, 0);

                    let y = yNum * (goldArr[i].height + 10), x = (i % 5) * goldArr[i].width - goldBox.width / 2;
                    // goldArr[i].setPosition((i + 1) * goldArr[i].width - goldBox.width / 2, y);
                    goldArr[i].setPosition(x, y);
                    // y轴基数加一
                    i % 5 == 0 ? yNum++ : yNum;
                    // 监听动画

                    // let aniTg= goldArr[i].getComponent(cc.Animation),callAniTg=e=>{
                    //     // aniTg.getAnimationState('gold').off('finished',callAniTg);
                    //     // conf.goldPool.put(goldArr[i]);
                    //     console.log('8989898');

                    // };
                    // aniTg.getAnimationState('gold').on('finished',callAniTg);
                    goldArr[i].getComponent(cc.Animation).play('gold');
                    goldArr[i].getComponent(cc.Animation).getAnimationState('gold').on('finished', e => {
                        goldArr[i].runAction(cc.sequence(cc.moveTo(1, goldPosi.getPositionX(), goldPosi.parent.parent.getPositionY()),cc.callFunc(() => {

                            conf.goldPool.put(goldArr[i]);
                            goldArr[i].stopAllActions();

                        })));
                        console.log(goldPosi.getPositionX(), goldPosi.parent.parent.getPositionY());

                    }, this)

                    // goldArr[i].getComponent(cc.Animation).getAnimationState('gold').on('finished', e => {
                    //         conf.goldPool.put(goldArr[i]);
                    //     console.log(goldPosi.getPositionX(), goldPosi.parent.parent.getPositionY());

                    // }, this)


                    console.log(goldArr[i].getPosition(), goldArr.length, goldArr[goldArr.length - 1].getPositionX() + goldArr[i].width);

                }

                // 调用手机振动
                this.fnVibrateShort()

                // 取消注册监听
                e.target.off('touchstart', this.touchstartCall, this);

                // 执行屏幕震动动画
                let camera = cc.find('Canvas/camera'), Vibration = cc.sequence(cc.moveBy(0.2, 30, -30), cc.moveBy(0.2, -60, 60), cc.moveBy(0.2, 30, -50), cc.moveBy(0.2, 0, +20))
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
    // 振动函数
    fnVibrateShort() {
        try {
            let obj = {
                fail: (e) => {
                    console.log('调用失败');
                },
            }
            wx.vibrateShort(obj)
        } catch (error) {
            // console.log('请在微信客户端运行此游戏');

        }
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
        // 判断是否返回大厅而停止回收
        if (conf.yieldFish) {
            // 停止这个节点上的所有动画
            self.node.stopAllActions();
            // 将节点放入对象池
            conf[`fishLevel_${self.node.name}`].put(self.node)
            // conf.FishNodePool.put();
            // console.log('进入回收');
        }

    },
    onCollisionExit: function (other, self) {


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
