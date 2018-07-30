"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var classnames_1 = __importDefault(require("classnames"));
var gh_1 = __importDefault(require("gh"));
var gh_checkbox_1 = __importDefault(require("gh-checkbox"));
require("gh-icon.css");
var TreeNode_1 = __importDefault(require("./TreeNode"));
require("./TreeView.css");
var TreeView = (function (_super) {
    __extends(TreeView, _super);
    function TreeView(props) {
        var _this = _super.call(this, props) || this;
        _this.treeData = (props.data) ? gh_1.default.clone(props.data) : null;
        if (_this.treeData) {
            _this.treeData.forEach(function (node) {
                _this.fixCheckStatus(node);
            });
        }
        var itemCount = (_this.treeData) ? _this.treeData.length : 0;
        var selectedCount = _this.getSelectedCount();
        var checked = false;
        if (selectedCount === itemCount)
            checked = true;
        else if (selectedCount)
            checked = 2;
        else
            checked = false;
        _this.state = {
            data: props.data,
            checked: checked || false,
            collapseAll: false,
            expandAll: false,
            shouldUpdateData: false,
            subItemsCount: itemCount,
        };
        _this.handleOnCheck = _this.handleOnCheck.bind(_this);
        _this.handleOnFocus = _this.handleOnFocus.bind(_this);
        _this.handleOnSelectAll = _this.handleOnSelectAll.bind(_this);
        _this.handleOnShrink = _this.handleOnShrink.bind(_this);
        _this.handleOnExpand = _this.handleOnExpand.bind(_this);
        return _this;
    }
    TreeView.getDerivedStateFromProps = function (nextProps, prevState) {
        if (!gh_1.default.isEquivalent(nextProps.data, prevState.data)) {
            return {
                data: nextProps.data,
                shouldUpdateData: true,
            };
        }
        else {
            return null;
        }
    };
    TreeView.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (nextState.shouldUpdateData) {
            var me_1 = this;
            this.treeData = (nextProps.data) ? gh_1.default.clone(nextProps.data) : null;
            if (this.treeData) {
                this.treeData.forEach(function (node) {
                    me_1.fixCheckStatus(node);
                });
                this.updateSelectAllStatus(this.treeData);
            }
            return true;
        }
        else if (nextState.collapseAll !== this.state.collapseAll || nextState.expandAll !== this.state.expandAll) {
            return true;
        }
        else {
            return false;
        }
    };
    TreeView.prototype.componentDidUpdate = function () {
        var me = this;
        if (this.state.collapseAll || this.state.expandAll || this.state.shouldUpdateData) {
            me.setState({
                collapseAll: false,
                expandAll: false,
                shouldUpdateData: false,
            });
        }
    };
    TreeView.prototype.getSelectedCount = function () {
        var selctedCount = 0;
        if (this.treeData) {
            this.treeData.forEach(function (node) {
                if (node.checked === true)
                    selctedCount += 1;
                else if (node.checked === 2)
                    selctedCount += 0.5;
            });
        }
        return selctedCount;
    };
    TreeView.prototype.selectAll = function (data, status) {
        var _this = this;
        if (data) {
            data.forEach(function (node) {
                node.checked = status;
                if (node.children && node.children.length) {
                    _this.selectAll(node.children, status);
                }
            });
        }
    };
    TreeView.prototype.handleOnCheck = function () {
        var count = this.getSelectedCount();
        var checkedStatus = false;
        if (count === this.state.subItemsCount)
            checkedStatus = true;
        else if (count)
            checkedStatus = 2;
        else
            checkedStatus = false;
        this.setState({
            checked: checkedStatus,
        });
        this.props.onCheck(this.treeData);
    };
    TreeView.prototype.handleOnFocus = function (node) {
        this.props.onFocus(node);
    };
    TreeView.prototype.handleOnSelectAll = function () {
        var onCheck = this.props.onCheck;
        var selectAll = (typeof this.state.checked === 'number' && this.state.checked === 2) ? false : !this.state.checked;
        this.selectAll(this.treeData, selectAll);
        this.setState({
            checked: selectAll,
        });
        onCheck(this.treeData);
    };
    TreeView.prototype.handleOnShrink = function () {
        this.setState({
            collapseAll: true,
        });
    };
    TreeView.prototype.handleOnExpand = function () {
        this.setState({
            expandAll: true,
        });
    };
    TreeView.prototype.fixCheckStatus = function (node) {
        if (node.children) {
            for (var i = 0; i < node.children.length; i += 1) {
                var child = node.children[i];
                if (child.children && child.children.length) {
                    this.fixCheckStatus(child);
                }
            }
            var checked = false;
            var checkedCount_1 = 0;
            node.children.forEach(function (child) {
                if (child.checked === true)
                    checkedCount_1 += 1;
                else if (child.checked === 2)
                    checkedCount_1 += 0.5;
            });
            if (checkedCount_1 === node.children.length)
                checked = true;
            else if (checkedCount_1)
                checked = 2;
            else
                checked = false;
            node.checked = checked;
        }
    };
    TreeView.prototype.updateSelectAllStatus = function (data) {
        var itemCount = (data) ? data.length : 0;
        var selectedCount = this.getSelectedCount();
        var checked = false;
        if (selectedCount === itemCount)
            checked = true;
        else if (selectedCount)
            checked = 2;
        else
            checked = false;
        this.setState({
            checked: checked,
            subItemsCount: itemCount,
        });
    };
    TreeView.prototype.render = function () {
        var _this = this;
        var me = this;
        var _a = this.props, collapsed = _a.collapsed, hasCheckbox = _a.hasCheckbox, hasSelectAll = _a.hasSelectAll, hasCollapseController = _a.hasCollapseController, isMultiLevel = _a.isMultiLevel, width = _a.width;
        var treeList = [];
        var toolBar = null;
        if (this.treeData && this.treeData.length) {
            if (hasSelectAll || hasCollapseController) {
                toolBar = (react_1.default.createElement("div", { className: "treeView_toolBar" },
                    (hasSelectAll)
                        ?
                            (react_1.default.createElement(gh_checkbox_1.default, { id: "selectAll", name: "Select All", checked: this.state.checked, onChange: this.handleOnSelectAll }))
                        :
                            null,
                    (hasCollapseController)
                        ?
                            (react_1.default.createElement("i", { className: "icon-shrink treeView_toolBar_button", role: "button", tabIndex: 0, onClick: this.handleOnShrink, onKeyPress: this.handleOnShrink }))
                        :
                            null,
                    (hasCollapseController)
                        ?
                            (react_1.default.createElement("i", { className: "icon-expand treeView_toolBar_button", role: "button", tabIndex: 0, onClick: this.handleOnExpand, onKeyPress: this.handleOnExpand }))
                        :
                            null));
            }
        }
        if (this.treeData) {
            this.treeData.forEach(function (node) {
                treeList.push(react_1.default.createElement(TreeNode_1.default, { node: node, key: node.index || node.id, defaultCollapsed: collapsed, collapsible: isMultiLevel, hasCheckbox: hasCheckbox, forceExpandAll: _this.state.expandAll, forcecollapseAll: _this.state.collapseAll, checked: node.checked, onCheck: me.handleOnCheck, onFocus: me.handleOnFocus }));
            });
        }
        return (react_1.default.createElement("div", { className: classnames_1.default('treeView'), style: {
                width: (typeof width === 'number' || (typeof width === 'string' && width.indexOf('px') === -1)) ? width + "px" : width,
            } },
            react_1.default.createElement("div", { className: classnames_1.default('treeView_content') },
                toolBar,
                treeList)));
    };
    TreeView.defaultProps = {
        collapsed: true,
        hasCollapseController: false,
        isMultiLevel: true,
        width: '100%',
    };
    return TreeView;
}(react_1.default.Component));
exports.default = TreeView;
//# sourceMappingURL=TreeView.js.map