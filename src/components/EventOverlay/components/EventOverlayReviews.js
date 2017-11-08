import React, { PropTypes } from 'react';
import Star from '../../icons/StarIcon';

export default function EventOverlayReviews({reviews}) {
  return (
    <div style={{height: '25rem'}}>
      <div className='EventOverlay-ratingWrapper'>
      {reviews && !!reviews.length &&
        reviews.map(review => (
          <div key={review.author_name}>
            <span className='EventOverlay-ratingName' key={review.author_name}>
              {review.author_name}
            </span>
            <span className='EventOverlay-ratingStarWrapper'>
              {
                Array(review.rating).fill().map((_, index) => (
                  <Star key={index} color='#CB0050' strokeColor='#CB0050' strokeSize='3' className='EventOverlay-reviewStar EventOverlay-reviewStar--filled' />
              ))}
              {
                Array(5 - review.rating).fill().map((_, index) => (
                  <Star key={index} color='#fff' strokeColor='#CB0050' strokeSize='3' className='EventOverlay-reviewStar EventOverlay-reviewStar--hollow' />
              ))}

            </span>
            <p className='EventOverlay-ratingText'>{review.text}</p>

          </div>
        ))
      }
      </div>
    </div>
  );
}

EventOverlayReviews.propTypes = {
  reviews: PropTypes.object
};
