import React from 'react';
import './TeamStyles.css';
interface TeamMemberProps {
  img: any;
  description: string;
  github: string;
  linkedin: string;
}

const TeamMember = function ({
  img,
  description,
  github,
  linkedin,
}: TeamMemberProps) {
  return (
    <div className='single-member'>
      <img src={img} className='member-img' />
      <p className='member-description'>{description}</p>
      <a href={github} className='team-link'>
        Github
      </a>
      <a href={linkedin} className='team-link'>
        Linkedin
      </a>
    </div>
  );
};

export default TeamMember;
