"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./ContributingStyles.css");
const description = `
Thank you for considering contributing to EmberQL's codebase!
If you'd like to help us maintain and update EmberQL, please understand that all of your contributions will fall under EmberQL's MIT license.\n \n 

Feel free to fork our repo and create a branch for your intended feature.
If you've added a feature that needs to be reflected in the README or in our documentation, please be sure to add that as well, along with any tests that ensure your feature is working properly.\n \n 

Also, please make sure your code is error-free using our linter, to ensure consistency across our contributions.\n \n 

After all is finished and pushed to your branch, issue that pull request to the main repository!
`;
function Contributing() {
    return (react_1.default.createElement("div", { className: 'contributing-container' },
        react_1.default.createElement("h2", { className: 'section-title' }, "CONTRIBUTING"),
        react_1.default.createElement("p", { className: 'contributing-description' }, description)));
}
exports.default = Contributing;
