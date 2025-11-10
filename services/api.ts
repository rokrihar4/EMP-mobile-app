export const KUPKO_CONFIG = {
    BASE_URL: 'https://kupko-api.onrender.com',
    Headers: {
        accept: 'application/json'
    }
}

export const fetchMeals = async() => {
    const endpoint = `${KUPKO_CONFIG.BASE_URL}/meal`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: KUPKO_CONFIG.Headers
    });

    const data = await response.json();
    return data.results || data.meals || data;
}


export const fetchWeeklyMenu = async() => {
    const meals = `${KUPKO_CONFIG.BASE_URL}/randomly_weekly_menu`;

    const response = await fetch(meals, {
        method: 'GET',
        headers: KUPKO_CONFIG.Headers
    });

    const data = await response.json();
    return data.results || data.meals || data;
}