function safeCell(value: unknown) {
  let text = String(value ?? "")
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export function serializeCsv(rows: unknown[][]) {
  return `\uFEFF${rows.map((row) => row.map(safeCell).join(",")).join("\r\n")}`
}

export function downloadCsv(filename: string, rows: unknown[][]) {
  if (typeof document === "undefined") throw new Error("CSV downloads are only available in the browser")
  const content = serializeCsv(rows)
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
