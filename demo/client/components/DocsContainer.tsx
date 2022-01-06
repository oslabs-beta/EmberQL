import React from 'react';
import './DocsStyles.css';


function DocsContainer() {
  return (
    <div className='github'>
      <h2 id='section-title'>Docs</h2>
      <a href='https://github.com/oslabs-beta/EmberQL#readme' className='link'>
        Explore Our Github
      </a>
      <div>
        <div>
          <h1 id='-emberql'># EmberQL</h1>
          <p>
            <a href='https://github.com/oslabs-beta/EmberQL/blob/dev/LICENSE'>
              <img
                src='https://img.shields.io/badge/License-MIT-yellow.svg'
                alt='License: MIT'
              />
            </a>
          </p>
          <h2 id='what-is-emberql-'>What is EmberQL?</h2>
          <p>
            EmberQL is an intuitive, lightweight Node module that facilitates
            caching data from GraphQL queries, and implements a dynamic data
            persistence system that monitors the status of the primary database
            and modifies cache invalidation accordingly.
          </p>
          <h2 id='features'>Features</h2>
          <h3 id='server-side-caching-with-redis-to-decrease-query-times'>
            Server-side caching with Redis to decrease query times
          </h3>
          <p>
            Decrease the time it takes for your users to fetch data from your
            database by up to one hundred fold. Research shows that even a
            second of latency will drastically increase bounce rates on your
            application. Additionally, depending on the specifications or
            hosting of your database, too many simultaneous queries can cause
            timeouts to occur. Using EmberQL, there is no need to gamble with
            forcing your users to make redundant queries to your database.
          </p>
          <h3 id='dynamic-cache-invalidation'>Dynamic cache invalidation</h3>
          <p>
            EmberQL incorporates a smart "heartbeat" feature that will monitor
            your database in real time and halt cache invalidation when it
            detects downtime. This is done by periodically increasing the time
            to live of cached data, and as soon as the database comes back
            online cached items will revert to being evicted normally. The
            heartbeat will communicate relevant information about the cache and
            database to the developer in the server console.
          </p>
          <h3 id='data-persistence-system-utilizing-rdb-redis-database-and-aof-append-only-file-'>
            Data persistence system utilizing <strong>RDB</strong> (Redis
            Database) and
            <strong>AOF</strong> (Append Only File)
          </h3>
          <p>
            In the event of your database going down, the most relevant
            information users are querying will be available in the in-memory
            database and thus available to users. With EmberQL, there is no need
            for your clients to notice when your database isn't running. You can
            rest assured that your application will have fault tolerance after
            installing the module.
          </p>
          <h2 id='installation-prerequisites'>
            Installation &amp; Prerequisites
          </h2>
          <p>
            Install the EmberQL module into your Node.js application by running
            the command npm install emberql. Your application must have GraphQL
            and as a dependency, and you will need to define your schema so that
            EmberQL can make use of it. You will also need Redis as a dependency
            to access the Redis functions (createClient, connect, on, etc.) and
            you will need to either run a Redis server on your machine locally
            or utilize AWS Elasticache to run a Redis server.
          </p>
          <h2 id='implementation'>Implementation</h2>
          <p>
            After installing, the module can be easily configured by making a
            few small additions to your server file.
          </p>
          <p>
            The EmberQL class will take your GraphQL schema and your Redis cache
            instance as arguments:
          </p>
          <pre>
            <code>
              <span className='hljs-keyword'>const</span> Ember ={' '}
              <span className='hljs-keyword'>new</span> EmberQL(schema,
              redisCache);{'\n'}
            </code>
          </pre>
          <p>
            Any request sent to '/graphql' should be routed through the
            handleQuery middleware:
          </p>
          <pre>
            <code className='lang-javascript'>
              app.use(<span className='hljs-string'>'/graphql'</span>,
              Ember.handleQuery,{' '}
              <span className='hljs-function'>
                <span className='hljs-params'>(req, res)</span> =&gt;
              </span>{' '}
              {'{'}
              {'\n'}
              {'  '}res.status(<span className='hljs-number'>202</span>
              ).json(res.locals.data);{'\n'}
              {'}'});{'\n'}
            </code>
          </pre>
          <p>
            To clear the Redis cache, send a request to the '/clearCache'
            endpoint and route it through the EmberQL clearCache method:
          </p>
          <pre>
            <code className='lang-javascript'>
              app.use(<span className='hljs-string'>'/clearCache'</span>,
              Ember.clearCache,{' '}
              <span className='hljs-function'>
                <span className='hljs-params'>(req, res)</span> =&gt;
              </span>{' '}
              {'{'}
              {'\n'}
              {'  '}res.sendStatus(<span className='hljs-number'>202</span>);
              {'\n'}
              {'}'});{'\n'}
            </code>
          </pre>
          <p>
            To set up the heartbeat, simply save the heartbeat property of the
            new EmberQL instance you just declared to a new variable. Then use
            the setInterval method and an interval of your choice to assign the
            frequency you would like the heartbeat to check your database:
          </p>
          <pre>
            <code className='lang-javascript'>
              const EmberHeartbeat = Ember.heartbeat;{'\n'}
              {'\n'}setInterval(
              <span className='hljs-function'>
                <span className='hljs-params'>()</span> =&gt;
              </span>{' '}
              {'{'}
              {'\n'}
              {'  '}EmberHeartbeat();{'\n'}
              {'}'}, <span className='hljs-number'>3000</span>);{'\n'}
            </code>
          </pre>
          <h2 id='features-in-production'>Features in Production</h2>
          <p>
            Data normalization for Redis caching is currently in our development
            pipeline. The prototype utilizes a recursive function to parse the
            GraphQL AST and transform queries into key value pairs leveraging
            hashing to optimize memory.
          </p>
          <h2 id='emberql-engineering-team'>EmberQL Engineering Team</h2>
          <p>
            <a href='https://github.com/Cristian-DeLosRios'>
              Cristian De Los Rios
            </a>{' '}
            |
            <a href='https://github.com/manjunathap85'>
              Manjunath Ajjappa Pattanashetty
            </a>
            | <a href='https://github.com/mikemasatsugu'>Mike Masatsugu</a> |
            <a href='https://github.com/rammarimuthu'>Ram Marimuthu</a> |
            <a href='https://github.com/tylerpohn'>Tyler Pohn</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DocsContainer;
