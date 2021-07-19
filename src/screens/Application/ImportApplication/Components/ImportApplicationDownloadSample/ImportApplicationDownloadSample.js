import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import IconButton from '../../../../../common/IconButton/IconButton';
import { downloadAll } from '../../../../../helpers/DownloadHelper';
import { downloadIASample } from '../../../redux/ApplicationAction';

const ImportApplicationDownloadSample = () => {
  const { downloadIASampleFileLoaderButton } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );
  const downloadSampleFile = useCallback(async () => {
    const res = await downloadIASample();
    if (res) downloadAll(res);
  }, []);
  return (
    <div className="ia-download-step">
      <div className="ia-file-icon mt-10">
        <IconButton
          buttonType="primary-1"
          title="cloud_download"
          onClick={downloadSampleFile}
          isLoading={downloadIASampleFileLoaderButton}
        />
        <span className="ia-file-text mt-10">Download Sample File</span>
      </div>
    </div>
  );
};
export default ImportApplicationDownloadSample;
