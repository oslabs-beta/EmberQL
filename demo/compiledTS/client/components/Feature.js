"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Feature = function ({ img, description }) {
    return (react_1.default.createElement("div", { className: 'single-feature' },
        react_1.default.createElement("img", { src: img, className: 'feature-img' }),
        react_1.default.createElement("p", { className: 'feature-description' }, description)));
};
exports.default = Feature;
