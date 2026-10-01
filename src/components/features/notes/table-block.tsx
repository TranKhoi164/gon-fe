'use client';

import React from 'react';
import { NotionBlock } from '@/types/notes.types';
import { Plus, Trash2 } from 'lucide-react';

interface TableBlockProps {
  block: NotionBlock;
  onChange: (updatedBlock: NotionBlock) => void;
}

export const TableBlock: React.FC<TableBlockProps> = ({ block, onChange }) => {
  const columns: string[] = block.properties?.columns || ['Cột 1', 'Cột 2'];
  const hasHeader: boolean = block.properties?.has_column_header ?? true;
  const rows: string[][] =
    block.content?.map((row) => row.properties?.cells?.[0] || []) ||
    block.properties?.cells || [
      ['Dữ liệu 1', 'Dữ liệu 2'],
    ];

  // Helper to commit changes
  const updateTable = (newCols: string[], newRows: string[][], newHasHeader = hasHeader) => {
    const updatedContent: NotionBlock[] = newRows.map((rowCells, idx) => ({
      id: block.content?.[idx]?.id || `row-${Date.now()}-${idx}`,
      type: 'table_row',
      properties: {
        cells: [rowCells],
      },
    }));

    onChange({
      ...block,
      properties: {
        ...block.properties,
        columns: newCols,
        has_column_header: newHasHeader,
        cells: newRows,
      },
      content: updatedContent,
    });
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = rows.map((r, rIdx) => {
      if (rIdx !== rowIndex) return [...r];
      const newRow = [...r];
      newRow[colIndex] = value;
      return newRow;
    });
    updateTable(columns, newRows);
  };

  const handleHeaderChange = (colIndex: number, value: string) => {
    const newCols = [...columns];
    newCols[colIndex] = value;
    updateTable(newCols, rows);
  };

  const addColumn = () => {
    const newCols = [...columns, `Cột ${columns.length + 1}`];
    const newRows = rows.map((r) => [...r, '']);
    updateTable(newCols, newRows);
  };

  const deleteColumn = (colIndex: number) => {
    if (columns.length <= 1) return;
    const newCols = columns.filter((_, i) => i !== colIndex);
    const newRows = rows.map((r) => r.filter((_, i) => i !== colIndex));
    updateTable(newCols, newRows);
  };

  const addRow = () => {
    const newRow = new Array(columns.length).fill('');
    const newRows = [...rows, newRow];
    updateTable(columns, newRows);
  };

  const deleteRow = (rowIndex: number) => {
    if (rows.length <= 1) return;
    const newRows = rows.filter((_, i) => i !== rowIndex);
    updateTable(columns, newRows);
  };

  return (
    <div className="my-3 overflow-x-auto select-text">
      <div className="inline-block min-w-full align-middle rounded-xl bg-surface shadow-warm overflow-hidden">
        <table className="min-w-full divide-y divide-border/60 text-xs">
          {/* Header Row */}
          {hasHeader && (
            <thead className="bg-surface-secondary/70">
              <tr>
                {columns.map((col, cIdx) => (
                  <th key={cIdx} className="p-2 border-r border-border/60 last:border-r-0 relative group">
                    <input
                      type="text"
                      value={col}
                      onChange={(e) => handleHeaderChange(cIdx, e.target.value)}
                      className="w-full bg-transparent font-semibold text-text-primary focus:outline-none focus:bg-surface/50 px-1 py-0.5 rounded"
                      placeholder="Tên cột"
                    />
                    {columns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteColumn(cIdx)}
                        className="opacity-0 group-hover:opacity-100 absolute right-1 top-2 p-0.5 text-text-tertiary hover:text-error transition-opacity rounded cursor-pointer"
                        title="Xóa cột này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Table Body */}
          <tbody className="divide-y divide-border bg-surface">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-surface-secondary/40 group">
                {columns.map((_, cIdx) => (
                  <td key={cIdx} className="p-1.5 border-r border-border last:border-r-0 relative">
                    <input
                      type="text"
                      value={row[cIdx] || ''}
                      onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                      className="w-full bg-transparent text-text-primary focus:outline-none focus:bg-primary-soft/30 px-1 py-0.5 rounded"
                      placeholder="Nhập ô..."
                    />
                    {cIdx === columns.length - 1 && rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteRow(rIdx)}
                        className="opacity-0 group-hover:opacity-100 absolute -right-6 top-2 p-0.5 text-text-tertiary hover:text-error transition-opacity rounded cursor-pointer"
                        title="Xóa hàng"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Table Bottom Controls */}
        <div className="flex items-center justify-between p-2 bg-surface-secondary/40 border-t border-border-subtle text-[11px] text-text-tertiary">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-1 font-medium hover:text-primary transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Thêm dòng</span>
            </button>
            <button
              type="button"
              onClick={addColumn}
              className="flex items-center gap-1 font-medium hover:text-primary transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Thêm cột</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => updateTable(columns, rows, !hasHeader)}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            {hasHeader ? 'Ẩn dòng tiêu đề' : 'Hiện dòng tiêu đề'}
          </button>
        </div>
      </div>
    </div>
  );
};
