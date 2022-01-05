"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const TeamMember_1 = __importDefault(require("./TeamMember"));
require("./TeamStyles.css");
const cristian_png_1 = __importDefault(require("./assets/cristian.png"));
const mike_png_1 = __importDefault(require("./assets/mike.png"));
const manju_png_1 = __importDefault(require("./assets/manju.png"));
const tyler_png_1 = __importDefault(require("./assets/tyler.png"));
const ram_png_1 = __importDefault(require("./assets/ram.png"));
function Team() {
    const teamArray = [
        {
            img: cristian_png_1.default,
            description: `Christian De Los Rios`,
            github: 'https://github.com/Cristian-DeLosRios',
            linkedin: 'https://www.linkedin.com/in/cristian-de-los-rios-600875b2/',
        },
        {
            img: mike_png_1.default,
            description: `Mike Masatsugu`,
            github: 'https://github.com/mikemasatsugu',
            linkedin: 'https://www.linkedin.com/in/michael-masatsugu/',
        },
        {
            img: manju_png_1.default,
            description: `Manjunath Pattanashetty`,
            github: 'https://github.com/manjunathap85',
            linkedin: 'https://www.linkedin.com/in/manjunath-pattanashetty-711b6911/',
        },
        {
            img: ram_png_1.default,
            description: `Ram Marimuthu`,
            github: 'https://github.com/rammarimuthu',
            linkedin: 'https://www.linkedin.com/in/ram-marimuthu/',
        },
        {
            img: tyler_png_1.default,
            description: `Tyler Pohn`,
            github: 'https://github.com/tylerpohn',
            linkedin: 'https://www.linkedin.com/in/tylerpohn/',
        },
    ];
    return (react_1.default.createElement("div", { className: 'team-container' },
        react_1.default.createElement("h2", { id: 'section-title-team' }, "Meet The Team"),
        react_1.default.createElement("div", { className: 'team-1' },
            react_1.default.createElement(TeamMember_1.default, { img: teamArray[0].img, description: teamArray[0].description, github: teamArray[0].github, linkedin: teamArray[0].linkedin, key: `member-1` }),
            react_1.default.createElement(TeamMember_1.default, { img: teamArray[1].img, description: teamArray[1].description, github: teamArray[1].github, linkedin: teamArray[1].linkedin, key: `member-2` }),
            react_1.default.createElement(TeamMember_1.default, { img: teamArray[2].img, description: teamArray[2].description, github: teamArray[2].github, linkedin: teamArray[2].linkedin, key: `member-3` })),
        react_1.default.createElement("div", { className: 'team-2' },
            react_1.default.createElement(TeamMember_1.default, { img: teamArray[3].img, description: teamArray[3].description, github: teamArray[3].github, linkedin: teamArray[3].linkedin, key: `member-4` }),
            react_1.default.createElement(TeamMember_1.default, { img: teamArray[4].img, description: teamArray[4].description, github: teamArray[4].github, linkedin: teamArray[4].linkedin, key: `member-5` }))));
}
exports.default = Team;
{
    /* <div className='team-container-2'>
            {teamArray.map((el, i) => (
              <TeamMember
                img={el.img}
                description={el.description}
                key={`member-${i}`}
              />
            ))}
          </div> */
}
