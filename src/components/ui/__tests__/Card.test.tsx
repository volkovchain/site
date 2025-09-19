import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { Card } from '../Card'

describe('Card Component', () => {
  it('renders with default props', () => {
    render(<Card>Card content</Card>)
    
    const card = screen.getByText('Card content')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('bg-white', 'dark:bg-gray-800')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Card variant="default">Default</Card>)
    expect(screen.getByText('Default')).toHaveClass('bg-white')

    rerender(<Card variant="ghost">Ghost</Card>)
    expect(screen.getByText('Ghost')).toHaveClass('bg-transparent')

    rerender(<Card variant="outline">Outline</Card>)
    expect(screen.getByText('Outline')).toHaveClass('border-2')
  })

  it('applies hover effects when hover prop is true', () => {
    render(<Card hover>Hoverable card</Card>)
    
    const card = screen.getByText('Hoverable card')
    expect(card).toHaveClass('hover:shadow-lg')
  })

  it('handles click events when clickable', () => {
    const handleClick = vi.fn()
    render(<Card onClick={handleClick}>Clickable card</Card>)
    
    const card = screen.getByText('Clickable card')
    fireEvent.click(card)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(card).toHaveClass('cursor-pointer')
  })

  it('renders with custom className', () => {
    render(<Card className="custom-class">Custom card</Card>)
    
    const card = screen.getByText('Custom card')
    expect(card).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Card ref={ref}>Ref test</Card>)
    
    expect(ref).toHaveBeenCalled()
  })

  it('applies correct padding classes', () => {
    render(<Card>Padded card</Card>)
    
    const card = screen.getByText('Padded card')
    expect(card).toHaveClass('p-6')
  })

  it('has correct border radius', () => {
    render(<Card>Rounded card</Card>)
    
    const card = screen.getByText('Rounded card')
    expect(card).toHaveClass('rounded-lg')
  })

  it('supports dark mode', () => {
    render(<Card>Dark mode card</Card>)
    
    const card = screen.getByText('Dark mode card')
    expect(card).toHaveClass('dark:bg-gray-800', 'dark:border-gray-700')
  })
})