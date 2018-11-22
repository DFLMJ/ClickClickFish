

var DBUtility = {
    /**
     * 获取随机整数,不包括两个数
     *@method fnRandomNum
     * @param {number} iZero 随机数范围开始值
     * @param {number} iEnd  随机数范围结束值
     * @returns {number} 返回随机数
     */
    fnRandomNum: function (iZero, iEnd) {
        if (iZero >= iEnd) {
            fnEio(RangeError, '随机数临界值应大于起始值')
        }
        let min = Math.ceil(iEnd),
        max = Math.floor(iZero);
        return Math.floor(Math.random() * (max - min)) + min;
    },

    getRandomIntInclusive:function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    },
    getRandFload:function(min,max) {
        return parseFloat((Math.random()*(max-min)+min).toFixed(1))
    },
    /**
     * 获取随机概率情况下的结果
     * @method getRandomProb
     * @param {number} arr 随机概率对应的结果数组
     * @param {number} Prob  存放随机概率的数组
     * @returns {number} 返回随机数
     */
    getRandomProb: function(arr,Prob) {
            var sum = 0,
                factor = 0,
                random = Math.random();
        
            for(var i = Prob.length - 1; i >= 0; i--) {
                sum += Prob[i]; // 统计概率总和
            };
            random *= sum; // 生成概率随机数
            for(var i = Prob.length - 1; i >= 0; i--) {
                factor += Prob[i];
                if(random <= factor) 
                  return arr[i];
            };
            return null;
    },
     /**
     * 加载图像URL
     * @method loadUrl
     * @param {String} Path 图片地址
     * @param {Node} Node  需要更改spriteFrame 的节点
     * @param {String} Type  图片的类型 例如jpg,Png 默认为png
     */
    loadUrl:function(Path,Node,Type){
        cc.loader.load({url:Path ,type:Type|| 'png' }, (e, texture) => {
            Node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        });
    },
    /**
     * 加载txt文字
     * @method loadTxt
     * @param {String} Txt Txt内容
     * @param {Node} Node  需要更改的节点
     */
    loadTxt:function(Txt,Node){
        Node.getComponent(cc.Label).string=Txt;
    }


}

module.exports = DBUtility;