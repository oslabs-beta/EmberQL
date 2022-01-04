import React from 'react';
import './TeamStyles.css';
interface TeamMemberProps {
  img: any;
  description: string;
  github: string;
}

const TeamMember = function ({ img, description, github }: TeamMemberProps) {
  return (
    <div className='single-member'>
      <img src={img} className='member-img' />
      <p className='member-description'>{description}</p>
      <p className='member-github'>{github}</p>
    </div>
  );
};

export default TeamMember;
