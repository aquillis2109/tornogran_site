function todaySlug() {
  return new Date().toISOString().slice(0, 10);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function normalizeCell(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim();
}

export function buildExportRows(rows, columns) {
  return rows.map((row) =>
    columns.map((column) => {
      const raw = column.value ? column.value(row) : row[column.key];
      return normalizeCell(raw);
    }),
  );
}

export function exportCsv({ rows, columns, filename }) {
  const headers = columns.map((column) => column.label);
  const body = buildExportRows(rows, columns);
  const csv = [headers, ...body]
    .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename || `dados-${todaySlug()}`}.csv`);
}

export async function exportExcel({ rows, columns, filename, sheetName = 'Dados' }) {
  const module = await import('write-excel-file/browser');
  const writeXlsxFile = module.default;
  const body = buildExportRows(rows, columns);
  const data = [
    columns.map((column) => ({
      value: column.label,
      fontWeight: 'bold',
      color: '#FFFFFF',
      backgroundColor: '#172529',
      align: 'center',
      alignVertical: 'center',
    })),
    ...body.map((line, rowIndex) =>
      line.map((cell) => ({
        value: cell,
        wrap: true,
        alignVertical: 'top',
        backgroundColor: rowIndex % 2 === 0 ? '#FFFFFF' : '#F6F8F9',
      })),
    ),
  ];
  const widths = columns.map((column, index) => {
    const max = Math.max(column.label.length, ...body.map((line) => line[index]?.length || 0));
    return { width: Math.min(Math.max(max + 3, 14), 42) };
  });

  await writeXlsxFile(data, {
    fileName: `${filename || `dados-${todaySlug()}`}.xlsx`,
    sheet: sheetName,
    columns: widths,
  });
}

export async function copyTable({ rows, columns }) {
  const headers = columns.map((column) => column.label).join('\t');
  const body = buildExportRows(rows, columns).map((line) => line.join('\t')).join('\n');
  await navigator.clipboard.writeText([headers, body].filter(Boolean).join('\n'));
}

export function printTable({ rows, columns, title, logo = '/assets/tornogran-logo.png' }) {
  const printedAt = new Date().toLocaleString('pt-BR');
  const tableRows = buildExportRows(rows, columns);
  const popup = window.open('', '_blank', 'width=1200,height=800');
  if (!popup) return false;

  popup.document.write(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; margin: 32px; color: #172529; }
          header { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 24px; border-bottom: 2px solid #f67010; padding-bottom: 18px; }
          img { width: 150px; height: auto; }
          h1 { margin: 0 0 8px; font-size: 24px; text-transform: uppercase; }
          p { margin: 0; color: #526269; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #172529; color: white; text-transform: uppercase; font-size: 11px; letter-spacing: .08em; }
          th, td { border: 1px solid #d6dee2; padding: 9px; vertical-align: top; text-align: left; }
          tr:nth-child(even) td { background: #f4f7f8; }
          @page { margin: 16mm; }
        </style>
      </head>
      <body>
        <header>
          <img src="${logo}" alt="Tornogran" />
          <div>
            <h1>${title}</h1>
            <p>Data da impressão: ${printedAt}</p>
            <p>Quantidade de registros: ${rows.length}</p>
          </div>
        </header>
        <table>
          <thead>
            <tr>${columns.map((column) => `<th>${column.label}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${tableRows
              .map((line) => `<tr>${line.map((cell) => `<td>${cell.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</td>`).join('')}</tr>`)
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
  popup.print();
  return true;
}

export function datedFilename(prefix) {
  return `${prefix}-${todaySlug()}`;
}
