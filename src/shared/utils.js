import React from "react";
import { PatternFormat } from "react-number-format";
import { parse } from "uuid";
import { getDay } from "date-fns";

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
  
export const setDaysAllowed = (data) => {
    const horarios = data.horarios
    var daysAllowed = []
    for (let i = 0; i < horarios.length; i++) {
      if (horarios[i].status === "active") {
        daysAllowed.push(horarios[i].day)
      }
    }
    return daysAllowed
}

export const getAvailableHours = (selectedDate, data) => {
    const dataBase = '2024-01-01'
    const diaDaSemana = selectedDate.getDay()
    const horarioDoDia = data.horarios[diaDaSemana]
    if (!horarioDoDia || horarioDoDia.status !== "active") {
      return ["inactive"]
    }
    const { horarioInicio: inicio, horarioFim: fim } = horarioDoDia
    const blocos = []
    const inicioDate = new Date(`${dataBase}T${inicio}:00`)
    if (inicioDate.getMinutes() > 0) {
      inicioDate.setHours(inicioDate.getHours() + 1)
      inicioDate.setMinutes(0)
    }
    const fimDate = new Date(`${dataBase}T${fim}:00`)
    fimDate.setMinutes(0)
    let atual = new Date(inicioDate)
    while ((fimDate - atual) >= 60 * 60 * 1000) {
      const horas = atual.getHours().toString().padStart(2, '0')
      const minutos = atual.getMinutes().toString().padStart(2, '0')
      blocos.push(`${horas}:${minutos}`)
      atual.setHours(atual.getHours() + 1)
    }
    return blocos
  }

export const isValidMinutes = (hour) => {
    const [hh, mm] = hour.split(":").map(Number)
    if (mm > 59) {
        alert("minutos inválidos")
        return false
    }
    var time = hh * 60 + mm
    if (Number.isNaN(time)) {
        return false
    }
    return true
}

export const getNext7Days = () => {
    const today = new Date()
    const next7Days = []
    for (var i = 0; i < 7; i++) {
        const nextDay = new Date(today)
        nextDay.setDate(today.getDate() + i)
        next7Days.push({
            date: nextDay, 
            dayOfWeek: nextDay.getDay()
        })
    }
    return next7Days
}

export const completeAvailableHours = (horarios) => {
    const next7Days = getNext7Days()
    const completed = next7Days.map((day) => {
        const horarioDoDia = horarios.horarios[getDay(day.date)]
        if (!horarioDoDia || horarioDoDia.status !== "active") {
            return { ...day, isDayAllowed: false, availableHours: [], dia: horarioDoDia?.dia || null}
        }
        const availableHours = getAvailableHours(day.date, horarios)
        return { ...day, isDayAllowed: true, availableHours: availableHours, dia: horarioDoDia?.dia || null }
    })
    return completed
}

export const dateToString = (date) => {
    if (!date) return ""
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${day}/${month}/${year}`
}

export const secondsToDateString = (seconds) => {
  if (!seconds) return ""
  const date = new Date(seconds * 1000)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${day}/${month}/${year}`
}

export const isPastDateTime = (dateInfo) => {
    if (!dateInfo?.date?.seconds || !dateInfo?.hour) return false
    const date = new Date(dateInfo.date.seconds * 1000)
    const [hours, minutes] = dateInfo.hour.split(':').map(Number)
    date.setHours(hours, minutes, 0, 0)
    const diffInMs = Date.now() - date.getTime()
    return diffInMs >= 3600000
}

export const groupAgendamentosByDayOfWeek = (agendamentos) => {
    if (!Array.isArray(agendamentos)) return []

    const getTimestamp = (item) => {
        const segundos = item?.dateInfo?.date?.seconds || 0
        const hora = item?.dateInfo?.hour || "00:00"
        const [h, m] = hora.split(":").map(Number)
        return (segundos * 1000) + (h * 3600000) + (m * 60000)
    }

    const ordenados = [...agendamentos].sort((a, b) => getTimestamp(a) - getTimestamp(b))

    const agrupadosObj = {}

    ordenados.forEach(item => {
        const dia = item?.dateInfo?.titleDayOfWeek
        const indexDayOfWeek = item?.dateInfo?.indexDayOfWeek
        if (!dia) return

        if (!agrupadosObj[dia]) {
        agrupadosObj[dia] = {
            indexDayOfWeek,
            agendamentos: []
        }
        }
        agrupadosObj[dia].agendamentos.push(item)
    })

    const agrupadosArray = Object.entries(agrupadosObj).map(([day, obj]) => ({
        day,
        indexDayOfWeek: obj.indexDayOfWeek,
        agendamentos: obj.agendamentos
    }))

    return agrupadosArray
}
