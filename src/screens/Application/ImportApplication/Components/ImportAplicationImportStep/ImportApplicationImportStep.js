import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '../../../../../common/IconButton/IconButton';
import { errorNotification } from '../../../../../common/Toast';
import {
  deleteImportedFile,
  setImportedFile,
  updateImportApplicationData,
} from '../../../redux/ApplicationAction';

const ImportApplicationImportStep = () => {
  const dispatch = useDispatch();
  const hiddenFileInput = useRef(null);

  const { importApplication } = useSelector(({ application }) => application ?? {});
  const { file, error } = useMemo(() => importApplication?.importFile ?? {}, [
    importApplication?.importFile,
  ]);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = useCallback(e => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const fileExtension = ['xls', 'xlsx'];
      const mimeType = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      const checkExtension =
        fileExtension.indexOf(e.target.files[0].name.split('.').splice(-1)[0]) !== -1;
      const checkMimeTypes = mimeType.indexOf(e.target.files[0].type) !== -1;

      if (!(checkExtension || checkMimeTypes)) {
        errorNotification('Only excel file types are allowed');
      } else {
        dispatch(setImportedFile(e.target.files[0]));
        e.target.value = null;
        dispatch(updateImportApplicationData('importFile', ''));
      }
    }
  }, []);

  const downloadImportedFile = useCallback(() => {
    const blob = new Blob([file]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = file?.name;
    link.setAttribute('download', fileName);
    link.setAttribute('target', '__blank');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.setAttribute('href', url);
    link.click();
  }, [file]);

  return (
    <div className="ia-import-file-step">
      <div className="ia-file-icon mt-10">
        <IconButton buttonType="primary" title="cloud_upload" onClick={handleClick} />
        <input
          type="file"
          style={{ display: 'none' }}
          ref={hiddenFileInput}
          onChange={handleChange}
        />
        <span className="ia-file-text mt-10 cursor-pointer" onClick={handleClick}>
          Import File
        </span>
      </div>
      {file && (
        <div className="ia-import-file-name mt-10">
          <div className="ia-file-name">{file.name}</div>
          <div className="ia-action-buttons">
            <span
              className="material-icons-round font-field cursor-pointer"
              onClick={() => downloadImportedFile(file)}
            >
              cloud_download
            </span>
            <span
              className="material-icons-round font-field cursor-pointer ml-10"
              onClick={() => {
                dispatch(deleteImportedFile());
                dispatch(updateImportApplicationData('importFile', ''));
              }}
            >
              delete
            </span>
          </div>
        </div>
      )}
      {error && <div className="import-error mt-10 font-danger">{error}</div>}
    </div>
  );
};

export default ImportApplicationImportStep;
