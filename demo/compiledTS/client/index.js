"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//thread of execution starts here
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_router_dom_1 = require("react-router-dom");
const App_1 = __importDefault(require("./App"));
require("./styles.css");
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
// render('Hi I am a string');
react_dom_1.default.render(react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
    react_1.default.createElement(App_1.default, null)), document.getElementById('root'));
