import React from "react";
import { PatternFormat } from "react-number-format";
import { parse } from "uuid";

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

export const isValidPhoneNumber = (value) => {
    var number = removeSimbols(value)
    return number?.length === 10 || number?.length === 11
}


export const TimeInput = ({ value, className, style, onChange, disabled }) => {
    return (
      <PatternFormat value={value} onChange={onChange} format="##:##" allowEmptyFormatting mask="_" 
      className={`form-control  ${className || ''}`} style={{ width: "80px", ...style }} disabled={disabled}/>
    )
}

export const convertTimeToMinutes = (hhmm) => {
    const [hh, mm] = hhmm.split(":").map(Number)
    if (mm > 59) {
        alert("minutos inválidos")
        return 0
    }
    var time = hh * 60 + mm
    if (Number.isNaN(time)) {
        return -1
    }
    return time
}

export const saveTime = (value) => {
    var time = removeSimbols(value)
    if (time.length < 4) {
        return false
    } else {
        const hh = time.substring(0, 2)
        const mm = time.substring(2, 4)
        console.log(hh, mm)
        return `${hh}:${mm}`
    }
}

export const isEmpty = (value) => {
    return value === null || value === undefined || value === "" || value.length === 0;
}

export const removeSimbols = (value) => {
    return value?.replace(/[^a-zA-Z0-9]/g, "")
}

export const DocumentFormat = ({ value }) => {
    console.log(value)
    const rawValue = value?.replace(/\D/g, '') || ''
    const isCPF = rawValue.length <= 11

    return (
        <PatternFormat
            value={value}
            format={isCPF ? "###.###.###-##" : "##.###.###/####-##"}
            displayType="text"
            allowEmptyFormatting
            mask="_"
            renderText={(formattedValue) => <span>{formattedValue}</span>}
        />
    )
}

export const PriceFormat = ({ value }) => {
    return (
        <span>R${parseFloat(value).toFixed(2)}</span>
    )
}

export const isValidCPF = (cpf) => {
    cpf = removeSimbols(cpf)
    if (cpf?.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

    let sum = 0
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i)
    let rev = 11 - (sum % 11)
    if (rev >= 10) rev = 0
    if (rev !== parseInt(cpf[9])) return false

    sum = 0
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i)
    rev = 11 - (sum % 11)
    if (rev >= 10) rev = 0
    return rev === parseInt(cpf[10])
}

export const isValidCNPJ = (cnpj) => {
    cnpj = removeSimbols(cnpj)
    if (cnpj?.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false

    let length = cnpj.length - 2
    let numbers = cnpj.substring(0, length)
    let digits = cnpj.substring(length)
    let sum = 0
    let pos = length - 7

    for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--
        if (pos < 2) pos = 9
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== parseInt(digits.charAt(0))) return false

    length += 1
    numbers = cnpj.substring(0, length)
    sum = 0
    pos = length - 7

    for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--
        if (pos < 2) pos = 9
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    return result === parseInt(digits.charAt(1))
}

export const isValidDocument = (doc) => {
    console.log(doc)
    const cleaned = removeSimbols(doc)
    if (cleaned?.length <= 11) {
        return isValidCPF(cleaned)
    } else {
        return isValidCNPJ(cleaned)
    }
}

export const OrderByField = (data, field) => {
    return data.sort((a, b) => {
      const valA = a[field]
      const valB = b[field]
      if (typeof valA === "string" && typeof valB === "string") {
        return valA.localeCompare(valB)
      }
      if (typeof valA === "number" && typeof valB === "number") {
        return valA - valB
      }
      return 0
    })
  }
  