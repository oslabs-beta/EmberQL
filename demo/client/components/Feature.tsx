import React from 'react';

interface FeatureProps {
  img: any;
  description: string;
}

const Feature = function ({ img, description }: FeatureProps) {
  return (
    <div className='single-feature'>
      <img src={img} className='feature-img' />
      <p className='feature-description'>{description}</p>
    </div>
  );
};

export default Feature;
