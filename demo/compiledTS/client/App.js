"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
require("./styles.css");
const DemoContainer_1 = __importDefault(require("./components/demo-components/DemoContainer"));
const LandingContainer_1 = __importDefault(require("./components/LandingContainer"));
const DocsContainer_1 = __importDefault(require("./components/DocsContainer"));
const Team_1 = __importDefault(require("./components/Team"));
const Navbar_1 = __importDefault(require("./components/Navbar"));
function App() {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(Navbar_1.default, null),
        react_1.default.createElement(react_router_dom_1.Routes, null,
            react_1.default.createElement(react_router_dom_1.Route, { path: '/', element: react_1.default.createElement(LandingContainer_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: '/Demo', element: react_1.default.createElement(DemoContainer_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: '/Docs', element: react_1.default.createElement(DocsContainer_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: '/Team', element: react_1.default.createElement(Team_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: '/*', element: react_1.default.createElement(LandingContainer_1.default, null) }))));
}
exports.default = App;
