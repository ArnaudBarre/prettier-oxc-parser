import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';

// 基本的なProps定義
interface TableProps<T> {
  data: T[];
  columns: Array<{
    header: string;
    accessor: keyof T | ((data: T) => string);
    sortable?: boolean;
    width?: number | string;
    Cell?: (props: { value: any; row: T }) => React.ReactNode;
  }>;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  className?: string;
  emptyState?: React.ReactNode;
}

// ソートの状態を管理する型
type SortConfig<T> = {
  key: keyof T | null;
  direction: 'asc' | 'desc';
};

// フォーマット用のヘルパー関数
const formatValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return String(value);
};

// テーブルコンポーネント
export function Table<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  sortable = true,
  pagination = true,
  pageSize = 10,
  className = '',
  emptyState = <div>No data available</div>,
}: TableProps<T>): JSX.Element {
  // ソート状態
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: null,
    direction: 'asc',
  });

  // ページング状態
  const [currentPage, setCurrentPage] = useState(0);
  
  // ソート関連のハンドラー
  const handleSort = useCallback((key: keyof T) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig.key === key) {
        return {
          key,
          direction: prevSortConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  // ソート済みのデータを計算する
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];
      
      if (aValue === bValue) return 0;
      
      const compareResult = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? compareResult : -compareResult;
    });
  }, [data, sortConfig]);

  // 現在のページのデータを計算する
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = currentPage * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  // 総ページ数を計算する
  const pageCount = useMemo(() => {
    return Math.ceil(sortedData.length / pageSize);
  }, [sortedData.length, pageSize]);

  // ページ変更ハンドラー
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  // データがない場合は空の状態を表示
  if (!isLoading && (!data || data.length === 0)) {
    return <div className={`table-empty ${className}`}>{emptyState}</div>;
  }

  return (
    <div className={`table-container ${className}`}>
      {isLoading && (
        <div className="table-loading-overlay">
          <div className="table-loading-spinner" />
        </div>
      )}
      
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                style={{ width: column.width }}
                className={`
                  ${column.sortable !== false && sortable ? 'sortable-header' : ''}
                  ${sortConfig.key === column.accessor ? `sorted-${sortConfig.direction}` : ''}
                `}
                onClick={() => {
                  if (column.sortable !== false && sortable && typeof column.accessor === 'string') {
                    handleSort(column.accessor as keyof T);
                  }
                }}
              >
                {column.header}
                {column.sortable !== false && sortable && (
                  <span className="sort-indicator">
                    {sortConfig.key === column.accessor && (
                      sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                    )}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'clickable-row' : ''}
            >
              {columns.map((column, colIndex) => {
                const accessorKey = column.accessor;
                let cellValue;
                
                if (typeof accessorKey === 'function') {
                  cellValue = accessorKey(row);
                } else {
                  cellValue = row[accessorKey];
                }
                
                return (
                  <td key={colIndex}>
                    {column.Cell ? (
                      <column.Cell value={cellValue} row={row} />
                    ) : (
                      formatValue(cellValue)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      {pagination && pageCount > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0}
            className="pagination-button first"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="pagination-button prev"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {currentPage + 1} of {pageCount}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pageCount - 1}
            className="pagination-button next"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(pageCount - 1)}
            disabled={currentPage >= pageCount - 1}
            className="pagination-button last"
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
}

// 使用例
export const TableExample = (): JSX.Element => {
  interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: boolean;
    lastLogin: Date;
  }
  
  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: true, lastLogin: new Date('2023-01-15') },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: true, lastLogin: new Date('2023-02-20') },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: false, lastLogin: new Date('2022-11-05') },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: true, lastLogin: new Date('2023-03-10') },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: false, lastLogin: new Date('2022-09-18') },
  ];
  
  const columns = [
    { header: 'ID', accessor: 'id', width: '60px' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { 
      header: 'Status', 
      accessor: 'status',
      Cell: ({ value }: { value: boolean }) => (
        <span style={{ color: value ? 'green' : 'red' }}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { header: 'Last Login', accessor: 'lastLogin' },
  ];
  
  const handleRowClick = (user: User) => {
    console.log('Row clicked:', user);
    alert(`You clicked on ${user.name}`);
  };
  
  return (
    <div>
      <h2>User Management</h2>
      <Table
        data={users}
        columns={columns}
        onRowClick={handleRowClick}
        pagination={true}
        pageSize={3}
      />
    </div>
  );
};