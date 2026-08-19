import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: function NextImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
  }),
}));

// Mock useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="calendar" />,
  Users: () => <span data-testid="users" />,
  MapPin: () => <span data-testid="map-pin" />,
  CheckCircle: () => <span data-testid="check-circle" />,
  ChevronDown: () => <span data-testid="chevron-down" />,
  ChevronUp: () => <span data-testid="chevron-up" />,
  Loader2: () => <span data-testid="loader" />,
  Lock: () => <span data-testid="lock" />,
  AlertCircle: () => <span data-testid="alert-circle" />,
  CheckCircle2: () => <span data-testid="check-circle-2" />,
  Eye: () => <span data-testid="eye" />,
  EyeOff: () => <span data-testid="eye-off" />,
  Mail: () => <span data-testid="mail" />,
  AlertTriangle: () => <span data-testid="alert-triangle" />,
  User: () => <span data-testid="user" />,
  Send: () => <span data-testid="send" />,
}));