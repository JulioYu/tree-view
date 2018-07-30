"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const classnames_1 = __importDefault(require("classnames"));
const utility_1 = __importDefault(require("utility"));
const checkbox_1 = __importDefault(require("checkbox"));
require("icons");
const TreeNode_1 = __importDefault(require("./TreeNode"));
require("./TreeView.css");
class TreeView extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.treeData = (props.data) ? utility_1.default.clone(props.data) : null;
        if (this.treeData) {
            this.treeData.forEach((node) => {
                this.fixCheckStatus(node);
            });
        }
        const itemCount = (this.treeData) ? this.treeData.length : 0;
        const selectedCount = this.getSelectedCount();
        let checked = false;
        if (selectedCount === itemCount)
            checked = true;
        else if (selectedCount)
            checked = 2;
        else
            checked = false;
        this.state = {
            data: props.data,
            checked: checked || false,
            collapseAll: false,
            expandAll: false,
            shouldUpdateData: false,
            subItemsCount: itemCount,
        };
        this.handleOnCheck = this.handleOnCheck.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
        this.handleOnShrink = this.handleOnShrink.bind(this);
        this.handleOnExpand = this.handleOnExpand.bind(this);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (!utility_1.default.isEquivalent(nextProps.data, prevState.data)) {
            return {
                data: nextProps.data,
                shouldUpdateData: true,
            };
        }
        else {
            return null;
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.shouldUpdateData) {
            const me = this;
            this.treeData = (nextProps.data) ? utility_1.default.clone(nextProps.data) : null;
            if (this.treeData) {
                this.treeData.forEach((node) => {
                    me.fixCheckStatus(node);
                });
                this.updateSelectAllStatus(this.treeData);
            }
            return true;
        }
        else if (nextState.collapseAll !== this.state.collapseAll || nextState.expandAll !== this.state.expandAll) {
            return true;
        }
        else if (nextState.checked !== this.state.checked) {
            return true;
        }
        else {
            return false;
        }
    }
    componentDidUpdate() {
        const me = this;
        if (this.state.collapseAll || this.state.expandAll || this.state.shouldUpdateData) {
            me.setState({
                collapseAll: false,
                expandAll: false,
                shouldUpdateData: false,
            });
        }
    }
    getSelectedCount() {
        let selctedCount = 0;
        if (this.treeData) {
            this.treeData.forEach((node) => {
                if (node.checked === true)
                    selctedCount += 1;
                else if (node.checked === 2)
                    selctedCount += 0.5;
            });
        }
        return selctedCount;
    }
    selectAll(data, status) {
        if (data) {
            data.forEach((node) => {
                node.checked = status;
                if (node.children && node.children.length) {
                    this.selectAll(node.children, status);
                }
            });
        }
    }
    handleOnCheck() {
        const count = this.getSelectedCount();
        let checkedStatus = false;
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
    }
    handleOnFocus(node) {
        const { onFocus } = this.props;
        if (onFocus)
            onFocus(node);
    }
    handleOnSelectAll() {
        const { onCheck } = this.props;
        const selectAll = (typeof this.state.checked === 'number' && this.state.checked === 2) ? false : !this.state.checked;
        this.selectAll(this.treeData, selectAll);
        this.setState({
            checked: selectAll,
        });
        onCheck(this.treeData);
    }
    handleOnShrink() {
        this.setState({
            collapseAll: true,
        });
    }
    handleOnExpand() {
        this.setState({
            expandAll: true,
        });
    }
    fixCheckStatus(node) {
        if (node.children) {
            for (let i = 0; i < node.children.length; i += 1) {
                const child = node.children[i];
                if (child.children && child.children.length) {
                    this.fixCheckStatus(child);
                }
            }
            let checked = false;
            let checkedCount = 0;
            node.children.forEach((child) => {
                if (child.checked === true)
                    checkedCount += 1;
                else if (child.checked === 2)
                    checkedCount += 0.5;
            });
            if (checkedCount === node.children.length)
                checked = true;
            else if (checkedCount)
                checked = 2;
            else
                checked = false;
            node.checked = checked;
        }
    }
    updateSelectAllStatus(data) {
        const itemCount = (data) ? data.length : 0;
        const selectedCount = this.getSelectedCount();
        let checked = false;
        if (selectedCount === itemCount)
            checked = true;
        else if (selectedCount)
            checked = 2;
        else
            checked = false;
        this.setState({
            checked,
            subItemsCount: itemCount,
        });
    }
    render() {
        const me = this;
        const { collapsed, hasCheckbox, hasSelectAll, hasCollapseController, isMultiLevel, width, } = this.props;
        const treeList = [];
        let toolBar = null;
        if (this.treeData && this.treeData.length) {
            if (hasSelectAll || hasCollapseController) {
                toolBar = (react_1.default.createElement("div", { className: "treeView_toolBar" },
                    (hasSelectAll)
                        ?
                            (react_1.default.createElement(checkbox_1.default, { id: "selectAll", name: "Select All", checked: this.state.checked, onChange: this.handleOnSelectAll }))
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
            this.treeData.forEach((node) => {
                treeList.push(react_1.default.createElement(TreeNode_1.default, { node: node, key: node.index || node.id, defaultCollapsed: collapsed, collapsible: isMultiLevel, hasCheckbox: hasCheckbox, forceExpandAll: this.state.expandAll, forcecollapseAll: this.state.collapseAll, checked: node.checked, onCheck: me.handleOnCheck, onFocus: me.handleOnFocus }));
            });
        }
        return (react_1.default.createElement("div", { className: classnames_1.default('treeView'), style: {
                width: (typeof width === 'number' || (typeof width === 'string' && width.indexOf('px') === -1)) ? `${width}px` : width,
            } },
            react_1.default.createElement("div", { className: classnames_1.default('treeView_content') },
                toolBar,
                treeList)));
    }
}
TreeView.defaultProps = {
    collapsed: true,
    hasCollapseController: false,
    isMultiLevel: true,
    width: '100%',
};
exports.default = TreeView;
//# sourceMappingURL=TreeView.js.map