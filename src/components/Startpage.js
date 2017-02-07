import React, { Component } from 'react';
import Lipping from './Lipping';
import MultimediaBackground from './MultimediaBackground';
import TopBar, { TopBarLink } from './TopBar';
import SectionCard from './SectionCard';
import SearchField from './SearchField';

import './Startpage.css';

export default class Startpage extends Component {
  render() {
    const tagsVisitor = [{ name: 'See & Do', href: '#asdf'}, { name: 'Attractions', href: '#asdf'},
      { name: 'Lorem', href: '#asdf'}, { name: 'Recommendations', href: '#asdf'},
      { name: 'Lorem', href: '#asdf'}, { name: 'Lorem', href: '#asdf'}];
    const firstPostVisitor = { href: '#asdf', imgUrl: 'http://lorempixel.com/166/102',
      heading: 'Lorem ipsum', preamble: 'Lorem ipsum dolor sit amet, consectetur' +
      ' adipisicing elit, sed do eiusmod tempor incididunt ut.'};
    const postsVisitor = Array.apply(null, Array(10)).map(() => firstPostVisitor)
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
            <div style={{display: 'flex', margin: '0 5%'}}>
              <div style={{flex: '1', margin: '0 1%', maxWidth: '33%'}}>
                <SectionCard
                  section="Visitor"
                  bgColor='#f4a428'
                  tags={tagsVisitor}
                  posts={postsVisitor} />
              </div>
              <div style={{flex: '1', margin: '0 1%', maxWidth: '33%'}}>
                <SectionCard
                  section="Local"
                  bgColor='#eb6421'
                  tags={tagsVisitor}
                  posts={postsVisitor} />
              </div>
              <div style={{flex: '1', margin: '0 1%', maxWidth: '33%'}}>
                <SectionCard
                  section="Today"
                  bgColor='#c90e52'
                  tags={tagsVisitor}
                  posts={postsVisitor} />
              </div>
            </div>
            <SearchField />
          </MultimediaBackground>
        </div>
    );
  }
}
