"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./TeamStyles.css");
const TeamMember = function ({ img, description, github, linkedin, }) {
    return (react_1.default.createElement("div", { className: 'single-member' },
        react_1.default.createElement("img", { src: img, className: 'member-img' }),
        react_1.default.createElement("p", { className: 'member-description' }, description),
        react_1.default.createElement("a", { href: github, className: 'team-link' }, "Github"),
        react_1.default.createElement("a", { href: linkedin, className: 'team-link' }, "Linkedin")));
};
exports.default = TeamMember;
