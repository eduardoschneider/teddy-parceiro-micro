import React from 'react';
import { useTable } from 'react-table';
import './styles.scss'

interface TableProps {
    columns: any[];
    data: any[];
    onDelete: any,
    onEdit: any
}

const Table: React.FC<TableProps> = ({ columns, data, onDelete, onEdit }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
        <div className="table-wrapper">
            <table {...getTableProps()} className="table">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className={`table-header ${column.id}-column`}>{column.render('Header')}</th>
                            ))}
                            <th> Ações </th>
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        const empresa = row.original;
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>
                                        {Array.isArray(cell.value) ? (
                                            cell.value.length
                                        ) : typeof cell.value === 'string' ? (
                                            cell.value.trim() === '' ? 'Não informado' : cell.value
                                        ) : typeof cell.value === 'boolean' ? (
                                            cell.value ? 'Ativa' : 'Inativa'
                                        ) : (
                                            cell.render('Cell')
                                        )}
                                    </td>
                                ))}
                                <td className="actions">
                                    <button className="button edit" onClick={() => onEdit(empresa)}>Editar</button>
                                    <button className="button delete" onClick={() => onDelete(empresa.id)}>Excluir</button>
                                </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Table;