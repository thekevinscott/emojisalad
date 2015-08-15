import * as React from 'react';
import * as Router from 'react-router';

import { auth } from '../auth';

export class Logout extends React.Component {
  componentWillMount() {
    auth.logout();
  }
}
