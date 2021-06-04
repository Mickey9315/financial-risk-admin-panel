import React, {useCallback} from "react";
import {useHistory} from "react-router-dom";
import IconButton from "../../../common/IconButton/IconButton";
import Button from "../../../common/Button/Button";

const ClaimsList = () => {
    const history = useHistory();
    const onAddClaims = useCallback(() => {
        history.push('/claims/add');
    }, [history])
    return(<>
        <div className="page-header">
            <div className="page-header-name">Claims List</div>
            <div className="page-header-button-container">
                <IconButton
                        buttonType="secondary"
                        title="filter_list"
                        className="mr-10"
                        buttonTitle="Click to apply filters on credit limit list"
                />
                <IconButton
                        buttonType="primary"
                        title="format_line_spacing"
                        className="mr-10"
                        buttonTitle="Click to apply filters on credit limit list"
                />
                <Button
                        buttonType="success"
                        title="Add"
                        onClick={onAddClaims}
                />
            </div>
        </div>
    </>)
}

export default ClaimsList;
