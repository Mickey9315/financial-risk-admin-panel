import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const NotesDescription = props => {
  const noteRef = useRef();
  const { description } = props;
  const [isReadMore, setIsReadMore] = useState(false);
  const noteHeight = useMemo(() => noteRef?.current?.offsetHeight, [
    noteRef?.current,
    noteRef?.current?.offsetWidth,
  ]);
  const isReadMoreNeeded = useMemo(() => noteHeight > 92, [noteHeight]);
  console.log(noteHeight);
  return (
    <div className="note-container" ref={noteRef}>
      <div
        className="view-application-accordion-description"
        style={{ maxHeight: isReadMoreNeeded && !isReadMore ? '92px' : '1000px' }}
      >
        {description || '-'}
      </div>
      {isReadMoreNeeded && !isReadMore && <span className="read-more-ellipsis">...</span>}
      {isReadMoreNeeded && (
        <span className="read-more-or-less" onClick={() => setIsReadMore(e => !e)}>
          {isReadMore ? 'Read less' : 'Read more'}
        </span>
      )}
    </div>
  );
};

NotesDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export default NotesDescription;
