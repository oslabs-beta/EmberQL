"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const WhyReason_1 = __importDefault(require("./WhyReason"));
require("./WhyStyles.css");
const BloatedA_png_1 = __importDefault(require("./assets/BloatedA.png"));
const graphql_png_1 = __importDefault(require("./assets/graphql.png"));
const shield_png_1 = __importDefault(require("./assets/shield.png"));
function WhyWeExist() {
    const reasonArray = [
        {
            img: graphql_png_1.default,
            description: `GraphQL Lacks Caching. This means users of GraphQL applications will
      experience latencies of 1000+ ms for every query to the database.`,
        },
        {
            img: BloatedA_png_1.default,
            description: `Apollo is bloated. Installing Apollo will add over half a million
      files to your node_modules folder. This hinders performance and increases application overhead.`,
        },
        {
            img: shield_png_1.default,
            description: `Data Safety. With standard GraphQL implementations, there is no way to identify
      database downtime in a timely manner. EmberQL implements a heartbeat feature that monitors the database
      and halts cache invalidation when downtime occurs. Users can continue to access the most important data
      even before the database is up again.`,
        },
    ];
    return (react_1.default.createElement("div", { className: 'Why' },
        react_1.default.createElement("h2", { id: 'section-title' }, "Why We Exist"),
        react_1.default.createElement("div", { className: 'reason-container' }, reasonArray.map((el, i) => (react_1.default.createElement(WhyReason_1.default, { img: el.img, description: el.description, key: `reason-${i}`, style: i % 2 === 0
                ? { flexDirection: 'row' }
                : { flexDirection: 'row-reverse' } }))))));
}
exports.default = WhyWeExist;
