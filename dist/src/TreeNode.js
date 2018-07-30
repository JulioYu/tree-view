"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const classnames_1 = __importDefault(require("classnames"));
const checkbox_1 = __importDefault(require("checkbox"));
require("./TreeView.css");
class TreeNode extends react_1.default.Component {
    constructor(props) {
        super(props);
        const { node, checked, defaultCollapsed } = props;
        const itemsCount = (node && node.children) ? node.children.length : 0;
        this.state = {
            node,
            collapsed: (defaultCollapsed !== undefined) ? defaultCollapsed : true,
            checked: checked || false,
            shouldUpdateData: false,
            subItemsCount: itemsCount,
        };
        this.handleCollapsed = this.handleCollapsed.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleSubItemChecked = this.handleSubItemChecked.bind(this);
        this.handleSubItemFocus = this.handleSubItemFocus.bind(this);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.node.checked !== prevState.checked && !prevState.shouldUpdateData) {
            const { node } = nextProps;
            const itemsCount = (node && node.children) ? node.children.length : 0;
            return {
                node: nextProps.node,
                checked: nextProps.checked,
                shouldUpdateData: true,
                subItemsCount: itemsCount,
            };
        }
        else if (nextProps.forcecollapseAll || nextProps.forceExpandAll) {
            const collapsed = nextProps.forcecollapseAll || (prevState.collapsed && !nextProps.forceExpandAll);
            return {
                collapsed,
            };
        }
        else {
            return null;
        }
    }
    componentDidMount() {
        if (this.nodeDOM) {
            this.forceUpdate();
        }
    }
    componentDidUpdate() {
        const me = this;
        if (this.state.shouldUpdateData) {
            me.setState({
                shouldUpdateData: false,
            });
        }
    }
    getSelectedCount() {
        const { node } = this.props;
        let selctedCount = 0;
        if (node.children) {
            node.children.forEach((child) => {
                if (typeof child.checked === 'boolean' && child.checked === true)
                    selctedCount += 1;
                else if (typeof child.checked === 'number' && child.checked === 2)
                    selctedCount += 0.5;
            });
        }
        return selctedCount;
    }
    selectAll(status, node) {
        const me = this;
        if (node) {
            node.checked = status;
            if (node.children) {
                node.children.forEach((child) => {
                    me.selectAll(status, child);
                });
            }
        }
    }
    handleCollapsed() {
        this.setState({ collapsed: !this.state.collapsed });
    }
    handleCheck(status) {
        const { node, onCheck } = this.props;
        this.selectAll(status, node);
        this.setState({
            checked: status,
        });
        onCheck();
    }
    handleFocus() {
        const { node, onFocus } = this.props;
        onFocus(node);
    }
    handleSubItemChecked() {
        const { node, onCheck } = this.props;
        const count = this.getSelectedCount();
        let checkedStatus = false;
        if (count === this.state.subItemsCount)
            checkedStatus = true;
        else if (count)
            checkedStatus = 2;
        else
            checkedStatus = false;
        node.checked = checkedStatus;
        this.setState({
            checked: checkedStatus,
            shouldUpdateData: true,
        });
        onCheck();
    }
    handleSubItemFocus(node) {
        const { onFocus } = this.props;
        onFocus(node);
    }
    render() {
        const me = this;
        const { node, defaultCollapsed, collapsible, forceExpandAll, forcecollapseAll, } = this.props;
        const treeList = [];
        const collapsed = forcecollapseAll || (this.state.collapsed && !forceExpandAll);
        const iconClassName = classnames_1.default('treeNode_arrow', {
            collapsed: (node.children && node.children.length && collapsed),
            expanded: (node.children && node.children.length && !collapsed),
        });
        let collapseIcon = null;
        let checkbox = null;
        let icon = null;
        let item = null;
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
                checkbox = (react_1.default.createElement(checkbox_1.default, { id: node.id, name: node.name, width: this.nodeDOM.offsetWidth - 16 - 6, checked: this.state.checked, onChange: this.handleCheck }));
            }
            else {
                checkbox = (react_1.default.createElement(checkbox_1.default, { id: node.id, name: node.name, checked: this.state.checked, onChange: this.handleCheck }));
            }
        }
        else {
            item = (react_1.default.createElement("div", { className: classnames_1.default('treeNode_name'), onClick: this.handleFocus }, node.name));
        }
        if (node.icon) {
            icon = (react_1.default.createElement("div", { className: classnames_1.default(node.icon, 'treeNode_icon') }));
        }
        if (node && node.children) {
            node.children.forEach((child) => {
                treeList.push(react_1.default.createElement(TreeNode, { node: child, key: child.index || child.id, hasCheckbox: me.props.hasCheckbox, checked: child.checked, defaultCollapsed: defaultCollapsed, forceExpandAll: forceExpandAll, forcecollapseAll: forcecollapseAll, onCheck: me.handleSubItemChecked, onFocus: me.handleSubItemFocus }));
            });
        }
        return (react_1.default.createElement("div", { className: classnames_1.default('treeView_treeNode'), key: node.index || node.id },
            react_1.default.createElement("div", { className: classnames_1.default('treeView_treeNode_item'), ref: (dom) => { this.nodeDOM = dom; } },
                collapseIcon,
                icon,
                checkbox,
                item),
            (treeList.length && !collapsed)
                ?
                    (react_1.default.createElement("div", { className: classnames_1.default('treeView_treeNode_children') }, treeList))
                :
                    null));
    }
}
TreeNode.defaultProps = {
    defaultCollapsed: true,
    collapsible: true,
    forceExpandAll: false,
    forcecollapseAll: false,
};
exports.default = TreeNode;
//# sourceMappingURL=TreeNode.js.map