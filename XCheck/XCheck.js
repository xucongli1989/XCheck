/**
 * ******************************************************************************************
 * 1：基本信息：
 * 开源协议：https://github.com/xucongli1989/XCheck/blob/master/LICENSE
 * 项目地址：https://github.com/xucongli1989/XCheck
 * 电子邮件：80213876@qq.com
 ********************************************************************************************
 * 2：使用说明：
 *                      本插件支持单页及多页的全选、反选、清空选择
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
         * 是否为【保持选择】的场景（比如ajax翻页多选）
         */
        isKeep: false,
        /**
         * 【组】的class
         */
        groupClass: ".xcheckgroup",
        /**
         * 【要选择的每一项】的class
         */
        checkItemClass: ".checkItem",
        /**
         * 【全选所有】的class
         */
        checkAllClass: ".checkAll",
        /**
         * 【全选当页】的class
         */
        checkAllCurrentClass: ".checkAllCurrent",
        /**
         * 【清空所有选择】的class
         */
        clearCheckClass: ".clearCheck",
        /**
         * 【清空当页选择】的class
         */
        clearCheckCurrentClass: ".clearCheckCurrent",
        /**
         * 【反选当页】的class
         */
        reverseCheckCurrentClass: ".reverseCheckCurrent",
        /**
         * 【存放已选值】的class
         */
        valueClass: ".checkAll",
        /**
         * 【存放已选值】的属性
         */
        valueAttr: "value",
        
        
        /**
         * 【全选所有】前回调函数，如果返回false，则不执行默认的【全选所有】的事件
         */
        beforeCheckAll: function () { },
        /**
         * 【全选所有】后的回调函数
         */
        afterCheckAll: function () { },
        
        
        /**
         * 【全选当页】前的回调函数，如果返回false，则不执行默认的【全选当页】事件
         */
        beforeCheckAllCurrent: function () { },
        /**
         * 【全选当页】后的回调函数
         */
        afterCheckAllCurrent: function () { },        
        
        
        /**
         * 【选择具体项】前回调函数，如果返回false，则不执行默认的【选择具体项】的事件
         */
        beforeCheckItem: function () { },
        /**
         * 【选择具体项】后回调函数
         */
        afterCheckItem: function () { },
        
        
        /**
         * 【清空选择所有】之前的回调函数，如果返回false，则不执行默认的【清空选择所有】的事件
         */
        beforeClearCheck: function () { },
        /**
         * 【清空选择所有】之后的回调函数
         */
        afterClearCheck: function () { },
        
        
        /**
         * 【清空选择当前页】之前的回调函数，如果返回false，则不执行默认的【清空选择当前页】的事件
         */
        beforeClearCheckCurrent: function () { },
        /**
         * 【清空选择当前页】之后的回调函数
         */
        afterClearCheckCurrent: function () { },
        
        
        
        
        /**
         * 【反选当页】前的回调函数，如果返回false，则不执行默认的【反选当页】事件
         */
        beforeReverseCheckCurrent: function () { },
        /**
         * 【反选当页】后的回调函数
         */
        afterReverseCheckCurrent: function () { }
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
        ops.checkAllCurrentClass += ops.groupClass;
        ops.clearCheckClass += ops.groupClass;
        ops.clearCheckCurrentClass += ops.groupClass;
        ops.reverseCheckCurrentClass += ops.groupClass;
        ops.valueClass += ops.groupClass;

        var $body = $("body");

        var selectInfo = new SelectedBaseInfo();
        
        
        //获取所有【要选择的每一项】的jquery对象
        var _getCheckItem = function () {
            return $(ops.checkItemClass);
        };
        //获取所有【全选所有】的jquery对象
        var _getCheckAll = function () {
            return $(ops.checkAllClass);
        };
        //获取所有【全选当页】的jquery对象
        var _getCheckAllCurrent = function () {
            return $(ops.checkAllCurrentClass);
        };
        //获取或设置已选结果值
        var _getOrSetValue = function (v) {
            var $val = $(ops.valueClass);
            if (!v) {
                return ops.isKeep ? JSON.parse($val.attr(ops.valueAttr) || "{}") : $val.attr(ops.valueAttr);
            }
            if (ops.isKeep && isObject(v)) {
                $val.attr(ops.valueAttr, JSON.stringify(v));
            } else {
                $val.attr(ops.valueAttr, v);
            }
        };
        
        

        /**
         * 判断是否全选了
         */
        var _isAllChecked = function () {

            if (ops.isKeep) {
                return selectInfo.isCheckAll && selectInfo.unSelectedValues.length === 0;
            } else {
                return _getCheckItem().not(":checked").length === 0;
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
