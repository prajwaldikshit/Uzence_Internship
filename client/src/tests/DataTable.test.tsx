import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/lib/test-utils'
import { DataTable, DataTableColumn } from '@/components/DataTable'

interface TestData {
  id: string
  name: string
  email: string
  role: string
}

const mockData: TestData[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
]

const mockColumns: DataTableColumn<TestData>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'role', title: 'Role', dataIndex: 'role', sortable: false },
]

describe('DataTable', () => {
  it('renders table with data and columns', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        rowKey="id"
      />
    )
    
    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    
    // Check data rows
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Editor')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        rowKey="id"
        loading={true}
      />
    )
    
    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        rowKey="id"
        loading={false}
      />
    )
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('handles sorting when sortable column header is clicked', async () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        rowKey="id"
      />
    )
    
    const nameHeader = screen.getByTestId('sort-name')
    
    // Initially unsorted
    expect(nameHeader).toHaveAttribute('aria-sort', 'none')
    
    // Click to sort ascending
    fireEvent.click(nameHeader)
    await waitFor(() => {
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
    })
    
    // Click again to sort descending
    fireEvent.click(nameHeader)
    await waitFor(() => {
      expect(nameHeader).toHaveAttribute('aria-sort', 'descending')
    })
    
    // Click again to remove sorting
    fireEvent.click(nameHeader)
    await waitFor(() => {
      expect(nameHeader).toHaveAttribute('aria-sort', 'none')
    })
  })

  it('renders select all checkbox when selectable', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        selectable
      />
    )
    
    expect(screen.getByTestId('select-all-checkbox')).toBeInTheDocument()
  })

  it('handles select all checkbox functionality', async () => {
    const handleRowSelect = vi.fn()
    
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        selectable
        onRowSelect={handleRowSelect}
      />
    )
    
    const selectAllCheckbox = screen.getByTestId('select-all-checkbox') as HTMLInputElement
    
    // Initially unchecked
    expect(selectAllCheckbox.checked).toBe(false)
    
    // Click select all
    fireEvent.click(selectAllCheckbox)
    
    await waitFor(() => {
      expect(handleRowSelect).toHaveBeenCalledWith(
        mockData,
        ['1', '2', '3']
      )
    })
  })

  it('handles individual row selection', async () => {
    const handleRowSelect = vi.fn()
    
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        selectable
        onRowSelect={handleRowSelect}
      />
    )
    
    const firstRowCheckbox = screen.getByTestId('select-row-1')
    
    fireEvent.click(firstRowCheckbox)
    
    await waitFor(() => {
      expect(handleRowSelect).toHaveBeenCalledWith(
        [mockData[0]],
        ['1']
      )
    })
  })

  it('renders custom cell content when render function is provided', () => {
    const customColumns: DataTableColumn<TestData>[] = [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        render: (value) => <strong>{value}</strong>
      },
      {
        key: 'email',
        title: 'Email',
        dataIndex: 'email',
      },
    ]
    
    render(
      <DataTable
        data={mockData}
        columns={customColumns}
        rowKey="id"
      />
    )
    
    // Check that custom rendering is applied
    const nameElement = screen.getByText('John Doe')
    expect(nameElement.tagName).toBe('STRONG')
  })

  it('maintains selection state when data changes', async () => {
    const handleRowSelect = vi.fn()
    
    const { rerender } = render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        selectable
        onRowSelect={handleRowSelect}
      />
    )
    
    // Select first row
    const firstRowCheckbox = screen.getByTestId('select-row-1')
    fireEvent.click(firstRowCheckbox)
    
    await waitFor(() => {
      expect(handleRowSelect).toHaveBeenCalledWith([mockData[0]], ['1'])
    })
    
    // Update data (remove second item)
    const updatedData = [mockData[0], mockData[2]]
    rerender(
      <DataTable
        data={updatedData}
        columns={mockColumns}
        rowKey="id"
        selectable
        onRowSelect={handleRowSelect}
      />
    )
    
    // First row should still be selected
    const updatedFirstRowCheckbox = screen.getByTestId('select-row-1') as HTMLInputElement
    expect(updatedFirstRowCheckbox.checked).toBe(true)
  })

  it('uses rowKey function when provided', () => {
    const rowKeyFn = (record: TestData) => `user-${record.id}`
    
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        rowKey={rowKeyFn}
        selectable
      />
    )
    
    // Check that the generated row keys are used
    expect(screen.getByTestId('select-row-user-1')).toBeInTheDocument()
    expect(screen.getByTestId('select-row-user-2')).toBeInTheDocument()
  })
})
