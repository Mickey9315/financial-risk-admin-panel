import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import australia from '../../../../assets/images/australia.svg';
import newZealandFlag from '../../../../assets/images/new-zealand.svg';
import { getInsurerMatrixData } from '../../redux/InsurerAction';

const InsurerMatrixTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { priceRange: matrixReportData, generalGuideLines: matrixGuidelinesData } = useSelector(
    ({ insurer }) => insurer?.matrix ?? {}
  );
  useEffect(() => {
    dispatch(getInsurerMatrixData(id));
  }, []);
  return (
    <div className="matrix-container">
      <div className="matrix-title">Matrix</div>
      {matrixReportData ? (
        <div className="matrix-table">
          <div className="matrix-level header">Level</div>
          <div className="matrix-australia header">Information Sourced / Guidelines</div>
          {matrixReportData?.map(report => (
            <>
              <div className="matrix-level">{report?.level}</div>
              <div className="matrix-australia matrix-detail-container">
                <div className="country-name">
                  <div>
                    <img src={australia} alt="AU" />
                  </div>
                  Australia
                </div>
                <div className="matrix-detail-grid">
                  {report?.australianCompanies && (
                    <div>
                      <div className="matrix-detail-title">Companies</div>
                      {report.australianCompanies.map(auIllion => (
                        <div className="au-illion-report-container mb-10">
                          <span className="material-icons-round">arrow_circle_up</span>
                          <div className="font-field">{auIllion}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {report?.australianReports &&
                    report?.australianReports?.map(auReport => (
                      <div className="au-report-container mb-10">
                        <span className="material-icons-round">arrow_circle_up</span>
                        <div className="font-field">{auReport}</div>
                      </div>
                    ))}

                  {report?.australianIndividuals &&
                    report?.australianIndividuals?.map(auEquifax => (
                      <div>
                        <div className="matrix-detail-title">Individuals</div>
                        <div className="au-equifax-report-container">
                          <span className="material-icons-round">arrow_circle_up</span>
                          <div className="font-field">{auEquifax}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="matrix-new-zealand">
                {report?.newZealand?.length > 0 && (
                  <div className="matrix-detail-container">
                    <div className="country-name">
                      <div>
                        <img src={newZealandFlag} alt="NZ" />
                      </div>
                      New Zealand
                    </div>

                    {report?.newZealand?.map(nzIllion => (
                      <div className="matrix-detail-report-container mb-10">
                        <span className="material-icons-round">arrow_circle_up</span>
                        <div className="font-field">
                          <div>{nzIllion}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {report?.commonGuideLines?.length > 0 && (
                <div className="matrix-guidelines matrix-detail-container">
                  <div className="report-guideline-title">
                    <span className="material-icons-round">screen_search_desktop</span>
                    Guidelines
                  </div>
                  {report?.commonGuideLines?.map(guideline => (
                    <div className="matrix-detail-report-container">
                      <span className="material-icons-round">arrow_circle_up</span>
                      <div className="font-field">{guideline}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ))}
        </div>
      ) : (
        <div className="no-record-found">No record found</div>
      )}

      <div className="matrix-horizontal-line" />
      <div className="matrix-guidelines-title">Guidelines</div>
      {matrixGuidelinesData ? (
        <div className="matrix-guidelines-container">
          {matrixGuidelinesData?.map(guideline => (
            <div>
              <span className="material-icons-round">arrow_circle_up</span>
              {guideline}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-record-found">No record found</div>
      )}
    </div>
  );
};
export default InsurerMatrixTab;
