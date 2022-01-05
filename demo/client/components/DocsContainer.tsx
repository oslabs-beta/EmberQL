import React from 'react';
import './DocsStyles.css';

import pic from './assets/githubReadme.png';

function DocsContainer() {
  return (
    <div className='github'>
      <h2 id='section-title'>Docs</h2>
      <a href='https://github.com/oslabs-beta/EmberQL#readme' className='link'>
        Explore Our Github
      </a>
      <div className='html'>
        <h1 id='emberql'>EmberQL</h1>
        <p>
          <a href='https://github.com/oslabs-beta/EmberQL/blob/dev/LICENSE'>
            <img
              src='https://img.shields.io/badge/License-MIT-yellow.svg'
              alt='License: MIT'
            />
          </a>
        </p>
        <br></br>
        <h2 id='what-is-emberql-'>What is EmberQL?</h2>
        <p>
          EmberQL is an intuitive Node module that facilitates caching data from
          GraphQL queries, and implements a dynamic data persistence system that
          monitors the status of the primary database.
        </p>
        <br></br>
        <h2 id='features'>Features</h2>
        <ul>
          <li>Server-side caching w/ Redis to decrease query times</li>
          <li>Dynamic cache invalidation</li>
          <li>
            Data persistence system utilizing <strong>RDB</strong> (Redis
            Database) and <strong>AOF</strong> (Append Only File)
          </li>
        </ul>
        <br></br>
        <h2 id='installation-prerequisites'>
          Installation &amp; Prerequisites
        </h2>
        <br></br>
        <h2 id='documentation'>Documentation</h2>
        <br></br>
        <h2 id='emberql-engineering-team'>EmberQL Engineering Team</h2>
        <br></br>
        <p>
          <a href='https://github.com/Cristian-DeLosRios'>
            Cristian De Los Rios
          </a>{' '}
          |
          <a href='https://github.com/manjunathap85'>
            Manjunath Ajjappa Pattanashetty
          </a>{' '}
          |<a href='https://github.com/mikemasatsugu'>Mike Masatsugu</a> |
          <a href='https://github.com/rammarimuthu'>Ram Marimuthu</a> |
          <a href='https://github.com/tylerpohn'>Tyler Pohn</a>
        </p>
      </div>
    </div>
  );
}

export default DocsContainer;
