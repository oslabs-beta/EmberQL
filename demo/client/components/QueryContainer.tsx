import React, { useState } from 'react'
import { render } from 'react-dom';
// import schema from '../../server/schema/schema';
// const schema = require('../server/schema/schema');

interface QueryContainerProps {
  setTimesArray: React.Dispatch<React.SetStateAction<number[]>>;
  timesArray: number[];
};

function QueryContainer({ setTimesArray, timesArray } : QueryContainerProps) {
  const [query, setQuery] = useState('');

  const handleTestQuery = async () => {
    const sampleQuery = `
    query {
      authors{
      name
    }
  }
    `
    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        query: sampleQuery
      })
    })
    .then(res => res.json())
    .then(res => console.log(res.data));
    
  };

  const submitQuery = async () => {
    
  }

  return(
    <div className="query-container">
    <select name="queries" id="query-dropdown">
      <option value="books">QueryBooks</option>
      <option value="authors">QueryAuthors</option>
      <option value="genre">QueryGenres</option>
    </select>
    <button id="submit-query" onClick={()=> submitQuery()}type="submit">Submit Query</button>
    <button id="clear-cache" type="submit">Clear Cache</button>
    <button id="test-query" onClick={() => handleTestQuery()}>Test Query</button>
    <br />
    <input id="query-input" type="text" name="name" placeholder="Query Submitted" />
    </div>
  )
};

export default QueryContainer

/*
Access to fetch at 'http://localhost:3000/graphql' from origin 'http://localhost:8080' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. 
If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
*/