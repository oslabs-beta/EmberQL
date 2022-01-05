"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const EmberQL_1 = __importDefault(require("./EmberQL"));
const Features_1 = __importDefault(require("./Features"));
const WhyWeExist_1 = __importDefault(require("./WhyWeExist"));
const Contributing_1 = __importDefault(require("./Contributing"));
function LandingContainer() {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(EmberQL_1.default, null),
        react_1.default.createElement(Features_1.default, null),
        react_1.default.createElement(WhyWeExist_1.default, null),
        react_1.default.createElement(Contributing_1.default, null)));
}
exports.default = LandingContainer;
