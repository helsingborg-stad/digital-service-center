import React, { Component, PropTypes } from 'react';
import './SectionCard.css';
import Link from './Link';
import { Scrollbars } from 'react-custom-scrollbars';

export default class SectionCard extends Component {
  render() {
    return (
      <div className='SectionCard' style={{backgroundColor: this.props.bgColor}}>
        <h2 className='SectionCard-heading'>{this.props.section}</h2>
        <div className='SectionCard-tagWrapper'>
        {this.props.tags.map(tag => {
          return (<Link key={Math.random()} className='SectionCard-tag' href={tag.href}>
            {tag.name}
          </Link>);
        })}
        </div>
        <div className='SectionCard-scrollWrapper'>
          <Scrollbars style={{ width: '100%', height: '35vh' }}>
            <div className='SectionCard-postWrapper'>
            {this.props.posts.map(post => {
              return (
                <Link key={Math.random()} className='SectionCard-post' href={post.href}>
                  { post.imgUrl &&
                    <img className='SectionCard-postImage' src={post.imgUrl} role='presentation' />
                  }
                  <h3 className='SectionCard-postHeading'>{post.heading}</h3>
                  <p className='SectionCard-postPreamble'>{post.preamble}</p>
                </Link>
              );
            })}
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

SectionCard.propTypes = {
  section: PropTypes.string,
  bgColor: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string,
    name: PropTypes.string
  })),
  posts: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string,
    imgUrl: PropTypes.string,
    heading: PropTypes.string,
    preamble: PropTypes.string
  }))
};

SectionCard.defaultProps = {
  posts: [],
  tags: [],
  bgColor: '#dedddd'
};
