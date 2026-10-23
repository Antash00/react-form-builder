export type Choice = { id: string; name: string }

const choices = (names: string[]): Choice[] => names.map((name) => ({ id: name, name }))

export const getName = (item: Choice) => item.name
export const getId = (item: Choice) => item.id
export const sameChoice = (a: Choice, b: Choice) => a.id === b.id

export const departments = choices([
    'Engineering',
    'Product',
    'Design',
    'Operations',
    'Finance',
    'People',
    'Sales',
    'Marketing',
    'Customer Success',
    'Legal',
    'Security',
    'Data',
])

export const teams = choices([
    'Operations',
    'Design',
    'Engineering',
    'Product',
    'Data',
    'Security',
    'Finance',
    'People',
    'Marketing',
    'Sales',
    'Support',
    'Legal',
])

export const offices = choices([
    'London',
    'Berlin',
    'Paris',
    'Madrid',
    'Amsterdam',
    'Warsaw',
    'Tbilisi',
    'New York',
    'Toronto',
    'Austin',
    'Singapore',
    'Tokyo',
])

export const managers = choices([
    'Alex Morgan',
    'Sam Rivera',
    'Taylor Kim',
    'Jordan Patel',
    'Casey Brown',
    'Morgan Lee',
    'Riley Chen',
    'Avery Singh',
    'Jamie Park',
    'Drew Wilson',
    'Robin Clark',
    'Skyler Davis',
    'Cameron Green',
    'Quinn Martin',
    'Blair Adams',
])

export const costCenters = choices([
    'CC-100 Product',
    'CC-110 Platform',
    'CC-120 Design',
    'CC-130 Operations',
    'CC-140 Finance',
    'CC-150 People',
    'CC-160 Sales',
    'CC-170 Marketing',
    'CC-180 Support',
    'CC-190 Security',
    'CC-200 Data',
    'CC-210 Legal',
])

export const equipment = choices([
    'Laptop',
    'External monitor',
    'Keyboard',
    'Mouse',
    'Headset',
    'Webcam',
    'Docking station',
    'Security key',
    'Phone',
    'Tablet',
    'Desk chair',
    'Standing desk',
])

export const accessGroups = choices([
    'Email',
    'Calendar',
    'Chat',
    'Wiki',
    'Issue tracker',
    'Source control',
    'Analytics',
    'CRM',
    'Billing',
    'Cloud console',
])

export const industries = choices([
    'Software',
    'Healthcare',
    'Logistics',
    'Manufacturing',
    'Education',
    'Retail',
    'Financial services',
    'Energy',
    'Media',
    'Telecommunications',
    'Construction',
    'Travel',
])

export const countries = choices([
    'Australia',
    'Canada',
    'France',
    'Germany',
    'Georgia',
    'India',
    'Ireland',
    'Japan',
    'Netherlands',
    'Poland',
    'Singapore',
    'Spain',
    'Sweden',
    'United Kingdom',
    'United States',
])

export const currencies = choices([
    'AUD',
    'CAD',
    'CHF',
    'EUR',
    'GBP',
    'GEL',
    'INR',
    'JPY',
    'PLN',
    'USD',
])

export const supplierCategories = choices([
    'Cloud services',
    'Consulting',
    'Facilities',
    'Hardware',
    'Legal services',
    'Marketing',
    'Office supplies',
    'Recruiting',
    'Security',
    'Software',
    'Telecommunications',
    'Training',
    'Travel',
    'Translation',
    'Utilities',
])

export const regions = choices([
    'North America',
    'South America',
    'Western Europe',
    'Eastern Europe',
    'Northern Europe',
    'Southern Europe',
    'Middle East',
    'North Africa',
    'Sub-Saharan Africa',
    'South Asia',
    'East Asia',
    'Oceania',
])
