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
var gh_checkbox_1 = __importDefault(require("gh-checkbox"));
require("./TreeView.css");
var TreeNode = (function (_super) {
    __extends(TreeNode, _super);
    function TreeNode(props) {
        var _this = _super.call(this, props) || this;
        var node = props.node, checked = props.checked, defaultCollapsed = props.defaultCollapsed;
        var itemsCount = (node && node.children) ? node.children.length : 0;
        _this.state = {
            node: node,
            collapsed: (defaultCollapsed !== undefined) ? defaultCollapsed : true,
            checked: checked || false,
            shouldUpdateData: false,
            subItemsCount: itemsCount,
        };
        _this.handleCollapsed = _this.handleCollapsed.bind(_this);
        _this.handleCheck = _this.handleCheck.bind(_this);
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleSubItemChecked = _this.handleSubItemChecked.bind(_this);
        _this.handleSubItemFocus = _this.handleSubItemFocus.bind(_this);
        return _this;
    }
    TreeNode.getDerivedStateFromProps = function (nextProps, prevState) {
        if (nextProps.node !== prevState.node) {
            var node = nextProps.node;
            var itemsCount = (node && node.children) ? node.children.length : 0;
            return {
                node: nextProps.node,
                checked: nextProps.checked,
                shouldUpdateData: true,
                subItemsCount: itemsCount,
            };
        }
        else if (nextProps.forcecollapseAll || nextProps.forceExpandAll) {
            var collapsed = nextProps.forcecollapseAll || (prevState.collapsed && !nextProps.forceExpandAll);
            return {
                collapsed: collapsed,
            };
        }
        else {
            return null;
        }
    };
    TreeNode.prototype.componentDidMount = function () {
        if (this.nodeDOM) {
            this.forceUpdate();
        }
    };
    TreeNode.prototype.componentDidUpdate = function () {
        var me = this;
        if (this.state.shouldUpdateData) {
            me.setState({
                shouldUpdateData: false,
            });
        }
    };
    TreeNode.prototype.getSelectedCount = function () {
        var node = this.props.node;
        var selctedCount = 0;
        if (node.children) {
            node.children.forEach(function (child) {
                if (typeof child.checked === 'boolean' && child.checked === true)
                    selctedCount += 1;
                else if (typeof child.checked === 'number' && child.checked === 2)
                    selctedCount += 0.5;
            });
        }
        return selctedCount;
    };
    TreeNode.prototype.selectAll = function (status, node) {
        var me = this;
        if (node) {
            node.checked = status;
            if (node.children) {
                node.children.forEach(function (child) {
                    me.selectAll(status, child);
                });
            }
        }
    };
    TreeNode.prototype.handleCollapsed = function () {
        this.setState({ collapsed: !this.state.collapsed });
    };
    TreeNode.prototype.handleCheck = function (status) {
        var _a = this.props, node = _a.node, onCheck = _a.onCheck;
        this.selectAll(status, node);
        this.setState({
            checked: status,
        });
        onCheck();
    };
    TreeNode.prototype.handleFocus = function () {
        var _a = this.props, node = _a.node, onFocus = _a.onFocus;
        onFocus(node);
    };
    TreeNode.prototype.handleSubItemChecked = function () {
        var _a = this.props, node = _a.node, onCheck = _a.onCheck;
        var count = this.getSelectedCount();
        var checkedStatus = false;
        if (count === this.state.subItemsCount)
            checkedStatus = true;
        else if (count)
            checkedStatus = 2;
        else
            checkedStatus = false;
        node.checked = checkedStatus;
        this.setState({
            checked: checkedStatus,
        });
        onCheck();
    };
    TreeNode.prototype.handleSubItemFocus = function (node) {
        var onFocus = this.props.onFocus;
        onFocus(node);
    };
    TreeNode.prototype.render = function () {
        var _this = this;
        var me = this;
        var _a = this.props, node = _a.node, defaultCollapsed = _a.defaultCollapsed, collapsible = _a.collapsible, forceExpandAll = _a.forceExpandAll, forcecollapseAll = _a.forcecollapseAll;
        var treeList = [];
        var collapsed = forcecollapseAll || (this.state.collapsed && !forceExpandAll);
        var iconClassName = classnames_1.default('treeNode_arrow', {
            collapsed: (node.children && node.children.length && collapsed),
            expanded: (node.children && node.children.length && !collapsed),
        });
        var collapseIcon = null;
        var checkbox = null;
        var icon = null;
        var item = null;
        if (this.state.shouldUpdateData) {
            if (this.state.checked !== undefined && typeof this.state.checked === 'boolean') {
                this.selectAll(this.state.checked, node);
            }
        }
        if (collapsible) {
            collapseIcon = (react_1.default.createElement("div", { role: "button", tabIndex: 0, className: iconClassName, onClick: this.handleCollapsed, onKeyPress: this.handleCollapsed }));
        }
        if (this.props.hasCheckbox && !node.noCheckbox) {
            if (this.nodeDOM) {
                checkbox = (react_1.default.createElement(gh_checkbox_1.default, { id: node.id, name: node.name, width: this.nodeDOM.offsetWidth - 16 - 6, checked: this.state.checked, onChange: this.handleCheck }));
            }
            else {
                checkbox = (react_1.default.createElement(gh_checkbox_1.default, { id: node.id, name: node.name, checked: this.state.checked, onChange: this.handleCheck }));
            }
        }
        else {
            item = (react_1.default.createElement("div", { className: classnames_1.default('treeNode_name'), onClick: this.handleFocus }, node.name));
        }
        if (node.icon) {
            icon = (react_1.default.createElement("div", { className: classnames_1.default(node.icon, 'treeNode_icon') }));
        }
        if (node && node.children) {
            node.children.forEach(function (child) {
                treeList.push(react_1.default.createElement(TreeNode, { node: child, key: child.index || child.id, hasCheckbox: me.props.hasCheckbox, checked: child.checked, defaultCollapsed: defaultCollapsed, forceExpandAll: forceExpandAll, forcecollapseAll: forcecollapseAll, onCheck: me.handleSubItemChecked, onFocus: me.handleSubItemFocus }));
            });
        }
        return (react_1.default.createElement("div", { className: classnames_1.default('treeView_treeNode'), key: node.index || node.id },
            react_1.default.createElement("div", { className: classnames_1.default('treeView_treeNode_item'), ref: function (dom) { _this.nodeDOM = dom; } },
                collapseIcon,
                icon,
                checkbox,
                item),
            (treeList.length && !collapsed)
                ?
                    (react_1.default.createElement("div", { className: classnames_1.default('treeView_treeNode_children') }, treeList))
                :
                    null));
    };
    TreeNode.defaultProps = {
        defaultCollapsed: true,
        collapsible: true,
        forceExpandAll: false,
        forcecollapseAll: false,
    };
    return TreeNode;
}(react_1.default.Component));
exports.default = TreeNode;
//# sourceMappingURL=TreeNode.js.map