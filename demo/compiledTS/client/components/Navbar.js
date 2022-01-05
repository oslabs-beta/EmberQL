"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
require("./NavStyles.css");
function Navbar() {
    return (react_1.default.createElement("nav", { className: 'Nav' },
        react_1.default.createElement(react_router_dom_1.Link, { to: '/', className: 'nav-el', style: { textDecoration: 'none' } }, "EmberQL"),
        react_1.default.createElement(react_router_dom_1.Link, { to: '/Demo', className: 'nav-el', style: { textDecoration: 'none' } }, "Demo"),
        react_1.default.createElement(react_router_dom_1.Link, { to: '/Docs', className: 'nav-el', style: { textDecoration: 'none' } }, "Docs"),
        react_1.default.createElement(react_router_dom_1.Link, { to: '/Team', className: 'nav-el', style: { textDecoration: 'none' } }, "The Team")));
}
exports.default = Navbar;
