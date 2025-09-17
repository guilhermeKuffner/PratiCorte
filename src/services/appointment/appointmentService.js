import { getAppointmentByProviderAndDate } from '../../store/collections/appointmentWorker';
import { isEmpty, convertTimeToMinutes, secondsToDate } from '../../shared/utils';
import { getDay } from "date-fns";

export const setDaysAllowed = (data) => {
    // Verificação de segurança
    if (!data || !data.horarios || !Array.isArray(data.horarios)) {
        console.warn('Dados de horários não disponíveis para setDaysAllowed:', data)
        return []
    }

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
    // Verificação de segurança
    if (!data || !data.horarios || !Array.isArray(data.horarios)) {
        console.warn('Dados de horários não disponíveis ou formato inválido:', data)
        return ["inactive"]
    }

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
    // Verificação de segurança para evitar erros
    if (!horarios || !horarios.horarios || !Array.isArray(horarios.horarios)) {
        console.warn('Horários não disponíveis ou formato inválido:', horarios)
        return []
    }

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

export const isPastDateTime = (dateInfo) => {
    if (!dateInfo?.date?.seconds || !dateInfo?.hour) return false
    const baseDate = new Date(dateInfo.date.seconds * 1000)
    const hoursArray = Array.isArray(dateInfo.hour) ? dateInfo.hour : [dateInfo.hour]
    const lastHour = hoursArray[hoursArray.length - 1]
    const [h, m] = lastHour.split(':').map(Number)
    baseDate.setHours(h, m, 0, 0)
    const diffInMs = Date.now() - baseDate.getTime()
    return diffInMs >= 3600000
}

export const groupAgendamentosByDayOfWeek = (agendamentos) => {
    if (!Array.isArray(agendamentos)) return []

    const getTimestamp = (item) => {
        const segundos = item?.dateInfo?.date?.seconds || 0
        const horas = item?.dateInfo?.hour
        const horaStr = Array.isArray(horas) ? horas[0] : horas || "00:00"
        const [h, m] = horaStr.split(":").map(Number)
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

export const setAvailableHours = async (providerId, day, originalHourSelected = []) => {
    var date = day
    if (date.date?.seconds) {
        date = secondsToDate(date.date.seconds)
    } else {
        date = date.date
    }
    const appointmentsByProviderAndDate = await getAppointmentByProviderAndDate(providerId, date)
    const bookedHours = appointmentsByProviderAndDate.map(a => a.dateInfo.hour).flat()
    if (day.availableHours.length > 0) {
        const now = new Date()
        const isToday = date.toDateString() === now.toDateString()
        var hourNow = now.getHours()
        var LastHour = day.availableHours[day.availableHours.length - 1].split(':')[0]
        var blockAll = null

        if (isToday && (hourNow >= LastHour)) {
            blockAll = false
        }

        var availableHoursWithStatus = day.availableHours.map(hour => ({
            hour,
            available: isEmpty(blockAll) ? !bookedHours.includes(hour) : blockAll,
            isEditing: bookedHours.includes(hour) && originalHourSelected.includes(hour)
        }))
    }
    return availableHoursWithStatus
}

export const hourStillAvailable = async (availableHours, hours) => {
    if (availableHours.length === 0 || hours.length === 0) return false

    return hours.some(h =>
        availableHours.some(ah => ah.hour === h && (ah.available || ah.isEditing))
    )
}

export const verifyServiceTimeInBlocks = (service) => {
    return Math.ceil(convertTimeToMinutes(service.duracao) / 60)
}