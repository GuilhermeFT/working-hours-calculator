import type { Metadata } from "next"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Calculadora de Valor de Horas",
  description:
    "Calcule o valor de suas horas de trabalho com base no salário mensal desejado",
  keywords: "horas, trabalho, calculadora, valor, salário, freelancer",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
