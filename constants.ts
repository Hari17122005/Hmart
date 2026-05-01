import { Product, Category, HeroSlide, User, SideBanner } from './types';

// Updated credentials
export const DEFAULT_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@gmail.com',
    password: '12345'
  },
  {
    id: 'user-1',
    name: 'John Doe',
    role: 'user',
    email: 'user@gmail.com',
    password: 'user'
  }
];

export const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 1,
    badge: "Delivery in 30 mins",
    title: "Fresh Groceries Delivered Daily",
    subtitle: "Handpicked fruits, vegetables, dairy & bakery items delivered to your doorstep.",
    cta: "", // No button
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 2,
    badge: "Best Sellers",
    title: "Fresh Fruits & Vegetables",
    subtitle: "Farm-fresh, hygienically packed produce for your family's health.",
    cta: "", // No button
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 3,
    badge: "Limited Time",
    title: "Hot Offers & Discounts",
    subtitle: "Grab the best deals on your daily essentials before they run out!",
    cta: "View Offers", // Button present
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000",
  }
];

export const DEFAULT_SIDE_BANNERS: SideBanner[] = [
  {
    id: 'banner-1',
    subTitle: 'Daily Essentials',
    title: 'Snacks for every mood',
    cta: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=400',
    categoryLink: Category.SNACKS,
    theme: 'yellow'
  },
  {
    id: 'banner-2',
    subTitle: 'Freshly Baked',
    title: 'Bakery Specials',
    cta: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=400',
    categoryLink: Category.BAKERY,
    theme: 'emerald'
  }
];

const MOCK_REVIEWS = [
    { id: 'r1', user: 'Alice M.', rating: 5, comment: 'Absolutely fresh and delivered on time!', date: '2 days ago' },
    { id: 'r2', user: 'Bob K.', rating: 4, comment: 'Great quality, but packaging could be better.', date: '1 week ago' },
    { id: 'r3', user: 'Charlie', rating: 5, comment: 'Worth every penny. Tastes amazing.', date: '2 weeks ago' }
];

const DEFAULT_HIGHLIGHTS = ['Farm Fresh', 'Quality Checked', 'Organic', 'Best Price'];

const RAW_PRODUCTS: Product[] = [
  // Fresh Fruit
  {
    id: '1',
    name: 'Apple',
    price: 1.99,
    category: Category.FRUITS,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    unit: 'lb',
    description: 'Fresh, crisp red apples sourced from local orchards.',
    inStock: true,
    rating: 4.8,
    highlights: ['Farm Fresh', 'Crunchy', 'Sweet'],
  },
  {
    id: '2',
    name: 'Banana',
    price: 0.89,
    category: Category.FRUITS,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80',
    unit: 'lb',
    description: 'Sweet and ripe bananas, perfect for snacks or baking.',
    inStock: true,
    rating: 4.5,
    highlights: ['Potassium Rich', 'Ripe', 'Energy Booster']
  },
  {
    id: '3',
    name: 'Orange',
    price: 1.49,
    category: Category.FRUITS,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80',
    unit: 'lb',
    description: 'Juicy and Vitamin C rich oranges.',
    inStock: true,
    rating: 4.2,
    highlights: DEFAULT_HIGHLIGHTS
  },
  {
    id: '4',
    name: 'Mango',
    price: 1.99,
    category: Category.FRUITS,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    unit: 'pc',
    description: 'Sweet and aromatic seasonal mangoes.',
    inStock: true,
    rating: 4.9,
    highlights: ['Sweet', 'Seasonal', 'Aromatic']
  },
  {
    id: '5',
    name: 'Grapes',
    price: 2.99,
    category: Category.FRUITS,
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
    unit: 'lb',
    description: 'Fresh red grapes, sweet and juicy.',
    inStock: true,
    rating: 4.4,
    highlights: DEFAULT_HIGHLIGHTS
  },
  {
    id: '6',
    name: 'Pineapple',
    price: 3.99,
    category: Category.FRUITS,
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80',
    unit: 'pc',
    description: 'Tropical, sweet pineapple with golden flesh.',
    inStock: true,
    rating: 4.6,
    highlights: ['Tropical', 'Sweet', 'Fresh Cut']
  },
  {
    id: '7',
    name: 'Watermelon',
    price: 5.99,
    category: Category.FRUITS,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    unit: 'pc',
    description: 'Large, refreshing watermelon, perfect for summer.',
    inStock: true,
    rating: 4.3
  },
  {
    id: '8',
    name: 'Papaya',
    price: 3.99,
    category: Category.FRUITS,
    image: 'https://images.unsplash.com/photo-1617112848923-cc9419156a16?auto=format&fit=crop&w=800&q=80', 
    unit: 'pc',
    description: 'Ripe papaya, rich in antioxidants and vitamins.',
    inStock: true,
    rating: 4.1
  },
  {
    id: '9',
    name: 'Pomegranate',
    price: 2.49,
    category: Category.FRUITS,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    unit: 'pc',
    description: 'Fresh pomegranate with ruby red seeds.',
    inStock: true,
    rating: 4.7
  },
  {
    id: '10',
    name: 'Strawberry',
    price: 3.99,
    category: Category.FRUITS,
    image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=800&q=80',
    unit: 'pack',
    description: 'Fresh, bright red strawberries.',
    inStock: true,
    rating: 4.8
  },

  // Vegetables
  {
    id: '11',
    name: 'Tomato',
    price: 1.99,
    category: Category.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    unit: 'lb',
    description: 'Ripe red tomatoes, great for salads and cooking.',
    inStock: true,
    rating: 4.5,
    highlights: DEFAULT_HIGHLIGHTS
  },
  {
    id: '12',
    name: 'Onion',
    price: 0.99,
    category: Category.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    unit: 'lb',
    description: 'Essential cooking onions, crisp and pungent.',
    inStock: true,
    rating: 4.3
  },
  {
    id: '13',
    name: 'Potato',
    price: 1.29,
    category: Category.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1590165482129-1b8b27377f3e?auto=format&fit=crop&w=800&q=80',
    unit: 'lb',
    description: 'Versatile potatoes, perfect for mashing or frying.',
    inStock: true,
    rating: 4.6
  },
  {
    id: '14',
    name: 'Carrot',
    price: 1.49,
    category: Category.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
    unit: 'lb',
    description: 'Crunchy orange carrots, rich in beta carotene.',
    inStock: true,
    rating: 4.4
  },
  {
    id: '15',
    name: 'Cabbage',
    price: 1.99,
    category: Category.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1550411294-875307bccdd5?auto=format&fit=crop&w=800&q=80',
    unit: 'pc',
    description: 'Fresh green cabbage.',
    inStock: true,
    rating: 4.1
  },
  {
    id: '16',
    name: 'Cauliflower',
    price: 2.99,
    category: Category.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80', 
    unit: 'pc',
    description: 'White cauliflower head, fresh from the farm.',
    inStock: true,
    rating: 4.2
  },
  {
    id: '17',
    name: 'Brinjal (Eggplant)',
    price: 1.99,
    category: Category.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
    unit: 'lb',
    description: 'Glossy purple eggplant.',
    inStock: true,
    rating: 4.0
  },
  {
    id: '18',
    name: 'Lady’s Finger (Okra)',
    price: 2.49,
    category: Category.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1636545759714-3d965d1d6089?auto=format&fit=crop&w=800&q=80',
    unit: 'lb',
    description: 'Fresh green okra pods.',
    inStock: true,
    rating: 4.3
  },
  {
    id: '19',
    name: 'Green Chilli',
    price: 0.99,
    category: Category.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    unit: 'pack',
    description: 'Spicy fresh green chillies.',
    inStock: true,
    rating: 4.5
  },
  {
    id: '20',
    name: 'Spinach',
    price: 1.99,
    category: Category.VEGETABLES,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    unit: 'bunch',
    description: 'Nutrient-rich leafy green spinach.',
    inStock: true,
    rating: 4.7
  },

  // Dairy & Eggs
  {
    id: '21',
    name: 'Milk',
    price: 3.49,
    category: Category.DAIRY,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    unit: 'gallon',
    description: 'Farm fresh whole milk.',
    inStock: true,
    rating: 4.8,
    highlights: ['Farm Fresh', 'Pasteurized', 'Calcium Rich']
  },
  {
    id: '22',
    name: 'Curd (Yogurt)',
    price: 2.99,
    category: Category.DAIRY,
    image: 'https://images.unsplash.com/photo-1564149504817-d1378368526f?auto=format&fit=crop&w=800&q=80',
    unit: 'tub',
    description: 'Thick and creamy natural yogurt.',
    inStock: true,
    rating: 4.6
  },
  {
    id: '23',
    name: 'Butter',
    price: 4.49,
    category: Category.DAIRY,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80', 
    unit: 'pack',
    description: 'Creamy salted butter.',
    inStock: true,
    rating: 4.7
  },
  {
    id: '24',
    name: 'Cheese',
    price: 5.99,
    category: Category.DAIRY,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80',
    unit: 'pack',
    description: 'Aged cheddar cheese block.',
    inStock: true,
    rating: 4.5
  },
  {
    id: '25',
    name: 'Paneer',
    price: 4.99,
    category: Category.DAIRY,
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=800&q=80',
    unit: 'pack',
    description: 'Fresh cottage cheese cubes.',
    inStock: true,
    rating: 4.8
  },
  {
    id: '26',
    name: 'Ghee',
    price: 9.99,
    category: Category.DAIRY,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    unit: 'jar',
    description: 'Pure clarified butter.',
    inStock: true,
    rating: 4.9
  },
  {
    id: '27',
    name: 'Fresh Cream',
    price: 3.99,
    category: Category.DAIRY,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80', 
    unit: 'pack',
    description: 'Rich fresh cream for cooking and desserts.',
    inStock: true,
    rating: 4.4
  },
  {
    id: '28',
    name: 'Eggs',
    price: 4.99,
    category: Category.DAIRY,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
    unit: 'dozen',
    description: 'Free-range large brown eggs.',
    inStock: true,
    rating: 4.7
  },
  {
    id: '29',
    name: 'Flavoured Milk',
    price: 2.49,
    category: Category.DAIRY,
    image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&w=800&q=80',
    unit: 'bottle',
    description: 'Chocolate flavoured dairy milk.',
    inStock: true,
    rating: 4.3
  },
  {
    id: '30',
    name: 'Milk Powder',
    price: 6.99,
    category: Category.DAIRY,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80',
    unit: 'tin',
    description: 'Instant full cream milk powder.',
    inStock: true,
    rating: 4.2
  },

  // Bakery
  {
    id: '31',
    name: 'White Bread',
    price: 2.49,
    category: Category.BAKERY,
    image: 'https://images.unsplash.com/photo-1534620808146-d33bb39128b2?auto=format&fit=crop&w=800&q=80',
    unit: 'loaf',
    description: 'Soft sliced white sandwich bread.',
    inStock: true,
    rating: 4.5
  },
  {
    id: '32',
    name: 'Brown Bread',
    price: 3.49,
    category: Category.BAKERY,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    unit: 'loaf',
    description: 'Whole wheat brown bread.',
    inStock: true,
    rating: 4.6
  },
  {
    id: '33',
    name: 'Bun',
    price: 0.99,
    category: Category.BAKERY,
    image: 'https://images.unsplash.com/photo-1587248720327-8eb72564be1e?auto=format&fit=crop&w=800&q=80',
    unit: 'pack',
    description: 'Soft burger buns, pack of 4.',
    inStock: true,
    rating: 4.4
  },
  {
    id: '34',
    name: 'Croissant',
    price: 2.49,
    category: Category.BAKERY,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    unit: 'pc',
    description: 'Buttery flaky croissant.',
    inStock: true,
    rating: 4.8
  },
  {
    id: '35',
    name: 'Muffin',
    price: 2.99,
    category: Category.BAKERY,
    image: 'https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?auto=format&fit=crop&w=800&q=80',
    unit: 'pack',
    description: 'Freshly baked blueberry muffins.',
    inStock: true,
    rating: 4.7
  },
  {
    id: '36',
    name: 'Cake',
    price: 12.99,
    category: Category.BAKERY,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    unit: 'pc',
    description: 'Chocolate celebration cake.',
    inStock: true,
    rating: 4.9
  },
  {
    id: '37',
    name: 'Cookies',
    price: 3.99,
    category: Category.BAKERY,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
    unit: 'pack',
    description: 'Chocolate chip cookies.',
    inStock: true,
    rating: 4.6
  },
  {
    id: '38',
    name: 'Rusk',
    price: 2.99,
    category: Category.BAKERY,
    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80',
    unit: 'pack',
    description: 'Crunchy dry toast rusks.',
    inStock: true,
    rating: 4.2
  },
  {
    id: '39',
    name: 'Donut',
    price: 1.49,
    category: Category.BAKERY,
    image: 'https://images.unsplash.com/photo-1551024601-5629f977c2b3?auto=format&fit=crop&w=800&q=80', 
    unit: 'pc',
    description: 'Glazed sweet donut.',
    inStock: true,
    rating: 4.5
  },
  {
    id: '40',
    name: 'Pastry',
    price: 3.49,
    category: Category.BAKERY,
    image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=800&q=80',
    unit: 'pc',
    description: 'Sweet puff pastry.',
    inStock: true,
    rating: 4.7
  },
  
  // Snacks
  {
    id: '41',
    name: 'Potato Chips',
    price: 1.99,
    category: Category.SNACKS,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80',
    unit: 'pack',
    description: 'Crispy salted potato chips.',
    inStock: true,
    rating: 4.4,
    highlights: ['Crispy', 'Salty', 'Party Snack']
  },
  {
    id: '42',
    name: 'Popcorn',
    price: 2.49,
    category: Category.SNACKS,
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80',
    unit: 'tub',
    description: 'Buttered movie theatre style popcorn.',
    inStock: true,
    rating: 4.5
  },
  {
    id: '43',
    name: 'Chocolate Bar',
    price: 1.49,
    category: Category.SNACKS,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=80',
    unit: 'bar',
    description: 'Milk chocolate bar.',
    inStock: true,
    rating: 4.8
  },
  {
    id: '44',
    name: 'Trail Mix',
    price: 4.99,
    category: Category.SNACKS,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    unit: 'pack',
    description: 'Healthy mix of nuts and dried fruits.',
    inStock: true,
    rating: 4.7
  },
  {
    id: '45',
    name: 'Pretzels',
    price: 2.99,
    category: Category.SNACKS,
    image: 'https://images.unsplash.com/photo-1563262078-57d6b38c3527?auto=format&fit=crop&w=800&q=80', 
    unit: 'pack',
    description: 'Crunchy salted pretzels.',
    inStock: true,
    rating: 4.3
  }
];

export const CATEGORIES = Object.values(Category);

// Ensure all products have reviews
export const MOCK_PRODUCTS: Product[] = RAW_PRODUCTS.map(p => ({
    ...p,
    reviews: p.reviews || MOCK_REVIEWS
}));