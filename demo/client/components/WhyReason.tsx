import React from 'react';

interface ReasonProps {
  img: string;
  description: string;
  style: React.CSSProperties;
}

const WhyReason = function ({ img, description, style }: ReasonProps) {
  return (
    <div className='single-reason' style={style}>
      <img src={img} className='reason-img' />
      <p className='reason-description'>{description}</p>
    </div>
  );
};

export default WhyReason;
