import { useRef, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { uploadProfilePicture } from '../redux/HeaderAction';
import IconButton from '../../IconButton/IconButton';
import dummy from '../../../assets/images/dummy.svg';
import './FileUpload.scss';
import { errorNotification } from '../../Toast';

const FileUpload = props => {
  const dispatch = useDispatch();
  const { profilePictureUrl } = useMemo(() => props, [props]);
  const hiddenFileInput = useRef(null);
  const [fileName, setFileName] = useState('Browse...');
  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  const handleChange = e => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name ? file.name : 'Browse...');
      if (file.size > 2097152) {
        errorNotification('Maximum upload file size < 2 MB');
        setFileName('Browse...');
      } else if (file.type !== 'image/png') {
        errorNotification('File must be image file');
        setFileName('Browse...');
      } else {
        const formData = new FormData();
        formData.append('profile-picture', file);
        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        };
        dispatch(uploadProfilePicture(formData, config));
      }
    }
  };
  return (
    <div className="user-dp-upload">
      <img className="user-dp" src={profilePictureUrl || dummy} />
      <IconButton title="cloud_upload" className="user-dp-upload" onClick={handleClick} />
      <input
        type="file"
        style={{ display: 'none' }}
        ref={hiddenFileInput}
        onChange={handleChange}
      />
      <p>{fileName}</p>
    </div>
  );
};
export default FileUpload;
