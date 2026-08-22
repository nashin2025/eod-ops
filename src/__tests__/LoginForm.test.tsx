import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LoginForm } from '@/components/auth/LoginForm';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('has required attribute on email input', () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('required');
  });

  it('has required attribute on password input', () => {
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('required');
  });

  it('shows submit button', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    render(<LoginForm />);
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('renders sign up link', () => {
    render(<LoginForm />);
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });
});