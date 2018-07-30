"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const TreeView_1 = __importDefault(require("../src/TreeView"));
const initialRest_json_1 = __importDefault(require("./initialRest.json"));
const sourceData1 = initialRest_json_1.default.data1;
const sourceData2 = initialRest_json_1.default.data2;
class APP extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnChange(data) {
        console.log(data);
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(TreeView_1.default, { data: sourceData1, onCheck: this.handleOnChange, width: 304, hasCheckbox: true, hasSelectAll: true, hasCollapseController: true }),
            react_1.default.createElement(TreeView_1.default, { data: sourceData2, onCheck: this.handleOnChange, width: 304, hasCheckbox: true, hasSelectAll: true, hasCollapseController: true })));
    }
}
react_dom_1.default.render(react_1.default.createElement(APP, null), document.getElementById('root'));
//# sourceMappingURL=index.js.map