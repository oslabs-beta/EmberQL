import React from 'react';
import './ContributingStyles.css';

const description: string = `
Thank you for considering contributing to EmberQL's codebase!
If you'd like to help us maintain and update EmberQL, please understand that all of your contributions will fall under EmberQL's MIT license.\n \n 

Feel free to fork our repo and create a branch for your intended feature.\n 
If you've added a feature that needs to be reflected in the README or in our documentation, please be sure to add that as well, along with any tests that ensure your feature is working properly.\n \n 

Also, please make sure your code is error-free using our linter, to ensure consistency across our contributions.\n \n 

After all is finished and pushed to your branch, issue that pull request to the main repository!
`;

function Contributing() {
  return (
    <div className='contributing-container'>
      <h2 id='section-title'>CONTRIBUTING</h2>
      <p className='contributing-description'>{description}</p>
    </div>
  );
}

export default Contributing;
