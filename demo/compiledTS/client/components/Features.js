"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Feature_1 = __importDefault(require("./Feature"));
require("./FeaturesStyles.css");
const redis_png_1 = __importDefault(require("./assets/redis.png"));
const heart_png_1 = __importDefault(require("./assets/heart.png"));
const buttons_png_1 = __importDefault(require("./assets/buttons.png"));
function Features() {
    const featureArray = [
        {
            img: redis_png_1.default,
            description: `Server-side caching leveraging Redis to store query responses in memory, drastically decreasing query times and reducing queries made to the database`,
        },
        {
            img: heart_png_1.default,
            description: `Primary database heartbeat detection - server status monitoring with in-terminal reporting with customizable checking intervals`,
        },
        {
            img: buttons_png_1.default,
            description: `Dynamic cache invalidation, using our database monitoring to determine and extend the lifetime of keys and value stored in memory based on the primary database status`,
        },
    ];
    return (react_1.default.createElement("div", { className: 'features' },
        react_1.default.createElement("h2", { id: 'section-title' }, "FEATURES"),
        react_1.default.createElement("div", { className: 'feature-container' }, featureArray.map((el, i) => (react_1.default.createElement(Feature_1.default, { img: el.img, description: el.description, key: `feature-${i}` }))))));
}
exports.default = Features;
