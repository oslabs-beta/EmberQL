import React from 'react';
import Feature from './Feature';
import './FeaturesStyles.css';
import redis from './assets/redis.png';
import heart from './assets/heart.png';
import buttons from './assets/buttons.png';

function Features() {
  const featureArray = [
    {
      img: redis,
      description: `Server-side caching leveraging Redis to store query responses in memory, drastically decreasing query times and reducing queries made to the database`,
    },
    {
      img: heart,
      description: `Primary database heartbeat detection - server status monitoring with in-terminal reporting with customizable checking intervals`,
    },
    {
      img: buttons,
      description: `Dynamic cache invalidation, using our database monitoring to determine and extend the lifetime of keys and value stored in memory based on the primary database status`,
    },
  ];

  return (
    <div className='features'>
      <h2 className='section-title'>FEATURES</h2>
      <div className='feature-container'>
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
