import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import { renderRoutes } from '../imports/ui/App';
 
Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
});
