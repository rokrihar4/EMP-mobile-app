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
    return data.results || data.meals_menu || data;
}


export const fetchMenu =  async (noOfDays, mealsStr, prepTime, allergiesStr, maxPrice, mealType) => {
    // Sestavi query
    const params = [];
    
    params.push(`n=${noOfDays}`);
    params.push(`time_of_day=${mealsStr}`);
    
    if (prepTime && prepTime !== 'none' && prepTime !== 'null') {
        params.push(`time=${prepTime}`);
    }
    if (allergiesStr && allergiesStr !== 'none' && allergiesStr !== 'null') {
        params.push(`allergies=${allergiesStr}`);
    }
    if (maxPrice && maxPrice !== 'none' && maxPrice !== 'null') {
        params.push(`max_price=${maxPrice}`);
    }
    if (mealType && mealType !== 'none' && mealType !== 'null') {
        params.push(`meal_type=${mealType}`);
    }
    
    const queryString = params.join('&');
    const meals_menu = `${KUPKO_CONFIG.BASE_URL}/random_menu?${queryString}`;
    
    console.log("API URL:", meals_menu); // Debug, da vidimo kakšen je sestavljen url
    
    const response = await fetch(meals_menu, {
        method: "GET",
        headers: KUPKO_CONFIG.Headers,
    });
    
    const data = await response.json();
    return data;
};