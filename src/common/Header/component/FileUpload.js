import { useRef } from 'react';
/* import { uploadProfilePicture } from '../redux/HeaderAction'; */
import PropTypes from 'prop-types';
import IconButton from '../../IconButton/IconButton';
import dummy from '../../../assets/images/dummy.svg';
import './FileUpload.scss';

const FileUpload = props => {
  const { isProfile, handleChange, profilePictureUrl, fileName, className } = props;

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <div className={className ?? 'user-dp-upload'}>
      {isProfile ? <img className="user-dp" src={profilePictureUrl ?? dummy} /> : ''}
      <IconButton title="cloud_upload" className="user-dp-upload" onClick={handleClick} />
      <input
        type="file"
        style={{ display: 'none' }}
        ref={hiddenFileInput}
        onChange={handleChange}
      />
      <p onClick={handleClick}>{fileName}</p>
    </div>
  );
};
FileUpload.propTypes = {
  fileName: PropTypes.string.isRequired,
  isProfile: PropTypes.bool,
  handleChange: PropTypes.func,
  profilePictureUrl: PropTypes.string.isRequired,
  className: PropTypes.object.isRequired,
};

FileUpload.defaultProps = {
  isProfile: false,
  handleChange: () => {},
};

export default FileUpload;
