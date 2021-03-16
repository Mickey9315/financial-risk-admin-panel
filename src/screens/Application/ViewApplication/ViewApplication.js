import React from 'react';
import './ViewApplication.scss';
import { useHistory } from 'react-router-dom';
import ReactSelect from 'react-dropdown-select';
import Accordion from '../../../common/Accordion/Accordion';
import AccordionItem from '../../../common/Accordion/AccordionItem';
import Checkbox from '../../../common/Checkbox/Checkbox';
import Button from '../../../common/Button/Button';

const ViewApplication = () => {
  const history = useHistory();
  const backToApplicationList = () => {
    history.replace('/applications');
  };
  const applicationDetails = [
    {
      title: 'Application ID',
      value: 'DE1-8D8A3B0EEBA250B-61',
      type: 'text',
    },
    {
      title: 'Credit Limit',
      value: '$0000',
      type: 'text',
    },
    {
      title: 'Client Name',
      value: 'A B Plastics Pty Ltd',
      type: 'link',
    },
    {
      title: 'Debtor Name',
      value: 'Alfred Construction Pty Limited',
      type: 'link',
    },
    {
      title: 'ABN',
      value: '012340123401234',
      type: 'text',
    },
    {
      title: 'Entity Name',
      value: 'Lorem ipsum',
      type: 'text',
    },
    {
      title: 'Entity Type',
      value: 'Lorem ipsum',
      type: 'text',
    },
    {
      title: 'Trading Name',
      value: 'Lorem ipsum',
      type: 'text',
    },
    {
      title: 'Phone Number',
      value: '12345678',
      type: 'text',
    },
    {
      title: 'Outstanding Amount',
      value: '$0000',
      type: 'text',
    },
    {
      title: 'Policy Name',
      value: 'Lorem ipsum',
      type: 'link',
    },
    {
      title: 'Trading Name',
      value: 'Lorem ipsum',
      type: 'text',
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
    <>
      <div className="breadcrumb mt-10">
        <span onClick={backToApplicationList}>Application List</span>
        <span className="material-icons-round">navigate_next</span>
        <span>View Application</span>
      </div>
      <div className="view-application-container">
        <div className="view-application-details-left">
          <div className="common-white-container">
            <div className="">Status</div>
            <div className="view-application-status">
              <ReactSelect placeholder="Status" searchable={false} />
            </div>
            <div className="w-100">
              <div className="application-details-grid">
                {applicationDetails.map(detail => (
                  <div>
                    <div className="font-field mb-5">{detail.title}</div>
                    {detail.type === 'text' && <div className="detail">{detail.value}</div>}
                    {detail.type === 'link' && (
                      <a href="http://www.google.com" className="detail">
                        {detail.value}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="guidelines-title">Guidelines</div>

            {guidelines.map(guideline => (
              <div className="guideline">
                <span className="material-icons-round">check_circle</span>
                {guideline.value}{' '}
              </div>
            ))}

            <div className="current-business-address-title">Current Business Address</div>
            <div className="current-business-address">
              <div className="font-field mr-15">Address</div>
              <div className="font-primary">Lorem ipsum</div>
            </div>
            <div className="view-application-question">
              Any extended payment terms outside your policy standard terms?
            </div>
            <div className="view-application-answer">
              Lorem ipsum dolor sit amet, consetetur sadipscing
            </div>
            <div className="view-application-question">
              Any overdue amounts passed your maximum extension period / Credit period?
            </div>
            <div className="view-application-answer">
              Lorem ipsum dolor sit amet, consetetur sadipscing
            </div>
          </div>
        </div>
        <div className="view-application-details-right">
          <div className="common-white-container">
            <Accordion className="view-application-accordion">
              <AccordionItem header="Reports" suffix="expand_more">
                <div className="common-accordion-item-content-box">
                  <div className="report-row">
                    <span className="title">Title:</span>
                    <span className="details">Lorem ipsum dolor sit amet, consetetur</span>
                    <span className="title">Date:</span>
                    <span className="details accordion-date">15-Dec-2020</span>
                    <span className="title">Link:</span>
                    <a
                      className="details"
                      href="http://www.google.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lorem ipsum
                    </a>
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem header="Tasks" count="04" suffix="expand_more">
                <Button buttonType="primary-1" title="Add Task" className="add-task-button" />
                <div className="common-accordion-item-content-box">
                  <div className="d-flex align-center just-bet">
                    <div className="tag red-tag">Really High</div>
                    <Checkbox />
                  </div>
                  <div className="date-owner-row">
                    <span className="title mr-5">Date:</span>
                    <span className="details accordion-date">15-Dec-2020</span>

                    <span className="title ml-15 mr-5">Owner:</span>
                    <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
                  </div>
                  <div className="font-field">Description:</div>
                  <div className="font-primary">
                    Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor
                    invidunt ut labore et.
                  </div>
                </div>
                <div className="common-accordion-item-content-box">
                  <div className="d-flex align-center just-bet">
                    <div className="tag secondary-tag">High</div>
                    <Checkbox />
                  </div>
                  <div className="date-owner-row">
                    <span className="title mr-5">Date:</span>
                    <span className="details accordion-date">15-Dec-2020</span>

                    <span className="title ml-15 mr-5">Owner:</span>
                    <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
                  </div>
                  <div className="font-field">Description:</div>
                  <div className="font-primary">
                    Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor
                    invidunt ut labore et.
                  </div>
                </div>
                <div className="common-accordion-item-content-box">
                  <div className="d-flex align-center just-bet">
                    <div className="tag alert-blue-tag">Medium</div>
                    <Checkbox />
                  </div>
                  <div className="date-owner-row">
                    <span className="title mr-5">Date:</span>
                    <span className="details accordion-date">15-Dec-2020</span>

                    <span className="title ml-15 mr-5">Owner:</span>
                    <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
                  </div>
                  <div className="font-field">Description:</div>
                  <div className="font-primary">
                    Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor
                    invidunt ut labore et.
                  </div>
                </div>
                <div className="common-accordion-item-content-box">
                  <div className="d-flex align-center just-bet">
                    <div className="tag primary-tag">Low</div>
                    <Checkbox />
                  </div>
                  <div className="date-owner-row">
                    <span className="title mr-5">Date:</span>
                    <span className="details accordion-date">15-Dec-2020</span>

                    <span className="title ml-15 mr-5">Owner:</span>
                    <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
                  </div>
                  <div className="font-field">Description:</div>
                  <div className="font-primary">
                    Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor
                    invidunt ut labore et.
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem header="Note" suffix="expand_more">
                <Button buttonType="primary-1" title="Add Note" className="add-note-button" />
                <div className="common-accordion-item-content-box">
                  <div className="alert-title-row">
                    <div className="alert-title">Title of Note</div>
                    <span className="material-icons-round font-placeholder">more_vert</span>
                  </div>
                  <div className="date-owner-row">
                    <span className="title mr-5">Date:</span>
                    <span className="details accordion-date">15-Dec-2020</span>

                    <span className="title ml-15 mr-5">Owner:</span>
                    <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
                  </div>
                  <div className="font-field">Description:</div>
                  <div className="font-primary">
                    Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor
                    invidunt ut labore et.
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem header="Alerts" count="04" suffix="expand_more">
                <div className="common-accordion-item-content-box alert">
                  <div className="alert-title-row">
                    <div className="alert-title">Title of Note</div>
                    <span className="material-icons-round font-placeholder">more_vert</span>
                  </div>
                  <div className="date-owner-row">
                    <span className="title mr-5">Date:</span>
                    <span className="details accordion-date">15-Dec-2020</span>

                    <span className="title ml-15 mr-5">Owner:</span>
                    <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
                  </div>
                  <div className="font-field">Description:</div>
                  <div className="font-primary">
                    Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor
                    invidunt ut labore et.
                  </div>
                </div>
                <div className="common-accordion-item-content-box high-alert">
                  <div className="alert-title-row">
                    <div className="alert-title">Title of Note</div>
                    <span className="material-icons-round font-placeholder">more_vert</span>
                  </div>
                  <div className="date-owner-row">
                    <span className="title mr-5">Date:</span>
                    <span className="details accordion-date">15-Dec-2020</span>

                    <span className="title ml-15 mr-5">Owner:</span>
                    <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
                  </div>
                  <div className="font-field">Description:</div>
                  <div className="font-primary">
                    Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor
                    invidunt ut labore et.
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem header="Documents" suffix="expand_more">
                <div className="common-accordion-item-content-box">
                  <div className="document-title-row">
                    <div className="document-title">Title of Document</div>
                    <span className="material-icons-round font-placeholder">more_vert</span>
                  </div>
                  <div className="date-owner-row">
                    <span className="title mr-5">Date:</span>
                    <span className="details accordion-date">15-Dec-2020</span>

                    <span className="title ml-15 mr-5">Owner:</span>
                    <span className="details">Lorem Ipsum Lorem Ipsum Lorem Ipsum</span>
                  </div>
                  <div className="font-field">Description:</div>
                  <div className="font-primary">
                    Lorem ipsum dolor sit amet, consetetur saelitr, sed diam nonumy eirmod tempor
                    invidunt ut labore et.
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewApplication;
