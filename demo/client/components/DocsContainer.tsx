import React from 'react';
import './DocsStyles.css';

 import pic from './assets/githubReadme.png';
 

function DocsContainer() {
  return (
    <div className='github'>
      <h2 className='section-title'>Docs</h2>
      <a href='https://github.com/oslabs-beta/EmberQL#readme' className='link'>
        EmberQL Github
      </a> 
       <img src={pic} alt='Github Readme' height='80%' width='80%' /> 
    </div>
  );
}

export default DocsContainer;

// https://newbedev.com/importing-images-in-typescript-react-cannot-find-module
