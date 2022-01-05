import type {Config} from '@jest/types';
const { defaults } = require('jest-config');

const config = {
  preset: 'ts-jest',
  bail: 1,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  verbose: true,
}

export default config;