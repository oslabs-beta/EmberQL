import React from 'react';
import TeamMember from './TeamMember';
import './TeamStyles.css';
import cristian from './assets/cristian.png';
import mike from './assets/mike.png';
import manju from './assets/manju.png';
import tyler from './assets/tyler.png';

function Team() {
  const teamArray = [
    {
      img: cristian,
      description: `Christian De Los Rios`,
      github: 'https://www.github.com/',
    },
    {
      img: mike,
      description: `Mike Masatsugu`,
      github: 'https://www.github.com/',
    },
    {
      img: manju,
      description: `Manjunath Pattanashetty`,
      github: 'https://www.github.com/',
    },
    {
      img: 'http://placecorgi.com/301/302/',
      description: `Ram Marimuthu`,
      github: 'https://www.github.com/',
    },
    {
      img: tyler,
      description: `Tyler Pohn`,
      github: 'https://www.github.com/',
    },
  ];
  return (
    <div className='team-container'>
      <h2 id='section-title-team'>Meet The Team</h2>

      <div className='team-1'>
        <TeamMember
          img={teamArray[0].img}
          description={teamArray[0].description}
          github={teamArray[0].github}
          key={`member-1`}
        />
        <TeamMember
          img={teamArray[1].img}
          description={teamArray[1].description}
          github={teamArray[0].github}
          key={`member-2`}
        />
        <TeamMember
          img={teamArray[2].img}
          description={teamArray[2].description}
          github={teamArray[0].github}
          key={`member-3`}
        />
      </div>
      <div className='team-2'>
        <TeamMember
          img={teamArray[3].img}
          description={teamArray[3].description}
          github={teamArray[0].github}
          key={`member-4`}
        />
        <TeamMember
          img={teamArray[4].img}
          description={teamArray[4].description}
          github={teamArray[0].github}
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
