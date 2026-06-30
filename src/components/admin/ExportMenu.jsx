import { Check, ChevronDown, Clipboard, FileDown, FileSpreadsheet, Printer } from 'lucide-react';
import { useMemo, useState } from 'react';
import { copyTable, datedFilename, exportCsv, exportExcel, printTable } from '../../lib/exportData.js';

export function ExportMenu({ rows, columns, filenamePrefix, sheetName, title }) {
  const [open, setOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(() =>
    columns.filter((column) => column.defaultSelected !== false).map((column) => column.key),
  );
  const [message, setMessage] = useState('');

  const selectedColumns = useMemo(() => {
    const active = columns.filter((column) => selectedKeys.includes(column.key));
    return active.length ? active : columns.slice(0, 1);
  }, [columns, selectedKeys]);

  function notify(text) {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2800);
  }

  function toggleColumn(key) {
    setSelectedKeys((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  }

  async function runExport(action) {
    const filename = datedFilename(filenamePrefix);
    try {
      if (action === 'csv') {
        exportCsv({ rows, columns: selectedColumns, filename });
        notify('Arquivo CSV exportado com sucesso.');
      }
      if (action === 'excel') {
        await exportExcel({ rows, columns: selectedColumns, filename, sheetName });
        notify('Arquivo Excel exportado com sucesso.');
      }
      if (action === 'copy') {
        await copyTable({ rows, columns: selectedColumns });
        notify('Dados copiados para a área de transferência.');
      }
      if (action === 'print') {
        const printed = printTable({ rows, columns: selectedColumns, title });
        notify(printed ? 'Tabela enviada para impressão.' : 'Não foi possível abrir a impressão.');
      }
      setOpen(false);
    } catch {
      notify('Não foi possível concluir a exportação.');
    }
  }

  return (
    <div className="admin-export">
      <button type="button" className="admin-export-button" onClick={() => setOpen((value) => !value)}>
        <FileDown size={17} />
        Exportar
        <ChevronDown size={16} />
      </button>
      {message && <span className="admin-export-feedback">{message}</span>}

      {open && (
        <div className="admin-export-menu">
          <div className="admin-export-summary">
            <strong>{rows.length}</strong>
            <span>registros filtrados</span>
          </div>

          <div className="admin-export-actions">
            <button type="button" onClick={() => runExport('csv')}>
              <FileDown size={16} />
              Exportar CSV
            </button>
            <button type="button" onClick={() => runExport('excel')}>
              <FileSpreadsheet size={16} />
              Exportar Excel
            </button>
            <button type="button" onClick={() => runExport('print')}>
              <Printer size={16} />
              Imprimir tabela
            </button>
            <button type="button" onClick={() => runExport('copy')}>
              <Clipboard size={16} />
              Copiar dados
            </button>
          </div>

          <div className="admin-export-columns">
            <p>Colunas</p>
            {columns.map((column) => (
              <label key={column.key}>
                <input
                  type="checkbox"
                  checked={selectedKeys.includes(column.key)}
                  onChange={() => toggleColumn(column.key)}
                />
                <span>{column.label}</span>
                {selectedKeys.includes(column.key) && <Check size={14} />}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
