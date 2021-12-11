import React, { useState } from 'react'
import { render } from 'react-dom';
import QueryContainer from './QueryContainer';
import GraphContainer from './GraphContainer';

function DemoContainer() {
  const [timesArray, setTimesArray] = useState<number[]>([]);
  
  return (
    <div className="demo-container">
      <QueryContainer setTimesArray={setTimesArray} timesArray={timesArray}/>
      <GraphContainer timesArray={timesArray} />
    </div>
  )
}


export default DemoContainer

