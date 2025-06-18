'use client'; // Required because we use React hooks and context (which are client-side only)

// Import necessary React types and functions
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';

/**
 * Define the shape of the global auth state.
 * This tells TypeScript what values will be available via the context.
 */
interface AuthContextType {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    error: string;
    setError: (error: string) => void;
    token: string | null; // Testing hybrid persist
    setToken: (token: string | null) => void;
}

/**
 * Create the AuthContext.
 * Default value is `undefined` until a Provider wraps part of the tree.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that wraps parts of the app needing auth state.
 * This sets up the shared state (email, password, error) and provides it.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState<string | null>(null);

    // Check localStorage for token and set it in state
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Whenever token changes, update localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    return (
        <AuthContext.Provider
            value={{
                email,
                setEmail,
                password,
                setPassword,
                error,
                setError,
                token, // Test
                setToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook for using the auth store.
 * This allows any component to access or update the auth state.
 */
export function useAuthStore() {
    const context = useContext(AuthContext);

    // If this hook is used outside of the provider, throw a helpful error.
    if (!context) {
        throw new Error('useAuthStore must be used inside AuthProvider');
    }
    return context;
}
