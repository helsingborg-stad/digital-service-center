import React, { Component } from 'react';

import Lipping from '../Lipping';
import BottomBar from '../BottomBar';
import SectionCard from '../SectionCard';

export default class StartpageLoading extends Component {
  render() {
    const Row = ({children}) => (
      <div className='Startpage-Row'>{children}</div>
    );
    const Column = ({children}) => (
      <div className='Startpage-Column'>{children}</div>
    );

    const randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const tag = (min, max) => {
      return { name: '\u00a0'.repeat(randomIntBetween(min, max)) };
    };
    const emptyTags = () => [tag(12, 15), tag(13, 20), tag(18, 22), tag(25, 30), tag(10, 15)];

    return (
      <div>
        <Lipping />
        <div style={{background: '#333', minHeight: '100vh'}}>
          <h1 className='Startpage-heading'>Loading</h1>
          <Row>
            <Column>
              <SectionCard
                section='&nbsp;'
                bgColor='#c90e52'
                tags={emptyTags()}
                posts={[]} />
            </Column>
            <Column>
              <SectionCard
                section='&nbsp;'
                bgColor='#eb6421'
                tags={emptyTags()}
                posts={[]} />
            </Column>
            <Column>
              <SectionCard
                section='&nbsp;'
                bgColor='#f4a428'
                tags={emptyTags()}
                posts={[]} />
            </Column>
          </Row>
        </div>
        <BottomBar><div style={{height: '3.75rem'}} /></BottomBar>
      </div>
    );
  }
}
