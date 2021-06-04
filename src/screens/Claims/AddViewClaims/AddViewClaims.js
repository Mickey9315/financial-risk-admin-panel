import React, {useCallback} from 'react';
import {useHistory} from "react-router-dom";
import ReactSelect from "react-select";
import DatePicker from "react-datepicker";
import Button from "../../../common/Button/Button";
import Input from "../../../common/Input/Input";
import Switch from "../../../common/Switch/Switch";

const AddViewClaims = () => {
    const history = useHistory();
    const backToClaimsList = useCallback(() => {
        history.replace('/claims')
    }, [history])
    const inputClaims = [
        {
            name: 'Client Name',
            placeholder: 'Enter client name',
            type: 'input'
        },
        {
            name: 'POD Received',
            placeholder: 'Select',
            type: 'select'
        },
        {
            name: 'Debtor Name',
            placeholder: 'Enter debtor name',
            type: 'input'
        },
        {
            name: 'POD Sent to U/W',
            placeholder: '',
            type: 'input'
        },
        {
            name: 'Claim Name',
            placeholder: 'Enter claim name',
            type: 'input'
        },
        {
            name: 'COD Requested',
            placeholder: '',
            type: 'input'
        },
        {
            name: 'Notified of Case',
            placeholder: 'Select',
            type: 'date'
        },
        {
            name: 'COD Received',
            placeholder: '',
            type: 'input'
        },
        {
            id: 'claims_info_requested',
            name: 'Claims Info Requested',
            placeholder: '',
            type: 'switch'
        },
        {
            name: 'Gross Debt Amount',
            placeholder: '',
            type: 'input'
        },
        {
            id: 'claims_info_reviewed',
            name: 'Claims Info Reviewed',
            placeholder: '',
            type: 'switch'
        },
        {
            name: 'Amount Paid',
            placeholder: '',
            type: 'input'
        },
        {
            id: 'trading_history',
            name: 'Trading History',
            placeholder: '',
            type: 'switch'
        },
        {
            name: 'Received LOL from U/ W',
            placeholder: 'Select',
            type: 'date'
        },
        {
            name: 'D/ L Justification',
            placeholder: 'Select',
            type: 'select'
        },
        {
            name: 'Claim Paid by U/ W',
            placeholder: 'Select',
            type: 'date'
        },
        {
            name: 'Underwriter',
            placeholder: '',
            type: 'select'
        },
        {
            id: 'reimbursement_required',
            name: 'Reimbursement Required',
            placeholder: '',
            type: 'switch'
        },
        {
            name: 'Notes',
            placeholder: '',
            type: 'input'
        },
        {
            name: 'Reimbursement Requested',
            placeholder: '',
            type: 'input'
        },
        {
            name: 'Reimbursement Paid',
            placeholder: '',
            type: 'input'
        },
        {
            name: 'Repayment Plan Amount',
            placeholder: '',
            type: 'input'
        },
        {
            name: 'Date of Oldest Invoice',
            placeholder: 'Select',
            type: 'date'
        },
        {
            name: 'Instalment Amount',
            placeholder: '$00.00',
            type: 'input'
        },
        {
            name: 'Sector',
            placeholder: 'Select',
            type: 'select'
        },
        {
            name: 'Frequency',
            placeholder: '',
            type: 'input'
        },
        {
            name: 'Date Submitted to U/ W',
            placeholder: 'Select',
            type: 'date'
        },
        {
            name: 'Repayment Plan Length',
            placeholder: '',
            type: 'input'
        },
        {
            name: 'Final Payment',
            placeholder: '',
            type: 'input'
        }
    ]

    const getComponentByType = useCallback(input => {
        let component = null;
        switch (input.type) {
            case 'select':
                component = <ReactSelect placeholder={input.placeholder} className="react-select-container"
                                         classNamePrefix="react-select"/>
                break;

            case 'date':
                component = (
                        <div className="date-picker-container">
                            <DatePicker
                                    placeholderText={input.placeholder}
                                    dateFormat="dd/MM/yyyy"
                            />
                            <span className="material-icons-round">event</span>
                        </div>)
                break;

            case 'switch':
                component = <Switch id={input.id}/>
                break;
            default:
                component = <Input type='text' placeholder={input.placeholder}/>
                break;
        }
        return <div className='d-flex align-center w-100'>
            <span className="claims-title">{input.name}</span>
            <div>{component}</div>
        </div>
    }, [inputClaims]);

    return (<>
        <div className="breadcrumb-button-row">
            <div className="breadcrumb">
                <span onClick={backToClaimsList}>Claims List</span>
                <span className="material-icons-round">navigate_next</span>
                <span>New Claim</span>
            </div>
        </div>
        <div className="common-white-container add-claims-content">
            {inputClaims.map(getComponentByType)}
        </div>
        <div className="add-overdues-save-button">
            <Button buttonType="primary" title="Save"/>
        </div>
    </>)
}

export default AddViewClaims;
