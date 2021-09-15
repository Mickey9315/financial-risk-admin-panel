import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

const NotesDescription = props => {
  const noteRef = useRef();
  const { description } = props;

  const [isReadMore, setIsReadMore] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  useLayoutEffect(() => {
    window.addEventListener(
      'resize',
      _.throttle(() => setWindowWidth(window.innerWidth), 500)
    );
  }, []);
  const noteHeight = useMemo(
    () => (description?.toString()?.trim().length > 0 ? noteRef?.current?.offsetHeight : 0),
    [noteRef?.current, windowWidth, description]
  );

  const isReadMoreNeeded = useMemo(() => noteHeight > 92, [noteHeight, description, windowWidth]);
  return (
    <>
      {description?.toString()?.trim().length > 0 && (
        <div className="note-container">
          <div
            className="view-application-accordion-description"
            style={{ maxHeight: isReadMoreNeeded && !isReadMore ? '92px' : '1000px' }}
          >
            <span ref={noteRef}>
              <span className="font-field mr-5">Description:</span>
              {description || '-'}
            </span>
          </div>
          {isReadMoreNeeded && !isReadMore && <span className="read-more-ellipsis">...</span>}
          {isReadMoreNeeded && (
            <span className="read-more-or-less" onClick={() => setIsReadMore(e => !e)}>
              {isReadMore ? 'Read less' : 'Read more'}
            </span>
          )}
        </div>
      )}
    </>
  );
};

NotesDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export default NotesDescription;
