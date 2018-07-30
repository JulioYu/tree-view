import React from 'react';
import classNames from 'classnames';
import Checkbox from 'checkbox';
import './TreeView.css';

interface Node {
    index: number;
    id: string;
    name: string;
    children: Node[];
    icon: string;
    defaultCollapsed?: boolean;
    checked: number | boolean;
    noCheckbox?: boolean;
}

interface Props {
    node: Node;
    defaultCollapsed?: boolean;
    checked: number | boolean;
    hasCheckbox: boolean;
    forceExpandAll: boolean;
    forcecollapseAll: boolean;
    collapsible?: boolean;
    onCheck?: () => void;
    onFocus?: (obj: any) => void;
}

interface State {
    node: Node;
    collapsed: boolean;
    checked: number | boolean;
    shouldUpdateData: boolean;
    subItemsCount: number;
}

class TreeNode extends React.Component<Props, State> {
    nodeDOM: HTMLElement;

    static getDerivedStateFromProps(nextProps: Props, prevState: State): any {
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

    static defaultProps: Partial<Props> = {
        defaultCollapsed: true,
        collapsible: true,
        forceExpandAll: false,
        forcecollapseAll: false,
    };

    constructor(props: Props) {
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

    componentDidMount(): void {
        if (this.nodeDOM) {
            this.forceUpdate(); // Update checkbox width.
        }
    }

    componentDidUpdate(): void {
        const me = this;

        if (this.state.shouldUpdateData) {
            me.setState({
                shouldUpdateData: false,
            });
        }
    }

    getSelectedCount(): number {
        const { node } = this.props;
        let selctedCount = 0;

        if (node.children) {
            node.children.forEach((child) => {
                if (typeof child.checked === 'boolean' && child.checked === true) selctedCount += 1;
                else if (typeof child.checked === 'number' && child.checked === 2) selctedCount += 0.5;
            });
        }

        return selctedCount;
    }

    selectAll(status: boolean, node: Node): void {
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

    handleCollapsed(): void {
        this.setState({ collapsed: !this.state.collapsed });
    }

    handleCheck(status: boolean): void {
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

    handleSubItemChecked(): void {
        const { node, onCheck } = this.props;
        const count = this.getSelectedCount();
        let checkedStatus: boolean | number = false;

        if (count === this.state.subItemsCount) checkedStatus = true;
        else if (count) checkedStatus = 2;
        else checkedStatus = false;

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
        const {
            node,
            defaultCollapsed,
            collapsible,
            forceExpandAll,
            forcecollapseAll,
        } = this.props;
        const treeList = [];
        const collapsed = forcecollapseAll || (this.state.collapsed && !forceExpandAll);
        const iconClassName = classNames('treeNode_arrow', {
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
            collapseIcon = (
                <div
                    role="button"
                    tabIndex={0}
                    className={iconClassName}
                    onClick={this.handleCollapsed}
                    onKeyPress={this.handleCollapsed}
                />
            );
        }

        if (this.props.hasCheckbox && !node.noCheckbox) {
            if (this.nodeDOM) {
                checkbox = (
                    <Checkbox
                        id={node.id}
                        name={node.name}
                        width={this.nodeDOM.offsetWidth - 16 - 6} // 16 is for the arrow icon & 6 is for the scroll bar
                        checked={this.state.checked}
                        onChange={this.handleCheck}
                    />
                );
            }
            else {
                checkbox = (
                    <Checkbox
                        id={node.id}
                        name={node.name}
                        checked={this.state.checked}
                        onChange={this.handleCheck}
                    />
                );
            }
        }
        else {
            item = (
                <div
                    className={classNames('treeNode_name')}
                    onClick={this.handleFocus}
                >
                    {node.name}
                </div>
            );
        }

        if (node.icon) {
            icon = (
                <div className={classNames(node.icon, 'treeNode_icon')} />
            );
        }

        if (node && node.children) {
            node.children.forEach((child) => {
                treeList.push(
                    <TreeNode
                        node={child}
                        key={child.index || child.id}
                        hasCheckbox={me.props.hasCheckbox}
                        checked={child.checked}
                        defaultCollapsed={defaultCollapsed}
                        forceExpandAll={forceExpandAll}
                        forcecollapseAll={forcecollapseAll}
                        onCheck={me.handleSubItemChecked}
                        onFocus={me.handleSubItemFocus}
                    />);
            });
        }

        return (
            <div className={classNames('treeView_treeNode')} key={node.index || node.id}>
                <div
                    className={classNames('treeView_treeNode_item')}
                    ref={(dom: any) => { this.nodeDOM = dom; }}
                >
                    {collapseIcon}
                    {icon}
                    {checkbox}
                    {item}
                </div>
                {(treeList.length && !collapsed)
                    ?
                    (
                        <div className={classNames('treeView_treeNode_children')}>
                            {treeList}
                        </div>
                    )
                    :
                    null
                }
            </div>
        );
    }
}

export default TreeNode;
