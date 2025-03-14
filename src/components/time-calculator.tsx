"use client"

import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calculator, DollarSign, Calendar } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TimeCalculator() {
  const [hoursPerDay, setHoursPerDay] = useState(8)
  const [hourlyRate, setHourlyRate] = useState(50)
  const [hourlyRateInput, setHourlyRateInput] = useState("50,00")
  const [monthlyRate, setMonthlyRate] = useState(0)
  const [monthlyRateInput, setMonthlyRateInput] = useState("0,00")
  const [totalHoursPerMonth, setTotalHoursPerMonth] = useState(0)
  const [isUpdatingMonthly, setIsUpdatingMonthly] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  })

  // Formatador de moeda brasileira
  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  // Formatador de números com 1 casa decimal
  const decimalFormatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  const weekdays = [
    { id: "monday", label: "Segunda", index: 1 },
    { id: "tuesday", label: "Terça", index: 2 },
    { id: "wednesday", label: "Quarta", index: 3 },
    { id: "thursday", label: "Quinta", index: 4 },
    { id: "friday", label: "Sexta", index: 5 },
    { id: "saturday", label: "Sábado", index: 6 },
    { id: "sunday", label: "Domingo", index: 0 },
  ]

  const months = [
    { value: 0, label: "Janeiro" },
    { value: 1, label: "Fevereiro" },
    { value: 2, label: "Março" },
    { value: 3, label: "Abril" },
    { value: 4, label: "Maio" },
    { value: 5, label: "Junho" },
    { value: 6, label: "Julho" },
    { value: 7, label: "Agosto" },
    { value: 8, label: "Setembro" },
    { value: 9, label: "Outubro" },
    { value: 10, label: "Novembro" },
    { value: 11, label: "Dezembro" },
  ]

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() + i - 2
  )

  // Função para formatar valor monetário no estilo de app bancário
  const formatCurrencyBankStyle = (value: number) => {
    // Converte para string e remove tudo exceto dígitos
    let digits = value.toString().replace(/\D/g, "")

    // Garante que temos pelo menos 3 dígitos (1 real = 100 centavos)
    while (digits.length < 3) {
      digits = "0" + digits
    }

    // Insere a vírgula antes dos dois últimos dígitos
    const integerPart = digits.slice(0, digits.length - 2)
    const decimalPart = digits.slice(digits.length - 2)

    // Formata com pontos para milhares se necessário
    let formattedInteger = ""
    for (let i = integerPart.length - 1, count = 0; i >= 0; i--, count++) {
      if (count > 0 && count % 3 === 0) {
        formattedInteger = "." + formattedInteger
      }
      formattedInteger = integerPart[i] + formattedInteger
    }

    // Remove zeros à esquerda, mas mantém pelo menos um dígito
    formattedInteger = formattedInteger.replace(/^0+/, "") || "0"

    return `${formattedInteger},${decimalPart}`
  }

  // Função para converter centavos para valor decimal
  const centsToDecimal = (cents: number) => {
    return cents / 100
  }

  // Calculate working days in the selected month
  const calculateWorkingDaysInMonth = () => {
    // Get the first and last day of the month
    const firstDay = new Date(selectedYear, selectedMonth, 1)
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0)

    let workingDays = 0

    // Loop through each day of the month
    for (
      let day = new Date(firstDay);
      day <= lastDay;
      day.setDate(day.getDate() + 1)
    ) {
      const weekday = day.getDay() // 0 = Sunday, 1 = Monday, etc.

      // Find the corresponding weekday in our data structure
      const weekdayId = weekdays.find((d) => d.index === weekday)?.id

      // If this weekday is selected by the user, count it
      if (weekdayId && selectedDays[weekdayId as keyof typeof selectedDays]) {
        workingDays++
      }
    }

    return workingDays
  }

  const calculateTotalHoursPerMonth = () => {
    const workingDays = calculateWorkingDaysInMonth()
    return workingDays * hoursPerDay
  }

  // Get month name
  const getMonthName = (monthIndex: number) => {
    return months.find((m) => m.value === monthIndex)?.label || ""
  }

  // Update total hours and derived values whenever relevant inputs change
  useEffect(() => {
    const hours = calculateTotalHoursPerMonth()
    setTotalHoursPerMonth(hours)

    // Only update monthly rate based on hourly rate, not the other way around
    if (!isUpdatingMonthly) {
      const newMonthlyRate = hourlyRate * hours
      setMonthlyRate(newMonthlyRate)

      // Converte para centavos, depois formata
      const monthlyRateCents = Math.round(newMonthlyRate * 100)
      setMonthlyRateInput(formatCurrencyBankStyle(monthlyRateCents))
    }
  }, [
    hoursPerDay,
    selectedDays,
    hourlyRate,
    selectedMonth,
    selectedYear,
    isUpdatingMonthly,
  ])

  // Handle monthly rate changes separately
  useEffect(() => {
    if (isUpdatingMonthly && totalHoursPerMonth > 0) {
      const newHourlyRate = monthlyRate / totalHoursPerMonth
      setHourlyRate(newHourlyRate)

      // Converte para centavos, depois formata
      const hourlyRateCents = Math.round(newHourlyRate * 100)
      setHourlyRateInput(formatCurrencyBankStyle(hourlyRateCents))
    }
  }, [isUpdatingMonthly, monthlyRate, totalHoursPerMonth])

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  const handleHourlyRateInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Permite apenas dígitos
    const input = e.target.value.replace(/\D/g, "")

    if (input === "") {
      setHourlyRateInput("0,00")
      setHourlyRate(0)
      return
    }

    // Formata para exibição
    const formattedValue = formatCurrencyBankStyle(Number(input))
    setHourlyRateInput(formattedValue)

    // Converte para valor decimal para cálculos
    const decimalValue = centsToDecimal(Number.parseInt(input))
    setHourlyRate(decimalValue)

    // Calcula o novo valor mensal
    const newMonthlyRate = decimalValue * totalHoursPerMonth
    setMonthlyRate(newMonthlyRate)

    // Atualiza o input do valor mensal
    const monthlyRateCents = Math.round(newMonthlyRate * 100)
    setMonthlyRateInput(formatCurrencyBankStyle(monthlyRateCents))
  }

  const handleMonthlyRateInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Permite apenas dígitos
    const input = e.target.value.replace(/\D/g, "")

    if (input === "") {
      setMonthlyRateInput("0,00")
      setMonthlyRate(0)
      return
    }

    // Formata para exibição
    const formattedValue = formatCurrencyBankStyle(Number(input))
    setMonthlyRateInput(formattedValue)

    // Converte para valor decimal para cálculos
    const decimalValue = centsToDecimal(Number.parseInt(input))
    setMonthlyRate(decimalValue)

    // Sinaliza que estamos atualizando a partir do valor mensal
    setIsUpdatingMonthly(true)

    // Calcula o novo valor por hora
    if (totalHoursPerMonth > 0) {
      const newHourlyRate = decimalValue / totalHoursPerMonth
      setHourlyRate(newHourlyRate)

      // Atualiza o input do valor por hora
      const hourlyRateCents = Math.round(newHourlyRate * 100)
      setHourlyRateInput(formatCurrencyBankStyle(hourlyRateCents))
    }

    // Reseta a flag após a atualização
    setTimeout(() => {
      setIsUpdatingMonthly(false)
    }, 0)
  }

  // Função para lidar com teclas especiais nos inputs de valor
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Permite apenas teclas de navegação, dígitos, backspace, delete
    const allowedKeys = [
      "ArrowLeft",
      "ArrowRight",
      "Backspace",
      "Delete",
      "Tab",
    ]
    const isDigit = /^\d$/.test(e.key)

    if (!isDigit && !allowedKeys.includes(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <div className="space-y-8 bg-zinc-100 p-4 rounded">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label
            htmlFor="month-select"
            className="text-sm text-secondary mb-2 block"
          >
            Mês
          </Label>
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
          >
            <SelectTrigger
              id="month-select"
              className="w-full border-secondary/20"
            >
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            htmlFor="year-select"
            className="text-sm text-secondary mb-2 block"
          >
            Ano
          </Label>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
          >
            <SelectTrigger
              id="year-select"
              className="w-full border-secondary/20"
            >
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label
          htmlFor="hours-per-day"
          className="text-sm text-secondary mb-2 block"
        >
          Horas por dia
        </Label>
        <Input
          id="hours-per-day"
          type="number"
          min="0"
          step="0.5"
          value={hoursPerDay}
          onChange={(e) =>
            setHoursPerDay(Number.parseFloat(e.target.value) || 0)
          }
          className="text-lg border-secondary/20"
        />
      </div>

      <div>
        <Label className="text-sm text-secondary mb-4 block">
          Dias de trabalho
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {weekdays.map((day) => (
            <div
              key={day.id}
              className="flex items-center space-x-2 rounded-md border border-secondary/20 p-3 hover:bg-primary/5"
            >
              <Checkbox
                id={day.id}
                checked={selectedDays[day.id]}
                onCheckedChange={() => handleDayToggle(day.id)}
                className="border-secondary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={day.id} className="cursor-pointer text-secondary">
                {day.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-primary p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5" />
          <h3 className="text-lg font-medium">
            Dias úteis em {getMonthName(selectedMonth)} de {selectedYear}
          </h3>
        </div>
        <p className="text-2xl font-medium mb-4">
          {calculateWorkingDaysInMonth()} dias úteis
        </p>
        <div>
          <h3 className="text-lg font-medium mb-2">Total de horas no mês:</h3>
          <p className="text-3xl font-bold">
            {decimalFormatter.format(totalHoursPerMonth)} horas
          </p>
        </div>
      </div>

      <Separator className="my-8 bg-secondary/20" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-5 w-5 text-secondary" />
            <Label htmlFor="hourly-rate" className="text-lg text-secondary">
              Valor por hora
            </Label>
          </div>
          <Input
            id="hourly-rate"
            type="text"
            inputMode="numeric"
            value={hourlyRateInput}
            onChange={handleHourlyRateInputChange}
            onKeyDown={handleKeyDown}
            className="text-right font-mono text-xl h-16 border-secondary/20 focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="h-5 w-5 text-secondary" />
            <Label htmlFor="monthly-rate" className="text-lg text-secondary">
              Valor mensal
            </Label>
          </div>
          <Input
            id="monthly-rate"
            type="text"
            inputMode="numeric"
            value={monthlyRateInput}
            onChange={handleMonthlyRateInputChange}
            onKeyDown={handleKeyDown}
            className="text-right font-mono text-xl h-16 border-secondary/20 focus:border-primary focus:ring-primary"
          />
        </div>
      </div>

      <div className="rounded-lg bg-primary/10 border border-primary/20 p-6 mt-8">
        <h3 className="text-xl font-medium text-secondary mb-4">
          Resumo do cálculo
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-secondary">
            <span>Dias trabalhados</span>
            <span className="font-medium">
              {calculateWorkingDaysInMonth()} dias em{" "}
              {getMonthName(selectedMonth)}
            </span>
          </div>
          <div className="flex justify-between items-center text-secondary">
            <span>Horas mensais</span>
            <span className="font-medium">
              {decimalFormatter.format(totalHoursPerMonth)} horas
            </span>
          </div>
          <div className="flex justify-between items-center text-secondary">
            <span>Valor por hora</span>
            <span className="font-medium">
              {currencyFormatter.format(hourlyRate)}
            </span>
          </div>
          <Separator className="my-4 bg-primary/20" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-secondary">
              Total em {getMonthName(selectedMonth)}
            </span>
            <span className="text-2xl font-bold text-primary">
              {currencyFormatter.format(monthlyRate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
