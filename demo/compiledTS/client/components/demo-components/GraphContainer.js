"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const chart_js_1 = require("chart.js");
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.PointElement, chart_js_1.LineElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend);
const react_chartjs_2_1 = require("react-chartjs-2");
function GraphContainer({ timesArray }) {
    const data = {
        labels: timesArray.map((el, i) => `Query ${i + 1}`),
        datasets: [
            {
                label: 'Query',
                data: timesArray,
                borderColor: '#FF4C29',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    // use ChartOptions to change the default font size to 20
    const options = {
        legend: {
            labels: {
                font: {
                    size: 24,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 24,
                    },
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 24,
                    },
                },
            },
        },
    };
    return (react_1.default.createElement("div", { className: "graph-container" },
        react_1.default.createElement(react_chartjs_2_1.Line, { data: data, options: options })));
}
exports.default = GraphContainer;
