import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const NotesDescription = props => {
  const noteRef = useRef();
  const { description } = props;
  const [isReadMore, setIsReadMore] = useState(false);
  const noteHeight = useMemo(
    () => (description?.toString()?.trim().length > 0 ? noteRef?.current?.offsetHeight : 0),
    [noteRef?.current, noteRef?.current?.offsetWidth, description]
  );
  const isReadMoreNeeded = useMemo(() => noteHeight > 92, [noteHeight, description]);
  return (
    <>
      {description?.toString()?.trim().length > 0 && (
        <div className="note-container" ref={noteRef}>
          <div
            className="view-application-accordion-description"
            style={{ maxHeight: isReadMoreNeeded && !isReadMore ? '92px' : '1000px' }}
          >
            <span className="font-field mr-5">Description:</span>
            {description || '-'}
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
