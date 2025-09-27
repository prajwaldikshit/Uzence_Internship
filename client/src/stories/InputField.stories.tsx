import type { Meta, StoryObj } from '@storybook/react'
import { InputField } from '@/components/InputField'
import { useState } from 'react'

const meta = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input field component with multiple variants, sizes, and features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    invalid: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    password: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof InputField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Default Input',
    placeholder: 'Enter text...',
    helperText: 'This is helper text',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <InputField
        label="Outlined (Default)"
        placeholder="Outlined variant"
        variant="outlined"
      />
      <InputField
        label="Filled"
        placeholder="Filled variant"
        variant="filled"
      />
      <InputField
        label="Ghost"
        placeholder="Ghost variant"
        variant="ghost"
      />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <InputField
        label="Small"
        placeholder="Small input"
        size="sm"
      />
      <InputField
        label="Medium (Default)"
        placeholder="Medium input"
        size="md"
      />
      <InputField
        label="Large"
        placeholder="Large input"
        size="lg"
      />
    </div>
  ),
}

export const WithPassword: Story = {
  render: () => {
    const [password, setPassword] = useState('')
    return (
      <div className="w-80">
        <InputField
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Password must be at least 8 characters"
        />
      </div>
    )
  },
}

export const WithClearable: Story = {
  render: () => {
    const [value, setValue] = useState('Clear me!')
    return (
      <div className="w-80">
        <InputField
          label="Clearable Input"
          placeholder="Type something..."
          clearable
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="Click the X to clear"
        />
      </div>
    )
  },
}

export const ErrorState: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    value: 'invalid-email',
    invalid: true,
    errorMessage: 'Please enter a valid email address',
  },
}

export const LoadingState: Story = {
  args: {
    label: 'Validating Field',
    placeholder: 'Checking availability...',
    loading: true,
    value: 'username123',
  },
}

export const DisabledState: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This field is disabled',
    disabled: true,
    value: 'Cannot edit this',
    helperText: 'This field is read-only',
  },
}

export const AllFeatures: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      username: '',
      email: 'test@',
      password: '',
      search: 'Clear me',
    })

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    return (
      <div className="space-y-6 w-96">
        <InputField
          label="Username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange('username')}
          helperText="Must be unique and 3+ characters"
          size="lg"
        />
        
        <InputField
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange('email')}
          invalid={formData.email.includes('@') && !formData.email.includes('.com')}
          errorMessage={formData.email.includes('@') && !formData.email.includes('.com') ? 'Please enter a valid email' : undefined}
          variant="filled"
        />
        
        <InputField
          label="Password"
          placeholder="Create a password"
          password
          value={formData.password}
          onChange={handleChange('password')}
          helperText="At least 8 characters with numbers and symbols"
        />
        
        <InputField
          label="Search"
          placeholder="Search users..."
          clearable
          value={formData.search}
          onChange={handleChange('search')}
          variant="ghost"
          size="sm"
        />
        
        <InputField
          label="Loading Example"
          placeholder="Checking availability..."
          loading
          disabled
          value="checking..."
        />
      </div>
    )
  },
}
