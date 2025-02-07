import React from "react";
import { PatternFormat } from "react-number-format";

export const PhoneNumberInput = ({ value, onChange }) => {
    return (
        <PatternFormat className="form-control" value={value} onChange={onChange} format="(##)#####-####" allowEmptyFormatting mask="_"/>
    )
}
