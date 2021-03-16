import React from 'react';
import './InsurerMatrixTab.scss';
import australia from '../../../assets/images/australia.svg';
import newZealand from '../../../assets/images/new-zealand.svg';

const InsurerMatrixTab = () => {
  const reports = [
    {
      level: 'Up to $50,000',
      auIllion: [
        'HTML Commercial Bureau Enquiry without ASIC Docs OR',
        'HTML Commercial Bureau Enquiry w/ refresh ASIC w/o ASIC Docs',
      ],
      auEquifax: ['Commercial Apply (Individuals tab)'],
      nzIllion: ['HTML NZ Comm. Bureau Enq (AU Subs)'],
    },
    {
      level: '$50,001 to $75,000',
      auIllion: ['Risk of Late Payment Report (DDS)'],
      auEquifax: ['Commercial Apply (Individuals tab)'],
      nzIllion: ['HTML Payment Analysis with refreshed NZCO'],
      guidelines: [
        'The Late Payment Risk Level indicated by D&B cannot be “High”, “Very High” or “Severe”',
        'The D&B Dynamic Delinquency Score cannot be lower than 386',
      ],
    },
    {
      level: '$75,001 to $100,000',
      auIllion: [
        'HTML Payment Analysis & ASIC Current Extract (minimum of 3 trade references - 3 seperate suppliers)',
      ],
      auEquifax: ['Commercial Apply (Individuals tab)'],
      nzIllion: ['To be referred to QBE for approval in all instances'],
      guidelines: [
        'The Late Payment Risk Level indicated by D&B cannot be “High”, “Very High” or “Severe”',
        'The D&B Dynamic Delinquency Score cannot be lower than 386',
      ],
    },
  ];
  const guidelines = [
    {
      value:
        'Limit must be within the Excess and Discretionary Limit - Check our CRM Database to confirm',
    },
    {
      value: 'Confirm the correct legal entity and company status (Must be registered)- Check ASIC',
    },
    {
      value: 'No Nil credit limits issued by other insurers in our database - TCR Portal',
    },
    {
      value: 'ABR check to confirm GST registration - ABN Lookup',
    },
    {
      value: 'Make sure the company has been incorporated for at least 12 months - ASIC',
    },
    {
      value: 'No court actions or legal or collection activity present above $5,000',
    },
    {
      value: 'No adverse against director/s, owner/s or Shareholders',
    },
    {
      value: 'No related party registered charges',
    },
    {
      value: 'Sole Traders must be registered for GST - Check ASIC or ABN Lookup',
    },
    {
      value: 'Monitor for 12 Months on Equifax or D&B or Creditor Watch',
    },
  ];
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
        {reports.map(report => (
          <tr>
            <td height="1" valign="middle" className="matrix-level">
              {report.level}
            </td>
            <td height="1" valign="top">
              <div className="d-flex">
                <div className="matrix-detail-container">
                  <div className="country-name">
                    <div>
                      {' '}
                      <img src={australia} alt="AU" />
                    </div>
                    Australia
                  </div>
                  <div className="matrix-detail-grid">
                    <div className="matrix-detail-title">Companies</div>
                    <div className="matrix-detail-title">Individuals</div>
                    <div>
                      {report.auIllion.map(auIllion => (
                        <div className="au-illion-report-container mb-10">
                          <span className="material-icons-round">arrow_circle_up</span>
                          <div className="font-field">
                            <div className="report-title">Illion Report:</div>
                            <div>{auIllion}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      {report.auEquifax.map(auEquifax => (
                        <div className="au-equifax-report-container">
                          <span className="material-icons-round">arrow_circle_up</span>
                          <div className="font-field">
                            <div className="report-title">Equifax Report:</div>
                            <div>{auEquifax}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td height="1" valign="top">
              <div className="matrix-detail-container">
                <div className="country-name">
                  <div>
                    <img src={newZealand} alt="NZ" />
                  </div>
                  New Zealand
                </div>
                <div>
                  {report.nzIllion.map(nzIllion => (
                    <div className="matrix-detail-report-container mb-10">
                      <span className="material-icons-round">arrow_circle_up</span>
                      <div className="font-field">
                        <div className="report-title">Illion Report:</div>
                        <div>{nzIllion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </td>
            {report.guidelines && (
              <td height="1" width="20%" valign="top" className="matrix-report-guideline">
                <div className="matrix-detail-container">
                  <div className="report-guideline-title">
                    <span className="material-icons-round">screen_search_desktop</span>
                    Guidelines
                  </div>
                  {report.guidelines.map(guideline => (
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
        {guidelines.map(guideline => (
          <div>
            <span className="material-icons-round">arrow_circle_up</span>
            {guideline.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsurerMatrixTab;
