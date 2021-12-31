import React from 'react';
import { Link } from 'react-router-dom';
import './EmberQLStyles.css';

function EmberQL() {
  return (
    <div id='EmberQL'>
      <h1 id='Title'>EmberQL</h1>
      <div id='Paragraph'>
        EmberQL is an npm module made for applications that utilize GraphQL.
        When incorporating caching for GraphQL, devs are often pigeon-holed into
        using massive modules like Apollo, adding huge overhead to an otherwise
        small application. Under/overfetching is a large complaint in the
        RestfulAPI developer community. We address this as well.
      </div>
      <div id='Bullets'>
        <ul>
          <li>Leverage Redis caching for your GraphQL apps</li>
          <li>Keep your dependencies light</li>
          <li>Add fault tolerance to your database</li>
          <li>Keep your users happy with lightning fast load times</li>
          <li>Optimize your cache to slash memory overhead</li>
        </ul>
      </div>
      <div id='ButtonContainer'>
        <Link to='/Demo' style={{ textDecoration: 'none' }}>
          <button id='button1'>Demo</button>
        </Link>

        <Link to='/Docs' style={{ textDecoration: 'none' }}>
          <button id='button2'>Docs</button>
        </Link>
      </div>
    </div>
  );
}

export default EmberQL;
