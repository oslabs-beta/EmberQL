import React from 'react';
import './DocsStyles.css';

import pic from './assets/githubReadme.png';

function DocsContainer() {
  return (
    <div className='github'>
      <h2 id='section-title'>Docs</h2>
      <a href='https://github.com/oslabs-beta/EmberQL#readme' className='link'>
        EmberQL Github
      </a>
      <div className='docs-pic-container'>
        <img
          id='docs-pic'
          src={pic}
          alt='Github Readme'
          // height='100%'
          // width='100%'
        />
      </div>
    </div>
  );
}

export default DocsContainer;

// https://newbedev.com/importing-images-in-typescript-react-cannot-find-module
