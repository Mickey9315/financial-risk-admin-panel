import {
  importApplicationUploadDump,
  updateImportApplicationData,
} from '../../../redux/ApplicationAction';

export const importApplicationImportStepValidations = async (dispatch, data) => {
  let error = '';
  let validated = true;

  // eslint-disable-next-line no-prototype-builtins
  if (!data?.file) {
    validated = false;
    error = 'Please import file to continue';
  }

  if (validated) {
    const { file } = data;
    const formData = new FormData();
    formData.append('dump-file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    try {
      await dispatch(importApplicationUploadDump(formData, config));
      validated = true;
    } catch (e) {
      throw Error();
    }
  }
  dispatch(updateImportApplicationData('importFile', error));
  return validated;
};
