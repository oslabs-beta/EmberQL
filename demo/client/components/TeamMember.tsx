import React from 'react';
import './TeamStyles.css';
interface TeamMemberProps {
  img: string;
  description: string;
}

const TeamMember = function ({ img, description }: TeamMemberProps) {
  return (
    <div className='single-member'>
      <img src={img} className='member-img' />
      <p className='member-description'>{description}</p>
    </div>
  );
};

export default TeamMember;
