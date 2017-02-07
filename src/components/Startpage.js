import React, { Component } from 'react';
import Lipping from './Lipping';
import MultimediaBackground from './MultimediaBackground';
import TopBar, { TopBarLink } from './TopBar';
import SectionCard from './SectionCard';
import SearchField from './SearchField';

import './Startpage.css';

export default class Startpage extends Component {
  render() {
    return (
        <div>
          <Lipping />
          <MultimediaBackground>
            <TopBar>
              <TopBarLink href="#asdf" linkName="Vägbeskrivning på Knutpunkten" />
              <TopBarLink href="#asdf" linkName="Ett bättre Helsingborg" />
              <TopBarLink href="#asdf" linkName="Chatta med oss" />
            </TopBar>
            <h1 className='Startpage-heading'>Digital Service Center</h1>
            <SectionCard section="visitor" />
            <SectionCard section="local" />
            <SectionCard section="today" />
            <SearchField />
          </MultimediaBackground>
        </div>
    );
  }
}
