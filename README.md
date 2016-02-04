# 简介
XCheck为checkbox 全选/反选功能的 jquery插件，支持多页情况下保存已选项的情况。
# 如何使用
- 引用jquery.js
- 引用XCheck.js
# 初始化
    <script type="text/javascript">
        $(function(){
            $.XCheck({
                groupClass:".xcheckgroup"
            });
        });
    </script>

# 属性及方法

属性：
<table>
<tr>
<td>属性名</td>
<td>类型</td>
<td>默认值</td>
<td>说明</td>
</tr>
<tr>
<td>isKeep</td>
<td>boolean</td>
<td>false</td>
<td>是否为【保持选择】的场景（比如ajax翻页多选）</td>
</tr>
<tr>
<td>groupClass</td>
<td>string</td>
<td>".xcheckgroup"</td>
<td>【组】的class</td>
</tr>
<tr>
<td>checkItemClass</td>
<td>string</td>
<td>".checkItem"</td>
<td>【要选择的每一项】的class</td>
</tr>
<tr>
<td>checkAllClass</td>
<td>string</td>
<td>".checkAll"</td>
<td>【全选所有】的class</td>
</tr>
<tr>
<td>checkAllCurrentClass</td>
<td>string</td>
<td>".checkAllCurrent"</td>
<td>【全选当页】的class</td>
</tr>
<tr>
<td>clearCheckClass</td>
<td>string</td>
<td>".clearCheck"</td>
<td>【清空所有选择】的class</td>
</tr>
<tr>
<td>clearCheckCurrentClass</td>
<td>string</td>
<td>".clearCheckCurrent"</td>
<td>【清空当页选择】的class</td>
</tr>
<tr>
<td>reverseCheckCurrentClass</td>
<td>string</td>
<td>".reverseCheckCurrent"</td>
<td>【反选当页】的class</td>
</tr>
<tr>
<td>valueClass</td>
<td>string</td>
<td>".xcheckValue"</td>
<td>【存放已选值】的class</td>
</tr>
<tr>
<td>valueAttr</td>
<td>string</td>
<td>"value"</td>
<td>【存放已选值】的属性</td>
</tr>
</table>


----------


事件：
<table>
<tr>
<td>beforeCheckAll</td>
<td>function</td>
<td>function () { }</td>
<td>【全选所有】前回调函数，如果返回false，则不执行默认的【全选所有】的事件</td>
</tr>
<tr>
<td>afterCheckAll</td>
<td>function</td>
<td>function () { }</td>
<td>【全选所有】后的回调函数</td>
</tr>
<tr>
<td>beforeCheckAllCurrent</td>
<td>function</td>
<td>function () { }</td>
<td>【全选当页】前的回调函数，如果返回false，则不执行默认的【全选当页】事件</td>
</tr>
<tr>
<td>afterCheckAllCurrent</td>
<td>function</td>
<td>function () { }</td>
<td>【全选当页】后的回调函数</td>
</tr>
<tr>
<td>beforeCheckItem</td>
<td>function</td>
<td>function () { }</td>
<td>【选择具体项】前回调函数，如果返回false，则不执行默认的【选择具体项】的事件</td>
</tr>
<tr>
<td>afterCheckItem</td>
<td>function</td>
<td>function () { }</td>
<td>【选择具体项】后回调函数</td>
</tr>
<tr>
<td>beforeClearCheck</td>
<td>function</td>
<td>function () { }</td>
<td>【清空选择所有】之前的回调函数，如果返回false，则不执行默认的【清空选择所有】的事件</td>
</tr>
<tr>
<td>afterClearCheck</td>
<td>function</td>
<td>function () { }</td>
<td>【清空选择所有】之后的回调函数</td>
</tr>
<tr>
<td>beforeClearCheckCurrent</td>
<td>function</td>
<td>function () { }</td>
<td>【清空选择当前页】之前的回调函数，如果返回false，则不执行默认的【清空选择当前页】的事件</td>
</tr>
<tr>
<td>afterClearCheckCurrent</td>
<td>function</td>
<td>function () { }</td>
<td>【清空选择当前页】之后的回调函数</td>
</tr>
<tr>
<td>beforeReverseCheckCurrent</td>
<td>function</td>
<td>function () { }</td>
<td>【反选当页】前的回调函数，如果返回false，则不执行默认的【反选当页】事件</td>
</tr>
<tr>
<td>afterReverseCheckCurrent</td>
<td>function</td>
<td>function () { }</td>
<td>【反选当页】后的回调函数</td>
</tr>

</table>


----------

公开方法
<table>
<tr>
<td>名称</td>
<td>说明</td>
</tr>
<tr>
<td>$.XCheck({...}).val(...)</td>
<td>获取或设置结果值</td>
</tr>
<tr>
<td>$.XCheck({...}).initVal(...)</td>
<td>根据指定的结果值，初始化插件状态</td>
</tr>
</table>


----------



isKeep==true时存放结果的**SelectedBaseInfo**对象：

<table>
<tr>
<td>属性名</td>
<td>类型</td>
<td>默认值</td>
<td>说明</td>
</tr>
<tr>
<td>isCheckAll</td>
<td>boolean</td>
<td>false</td>
<td>是否全部保持已选状态</td>
</tr>
<tr>
<td>selectedValues</td>
<td>array</td>
<td>[]</td>
<td>已选择项的值</td>
</tr>
<tr>
<td>unSelectedValues</td>
<td>array</td>
<td>[]</td>
<td>未选择项的值</td>
</tr>
</table>
1. 如果点了【全部选择】了，则每一页都默认选择了
2. 如果点了【全部选择】了，又取消勾选了部分选项，则当前的状态还是全选状态，只是会保留此时未选择的项
3. 如果没有点【全部选择】，则每次已选项的值都会存入已选项中

# Demo
[http://htmlpreview.github.io/?https://raw.githubusercontent.com/xucongli1989/XCheck/master/XCheck/demo.html](http://htmlpreview.github.io/?https://raw.githubusercontent.com/xucongli1989/XCheck/master/XCheck/demo.html)
# 预览图
![](https://raw.githubusercontent.com/xucongli1989/XCheck/master/XCheck/Imgs/1.jpg)