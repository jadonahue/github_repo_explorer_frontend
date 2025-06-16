export async function searchGithubRepos(username: string, token: string) {
    const response = await fetch(
        `http://localhost:3001/user/searchRepo?username=${username}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    // check for server errors
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Search failed');
    }

    return data; // Return data to UI
}
