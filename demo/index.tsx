import React from 'react';
import ReactDOM from 'react-dom';
import TreeView from '../src/TreeView';
import jsonData from './initialRest.json';

const sourceData1 = jsonData.data1;
const sourceData2 = jsonData.data2;

class APP extends React.Component {
    constructor(props) {
        super(props);

        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleOnChange(data): void {
        console.log(data);
    }

    render() {
        return (
            <div>
                <TreeView
                    data={sourceData1}
                    onCheck={this.handleOnChange}
                    width={304}
                    hasCheckbox={true}
                    hasSelectAll={true}
                    hasCollapseController={true}
                />
                <TreeView
                    data={sourceData2}
                    onCheck={this.handleOnChange}
                    width={304}
                    hasCheckbox={true}
                    hasSelectAll={true}
                    hasCollapseController={true}
                />
            </div>
        );
    }
}

ReactDOM.render(
    <APP />,
    document.getElementById('root'),
);
