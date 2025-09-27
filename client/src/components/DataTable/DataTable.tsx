import * as React from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DataTableColumn<T = any> {
  key: string
  title: string
  dataIndex: keyof T
  sortable?: boolean
  render?: (value: any, record: T) => React.ReactNode
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: DataTableColumn<T>[]
  loading?: boolean
  selectable?: boolean
  onRowSelect?: (selectedRows: T[], selectedKeys: string[]) => void
  rowKey: keyof T | ((record: T) => string)
  className?: string
}

type SortOrder = "asc" | "desc" | null

interface SortState {
  column: string | null
  order: SortOrder
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  rowKey,
  className,
}: DataTableProps<T>) {
  const [sortState, setSortState] = React.useState<SortState>({
    column: null,
    order: null,
  })
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([])

  const getRowKey = React.useCallback(
    (record: T): string => {
      if (typeof rowKey === "function") {
        return rowKey(record)
      }
      return String(record[rowKey])
    },
    [rowKey]
  )

  const sortedData = React.useMemo(() => {
    if (!sortState.column || !sortState.order) return data

    return [...data].sort((a, b) => {
      const column = columns.find(col => col.key === sortState.column)
      if (!column) return 0

      const aValue = a[column.dataIndex]
      const bValue = b[column.dataIndex]

      if (aValue < bValue) return sortState.order === "asc" ? -1 : 1
      if (aValue > bValue) return sortState.order === "asc" ? 1 : -1
      return 0
    })
  }, [data, sortState, columns])

  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return

    setSortState(prevState => {
      if (prevState.column === column.key) {
        if (prevState.order === "asc") return { column: column.key, order: "desc" }
        if (prevState.order === "desc") return { column: null, order: null }
      }
      return { column: column.key, order: "asc" }
    })
  }

  const handleSelectAll = (checked: boolean) => {
    const newSelectedKeys = checked ? sortedData.map(getRowKey) : []
    setSelectedKeys(newSelectedKeys)
    
    if (onRowSelect) {
      const selectedRows = checked ? sortedData : []
      onRowSelect(selectedRows, newSelectedKeys)
    }
  }

  const handleRowSelect = (record: T, checked: boolean) => {
    const key = getRowKey(record)
    const newSelectedKeys = checked
      ? [...selectedKeys, key]
      : selectedKeys.filter(k => k !== key)
    
    setSelectedKeys(newSelectedKeys)
    
    if (onRowSelect) {
      const selectedRows = sortedData.filter(row => 
        newSelectedKeys.includes(getRowKey(row))
      )
      onRowSelect(selectedRows, newSelectedKeys)
    }
  }

  const isAllSelected = sortedData.length > 0 && selectedKeys.length === sortedData.length
  const isIndeterminate = selectedKeys.length > 0 && selectedKeys.length < sortedData.length

  const getSortIcon = (column: DataTableColumn<T>) => {
    if (!column.sortable) return null

    if (sortState.column === column.key) {
      if (sortState.order === "asc") {
        return <ChevronUp className="h-4 w-4" />
      }
      if (sortState.order === "desc") {
        return <ChevronDown className="h-4 w-4" />
      }
    }
    return <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
  }

  const getAriaSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return undefined
    if (sortState.column === column.key) {
      return sortState.order === "asc" ? "ascending" : "descending"
    }
    return "none"
  }

  if (loading) {
    return (
      <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label="Data table">
            <thead className="bg-muted/50">
              <tr>
                {selectable && (
                  <th className="px-4 py-3 text-left w-12">
                    <span className="sr-only">Select</span>
                  </th>
                )}
                {columns.map(column => (
                  <th key={column.key} className="px-4 py-3 text-left">
                    <span className="text-sm font-medium text-foreground">
                      {column.title}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="px-4 py-8 text-center"
                >
                  <div className="flex flex-col items-center gap-3" data-testid="loading-state">
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading data...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label="Data table">
            <thead className="bg-muted/50">
              <tr>
                {selectable && (
                  <th className="px-4 py-3 text-left w-12">
                    <span className="sr-only">Select</span>
                  </th>
                )}
                {columns.map(column => (
                  <th key={column.key} className="px-4 py-3 text-left">
                    <span className="text-sm font-medium text-foreground">
                      {column.title}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="px-4 py-8 text-center"
                >
                  <div className="flex flex-col items-center gap-3" data-testid="empty-state">
                    <Inbox className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">No data available</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Data table" data-testid="data-table">
          <thead className="bg-muted/50">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left w-12">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={input => {
                        if (input) input.indeterminate = isIndeterminate
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      aria-label="Select all rows"
                      data-testid="select-all-checkbox"
                      className="rounded border-border text-primary focus:ring-ring focus:ring-2"
                    />
                    <span className="sr-only">Select all</span>
                  </label>
                </th>
              )}
              {columns.map(column => (
                <th key={column.key} className="px-4 py-3 text-left">
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column)}
                      className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors group"
                      aria-sort={getAriaSort(column)}
                      data-testid={`sort-${column.key}`}
                    >
                      <span>{column.title}</span>
                      {getSortIcon(column)}
                    </button>
                  ) : (
                    <span className="text-sm font-medium text-foreground">
                      {column.title}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData.map((record, index) => {
              const key = getRowKey(record)
              const isSelected = selectedKeys.includes(key)
              
              return (
                <tr
                  key={key}
                  className="hover:bg-muted/50 transition-colors"
                  data-testid={`table-row-${key}`}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowSelect(record, e.target.checked)}
                          aria-label={`Select row ${index + 1}`}
                          data-testid={`select-row-${key}`}
                          className="rounded border-border text-primary focus:ring-ring focus:ring-2"
                        />
                        <span className="sr-only">Select row</span>
                      </label>
                    </td>
                  )}
                  {columns.map(column => (
                    <td key={column.key} className="px-4 py-3" data-testid={`cell-${column.key}-${key}`}>
                      {column.render
                        ? column.render(record[column.dataIndex], record)
                        : String(record[column.dataIndex] || "")}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
