

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
    Random: function(arr,Prob) {
        
    }
}



module.exports = DBUtility;