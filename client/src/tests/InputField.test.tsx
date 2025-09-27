import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/lib/test-utils'
import { InputField } from '@/components/InputField'

describe('InputField', () => {
  it('renders with label and placeholder', () => {
    render(
      <InputField 
        label="Test Label" 
        placeholder="Test placeholder" 
      />
    )
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument()
  })

  it('handles controlled input changes', async () => {
    const handleChange = vi.fn()
    
    render(
      <InputField 
        label="Test Input"
        value="initial"
        onChange={handleChange}
      />
    )
    
    const input = screen.getByLabelText('Test Input')
    fireEvent.change(input, { target: { value: 'new value' } })
    
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: 'new value' })
        })
      )
    })
  })

  it('shows and hides password when password toggle is clicked', async () => {
    render(
      <InputField 
        label="Password"
        password
        value="secret123"
        onChange={() => {}}
      />
    )
    
    const input = screen.getByLabelText('Password') as HTMLInputElement
    const toggleButton = screen.getByLabelText('Show password')
    
    // Initially password should be hidden
    expect(input.type).toBe('password')
    
    // Click toggle to show password
    fireEvent.click(toggleButton)
    await waitFor(() => {
      expect(input.type).toBe('text')
    })
    
    // Click again to hide password
    fireEvent.click(screen.getByLabelText('Hide password'))
    await waitFor(() => {
      expect(input.type).toBe('password')
    })
  })

  it('clears input when clear button is clicked', async () => {
    const handleChange = vi.fn()
    
    render(
      <InputField 
        label="Clearable Input"
        clearable
        value="clear me"
        onChange={handleChange}
      />
    )
    
    const clearButton = screen.getByLabelText('Clear input')
    fireEvent.click(clearButton)
    
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: '' })
        })
      )
    })
  })

  it('displays error message when invalid', () => {
    render(
      <InputField 
        label="Test Input"
        invalid
        errorMessage="This field is required"
      />
    )
    
    const input = screen.getByLabelText('Test Input')
    const errorMessage = screen.getByText('This field is required')
    
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(errorMessage).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('error'))
  })

  it('displays helper text when provided', () => {
    render(
      <InputField 
        label="Test Input"
        helperText="This is helpful information"
      />
    )
    
    const input = screen.getByLabelText('Test Input')
    const helperText = screen.getByText('This is helpful information')
    
    expect(helperText).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('helper'))
  })

  it('shows loading spinner when loading', () => {
    render(
      <InputField 
        label="Loading Input"
        loading
      />
    )
    
    expect(screen.getByTestId(/loading-/)).toBeInTheDocument()
    expect(screen.getByLabelText('Loading Input')).toBeDisabled()
  })

  it('applies different sizes correctly', () => {
    const { rerender } = render(
      <InputField 
        label="Test Input"
        size="sm"
      />
    )
    
    let input = screen.getByLabelText('Test Input')
    expect(input).toHaveClass('text-sm')
    
    rerender(
      <InputField 
        label="Test Input"
        size="lg"
      />
    )
    
    input = screen.getByLabelText('Test Input')
    expect(input).toHaveClass('text-lg')
  })

  it('applies different variants correctly', () => {
    const { rerender } = render(
      <InputField 
        label="Test Input"
        variant="filled"
      />
    )
    
    let input = screen.getByLabelText('Test Input')
    expect(input).toHaveClass('bg-muted')
    
    rerender(
      <InputField 
        label="Test Input"
        variant="ghost"
      />
    )
    
    input = screen.getByLabelText('Test Input')
    expect(input).toHaveClass('bg-transparent')
  })

  it('is disabled when disabled prop is true', () => {
    render(
      <InputField 
        label="Disabled Input"
        disabled
      />
    )
    
    const input = screen.getByLabelText('Disabled Input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('cursor-not-allowed')
  })
})
