import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
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

  const clearCacheQuery = () => {
    setTimesArray([]);
  };

  const sampleQuery1 = `
    query {
      books {
      title
      authors{\n\tname\n\tcountry\n      }
      genre{\n\tname\n      }
    }
  }`;

  const sampleQuery2 = `
    query {
      authors {
      name
  }
}`;

  const sampleQuery3 = `
  query {
    books {
      authors{\n\tname\n      }
    }
  }`;

  useEffect(() => {
    const inputField = document.getElementById(
      'query-input'
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
  }, [selectedQuery]);

  const submitQuery = async () => {
    const startTime = Date.now();
    await fetch('http://localhost:3000/graphql', {
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
        console.log(res.data);
      });
  };

  return (
    <div className='query-container'>
      <select
        name='queries'
        id='query-dropdown'
        onChange={(e) => {
          setSelectedQuery(e.target.value);
        }}
      >
        <option value='selection1'>Sample Query 1</option>
        <option value='selection2'>Sample Query 2</option>
        <option value='selection3'>Sample Query 3</option>
      </select>
      <button id='submit-query' onClick={() => submitQuery()} type='submit'>
        Submit Query
      </button>
      <button id='clear-cache' type='submit' onClick={() => clearCacheQuery()}>
        Clear Cache
      </button>
      <br />
      <textarea
        id='query-input'
        placeholder='Please select a sample query from the drop down menu.'
        readOnly={true}
      ></textarea>
    </div>
  );
};

export default QueryContainer;
