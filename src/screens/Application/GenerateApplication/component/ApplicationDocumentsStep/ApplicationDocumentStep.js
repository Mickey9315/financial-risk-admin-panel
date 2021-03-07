import React from 'react';
import './ApplicationDocumentStep.scss';
import Input from '../../../../../common/Input/Input';

const ApplicationDocumentStep = () => {
  const documents = [
    {
      name: 'abc.pdf',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
    },
    {
      name: 'abc.pdf',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
    },
    {
      name: 'abc.pdf',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
    },
    {
      name: 'abc.pdf',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
    },
    {
      name: 'abc.pdf',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
    },
  ];
  return (
    <>
      <div className="font-secondary f-14 mb-10">Upload Documents</div>
      <div className="if-yes-row">
        <span className="font-primary mr-15">Upload your documents here</span>
        <Input type="text" prefix="upload" placeholder="Browse.." />
      </div>
      <table className="documents-table">
        <tbody>
          <tr>
            <th align="left">Document Name</th>
            <th align="left">Description</th>
            <th />
          </tr>
          {documents &&
            documents.map(document => (
              <tr>
                <td>{document.name}</td>
                <td>{document.description}</td>
                <td align="right">
                  <span className="material-icons-round font-danger cursor-pointer">
                    delete_outline
                  </span>{' '}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default ApplicationDocumentStep;
