import React from 'react';
import Feature from './Feature';
import './FeaturesStyles.css';

function Features() {
  const featureArray = [
    {
      img: 'http://placecorgi.com/300/300/',
      description: `Server-side caching leveraging Redis to store query responses in memory, drastically decreasing query times and reducing queries made to the database`,
    },
    {
      img: 'http://placecorgi.com/299/299/',
      description: `Primary database heartbeat detection - server status monitoring with in-terminal reporting with customizable checking intervals`,
    },
    {
      img: 'http://placecorgi.com/301/301/',
      description: `Dynamic cache invalidation, using our database monitoring to determine and extend the lifetime of keys and value stored in memory based on the primary database status`,
    },
  ];

  return (
    <div className='feature-container'>
      <h2 id='section-title'>FEATURES</h2>
      <div className='features'>
        {featureArray.map((el, i) => (
          <Feature
            img={el.img}
            description={el.description}
            key={`feature-${i}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Features;
