"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const react_1 = __importStar(require("react"));
const QueryContainer = function ({ setTimesArray, timesArray, }) {
    const [query, setQuery] = (0, react_1.useState)('');
    const [selectedQuery, setSelectedQuery] = (0, react_1.useState)('selection1');
    const [incomingData, setIncomingData] = (0, react_1.useState)('');
    const clearGraph = () => {
        setTimesArray([]);
        setIncomingData('');
    };
    const clearCache = () => {
        fetch('/clearcache', {
            method: 'GET',
        });
        setIncomingData('');
    };
    const sampleQuery1 = `query {
    books {
    title
    authors{\n\tname\n\tcountry\n      }
    genre{\n\tname\n      }
    }
  }`;
    const sampleQuery2 = `query {
    authors {
    name
  }
}`;
    const sampleQuery3 = `query {
    books {
      authors{\n\tname\n      }
    }
  }`;
    (0, react_1.useEffect)(() => {
        const inputField = document.getElementById('query-input');
        if (selectedQuery === 'selection1') {
            inputField.value = sampleQuery1;
            setQuery(sampleQuery1);
        }
        if (selectedQuery === 'selection2') {
            inputField.value = sampleQuery2;
            setQuery(sampleQuery2);
        }
        if (selectedQuery === 'selection3') {
            inputField.value = sampleQuery3;
            setQuery(sampleQuery3);
        }
    }, [sampleQuery1, sampleQuery2, sampleQuery3, selectedQuery]);
    const submitQuery = () => __awaiter(this, void 0, void 0, function* () {
        const startTime = Date.now();
        yield fetch('/graphql', {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                query: query,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
            setTimesArray([...timesArray, Date.now() - startTime]);
            setIncomingData(`${JSON.stringify(res.data, null, 2)}`);
        });
    });
    return (react_1.default.createElement("div", { className: "query-container" },
        react_1.default.createElement("select", { name: "queries", id: "query-dropdown", onChange: (e) => {
                setSelectedQuery(e.target.value);
            } },
            react_1.default.createElement("option", { value: "selection1" }, "Sample Query 1"),
            react_1.default.createElement("option", { value: "selection2" }, "Sample Query 2"),
            react_1.default.createElement("option", { value: "selection3" }, "Sample Query 3")),
        react_1.default.createElement("button", { id: "submit-query", onClick: () => submitQuery(), type: "submit" }, "Submit Query"),
        react_1.default.createElement("div", { className: "clear-buttons-div" },
            react_1.default.createElement("button", { id: "clear-graph", className: "clear-btn", type: "submit", onClick: () => clearGraph() }, "Clear Graph"),
            react_1.default.createElement("button", { id: "clear-cache", className: "clear-btn", type: "submit", onClick: () => clearCache() }, "Clear Cache")),
        react_1.default.createElement("br", null),
        react_1.default.createElement("h2", null, "Query:"),
        react_1.default.createElement("textarea", { className: "text-area", id: "query-input", placeholder: "Please select a sample query from the drop down menu.", readOnly: true }),
        react_1.default.createElement("br", null),
        react_1.default.createElement("h2", null, "Data:"),
        react_1.default.createElement("textarea", { className: "text-area", id: "query-output", placeholder: "Incoming data will be shown here.", readOnly: true, value: incomingData })));
};
exports.default = QueryContainer;
