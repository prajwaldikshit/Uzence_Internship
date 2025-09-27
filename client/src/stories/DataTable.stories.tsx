import type { Meta, StoryObj } from '@storybook/react'
import { DataTable, DataTableColumn } from '@/components/DataTable'
import { useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  lastActive: string
  avatar?: string
}

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
    status: 'active',
    lastActive: '5 minutes ago',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Viewer',
    status: 'inactive',
    lastActive: '1 day ago',
  },
  {
    id: '4',
    name: 'Alice Wilson',
    email: 'alice.wilson@example.com',
    role: 'Editor',
    status: 'pending',
    lastActive: '3 hours ago',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'Admin',
    status: 'active',
    lastActive: '1 hour ago',
  },
]

const basicColumns: DataTableColumn<User>[] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    sortable: true,
  },
  {
    key: 'role',
    title: 'Role',
    dataIndex: 'role',
    sortable: true,
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    sortable: true,
  },
]

const richColumns: DataTableColumn<User>[] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
    render: (value, record) => (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-primary">
            {record.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">@{value.toLowerCase().replace(' ', '')}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    sortable: true,
  },
  {
    key: 'role',
    title: 'Role',
    dataIndex: 'role',
    sortable: true,
    render: (value) => (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
        {value}
      </span>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    sortable: true,
    render: (value) => {
      const statusColors = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      }
      
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
  },
  {
    key: 'lastActive',
    title: 'Last Active',
    dataIndex: 'lastActive',
    sortable: true,
  },
]

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive data table component with sorting, selection, and custom rendering capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
    },
    selectable: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: sampleUsers,
    columns: basicColumns,
    rowKey: 'id',
  },
}

export const WithSelection: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<User[]>([])
    
    const handleRowSelect = (rows: User[], keys: string[]) => {
      setSelectedRows(rows)
      console.log('Selected rows:', rows)
      console.log('Selected keys:', keys)
    }

    return (
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Selectable Table</h3>
          {selectedRows.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Selected {selectedRows.length} row(s): {selectedRows.map(r => r.name).join(', ')}
            </p>
          )}
        </div>
        <DataTable
          data={sampleUsers}
          columns={basicColumns}
          rowKey="id"
          selectable
          onRowSelect={handleRowSelect}
        />
      </div>
    )
  },
}

export const WithCustomRendering: Story = {
  args: {
    data: sampleUsers,
    columns: richColumns,
    rowKey: 'id',
    selectable: true,
  },
}

export const LoadingState: Story = {
  args: {
    data: [],
    columns: basicColumns,
    rowKey: 'id',
    loading: true,
  },
}

export const EmptyState: Story = {
  args: {
    data: [],
    columns: basicColumns,
    rowKey: 'id',
    loading: false,
  },
}

export const WithSorting: Story = {
  render: () => {
    return (
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Sortable Table</h3>
          <p className="text-sm text-muted-foreground">
            Click on column headers to sort. All columns are sortable.
          </p>
        </div>
        <DataTable
          data={sampleUsers}
          columns={richColumns}
          rowKey="id"
        />
      </div>
    )
  },
}

export const LargeDataset: Story = {
  render: () => {
    // Generate more sample data
    const largeDataset: User[] = Array.from({ length: 50 }, (_, i) => ({
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: ['Admin', 'Editor', 'Viewer'][i % 3],
      status: (['active', 'inactive', 'pending'] as const)[i % 3],
      lastActive: `${Math.floor(Math.random() * 24)} hours ago`,
    }))

    return (
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Large Dataset</h3>
          <p className="text-sm text-muted-foreground">
            Table with 50 users demonstrating performance with larger datasets.
          </p>
        </div>
        <DataTable
          data={largeDataset}
          columns={richColumns}
          rowKey="id"
          selectable
        />
      </div>
    )
  },
}

export const InteractiveExample: Story = {
  render: () => {
    const [data, setData] = useState(sampleUsers)
    const [loading, setLoading] = useState(false)
    const [selectedRows, setSelectedRows] = useState<User[]>([])

    const handleRefresh = () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        // Simulate data refresh
        setData([...sampleUsers].sort(() => Math.random() - 0.5))
      }, 2000)
    }

    const handleRowSelect = (rows: User[], keys: string[]) => {
      setSelectedRows(rows)
    }

    const handleDeleteSelected = () => {
      const selectedIds = selectedRows.map(row => row.id)
      setData(data.filter(user => !selectedIds.includes(user.id)))
      setSelectedRows([])
    }

    return (
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Interactive Table</h3>
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
            {selectedRows.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
              >
                Delete Selected ({selectedRows.length})
              </button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {data.length} users. {selectedRows.length} selected.
          </p>
        </div>
        <DataTable
          data={data}
          columns={richColumns}
          rowKey="id"
          selectable
          loading={loading}
          onRowSelect={handleRowSelect}
        />
      </div>
    )
  },
}
