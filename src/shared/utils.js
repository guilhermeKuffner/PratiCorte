import React from "react";
import { PatternFormat } from "react-number-format";

export const PhoneNumberInput = ({ value, onChange }) => {
    return (
        <PatternFormat className="form-control" value={value} onChange={onChange} format="(##)#####-####" allowEmptyFormatting mask="_"/>
    )
}

export const PhoneNumberFormat = ({ value }) => {
    var number = removeSimbols(value)
    return (
        <PatternFormat value={number} format="(##) #####-####" displayType="text" allowEmptyFormatting mask="_" renderText={(formattedValue) => <span>{formattedValue}</span>}/>
    )
}

export const isEmpty = (value) => {
    return value === null || value === undefined || value === "";
}

export const removeSimbols = (value) => {
    return value.replace(/[^a-zA-Z0-9]/g, "")
}