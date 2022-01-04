import React from 'react';
import TeamMember from './TeamMember';
import './TeamStyles.css';
import cristian from './assets/cristian.png';
import mike from './assets/mike.png';
import manju from './assets/manju.png';
import tyler from './assets/tyler.png';
import ram from './assets/ram.png';

function Team() {
  const teamArray = [
    {
      img: cristian,
      description: `Christian De Los Rios`,
      github: 'https://github.com/Cristian-DeLosRios',
      linkedin: 'https://www.linkedin.com/in/cristian-de-los-rios-600875b2/',
    },
    {
      img: mike,
      description: `Mike Masatsugu`,
      github: 'https://github.com/mikemasatsugu',
      linkedin: 'https://www.linkedin.com/in/michael-masatsugu/',
    },
    {
      img: manju,
      description: `Manjunath Pattanashetty`,
      github: 'https://github.com/manjunathap85',
      linkedin: 'https://www.linkedin.com/in/manjunath-pattanashetty-711b6911/',
    },
    {
      img: ram,
      description: `Ram Marimuthu`,
      github: 'https://github.com/rammarimuthu',
      linkedin: 'https://www.linkedin.com/in/ram-marimuthu/',
    },
    {
      img: tyler,
      description: `Tyler Pohn`,
      github: 'https://github.com/tylerpohn',
      linkedin: 'https://www.linkedin.com/in/tylerpohn/',
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
          linkedin={teamArray[0].linkedin}
          key={`member-1`}
        />
        <TeamMember
          img={teamArray[1].img}
          description={teamArray[1].description}
          github={teamArray[1].github}
          linkedin={teamArray[1].linkedin}
          key={`member-2`}
        />
        <TeamMember
          img={teamArray[2].img}
          description={teamArray[2].description}
          github={teamArray[2].github}
          linkedin={teamArray[2].linkedin}
          key={`member-3`}
        />
      </div>
      <div className='team-2'>
        <TeamMember
          img={teamArray[3].img}
          description={teamArray[3].description}
          github={teamArray[3].github}
          linkedin={teamArray[3].linkedin}
          key={`member-4`}
        />
        <TeamMember
          img={teamArray[4].img}
          description={teamArray[4].description}
          github={teamArray[4].github}
          linkedin={teamArray[4].linkedin}
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
