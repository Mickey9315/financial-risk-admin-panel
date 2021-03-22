import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './InsurerMatrixTab.scss';
import australia from '../../../../assets/images/australia.svg';
import newZealandFlag from '../../../../assets/images/new-zealand.svg';
import { getInsurerMatrixData } from '../../redux/InsurerAction';

const InsurerMatrixTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { priceRange: matrixReportData, generalGuideLines: matrixGuidelinesData } = useSelector(
    ({ insurer }) => insurer.matrix
  );
  // const reports = useMemo(
  //   () => (matrixData ? matrixData.priceRange.map(report => console.log(report)) : []),
  //   []
  // );
  // console.log(reports);
  // const {
  //   australianIndividuals = [],
  //   australianCompanies = [],
  //   newZealand = [],
  //   commonGuideLines = [],
  //   level = '',
  // } = useMemo(() => matrixReportData, [matrixReportData]);
  // console.log(level);
  // const australianCompanies = useMemo(
  //   () =>
  //     reports
  //       ? reports.australianCompanies.map(auCompanyReport => console.log(auCompanyReport))
  //       : [],
  //   []
  // );
  useEffect(() => {
    dispatch(getInsurerMatrixData(id));
  }, []);
  return (
    <div className="matrix-container">
      <div className="matrix-title">Matrix</div>
      <table className="matrix-table">
        <thead>
          <th>Level</th>
          <th>Information Sourced / Guidelines</th>
          <th />
          <th />
        </thead>
        {matrixReportData &&
          matrixReportData.map(report => (
            <tr>
              <td height="1" valign="middle" className="matrix-level">
                {report.level}
              </td>
              <td height="1" valign="top">
                <div className="d-flex">
                  <div className="matrix-detail-container">
                    <div className="country-name">
                      <div>
                        <img src={australia} alt="AU" />
                      </div>
                      Australia
                    </div>
                    <div className="matrix-detail-grid">
                      {report.australianCompanies && (
                        <div className="matrix-detail-title">Companies</div>
                      )}
                      {report.australianIndividuals && (
                        <div className="matrix-detail-title">Individuals</div>
                      )}

                      {report.australianCompanies &&
                        report.australianCompanies.map(auIllion => (
                          <div className="au-illion-report-container mb-10">
                            <span className="material-icons-round">arrow_circle_up</span>
                            <div className="font-field">{auIllion}</div>
                          </div>
                        ))}

                      {report.australianReports &&
                        report.australianReports.map(auReport => (
                          <div className="au-report-container mb-10">
                            <span className="material-icons-round">arrow_circle_up</span>
                            <div className="font-field">{auReport}</div>
                          </div>
                        ))}

                      {report.australianIndividuals &&
                        report.australianIndividuals.map(auEquifax => (
                          <div className="au-equifax-report-container">
                            <span className="material-icons-round">arrow_circle_up</span>
                            <div className="font-field">{auEquifax}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </td>
              <td height="1" valign="top">
                <div className="matrix-detail-container">
                  <div className="country-name">
                    <div>
                      <img src={newZealandFlag} alt="NZ" />
                    </div>
                    New Zealand
                  </div>

                  {report.newZealand &&
                    report.newZealand.map(nzIllion => (
                      <div className="matrix-detail-report-container mb-10">
                        <span className="material-icons-round">arrow_circle_up</span>
                        <div className="font-field">
                          <div>{nzIllion}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </td>
              {report.commonGuideLines.length > 0 && (
                <td height="1" width="20%" valign="top" className="matrix-report-guideline">
                  <div className="matrix-detail-container">
                    <div className="report-guideline-title">
                      <span className="material-icons-round">screen_search_desktop</span>
                      Guidelines
                    </div>
                    {report.commonGuideLines.map(guideline => (
                      <div className="matrix-detail-report-container">
                        <span className="material-icons-round">arrow_circle_up</span>
                        <div className="font-field">{guideline}</div>
                      </div>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
      </table>

      <div className="matrix-horizontal-line" />
      <div className="matrix-guidelines-title">Guidelines</div>
      <div className="matrix-guidelines-container">
        {matrixGuidelinesData &&
          matrixGuidelinesData.map(guideline => (
            <div>
              <span className="material-icons-round">arrow_circle_up</span>
              {guideline}
            </div>
          ))}
      </div>
    </div>
  );
};

export default InsurerMatrixTab;
