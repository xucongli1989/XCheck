/**
 * ******************************************************************************************
 * 1：基本信息：
 * 开源协议：https://github.com/xucongli1989/XCheck/blob/master/LICENSE
 * 项目地址：https://github.com/xucongli1989/XCheck
 * 电子邮件：80213876@qq.com
 ********************************************************************************************
 * 2：使用说明：
 *                      需要引用jquery，$.XCheck({option});
 ********************************************************************************************
 * 当前版本：v1.0.0
 * 更新时间：2016-01-24
 */
; (function (window, $, undefined) {
   
    /**
     * 默认选项
     */
    var defaults = {
        /**
         * 是否在ajax多页选择时保持选择状态
         */
        isHoldCheckState: false,
        /**
         * 组的class
         */
        groupClass: ".xcheckgroup",
        /**
         * 要选择的每一项的class
         */
        checkItemClass: ".checkItem",
        /**
         * 全选的class
         */
        checkAllClass: ".checkAll",
        /**
         * 清空选择的class
         */
        clearCheckClass: ".clearCheck",
        /**
         * 反选的class
         */
        reverseCheckClass: ".reverseCheck",
        /**
         * 存放已选值的class
         */
        valueClass: ".checkAll",
        /**
         * 全选前回调函数，如果返回false，则不执行默认的全选事件
         */
        beforeCheckAll: function () { },
        /**
         * 全选后回调函数
         */
        afterCheckAll: function () { },
        /**
         * 选择具体项前回调函数，如果返回false，则不执行默认的选择具体项的事件
         */
        beforeCheckItem: function () { },
        /**
         * 选择具体项后回调函数
         */
        afterCheckItem: function () { },
        /**
         * 清空选择前回调函数，如果返回false，则不执行默认的清空选择事件
         */
        beforeClearCheck: function () { },
        /**
         * 清空选择后回调函数
         */
        afterClearCheck: function () { },
        /**
         * 反选前回调函数，如果返回false，则不执行默认的反选事件
         */
        beforeReverseCheck: function () { },
        /**
         * 反选后回调函数
         */
        afterReverseCheck: function () { }
    };
    
    /**
     * 选项
     * 适用于翻页选择的场景
     * 1：如果点了【全部选择】了，则每一页都默认选择了
     * 2：如果点了【全部选择】了，又取消勾选了部分选项，则当前的状态还是全选状态，只是会保留此时未选择的项
     * 3：如果没有点【全部选择】，则每次已选项的值都会存入已选项中
     */
    function SelectedBaseInfo() {
        /**
         * 是否全部保持已选状态
         */
        this.isCheckAll = false;
        /**
         * 已选择项的值
         */
        this.selectedValues = [];
        /**
         * 未选择项的值
         */
        this.unSelectedValues = [];
    };
    
    
    /**
     * 判断是否为html元素
     */
    function isElement(val) {
        return typeof HTMLElement === "object" ? val instanceof HTMLElement : val && typeof val === "object" && val !== null && val.nodeType === 1 && typeof val.nodeName === "string";
    }
    /**
     * 判断是否为checkbox
     */
    function isCheckBox(ele) {
        return isElement(ele) && ele.type && ele.type === "checkbox";
    }
    /**
     * 判断是否为数组
     */
    function isArray(val) {
        return Object.prototype.toString.call(val) === "[object Array]";
    }
    /**
     * 判断是否为字符串
     */
    function isString(val) {
        return typeof (val) === "string";
    }
    /**
     * 判断是否为object
     */
    function isObject(val) {
        return typeof (val) === "object";
    }

    var _xcheck = function (ops) {
        ops = $.extend({}, defaults, ops || {});
        ops.checkItemClass += ops.groupClass;
        ops.checkAllClass += ops.groupClass;
        ops.clearCheckClass += ops.groupClass;
        ops.reverseCheckClass += ops.groupClass;
        ops.valueClass += ops.groupClass;

        var $body = $("body");

        var selectInfo = new SelectedBaseInfo();

        /**
         * 判断是否全选了
         */
        var _isAllChecked = function () {
            var $checkItem = $(ops.checkItemClass);
            return $checkItem.not(":checked").length === 0;
        };

        /**
         * 获取选择的结果值
         */
        var _getValues = function () {
            var val = $(ops.valueClass).attr("value");
            return ops.isHoldCheckState ? JSON.parse(val || "{}") : val;
        };
        /**
         * 设置选择的结果值
         */
        var _setValues = function (values) {

            var $val = $(ops.valueClass);
            if (ops.isHoldCheckState && isObject(values)) {
                $val.attr("value", JSON.stringify(selectInfo));
            } else if (isString(values)) {
                $val.attr("value", values);
            } else if (isArray(values)) {
                $val.attr("value", values.toString());
            }

        };
        

        /**
         * 全选事件
         */
        var _checkAll = function () {
            var $checkItem = $(ops.checkItemClass);
            var _t = this;

            if (isCheckBox(_t)) {
                $checkItem.prop({ "checked": _t.checked });
            } else {
                $checkItem.prop({ "checked": true });
            }
            _setValues();
        };
        /**
         * 清空事件
         */
        var _clearCheck = function () {
            var $checkItem = $(ops.checkItemClass), $checkAll = $(ops.checkAllClass);
            $checkItem.prop({ "checked": false });
            $checkAll.prop({ "checked": false });
            _setValues();
        };
        /**
         * 反选事件
         */
        var _reverseCheck = function () {
            var $checkItem = $(ops.checkItemClass), $checkAll = $(ops.checkAllClass);
            $checkItem.each(function () {
                this.checked = !this.checked;
            });
            $checkAll.prop({ "checked": _isAllChecked() });
            _setValues();
        };
        /**
         * 选择每一项的事件
         */
        var _checkItem = function () {
            var $checkAll = $(ops.checkAllClass);
            $checkAll.prop({ "checked": _isAllChecked() });
            _setValues();
        };

        
        

        /**
         * 全选事件绑定
         */
        $body.on("click", ops.checkAllClass, function () {
            if (ops.beforeCheckAll.call(this) !== false) {
                _checkAll.call(this);
            }
            ops.afterCheckAll.call(this);
        });
        /**
         * 清空事件绑定
         */
        $body.on("click", ops.clearCheckClass, function () {
            if (ops.beforeClearCheck.call(this) !== false) {
                _clearCheck.call(this);
            }
            ops.afterClearCheck.call(this);
        });
        /**
         * 反选事件绑定
         */
        $body.on("click", ops.reverseCheckClass, function () {
            if (ops.beforeReverseCheck.call(this) !== false) {
                _reverseCheck.call(this);
            }
            ops.afterReverseCheck.call(this);
        });
        /**
         * 选择每一项的事件绑定
         */
        $body.on("click", ops.checkItemClass, function () {
            if (ops.beforeCheckItem.call(this) !== false) {
                _checkItem.call(this);
            }
            ops.afterCheckItem.call(this);
        });
        


        /**
         * 公开方法
         */
        return {
            /**
             * 全选回调函数
             */
            checkAll: _checkAll,
            /**
             * 清空选择回调函数
             */
            clearCheck: _clearCheck,
            /**
             * 反选回调函数
             */
            reverseCheck: _reverseCheck,
            /**
             * 获取到当前已选项的value
             */
            getValues: _getValues,
            /**
             * 初始化选中项
             */
            setValues: function (values) {

            }
        };

    };



    /**
     * jquery扩展
     */
    $.extend({
        XCheck: _xcheck
    });

})(window, jQuery);
