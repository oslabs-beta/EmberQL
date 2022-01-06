import React from 'react';
import WhyReason from './WhyReason';
import './WhyStyles.css';
import BloatedA from './assets/BloatedA.png';
import graphql from './assets/graphql.png';
import shield from './assets/shield.png';

function WhyWeExist() {
  const reasonArray = [
    {
      img: graphql,
      description: `GraphQL Lacks Caching. This means users of GraphQL applications will
      experience latencies of 1000+ ms for every query to the database.`,
    },
    {
      img: BloatedA,
      description: `Apollo is bloated. Installing Apollo will add over half a million
      files to your node_modules folder. This hinders performance and increases application overhead.`,
    },
    {
      img: shield,
      description: `Data Safety. With standard GraphQL implementations, there is no way to identify
      database downtime in a timely manner. EmberQL implements a heartbeat feature that monitors the database
      and halts cache invalidation when downtime occurs. Users can continue to access the most important data
      even before the database is up again.`,
    },
  ];

  return (
    <div className='why'>
      <h2 className='section-title'>WHY WE EXIST</h2>
      <div className='reason-container'>
        {reasonArray.map((el, i) => (
          <WhyReason
            img={el.img}
            description={el.description}
            key={`reason-${i}`}
            style={
              i % 2 === 0
                ? { flexDirection: 'row' }
                : { flexDirection: 'row-reverse' }
            }
          />
        ))}
        {/* {reasonArray.map((el, i) => (
            <WhyReason
              img={el.img}
              description={el.description}
              key={`reason-${i}`}
            />
          )
          )} */}
      </div>
    </div>
  );
}

export default WhyWeExist;
