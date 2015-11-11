/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component } from 'react';
import styles from './Header.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import Navigation from '../Navigation';

@withStyles(styles)
class Header extends Component {

  render() {
    return (
      <div className="Header">
        <div className="Header-container">
          <a className="Header-brand" href="/" onClick={Link.handleClick}>
            <img className="Header-brandImg" src={require('./logo-small.png')} width="38" height="38" alt="React" />
            <span className="Header-brandTxt">Boomer</span>
          </a>
          <Navigation className="Header-nav" />
          <div className="Header-banner">
            <h3 className="Header-bannerTitle">HTTP Battleground</h3>
            <p className="Header-bannerDesc">Plugin a series of API endpoints and watch them battle for speed.</p>
          </div>
        </div>
      </div>
    );
  }

}

export default Header;
