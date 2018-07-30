import React from 'react';
import classNames from 'classnames';
import utility from 'utility';
import Checkbox from 'checkbox';
import 'icons';
import TreeNode from './TreeNode';
import './TreeView.css';

interface Node {
    index: number;
    id: string;
    name: string;
    children: Node[];
    collapsed?: boolean;
    checked: number | boolean;
}

interface Props {
    data: Node[];
    collapsed?: boolean;
    hasCheckbox: boolean;
    hasSelectAll: boolean;
    hasCollapseController?: boolean;
    isMultiLevel?: boolean;
    width?: number | string;
    onCheck?: (obj: any) => void;
    onFocus?: (obj: any) => void;
}

interface State {
    data: Node[];
    checked: number | boolean;
    shouldUpdateData: boolean;
    expandAll: boolean;
    collapseAll: boolean;
    subItemsCount: number;
}

class TreeView extends React.Component<Props, State> {
    treeData: any[];

    static getDerivedStateFromProps(nextProps: Props, prevState: State): any {
        if (!utility.isEquivalent(nextProps.data, prevState.data)) {
            return {
                data: nextProps.data,
                shouldUpdateData: true,
            };
        }
        else {
            return null;
        }
    }

    static defaultProps: Partial<Props> = {
        collapsed: true,
        hasCollapseController: false,
        isMultiLevel: true,
        width: '100%',
    };

    constructor(props: Props) {
        super(props);

        this.treeData = (props.data) ? utility.clone(props.data) : null;

        if (this.treeData) {
            this.treeData.forEach((node) => {
                this.fixCheckStatus(node);
            });
        }

        const itemCount = (this.treeData) ? this.treeData.length : 0;
        const selectedCount = this.getSelectedCount();
        let checked: boolean | number = false;

        if (selectedCount === itemCount) checked = true;
        else if (selectedCount) checked = 2;
        else checked = false;

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

    shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
        if (nextState.shouldUpdateData) {
            const me = this;

            this.treeData = (nextProps.data) ? utility.clone(nextProps.data) : null;

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

    componentDidUpdate(): void {
        const me = this;

        if (this.state.collapseAll || this.state.expandAll || this.state.shouldUpdateData) {
            me.setState({
                collapseAll: false,
                expandAll: false,
                shouldUpdateData: false,
            });
        }
    }

    getSelectedCount(): number {
        let selctedCount = 0;

        if (this.treeData) {
            this.treeData.forEach((node) => {
                if (node.checked === true) selctedCount += 1;
                else if (node.checked === 2) selctedCount += 0.5;
            });
        }

        return selctedCount;
    }

    selectAll(data: any[], status: boolean): void {
        if (data) {
            data.forEach((node) => {
                node.checked = status;
                if (node.children && node.children.length) {
                    this.selectAll(node.children, status);
                }
            });
        }
    }

    handleOnCheck(): void {
        const count = this.getSelectedCount();
        let checkedStatus: boolean | number = false;

        if (count === this.state.subItemsCount) checkedStatus = true;
        else if (count) checkedStatus = 2;
        else checkedStatus = false;

        this.setState({
            checked: checkedStatus,
        });

        this.props.onCheck(this.treeData);
    }

    handleOnFocus(node): void {
        const { onFocus } = this.props;

        if (onFocus) onFocus(node);
    }

    handleOnSelectAll(): void {
        const { onCheck } = this.props;
        const selectAll = (typeof this.state.checked === 'number' && this.state.checked === 2) ? false : !this.state.checked;

        this.selectAll(this.treeData, selectAll);
        this.setState({
            checked: selectAll,
        });

        onCheck(this.treeData);
    }

    handleOnShrink(): void {
        this.setState({
            collapseAll: true,
        });
    }

    handleOnExpand(): void {
        this.setState({
            expandAll: true,
        });
    }

    fixCheckStatus(node: Node): void {
        if (node.children) {
            for (let i = 0; i < node.children.length; i += 1) {
                const child = node.children[i];
                if (child.children && child.children.length) {
                    this.fixCheckStatus(child);
                }
            }

            let checked: boolean | number = false;
            let checkedCount = 0;
            node.children.forEach((child) => {
                if (child.checked === true) checkedCount += 1;
                else if (child.checked === 2) checkedCount += 0.5;
            });

            if (checkedCount === node.children.length) checked = true;
            else if (checkedCount) checked = 2;
            else checked = false;

            node.checked = checked;
        }
    }

    updateSelectAllStatus(data): void {
        const itemCount = (data) ? data.length : 0;
        const selectedCount = this.getSelectedCount();
        let checked: boolean | number = false;

        if (selectedCount === itemCount) checked = true;
        else if (selectedCount) checked = 2;
        else checked = false;

        this.setState({
            checked,
            subItemsCount: itemCount,
        });
    }

    render() {
        const me = this;
        const {
            collapsed,
            hasCheckbox,
            hasSelectAll,
            hasCollapseController,
            isMultiLevel,
            width,
        } = this.props;
        const treeList = [];

        let toolBar = null;
        if (this.treeData && this.treeData.length) {
            if (hasSelectAll || hasCollapseController) {
                toolBar = (
                    <div className="treeView_toolBar">
                        {
                            (hasSelectAll)
                                ?
                                (
                                    <Checkbox id="selectAll" name="Select All" checked={this.state.checked} onChange={this.handleOnSelectAll} />
                                )
                                :
                                null
                        }
                        {
                            (hasCollapseController)
                                ?
                                (
                                    <i
                                        className="icon-shrink treeView_toolBar_button"
                                        role="button"
                                        tabIndex={0}
                                        onClick={this.handleOnShrink}
                                        onKeyPress={this.handleOnShrink}
                                    />
                                )
                                :
                                null
                        }
                        {
                            (hasCollapseController)
                                ?
                                (
                                    <i
                                        className="icon-expand treeView_toolBar_button"
                                        role="button"
                                        tabIndex={0}
                                        onClick={this.handleOnExpand}
                                        onKeyPress={this.handleOnExpand}
                                    />
                                )
                                :
                                null
                        }
                    </div>
                );
            }
        }

        if (this.treeData) {
            this.treeData.forEach((node) => {
                treeList.push(
                    <TreeNode
                        node={node}
                        key={node.index || node.id}
                        defaultCollapsed={collapsed}
                        collapsible={isMultiLevel}
                        hasCheckbox={hasCheckbox}
                        forceExpandAll={this.state.expandAll}
                        forcecollapseAll={this.state.collapseAll}
                        checked={node.checked}
                        onCheck={me.handleOnCheck}
                        onFocus={me.handleOnFocus}
                    />);
            });
        }

        return (
            <div
                className={classNames('treeView')}
                style={{
                    width: (typeof width === 'number' || (typeof width === 'string' && width.indexOf('px') === -1)) ? `${width}px` : width,
                }}
            >
                <div className={classNames('treeView_content')}>
                    {toolBar}
                    {treeList}
                </div>
            </div>
        );
    }
}

export default TreeView;
