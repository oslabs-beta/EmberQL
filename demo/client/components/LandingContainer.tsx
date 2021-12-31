import React from 'react';
import EmberQL from './EmberQL';
import Navbar from './Navbar';
import Features from './Features';
import WhyWeExist from './WhyWeExist';
import Contributing from './Contributing';

function LandingContainer() {
  return (
    <div>
      <EmberQL></EmberQL>
      <Features />
      <WhyWeExist />
      <Contributing />
    </div>
  );
}

export default LandingContainer;
