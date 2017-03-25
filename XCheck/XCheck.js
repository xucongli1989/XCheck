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
 * 当前版本：v1.1
 * 更新时间：2017-03-25
 */
; (function (window, $, undefined) {

    "use strict";
   
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
        valueClass: ".xcheckValue",
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
    SelectedBaseInfo.prototype.reset = function () {
        this.isCheckAll = false;
        this.selectedValues = [];
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
        ops.selectInfo=new SelectedBaseInfo();

        var $body = $("body");

        var selectVal = [];
        var selectInfo = ops.selectInfo;
        
        
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
        var _val = function (v) {
            var $val = $(ops.valueClass);
            if (arguments.length === 0) {
                return ops.isKeep ? JSON.parse($val.attr(ops.valueAttr) || null) : $val.attr(ops.valueAttr);
            }
            if (ops.isKeep) {
                if (!isObject(v)) {
                    throw "the v must be a SelectedBaseInfo object!";
                }
                $val.attr(ops.valueAttr, JSON.stringify(v));
            } else {
                if (!isString(v || "")) {
                    throw "the v must be a string!";
                }
                $val.attr(ops.valueAttr, v);
            }
        };
        /**
         * 根据指定的结果值，初始化插件状态
         */
        var _initVal = function (v) {

            if (!v) {
                return;
            }

            var $checkItem = _getCheckItem(), $checkAll = _getCheckAll(), $checkAllCurrent = _getCheckAllCurrent();
            var filterStr = [];
            var arr = [];
            //设置值
            _val(v);
            //初始化checkbox选中状态
            if (ops.isKeep) {

                $checkItem.prop("checked", v.isCheckAll);
                $checkAll.prop("checked", v.isCheckAll);
                $checkAllCurrent.prop("checked", v.isCheckAll);

                if (v.isCheckAll) {

                    if (v.unSelectedValues.length > 0) {
                        filterStr = [];
                        $.each(v.unSelectedValues, function (idx, n) {
                            filterStr.push("[value='" + n + "']");
                        });
                        $checkItem.filter(filterStr.join(',')).prop("checked", false);
                    }

                }

                if (!v.isCheckAll) {

                    if (v.selectedValues.length > 0) {
                        filterStr = [];
                        $.each(v.selectedValues, function (idx, n) {
                            filterStr.push("[value='" + n + "']");
                        });
                        $checkItem.filter(filterStr.join(',')).prop("checked", true);
                    }

                }


            }

            if (!ops.isKeep) {
                arr = v.split(',');
                if (arr.length > 0) {
                    filterStr = [];
                    $.each(arr, function (idx, n) {
                        filterStr.push("[value='" + n + "']");
                    });
                    $checkItem.filter(filterStr.join(',')).prop("checked", true);
                }

            }

            _getCheckAllCurrent().prop({ "checked": $checkItem.not(":checked").length === 0 });

        };
        
        
        /****************************************事件处理  begin******************************************/

        /**
         * 根据checkbox对象，将其选中状态更新到结果值中
         */
        var _pushVal = function (obj) {

            var ischecked = obj.checked, v = obj.value;

            if (ops.isKeep) {
                //【全选所有】时
                if (selectInfo.isCheckAll) {
                    if (ischecked) {
                        selectInfo.unSelectedValues = $.map(selectInfo.unSelectedValues, function (n) {
                            return n === v ? null : n;
                        });
                    } else {
                        selectInfo.unSelectedValues.push(v);
                    }
                }
            
                //不是【全选所有】时
                if (!selectInfo.isCheckAll) {
                    if (ischecked) {
                        selectInfo.selectedValues.push(v);
                    } else {
                        selectInfo.selectedValues = $.map(selectInfo.selectedValues, function (n) {
                            return n === v ? null : n;
                        });
                    }
                }

                selectInfo.selectedValues = $.unique(selectInfo.selectedValues.sort());
                selectInfo.unSelectedValues = $.unique(selectInfo.unSelectedValues.sort());

                _val(selectInfo);
            } else {

                if (ischecked) {
                    selectVal.push(v);
                } else {
                    selectVal = $.map(selectVal, function (n) {
                        return n === v ? null : n;
                    });
                }

                selectVal = $.unique(selectVal.sort());

                _val(selectVal.join(','));
            }

        };
        
        
        /**
         * 【要选择的每一项】事件，this为checkbox
         */
        var _checkItem = function () {

            _getCheckAllCurrent().prop({ "checked": _getCheckItem().not(":checked").length == 0 });

            _pushVal(this);
        };

        /**
         * 【全选所有】事件，this可以为checkbox或其它
         */
        var _checkAll = function () {

            if (!ops.isKeep) {
                throw "call [checkAll] method,must be set 'isKeep' value is true!";
            }

            selectInfo.isCheckAll = true;
            selectInfo.selectedValues = [];
            selectInfo.unSelectedValues = [];

            _getCheckItem().prop("checked", true);
            _getCheckAll().prop("checked", true);
            _getCheckAllCurrent().prop({ "checked": true });

            if (isCheckBox(this)) {
                _pushVal(this);
            } else {
                _pushVal({
                    checked: true
                });
            }
        };
        
        /**
         * 【全选当页】事件,this为事件源，当this为checked时，当页全选，否则，当页不选。
         */
        var _checkAllCurrent = function () {
            var _t = this, $ck = _getCheckItem();
            if (isCheckBox(_t)) {
                $ck.prop({ "checked": _t.checked });
            } else {
                $ck.prop({ "checked": true });
            }
            $ck.each(function () {
                _pushVal(this);
            });
        };
        
        
        
        /**
         * 【清空所有选择】事件，this为事件源
         */
        var _clearCheck = function () {

            if (!ops.isKeep) {
                throw "call [clearCheck] method,must be set 'isKeep' value is true!";
            }

            selectInfo.reset();
            _getCheckItem().prop("checked", false);
            _getCheckAll().prop("checked", false);
            _getCheckAllCurrent().prop({ "checked": false });
            _pushVal({});
        };
        /**
         * 【清空当页选择】事件，this为事件源
         */
        var _clearCheckCurrent = function () {
            var $ck = _getCheckItem().prop("checked", false);
            _getCheckAllCurrent().prop({ "checked": false });
            $ck.each(function () {
                _pushVal(this);
            });
        };
        
        /**
         * 【反选当页】事件，this为事件源
         */
        var _reverseCheckCurrent = function () {
            var $ck = _getCheckItem();
            $ck.each(function () {
                this.checked = !this.checked;
            });
            _getCheckAllCurrent().prop({ "checked": $ck.not(":checked").length == 0 });
            $ck.each(function () {
                _pushVal(this);
            });
        };
        
        /********************************************事件绑定 开始**********************************************************/
        
        /**
         *【要选择的每一项】事件绑定
         */
        $body.on("click", ops.checkItemClass, function () {
            if (ops.beforeCheckItem.call(this) !== false) {
                _checkItem.call(this);
            }
            ops.afterCheckItem.call(this);
        });
        /**
         * 【全选所有】事件绑定
         */
        $body.on("click", ops.checkAllClass, function () {
            if (ops.beforeCheckAll.call(this) !== false) {
                _checkAll.call(this);
            }
            ops.afterCheckAll.call(this);
        });
        /**
         * 【全选当页】事件绑定
         */
        $body.on("click", ops.checkAllCurrentClass, function () {
            if (ops.beforeCheckAllCurrent.call(this) !== false) {
                _checkAllCurrent.call(this);
            }
            ops.afterCheckAllCurrent.call(this);
        });
        /**
         * 【清空所有选择】事件绑定
         */
        $body.on("click", ops.clearCheckClass, function () {
            if (ops.beforeClearCheck.call(this) !== false) {
                _clearCheck.call(this);
            }
            ops.afterClearCheck.call(this);
        });
        /**
         * 【清空当页选择】事件绑定
         */
        $body.on("click", ops.clearCheckCurrentClass, function () {
            if (ops.beforeClearCheckCurrent.call(this) !== false) {
                _clearCheckCurrent.call(this);
            }
            ops.afterClearCheckCurrent.call(this);
        });
        /**
         * 【反选当页】事件绑定
         */
        $body.on("click", ops.reverseCheckCurrentClass, function () {
            if (ops.beforeReverseCheckCurrent.call(this) !== false) {
                _reverseCheckCurrent.call(this);
            }
            ops.afterReverseCheckCurrent.call(this);
        });
        
        
        
        
        


        /**
         * 公开方法
         */
        return {
            /**
             * 获取或设置结果值
             */
            val: _val,
            /**
             * 根据指定的结果值，初始化插件状态
             */
            initVal: _initVal,
            /**
             * 当前选项options
             */
            options:ops
        };

    };



    /**
     * jquery扩展
     */
    $.extend({
        XCheck: _xcheck
    });

})(window, jQuery);
