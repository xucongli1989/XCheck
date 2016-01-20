; (function (window, $, undefined) {
   
    /**
     * 默认选项
     */
    var defaults = {
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
        reverseCheckClass: ".reverseCheck"
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

    var _xcheck = function (ops) {
        ops = $.extend({}, defaults, ops || {});
        ops.checkItemClass += ops.groupClass;
        ops.checkAllClass += ops.groupClass;
        ops.clearCheckClass += ops.groupClass;
        ops.reverseCheckClass += ops.groupClass;

        var $body = $("body");

        /**
         * 判断是否全选了
         */
        var _isAllChecked = function () {
            var $checkItem = $(ops.checkItemClass);
            return $checkItem.not(":checked").length === 0;
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

        };
        /**
         * 清空事件
         */
        var _clearCheck = function () {
            var $checkItem = $(ops.checkItemClass), $checkAll = $(ops.checkAllClass);
            $checkItem.prop({ "checked": false });
            $checkAll.prop({ "checked": false });
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
        };
        /**
         * 选择每一项的事件
         */
        var _checkItem = function () {
            var $checkAll = $(ops.checkAllClass);
            $checkAll.prop({ "checked": _isAllChecked() });
        };

        /**
         * 全选事件绑定
         */
        $body.on("click", ops.checkAllClass, function () {
            _checkAll.call(this);
        });
        /**
         * 清空事件绑定
         */
        $body.on("click", ops.clearCheckClass, function () {
            _clearCheck.call(this);
        });
        /**
         * 反选事件绑定
         */
        $body.on("click", ops.reverseCheckClass, function () {
            _reverseCheck.call(this);
        });
        /**
         * 选择每一项的事件绑定
         */
        $body.on("click", ops.checkItemClass, function () {
            _checkItem.call(this);
        });
        


        /**
         * 公开方法
         */
        return {
            /**
             * 全选
             */
            checkAll: _checkAll,
            /**
             * 清空选择
             */
            clearCheck: _clearCheck,
            /**
             * 反选
             */
            reverseCheck: _reverseCheck
        };

    };



    /**
     * jquery扩展
     */
    $.extend({
        XCheck: _xcheck
    });

})(window, jQuery);
