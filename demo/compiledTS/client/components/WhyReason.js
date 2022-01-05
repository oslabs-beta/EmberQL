"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const WhyReason = function ({ img, description, style }) {
    return (react_1.default.createElement("div", { className: 'single-reason', style: style },
        react_1.default.createElement("img", { src: img, className: 'reason-img' }),
        react_1.default.createElement("p", { className: 'reason-description' }, description)));
};
exports.default = WhyReason;
