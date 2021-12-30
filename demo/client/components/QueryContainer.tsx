/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

// import schema from '../../server/schema/schema';
// const schema = require('../server/schema/schema');

interface QueryContainerProps {
  setTimesArray: React.Dispatch<React.SetStateAction<number[]>>;
  timesArray: number[];
}

const QueryContainer = function ({
  setTimesArray,
  timesArray,
}: QueryContainerProps) {
  const [query, setQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState('selection1');
  const [incomingData, setIncomingData] = useState('');

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

  useEffect(() => {
    const inputField = document.getElementById(
      'query-input',
    ) as HTMLSelectElement;

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

  const submitQuery = async () => {
    const startTime = Date.now();
    await fetch('/graphql', {
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
        console.log(res.data);
      });
     
  };

  return (
    <div className="query-container">
      <select
        name="queries"
        id="query-dropdown"
        onChange={(e) => {
          setSelectedQuery(e.target.value);
        }}
      >
        <option value="selection1">Sample Query 1</option>
        <option value="selection2">Sample Query 2</option>
        <option value="selection3">Sample Query 3</option>
      </select>
      <button id="submit-query" onClick={() => submitQuery()} type="submit">
        Submit Query
      </button>
      <div className="clear-buttons-div">
        <button
          id="clear-graph"
          className="clear-btn"
          type="submit"
          onClick={() => clearGraph()}
        >
          Clear Graph
        </button>
        <button
          id="clear-cache"
          className="clear-btn"
          type="submit"
          onClick={() => clearCache()}
        >
          Clear Cache
        </button>
      </div>
      <br />
      <h2>Query:</h2>
      <textarea
        className="text-area"
        id="query-input"
        placeholder="Please select a sample query from the drop down menu."
        readOnly={true}
      ></textarea>
      <br />
      <h2>Data:</h2>
      <textarea
        className="text-area"
        id="query-output"
        placeholder="Incoming data will be shown here."
        readOnly={true}
        value={incomingData}
      ></textarea>
    </div>
  );
};

export default QueryContainer;
