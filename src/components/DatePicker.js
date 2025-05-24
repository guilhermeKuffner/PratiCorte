import React from "react";
import { TextField } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import ptBR from 'date-fns/locale/pt-BR';

const DateInput = ({ value, onChange, days }) => {
  const hoje = new Date()
  const max = new Date()
  max.setDate(hoje.getDate() + 7)

  const daysAllowed = (date) => {
    const dia = date.getDay()
    return !days.includes(dia)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <MobileDatePicker
        label="Data"
        inputFormat="dd/MM/yyyy" 
        value={value}
        onChange={onChange}
        minDate={hoje}
        maxDate={max}
        shouldDisableDate={daysAllowed}
        renderInput={(params) => <TextField {...params} fullWidth />}
      />
    </LocalizationProvider>
  )
}

export { DateInput }
