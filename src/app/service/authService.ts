// loginUser handles the login API request
export async function loginUser(email: string, password: string) {
    // Send POST request to backend login endpoint
    const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    console.log('This is response: ', response);

    // Parse response body as JSON
    const data = await response.json();

    console.log('This is data: ', data);

    // If login fails, throw an error with the message from server
    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    // Return token on successful login
    return data;
}


export async function registerUser(email: string, password: string) {
    const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }

    return data; // Should return { token: '...' }
}

