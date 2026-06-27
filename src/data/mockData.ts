import { MenuItem, Table, Order, Reservation, InventoryItem, StaffMember, LiveActivity, SystemSettings, CustomerFeedback } from '../types';

// Premium Unsplash Food & Beverage Images
export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Starters
  {
    id: 'm1',
    name: 'Truffle Parmesan Fries',
    price: 14.00,
    description: 'Crispy golden fries tossed in pure white truffle oil, grated pecorino romano, and fresh parsley.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 8
  },
  {
    id: 'm2',
    name: 'Heirloom Tomato Bruschetta',
    price: 16.00,
    description: 'Toasted sourdough rubbed with garlic, topped with marinated vine-ripened tomatoes, sweet basil, and balsamic glaze.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 10
  },
  {
    id: 'm3',
    name: 'Crispy Calamari Fritti',
    price: 19.50,
    description: 'Lightly dusted calamari rings served with a charred lemon wedge and house-made saffron aioli.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 12
  },

  // Main Course
  {
    id: 'm4',
    name: 'Prime Dry-Aged Ribeye',
    price: 49.00,
    description: '14oz ribeye steak cooked to perfection, served with garlic herb butter and charred asparagus.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 20
  },
  {
    id: 'm5',
    name: 'Pan-Seared Atlantic Salmon',
    price: 36.00,
    description: 'Crispy skin salmon fillet served over a bed of creamy wild leek risotto and dill emulsion.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 18
  },
  {
    id: 'm6',
    name: 'Wild Mushroom Risotto',
    price: 28.00,
    description: 'Slow-cooked arborio rice with porcini, shiitake, and oyster mushrooms, finished with thyme and white wine.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 15
  },

  // Desserts
  {
    id: 'm7',
    name: 'Molten Chocolate Lava Cake',
    price: 15.00,
    description: 'Warm chocolate cake with a liquid center, served with Madagascar vanilla bean gelato.',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 12
  },
  {
    id: 'm8',
    name: 'Classic Espresso Tiramisu',
    price: 13.50,
    description: 'Ladyfingers soaked in dark espresso and coffee liqueur, layered with whipped mascarpone cream.',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5
  },

  // Drinks
  {
    id: 'm9',
    name: 'Smoked Maple Old Fashioned',
    price: 18.00,
    description: 'Kentucky bourbon, pure Vermont maple syrup, Angostura bitters, smoked with hickory wood chips.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5
  },
  {
    id: 'm10',
    name: 'Hibiscus Lime Mocktail',
    price: 9.50,
    description: 'Organic hibiscus tea syrup, fresh lime juice, mint leaves, topped with sparkling club soda.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 4
  },

  // Specials
  {
    id: 'm11',
    name: 'Gourmet Wagyu Truffle Burger',
    price: 42.00,
    description: 'A5 Wagyu beef patty, black truffle melted cheese, caramelized shallots, brioche bun, and gold leaf flake.',
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 15
  },
  {
    id: 'm12',
    name: 'Butter-Poached Lobster Tail',
    price: 58.00,
    description: 'Maine lobster tail slow-poached in clarified herb butter, served with saffron-infused fingerling potatoes.',
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1559742811-824132fb7acf?w=400&auto=format&fit=crop&q=80',
    available: false, // Low-stock, unavailable
    preparationTime: 22
  },
  // Starters
  {
    id: 'm13',
    name: 'Burrata & Prosciutto di Parma',
    price: 22.00,
    description: 'Fresh creamy burrata cheese served with thinly sliced 24-month aged prosciutto, wild arugula, and extra virgin olive oil.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 7
  },
  {
    id: 'm14',
    name: 'Seared Ahi Tuna Tataki',
    price: 24.00,
    description: 'Sashimi-grade ahi tuna lightly seared, served with pickled ginger, avocado mousse, and citrus-ponzu glaze.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 10
  },
  {
    id: 'm15',
    name: 'Escargots à la Bourguignonne',
    price: 21.00,
    description: 'Six wild French snails baked in their shells with rich garlic, Italian parsley, and shallot butter.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 11
  },
  {
    id: 'm16',
    name: 'Baked Goat Cheese Tart',
    price: 18.00,
    description: 'Warm caramelized chèvre with fresh figs, honey, and microgreens on flaky puff pastry.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1515003844-1d98174574d1?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 9
  },
  {
    id: 'm17',
    name: 'Charred Spanish Octopus',
    price: 26.50,
    description: 'Tender octopus tentacle, fingerling potatoes, smoked paprika aioli, and pickled red onion.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 14
  },
  {
    id: 'm18',
    name: 'Oysters Rockefeller',
    price: 28.00,
    description: 'Half dozen freshly shucked oysters baked with spinach, bacon, absinthe, and a rich Hollandaise.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1553618551-fba689030290?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 12
  },
  {
    id: 'm19',
    name: 'Truffle Mushroom Arancini',
    price: 17.50,
    description: 'Crispy golden risotto balls stuffed with wild mushrooms and taleggio cheese, served with truffle aioli.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 8
  },
  {
    id: 'm20',
    name: 'Lobster Bisque',
    price: 20.00,
    description: 'Velvety lobster broth finished with cognac, fresh tarragon, and sweet Maine lobster tail chunks.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 10
  },
  {
    id: 'm21',
    name: 'Artisanal Cheese Board',
    price: 29.00,
    description: 'A selection of three imported cheeses, honeycomb, candied walnuts, and grilled sourdough.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 6
  },
  {
    id: 'm22',
    name: 'Beef Carpaccio',
    price: 23.00,
    description: 'Paper-thin prime beef tenderloin, capers, shaved parmigiano-reggiano, and extra virgin olive oil.',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1513137330482-7550412eec1e?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 8
  },
  // Main Course
  {
    id: 'm23',
    name: 'Chilean Sea Bass',
    price: 45.00,
    description: 'Pan-roasted Chilean sea bass served over baby bok choy and a ginger-soy dashi reduction.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 16
  },
  {
    id: 'm24',
    name: 'Slow-Braised Lamb Shank',
    price: 39.00,
    description: '24-hour braised domestic lamb shank served with garlic-infused potato puree and natural red wine jus.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 15
  },
  {
    id: 'm25',
    name: "Duck à l'Orange",
    price: 41.00,
    description: 'Crispy pan-seared duck breast, orange-grand marnier sauce, sweet potato croquette, and roasted endive.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1514944224746-6bba5b09e5c2?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 18
  },
  {
    id: 'm26',
    name: 'Handmade Lobster Ravioli',
    price: 38.00,
    description: 'Striped pasta pockets stuffed with butter-poached lobster, served with a velvety cherry tomato cream.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 14
  },
  {
    id: 'm27',
    name: 'Pan-Seared Duck Confit',
    price: 34.00,
    description: "Crisp-skin duck leg slow-cooked in its own fat, served over warm puy lentil salad with cherry glaze.",
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 16
  },
  {
    id: 'm28',
    name: 'Dry-Aged Tomahawk Steak',
    price: 110.00,
    description: '32oz dry-aged long bone ribeye steak, flamed tableside, served with wild mushrooms (serves two).',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 30
  },
  {
    id: 'm29',
    name: 'Black Truffle Tagliatelle',
    price: 36.00,
    description: 'House-made fresh ribbons of pasta in a creamy parmigiano sauce, topped with fresh shaved black truffles.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 12
  },
  {
    id: 'm30',
    name: 'Mediterranean Branzino',
    price: 42.00,
    description: 'Whole roasted branzino stuffed with fresh rosemary and lemon slices, served with grilled vegetables.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 20
  },
  {
    id: 'm31',
    name: 'Pan-Seared Veal Chop',
    price: 48.00,
    description: '12oz milk-fed veal chop, sage-infused brown butter sauce, roasted fingerling potatoes, and sautéed spinach.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 18
  },
  {
    id: 'm32',
    name: 'Classic Beef Wellington',
    price: 52.00,
    description: 'Center-cut tenderloin with mushroom duxelles, wrapped in puff pastry, baked golden brown, demi-glace.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 25
  },
  {
    id: 'm33',
    name: 'New Zealand Lamb Chops',
    price: 46.00,
    description: 'Herb-crusted lamb chops served with mint chimichurri, roasted baby carrots, and goat cheese crumbles.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 15
  },
  {
    id: 'm34',
    name: 'Seafood Bouillabaisse',
    price: 44.00,
    description: 'Classic French saffron seafood stew with prawns, mussels, clams, squid, and white fish, toasted rouille.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1534080391025-0979e8316f21?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 18
  },
  {
    id: 'm35',
    name: 'Saffron Seafood Paella',
    price: 45.00,
    description: 'Bomba rice infused with saffron, topped with jumbo prawns, calamari, mussels, and house-made chorizo.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1534080391025-0979e8316f21?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 22
  },
  {
    id: 'm36',
    name: 'A5 Japanese Wagyu Sirloin',
    price: 125.00,
    description: '6oz authentic Japanese Miyazaki beef sirloin served with sea salt flakes and house wasabi paste.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 15
  },
  {
    id: 'm37',
    name: 'Handcrafted Gnocchi al Pesto',
    price: 27.00,
    description: 'Pillowy potato gnocchi tossed in fresh sweet basil pesto, toasted pine nuts, and aged pecorino.',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 11
  },
  // Desserts
  {
    id: 'm38',
    name: 'Grand Marnier Soufflé',
    price: 17.00,
    description: 'Classic warm French soufflé infused with orange liqueur, served with fresh raspberry coulis.',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 15
  },
  {
    id: 'm39',
    name: 'Vanilla Bean Crème Brûlée',
    price: 14.00,
    description: 'Rich custard infused with Tahitian vanilla bean, topped with a crisp layer of caramelized sugar.',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1470124118117-292a175074f6?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5
  },
  {
    id: 'm40',
    name: 'Deconstructed Lemon Meringue',
    price: 15.00,
    description: 'Tangy Meyer lemon curd, toasted Italian meringue peaks, butter shortbread crumbs, and basil oil.',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 8
  },
  {
    id: 'm41',
    name: 'Warm Sticky Date Pudding',
    price: 14.50,
    description: 'Traditional British sponge cake with finely chopped dates, drenched in warm toffee sauce.',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 6
  },
  {
    id: 'm42',
    name: 'Affogato al Caffè',
    price: 11.00,
    description: 'A scoop of artisanal double vanilla gelato drowned in a freshly pulled shot of dark espresso.',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 3
  },
  {
    id: 'm43',
    name: 'Artisanal French Macarons',
    price: 16.00,
    description: 'Assortment of five delicate almond flour shells filled with pistachio, dark chocolate, raspberry, and vanilla.',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 4
  },
  {
    id: 'm44',
    name: 'Poached Pear in Red Wine',
    price: 15.50,
    description: 'Bosc pear slow-cooked in spiced Cabernet wine, served with mascarpone whip and cinnamon bark.',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 7
  },
  {
    id: 'm45',
    name: 'Premium Pistachio Gelato',
    price: 12.00,
    description: 'Three scoops of creamy Sicilian pistachio gelato, finished with raw crushed pistachios.',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 3
  },
  {
    id: 'm46',
    name: 'New York Style Cheesecake',
    price: 14.00,
    description: 'Dense and creamy classic cheesecake on graham cracker crust with a wild strawberry compote.',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 4
  },
  {
    id: 'm47',
    name: 'Trio of House Sorbets',
    price: 12.00,
    description: 'Refreshing dairy-free scoop selection of mango-passionfruit, blood orange, and dark forest berry.',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 3
  },
  // Drinks
  {
    id: 'm48',
    name: 'Royal Crystal Martini',
    price: 24.00,
    description: 'Ultra-premium vodka, dry vermouth, rinsed with single-malt scotch, served with olive-stuffed gold caviar.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5
  },
  {
    id: 'm49',
    name: 'Spiced Pear Negroni',
    price: 19.00,
    description: 'Artisanal dry gin, spiced sweet vermouth, Campari, infused with baked pear skin and star anise.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 4
  },
  {
    id: 'm50',
    name: 'Espresso Chocolate Martini',
    price: 18.50,
    description: 'Cold-pressed espresso, house vanilla bean vodka, dark cacao liqueur, and dusted shaved dark chocolate.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5
  },
  {
    id: 'm51',
    name: 'Elderflower Spritz',
    price: 16.00,
    description: 'St-Germain elderflower liqueur, premium Prosecco, club soda, served with fresh cucumber wheels.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 4
  },
  {
    id: 'm52',
    name: 'Matcha Ginger Elixir',
    price: 11.50,
    description: 'Organic Japanese ceremonial matcha, pressed ginger root juice, wildflower honey, and carbonated mountain water.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 4
  },
  {
    id: 'm53',
    name: 'Pomegranate Rosemary Fizz',
    price: 10.50,
    description: 'Fresh pomegranate press, squeezed lemon, rosemary herb-infused syrup, topped with dry tonic water.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 3
  },
  {
    id: 'm54',
    name: 'Napa Valley Cabernet 2018',
    price: 28.00,
    description: 'Full-bodied Cabernet Sauvignon with dark plum notes, black currant complexity, and a velvety oak finish.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 2
  },
  {
    id: 'm55',
    name: 'Chablis Premier Cru',
    price: 26.00,
    description: 'Elegant French white burgundy Chardonnay, boasting flinty minerality, green apple, and crisp citrus notes.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 2
  },
  {
    id: 'm56',
    name: 'Dom Pérignon Champagne',
    price: 85.00,
    description: 'Epitome of vintage Champagne, dry with complex toasted yeast, almond, and vibrant pear notes.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 2
  },
  {
    id: 'm57',
    name: 'Smoked Pineapple Mezcalita',
    price: 18.00,
    description: 'Smoky mezcal, charred pineapple juice, agave nectar, lime, and salt-rimmed glassware.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 4
  },
  // Specials
  {
    id: 'm58',
    name: 'Pan-Roasted Squab Pigeon',
    price: 54.00,
    description: 'Roasted squab breast with braised leg confit, served with black truffle polenta and port wine reduction.',
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 22
  },
  {
    id: 'm59',
    name: 'Truffle Lobster Mac & Cheese',
    price: 49.00,
    description: 'Creste di gallo pasta baked with rich fontina, gruyère, fresh Maine lobster claw meat, shaved white truffle.',
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 18
  },
  {
    id: 'm60',
    name: 'Pan-Seared Sweetbreads',
    price: 45.50,
    description: 'Glazed veal sweetbreads, creamed morel mushrooms, roasted parsnip purée, and light madeira reduction.',
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 20
  },
  {
    id: 'm61',
    name: 'Wood-Fired Dover Sole',
    price: 65.00,
    description: 'Whole Dover sole, filleted tableside, dressed in classic meunière brown butter, capers, parsley, and lemon.',
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 24
  },
  {
    id: 'm62',
    name: 'Glazed Kurobuta Pork Belly',
    price: 42.00,
    description: 'Sous-vide master-stock pork belly, crispy crackling skin, parsnip cream, apple-mustard jam, pork reduction.',
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 16
  },
  {
    id: 'm63',
    name: 'Roasted Rack of Venison',
    price: 58.00,
    description: 'Herb-crusted wild venison rack, charred root vegetables, celery root mousse, and elderberry-gin jus.',
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 22
  },
  {
    id: 'm64',
    name: 'Beluga Caviar Service',
    price: 180.00,
    description: '30g premium Beluga caviar served on ice with blinis, grated egg yolk, chives, shallots, and crème fraîche.',
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1553618551-fba689030290?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 5
  },
  {
    id: 'm65',
    name: 'Black Cod with Miso',
    price: 48.00,
    description: 'Sablefish marinated for three days in sweet white miso, broiled to caramelized perfection.',
    category: 'Specials',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80',
    available: true,
    preparationTime: 18
  }
];

export const INITIAL_TABLES: Table[] = [
  { id: 't1', number: 1, capacity: 2, status: 'Occupied', currentOrderId: 'o1', customerName: 'Sophia Loren', guestsCount: 2 },
  { id: 't2', number: 2, capacity: 2, status: 'Available' },
  { id: 't3', number: 3, capacity: 4, status: 'Reserved', customerName: 'Marcus Aurelius', guestsCount: 4 },
  { id: 't4', number: 4, capacity: 4, status: 'Occupied', currentOrderId: 'o2', customerName: 'Evelyn Carter', guestsCount: 3 },
  { id: 't5', number: 5, capacity: 6, status: 'Cleaning' },
  { id: 't6', number: 6, capacity: 6, status: 'Available' },
  { id: 't7', number: 7, capacity: 2, status: 'Available' },
  { id: 't8', number: 8, capacity: 4, status: 'Occupied', currentOrderId: 'o3', customerName: 'Liam Harrison', guestsCount: 2 },
  { id: 't9', number: 9, capacity: 8, status: 'Reserved', customerName: 'The Rockefeller Party', guestsCount: 8 },
  { id: 't10', number: 10, capacity: 2, status: 'Available' },
  { id: 't11', number: 11, capacity: 4, status: 'Cleaning' },
  { id: 't12', number: 12, capacity: 10, status: 'Available' }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'o1',
    orderNumber: 'DF-4001',
    tableNumber: 1,
    customerName: 'Sophia Loren',
    items: [
      { menuItemId: 'm1', name: 'Truffle Parmesan Fries', price: 14.00, quantity: 1 },
      { menuItemId: 'm5', name: 'Pan-Seared Atlantic Salmon', price: 36.00, quantity: 1, notes: 'Medium-well, dill sauce on side' },
      { menuItemId: 'm9', name: 'Smoked Maple Old Fashioned', price: 18.00, quantity: 2 }
    ],
    subtotal: 86.00,
    discount: 10, // 10% off
    tax: 8, // 8% tax
    grandTotal: 83.59, // (86 - 8.6) * 1.08 = 83.59
    status: 'Preparing',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    specialNotes: 'Anniversary celebration. Place Old Fashioned glasses at the same time.',
    waiterId: 's4',
    waiterName: 'Sarah Jenkins'
  },
  {
    id: 'o2',
    orderNumber: 'DF-4002',
    tableNumber: 4,
    customerName: 'Evelyn Carter',
    items: [
      { menuItemId: 'm2', name: 'Heirloom Tomato Bruschetta', price: 16.00, quantity: 2 },
      { menuItemId: 'm6', name: 'Wild Mushroom Risotto', price: 28.00, quantity: 2 },
      { menuItemId: 'm10', name: 'Hibiscus Lime Mocktail', price: 9.50, quantity: 3 }
    ],
    subtotal: 116.50,
    discount: 0,
    tax: 8,
    grandTotal: 125.82,
    status: 'New',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    waiterId: 's5',
    waiterName: 'David Lee'
  },
  {
    id: 'o3',
    orderNumber: 'DF-4003',
    tableNumber: 8,
    customerName: 'Liam Harrison',
    items: [
      { menuItemId: 'm3', name: 'Crispy Calamari Fritti', price: 19.50, quantity: 1 },
      { menuItemId: 'm4', name: 'Prime Dry-Aged Ribeye', price: 49.00, quantity: 2, notes: 'One medium rare, one medium' },
      { menuItemId: 'm7', name: 'Molten Chocolate Lava Cake', price: 15.00, quantity: 1 }
    ],
    subtotal: 132.50,
    discount: 5,
    tax: 8,
    grandTotal: 135.95, // (132.5 - 6.625) * 1.08
    status: 'Ready',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40 mins ago
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    waiterId: 's4',
    waiterName: 'Sarah Jenkins'
  },
  {
    id: 'o4',
    orderNumber: 'DF-3998',
    tableNumber: 3,
    customerName: 'Marcus Aurelius',
    items: [
      { menuItemId: 'm1', name: 'Truffle Parmesan Fries', price: 14.00, quantity: 2 },
      { menuItemId: 'm6', name: 'Wild Mushroom Risotto', price: 28.00, quantity: 1 }
    ],
    subtotal: 56.00,
    discount: 0,
    tax: 8,
    grandTotal: 60.48,
    status: 'Paid',
    paymentMethod: 'UPI',
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    waiterId: 's5',
    waiterName: 'David Lee'
  },
  {
    id: 'o5',
    orderNumber: 'DF-3999',
    tableNumber: 10,
    customerName: 'The Rockefeller Party',
    items: [
      { menuItemId: 'm11', name: 'Gourmet Wagyu Truffle Burger', price: 42.00, quantity: 2 },
      { menuItemId: 'm8', name: 'Classic Espresso Tiramisu', price: 13.50, quantity: 2 }
    ],
    subtotal: 111.00,
    discount: 15,
    tax: 8,
    grandTotal: 101.89,
    status: 'Served',
    createdAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    waiterId: 's4',
    waiterName: 'Sarah Jenkins'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'r1',
    customerName: 'Marcus Aurelius',
    phone: '+1 (555) 123-4567',
    date: new Date().toISOString().split('T')[0], // Today
    time: '19:00',
    guests: 4,
    tablePreference: 'Table 3 (Indoors)',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'r2',
    customerName: 'The Rockefeller Party',
    phone: '+1 (555) 987-6543',
    date: new Date().toISOString().split('T')[0], // Today
    time: '20:30',
    guests: 8,
    tablePreference: 'Table 9 (Private Room)',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'r3',
    customerName: 'Eleanor Vance',
    phone: '+1 (555) 443-8821',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    time: '18:15',
    guests: 2,
    tablePreference: 'Window Side',
    status: 'Pending',
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString()
  },
  {
    id: 'r4',
    customerName: 'Chef Gordon Watson',
    phone: '+1 (555) 234-5678',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    time: '21:00',
    guests: 2,
    tablePreference: 'Near Bar',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    id: 'r5',
    customerName: 'Aria Sterling',
    phone: '+1 (555) 876-5432',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    time: '19:30',
    guests: 3,
    tablePreference: 'Standard',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'A5 Wagyu Beef', category: 'Meats', currentStock: 8.5, minimumStock: 5.0, unit: 'kg', supplier: 'Miyazaki Farms', expiryDate: '2026-07-05', unitCost: 150.00 },
  { id: 'i2', name: 'Maine Lobster Tail', category: 'Seafood', currentStock: 3.0, minimumStock: 10.0, unit: 'units', supplier: 'Atlantic Harbors Ltd', expiryDate: '2026-06-30', unitCost: 18.50 }, // Low stock!
  { id: 'i3', name: 'White Truffle Oil', category: 'Oils & Condiments', currentStock: 1.2, minimumStock: 1.5, unit: 'liters', supplier: 'Alba Imports', expiryDate: '2027-02-14', unitCost: 95.00 }, // Low stock!
  { id: 'i4', name: 'Arborio Rice', category: 'Dry Goods', currentStock: 25.0, minimumStock: 10.0, unit: 'kg', supplier: 'Vercelli Grains', expiryDate: '2027-06-15', unitCost: 3.50 },
  { id: 'i5', name: 'Fresh Atlantic Salmon', category: 'Seafood', currentStock: 12.0, minimumStock: 8.0, unit: 'kg', supplier: 'Nordic Blue Salmon', expiryDate: '2026-07-02', unitCost: 24.00 },
  { id: 'i6', name: 'Pecorino Romano', category: 'Dairy', currentStock: 14.5, minimumStock: 6.0, unit: 'kg', supplier: 'Lazio Dairy Co', expiryDate: '2026-08-20', unitCost: 16.00 },
  { id: 'i7', name: 'Madagascar Vanilla Pods', category: 'Spices', currentStock: 0.1, minimumStock: 0.2, unit: 'kg', supplier: 'Bourbon Spices', expiryDate: '2027-12-01', unitCost: 450.00 }, // Low stock!
  { id: 'i8', name: 'Fresh Organic Mint', category: 'Produce', currentStock: 4.2, minimumStock: 2.0, unit: 'kg', supplier: 'Green Valley Labs', expiryDate: '2026-07-01', unitCost: 8.00 }
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 's1', name: 'Chef Alessandro Rossi', role: 'Chef', contact: '+1 (555) 765-4321', shiftTiming: '12:00 PM - 10:00 PM', attendanceStatus: 'Present', performanceRating: 4.9, image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80' },
  { id: 's2', name: 'Julianna Vance', role: 'Manager', contact: '+1 (555) 231-9988', shiftTiming: '09:00 AM - 07:00 PM', attendanceStatus: 'Present', performanceRating: 4.8, image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { id: 's3', name: 'Marcus Sterling', role: 'Cashier', contact: '+1 (555) 345-6789', shiftTiming: '03:00 PM - 11:00 PM', attendanceStatus: 'Present', performanceRating: 4.5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 's4', name: 'Sarah Jenkins', role: 'Waiter', contact: '+1 (555) 456-7890', shiftTiming: '04:00 PM - 12:00 AM', attendanceStatus: 'Present', performanceRating: 4.7, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { id: 's5', name: 'David Lee', role: 'Waiter', contact: '+1 (555) 567-8901', shiftTiming: '11:00 AM - 07:00 PM', attendanceStatus: 'Present', performanceRating: 4.6, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 's6', name: 'Chef Kenji Sato', role: 'Chef', contact: '+1 (555) 890-1234', shiftTiming: '08:00 AM - 05:00 PM', attendanceStatus: 'On Leave', performanceRating: 4.9, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80' },
  { id: 's7', name: 'Chef Julian Mercer', role: 'Chef', contact: '+1 (555) 712-4433', shiftTiming: '11:00 AM - 09:00 PM', attendanceStatus: 'Present', performanceRating: 4.8, image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150&auto=format&fit=crop&q=80' },
  { id: 's8', name: 'Clarissa Vance', role: 'Waiter', contact: '+1 (555) 609-1122', shiftTiming: '04:00 PM - 11:00 PM', attendanceStatus: 'Present', performanceRating: 4.9, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 's9', name: 'Dimitri Ivanov', role: 'Manager', contact: '+1 (555) 303-4040', shiftTiming: '02:00 PM - 11:00 PM', attendanceStatus: 'Present', performanceRating: 4.9, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
  { id: 's10', name: 'Emily Watson', role: 'Chef', contact: '+1 (555) 902-8877', shiftTiming: '06:00 AM - 03:00 PM', attendanceStatus: 'Present', performanceRating: 4.7, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=150&auto=format&fit=crop&q=80' },
  { id: 's11', name: 'Ravi Patel', role: 'Cashier', contact: '+1 (555) 554-3210', shiftTiming: '10:00 AM - 06:00 PM', attendanceStatus: 'Present', performanceRating: 4.6, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
  { id: 's12', name: 'Sophia Sterling', role: 'Waiter', contact: '+1 (555) 887-2211', shiftTiming: '04:00 PM - 12:00 AM', attendanceStatus: 'Present', performanceRating: 4.8, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 's13', name: 'Marcus Thorne', role: 'Waiter', contact: '+1 (555) 667-8899', shiftTiming: '05:00 PM - 01:00 AM', attendanceStatus: 'Present', performanceRating: 4.9, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 's14', name: 'Amelia Du Pont', role: 'Manager', contact: '+1 (555) 231-5544', shiftTiming: '04:00 PM - 11:00 PM', attendanceStatus: 'Present', performanceRating: 5.0, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' }
];

export const INITIAL_ACTIVITIES: LiveActivity[] = [
  { id: 'a1', type: 'order', message: 'New order DF-4002 created for Table 4.', time: new Date(Date.now() - 5 * 60 * 1000).toISOString(), severity: 'info' },
  { id: 'a2', type: 'order', message: 'Order DF-4003 marked as READY for Table 8.', time: new Date(Date.now() - 10 * 60 * 1000).toISOString(), severity: 'success' },
  { id: 'a3', type: 'inventory', message: 'Low stock warning: Maine Lobster Tail is below minimum threshold.', time: new Date(Date.now() - 120 * 60 * 1000).toISOString(), severity: 'warning' },
  { id: 'a4', type: 'reservation', message: 'New online reservation confirmed for Eleanor Vance (2 guests) tomorrow.', time: new Date(Date.now() - 6 * 60 * 1000).toISOString(), severity: 'success' },
  { id: 'a5', type: 'table', message: 'Table 5 changed status to Cleaning.', time: new Date(Date.now() - 15 * 60 * 1000).toISOString(), severity: 'info' },
  { id: 'a6', type: 'staff', message: 'Sarah Jenkins checked in for the Evening shift.', time: new Date(Date.now() - 235 * 60 * 1000).toISOString(), severity: 'info' }
];

export const DEFAULT_SETTINGS: SystemSettings = {
  restaurantName: 'Bistro',
  currencySymbol: '$',
  taxPercentage: 8,
  defaultDiscountPercentage: 10,
  enableSoundNotifications: true,
  kdsRefreshRate: 15,
  brandLogo: '',
  primaryBrandColor: '#f97316',
  secondaryBrandColor: '#ea580c'
};

export const INITIAL_FEEDBACK: CustomerFeedback[] = [
  {
    id: 'f1',
    customerName: 'Robert Langdon',
    rating: 5,
    comment: 'Absolutely delightful evening! The Wagyu Beef Tenderloin was cooked to absolute perfection. Our server Sophia was extremely attentive and quick.',
    waiterId: 's12',
    waiterName: 'Sophia Sterling',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'Approved',
    category: 'Food Quality'
  },
  {
    id: 'f2',
    customerName: 'Clara Oswald',
    rating: 4,
    comment: 'The ambiance is modern and high-end. Saffron Risotto was a bit salty, but the cocktails made up for it. Highly recommend the Crimson Elixir!',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    status: 'Pending',
    category: 'Ambiance'
  },
  {
    id: 'f3',
    customerName: 'Alistair Vance',
    rating: 5,
    comment: 'Marcus Thorne gave us the best table recommendations and guided us through the specials beautifully. The Truffle Fries are addictive.',
    waiterId: 's13',
    waiterName: 'Marcus Thorne',
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    status: 'Approved',
    category: 'Service'
  },
  {
    id: 'f4',
    customerName: 'Fiona Gallagher',
    rating: 3,
    comment: 'Food was decent but took almost 40 minutes to arrive. It was rush hour so understandable, but expected quicker turnaround.',
    createdAt: new Date(Date.now() - 300 * 60 * 1000).toISOString(),
    status: 'Pending',
    category: 'Service'
  },
  {
    id: 'f5',
    customerName: 'Julian Devorak',
    rating: 5,
    comment: 'Clean table, perfectly aligned cutlery, and incredibly hygienic food preparation. The whole team did an outstanding job.',
    createdAt: new Date(Date.now() - 480 * 60 * 1000).toISOString(),
    status: 'Approved',
    category: 'Cleanliness'
  }
];


// LocalStorage helpers to load/save state
export const loadData = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(`dineflow_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage`, error);
    return defaultValue;
  }
};

export const saveData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`dineflow_${key}`, JSON.stringify(value));
    
    // Asynchronously save to the server database
    fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key, data: value })
    }).catch(err => {
      console.error(`Failed to sync ${key} data with database:`, err);
    });
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage`, error);
  }
};
