// Lightweight multilingual support (English + Hindi)
const dict = {
  en: { dashboard: 'Dashboard', farms: 'My Farms', crops: 'Crops', store: 'Store', orders: 'Orders', forum: 'Community', admin: 'Admin',
    logout: 'Logout', login: 'Login', register: 'Register', weather: 'Weather & Pest Alerts', city: 'City', check: 'Check',
    cropStatus: 'Crop status', soilNutrients: 'Soil nutrients (kg/ha)', add: 'Add', save: 'Save', delete: 'Delete', edit: 'Edit',
    cancel: 'Cancel', soilReport: 'Soil report', name: 'Name', email: 'Email', password: 'Password', addToCart: 'Add to cart',
    placeOrder: 'Place order', address: 'Delivery address', total: 'Total', ask: 'Ask an expert', community: 'Community forum', welcome: 'Welcome' },
  hi: { dashboard: 'डैशबोर्ड', farms: 'मेरे खेत', crops: 'फसलें', store: 'दुकान', orders: 'ऑर्डर', forum: 'समुदाय', admin: 'एडमिन',
    logout: 'लॉगआउट', login: 'लॉगिन', register: 'रजिस्टर', weather: 'मौसम और कीट चेतावनी', city: 'शहर', check: 'देखें',
    cropStatus: 'फसल की स्थिति', soilNutrients: 'मिट्टी के पोषक तत्व (किग्रा/हे.)', add: 'जोड़ें', save: 'सेव', delete: 'हटाएं', edit: 'बदलें',
    cancel: 'रद्द करें', soilReport: 'मिट्टी रिपोर्ट', name: 'नाम', email: 'ईमेल', password: 'पासवर्ड', addToCart: 'कार्ट में डालें',
    placeOrder: 'ऑर्डर करें', address: 'डिलीवरी पता', total: 'कुल', ask: 'विशेषज्ञ से पूछें', community: 'किसान समुदाय', welcome: 'स्वागत है' },
};
export const makeT = (lang) => (k) => dict[lang]?.[k] || dict.en[k] || k;
