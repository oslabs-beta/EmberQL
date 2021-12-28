import React from 'react';
import WhyReason from './WhyReason';
import './WhyStyles.css';

function WhyWeExist() {
  const reasonArray = [
    {
      img: 'http://placecorgi.com/300/300/',
      description: `GraphQL Lacks Caching. This means users of GraphQL applications will
      experience latencies of 1000+ ms for every query to the database.`,
    },
    {
      img: 'http://placecorgi.com/299/299/',
      description: `Apollo is bloated. Installing Apollo will add over half a million
      files to your node_modules folder. This hinders performance and increases application overhead.`,
    },
    {
      img: 'http://placecorgi.com/301/301/',
      description: `Data Safety. With standard GraphQL implementations, there is no way to identify
      database downtime in a timely manner. EmberQL implements a heartbeat feature that monitors the database
      and halts cache invalidation when downtime occurs. Users can continue to access the most important data
      even before the database is up again.`,
    },
  ];

  return (
    <div className='Why'>
      <h2 className='section-title'>Why We Exist</h2>

      <div className='reason-container'>
        <div className='reasons'>
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
    </div>
  );
}

export default WhyWeExist;
