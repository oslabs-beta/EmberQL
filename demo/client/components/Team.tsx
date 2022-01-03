import React from 'react';
import TeamMember from './TeamMember';
import './TeamStyles.css';


function Team() {
  const teamArray = [
    {
      img: 'http://placecorgi.com/300/300/',
      description: `Christian De Los Rios`,
    },
    {
      img: 'http://placecorgi.com/299/299/',
      description: `Mike Masatsugu`,
    },
    {
      img: 'http://placecorgi.com/301/301/',
      description: `Manjunath Pattanashetty`,
    },
    {
      img: 'http://placecorgi.com/301/302/',
      description: `Ram Marimuthu`,
    },
    {
      img: 'http://placecorgi.com/301/303/',
      description: `Tyler Pohn`,
    },
  ];
  return (
    <div className='team-container'>
      <h2 className='section-title'>Meet The Team</h2>

      <div className='team-1'>
        <TeamMember
          img={teamArray[0].img}
          description={teamArray[0].description}
          key={`member-1`}
        />
        <TeamMember
          img={teamArray[1].img}
          description={teamArray[1].description}
          key={`member-2`}
        />
        <TeamMember
          img={teamArray[2].img}
          description={teamArray[2].description}
          key={`member-3`}
        />
      </div>
      <div className='team-2'>
        <TeamMember
          img={teamArray[3].img}
          description={teamArray[3].description}
          key={`member-4`}
        />
        <TeamMember
          img={teamArray[4].img}
          description={teamArray[4].description}
          key={`member-5`}
        />
      </div>
    </div>
  );
}

export default Team;
{
  /* <div className='team-container-2'>
          {teamArray.map((el, i) => (
            <TeamMember
              img={el.img}
              description={el.description}
              key={`member-${i}`}
            />
          ))}
        </div> */
}
