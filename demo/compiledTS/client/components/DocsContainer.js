"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./DocsStyles.css");
function DocsContainer() {
    return (react_1.default.createElement("div", { className: 'github' },
        react_1.default.createElement("h2", { id: 'section-title' }, "Docs"),
        react_1.default.createElement("a", { href: 'https://github.com/oslabs-beta/EmberQL#readme', className: 'link' }, "Explore Our Github"),
        react_1.default.createElement("div", { className: 'html' },
            react_1.default.createElement("h1", { id: 'emberql' }, "EmberQL"),
            react_1.default.createElement("p", null,
                react_1.default.createElement("a", { href: 'https://github.com/oslabs-beta/EmberQL/blob/dev/LICENSE' },
                    react_1.default.createElement("img", { src: 'https://img.shields.io/badge/License-MIT-yellow.svg', alt: 'License: MIT' }))),
            react_1.default.createElement("br", null),
            react_1.default.createElement("h2", { id: 'what-is-emberql-' }, "What is EmberQL?"),
            react_1.default.createElement("p", null, "EmberQL is an intuitive Node module that facilitates caching data from GraphQL queries, and implements a dynamic data persistence system that monitors the status of the primary database."),
            react_1.default.createElement("br", null),
            react_1.default.createElement("h2", { id: 'features' }, "Features"),
            react_1.default.createElement("ul", null,
                react_1.default.createElement("li", null, "Server-side caching w/ Redis to decrease query times"),
                react_1.default.createElement("li", null, "Dynamic cache invalidation"),
                react_1.default.createElement("li", null,
                    "Data persistence system utilizing ",
                    react_1.default.createElement("strong", null, "RDB"),
                    " (Redis Database) and ",
                    react_1.default.createElement("strong", null, "AOF"),
                    " (Append Only File)")),
            react_1.default.createElement("br", null),
            react_1.default.createElement("h2", { id: 'installation-prerequisites' }, "Installation & Prerequisites"),
            react_1.default.createElement("br", null),
            react_1.default.createElement("h2", { id: 'documentation' }, "Documentation"),
            react_1.default.createElement("br", null),
            react_1.default.createElement("h2", { id: 'emberql-engineering-team' }, "EmberQL Engineering Team"),
            react_1.default.createElement("br", null),
            react_1.default.createElement("p", null,
                react_1.default.createElement("a", { href: 'https://github.com/Cristian-DeLosRios' }, "Cristian De Los Rios"),
                ' ',
                "|",
                react_1.default.createElement("a", { href: 'https://github.com/manjunathap85' }, "Manjunath Ajjappa Pattanashetty"),
                ' ',
                "|",
                react_1.default.createElement("a", { href: 'https://github.com/mikemasatsugu' }, "Mike Masatsugu"),
                " |",
                react_1.default.createElement("a", { href: 'https://github.com/rammarimuthu' }, "Ram Marimuthu"),
                " |",
                react_1.default.createElement("a", { href: 'https://github.com/tylerpohn' }, "Tyler Pohn")))));
}
exports.default = DocsContainer;
