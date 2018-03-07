import React from 'react';
//import App from './App';
import Index from './Index';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<Index />).toJSON();
  expect(rendered).toBeTruthy();
});
