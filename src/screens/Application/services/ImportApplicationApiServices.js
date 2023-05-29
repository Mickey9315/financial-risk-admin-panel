import ApiService from '../../../services/api-service/ApiService';
import { APPLICATION_URLS } from '../../../constants/UrlConstants';

const ImportApplicationApiServices = {
  downloadSample: () =>
    ApiService.request({
      url: `${APPLICATION_URLS.IMPORT_APPLICATION_URLS.DOWNLOAD_SAMPLE}`,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
  deleteApplicationDump: id =>
    ApiService.deleteData(`${APPLICATION_URLS.IMPORT_APPLICATION_URLS.UPLOAD_DUMP}${id}`),
  uploadApplicationDump: (data, config) =>
    ApiService.postData(APPLICATION_URLS.IMPORT_APPLICATION_URLS.UPLOAD_DUMP, data, {
      ...config,
      timeout: 2 * 60 * 1000,
    }),
  importApplicationSaveAndNext: (id, stepName) =>
    ApiService.putData(
      `${APPLICATION_URLS.IMPORT_APPLICATION_URLS.UPLOAD_DUMP}${id}?stepName=${stepName}`,
      {},
      {
        timeout: 2 * 60 * 1000,
      }
    ),
};
export default ImportApplicationApiServices;
