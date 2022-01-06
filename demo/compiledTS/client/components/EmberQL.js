"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
require("./EmberQLStyles.css");
const icon_png_1 = __importDefault(require("./assets/icon.png"));
function EmberQL() {
    return (react_1.default.createElement("div", { id: 'EmberQL' },
        react_1.default.createElement("img", { src: icon_png_1.default, id: 'icon' }),
        react_1.default.createElement("div", { id: 'Paragraph' }, "EmberQL is an npm module made for applications that utilize GraphQL. When incorporating caching for GraphQL, devs are often pigeon-holed into using massive modules like Apollo, adding huge overhead to an otherwise small application. Under/overfetching is a large complaint in the RestfulAPI developer community. We address this as well."),
        react_1.default.createElement("div", { id: 'Bullets' },
            react_1.default.createElement("ul", null,
                react_1.default.createElement("li", null, "Leverage Redis caching for your GraphQL apps"),
                react_1.default.createElement("li", null, "Keep your dependencies light"),
                react_1.default.createElement("li", null, "Add fault tolerance to your database"),
                react_1.default.createElement("li", null, "Keep your users happy with lightning fast load times"),
                react_1.default.createElement("li", null, "Optimize your cache to slash memory overhead"))),
        react_1.default.createElement("div", { id: 'ButtonContainer' },
            react_1.default.createElement(react_router_dom_1.Link, { to: '/Demo', style: { textDecoration: 'none' } },
                react_1.default.createElement("button", { className: 'button', id: 'button1' }, "Demo")),
            react_1.default.createElement(react_router_dom_1.Link, { to: '/Docs', style: { textDecoration: 'none' } },
                react_1.default.createElement("button", { className: 'button', id: 'button2' }, "Docs")))));
}
exports.default = EmberQL;
