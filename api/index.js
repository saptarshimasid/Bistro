var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"));
var import_path2 = __toESM(require("path"));
var import_genai = require("@google/genai");
var import_dotenv2 = __toESM(require("dotenv"));

// db.ts
var import_pg = require("pg");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_dotenv = __toESM(require("dotenv"));

// src/data/mockDataDefaults.json
var mockDataDefaults_default = {
  menu: [
    {
      id: "m1",
      name: "Truffle Parmesan Fries",
      price: 14,
      description: "Crispy golden fries tossed in pure white truffle oil, grated pecorino romano, and fresh parsley.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 8
    },
    {
      id: "m2",
      name: "Heirloom Tomato Bruschetta",
      price: 16,
      description: "Toasted sourdough rubbed with garlic, topped with marinated vine-ripened tomatoes, sweet basil, and balsamic glaze.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 10
    },
    {
      id: "m3",
      name: "Crispy Calamari Fritti",
      price: 19.5,
      description: "Lightly dusted calamari rings served with a charred lemon wedge and house-made saffron aioli.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 12
    },
    {
      id: "m4",
      name: "Prime Dry-Aged Ribeye",
      price: 49,
      description: "14oz ribeye steak cooked to perfection, served with garlic herb butter and charred asparagus.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 20
    },
    {
      id: "m5",
      name: "Pan-Seared Atlantic Salmon",
      price: 36,
      description: "Crispy skin salmon fillet served over a bed of creamy wild leek risotto and dill emulsion.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 18
    },
    {
      id: "m6",
      name: "Wild Mushroom Risotto",
      price: 28,
      description: "Slow-cooked arborio rice with porcini, shiitake, and oyster mushrooms, finished with thyme and white wine.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 15
    },
    {
      id: "m7",
      name: "Molten Chocolate Lava Cake",
      price: 15,
      description: "Warm chocolate cake with a liquid center, served with Madagascar vanilla bean gelato.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 12
    },
    {
      id: "m8",
      name: "Classic Espresso Tiramisu",
      price: 13.5,
      description: "Ladyfingers soaked in dark espresso and coffee liqueur, layered with whipped mascarpone cream.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 5
    },
    {
      id: "m9",
      name: "Smoked Maple Old Fashioned",
      price: 18,
      description: "Kentucky bourbon, pure Vermont maple syrup, Angostura bitters, smoked with hickory wood chips.",
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 5
    },
    {
      id: "m10",
      name: "Hibiscus Lime Mocktail",
      price: 9.5,
      description: "Organic hibiscus tea syrup, fresh lime juice, mint leaves, topped with sparkling club soda.",
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 4
    },
    {
      id: "m11",
      name: "Gourmet Wagyu Truffle Burger",
      price: 42,
      description: "A5 Wagyu beef patty, black truffle melted cheese, caramelized shallots, brioche bun, and gold leaf flake.",
      category: "Specials",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 15
    },
    {
      id: "m12",
      name: "Butter-Poached Lobster Tail",
      price: 58,
      description: "Maine lobster tail slow-poached in clarified herb butter, served with saffron-infused fingerling potatoes.",
      category: "Specials",
      image: "https://images.unsplash.com/photo-1559742811-824132fb7acf?w=400&auto=format&fit=crop&q=80",
      available: false,
      preparationTime: 22
    },
    {
      id: "m13",
      name: "Burrata & Prosciutto di Parma",
      price: 22,
      description: "Fresh creamy burrata cheese served with thinly sliced 24-month aged prosciutto, wild arugula, and extra virgin olive oil.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 7
    },
    {
      id: "m14",
      name: "Seared Ahi Tuna Tataki",
      price: 24,
      description: "Sashimi-grade ahi tuna lightly seared, served with pickled ginger, avocado mousse, and citrus-ponzu glaze.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 10
    },
    {
      id: "m15",
      name: "Escargots \xE0 la Bourguignonne",
      price: 21,
      description: "Six wild French snails baked in their shells with rich garlic, Italian parsley, and shallot butter.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 11
    },
    {
      id: "m16",
      name: "Baked Goat Cheese Tart",
      price: 18,
      description: "Warm caramelized ch\xE8vre with fresh figs, honey, and microgreens on flaky puff pastry.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1515003844-1d98174574d1?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 9
    },
    {
      id: "m17",
      name: "Charred Spanish Octopus",
      price: 26.5,
      description: "Tender octopus tentacle, fingerling potatoes, smoked paprika aioli, and pickled red onion.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 14
    },
    {
      id: "m18",
      name: "Oysters Rockefeller",
      price: 28,
      description: "Half dozen freshly shucked oysters baked with spinach, bacon, absinthe, and a rich Hollandaise.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1553618551-fba689030290?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 12
    },
    {
      id: "m19",
      name: "Truffle Mushroom Arancini",
      price: 17.5,
      description: "Crispy golden risotto balls stuffed with wild mushrooms and taleggio cheese, served with truffle aioli.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 8
    },
    {
      id: "m20",
      name: "Lobster Bisque",
      price: 20,
      description: "Velvety lobster broth finished with cognac, fresh tarragon, and sweet Maine lobster tail chunks.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 10
    },
    {
      id: "m21",
      name: "Artisanal Cheese Board",
      price: 29,
      description: "A selection of three imported cheeses, honeycomb, candied walnuts, and grilled sourdough.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 6
    },
    {
      id: "m22",
      name: "Beef Carpaccio",
      price: 23,
      description: "Paper-thin prime beef tenderloin, capers, shaved parmigiano-reggiano, and extra virgin olive oil.",
      category: "Starters",
      image: "https://images.unsplash.com/photo-1513137330482-7550412eec1e?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 8
    },
    {
      id: "m23",
      name: "Chilean Sea Bass",
      price: 45,
      description: "Pan-roasted Chilean sea bass served over baby bok choy and a ginger-soy dashi reduction.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 16
    },
    {
      id: "m24",
      name: "Slow-Braised Lamb Shank",
      price: 39,
      description: "24-hour braised domestic lamb shank served with garlic-infused potato puree and natural red wine jus.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 15
    },
    {
      id: "m25",
      name: "Duck \xE0 l'Orange",
      price: 41,
      description: "Crispy pan-seared duck breast, orange-grand marnier sauce, sweet potato croquette, and roasted endive.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1514944224746-6bba5b09e5c2?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 18
    },
    {
      id: "m26",
      name: "Handmade Lobster Ravioli",
      price: 38,
      description: "Striped pasta pockets stuffed with butter-poached lobster, served with a velvety cherry tomato cream.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 14
    },
    {
      id: "m27",
      name: "Pan-Seared Duck Confit",
      price: 34,
      description: "Crisp-skin duck leg slow-cooked in its own fat, served over warm puy lentil salad with cherry glaze.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 16
    },
    {
      id: "m28",
      name: "Dry-Aged Tomahawk Steak",
      price: 110,
      description: "32oz dry-aged long bone ribeye steak, flamed tableside, served with wild mushrooms (serves two).",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1504973960431-1c467e159aa4?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 30
    },
    {
      id: "m29",
      name: "Black Truffle Tagliatelle",
      price: 36,
      description: "House-made fresh ribbons of pasta in a creamy parmigiano sauce, topped with fresh shaved black truffles.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 12
    },
    {
      id: "m30",
      name: "Mediterranean Branzino",
      price: 42,
      description: "Whole roasted branzino stuffed with fresh rosemary and lemon slices, served with grilled vegetables.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 20
    },
    {
      id: "m31",
      name: "Pan-Seared Veal Chop",
      price: 48,
      description: "12oz milk-fed veal chop, sage-infused brown butter sauce, roasted fingerling potatoes, and saut\xE9ed spinach.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 18
    },
    {
      id: "m32",
      name: "Classic Beef Wellington",
      price: 52,
      description: "Center-cut tenderloin with mushroom duxelles, wrapped in puff pastry, baked golden brown, demi-glace.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 25
    },
    {
      id: "m33",
      name: "New Zealand Lamb Chops",
      price: 46,
      description: "Herb-crusted lamb chops served with mint chimichurri, roasted baby carrots, and goat cheese crumbles.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 15
    },
    {
      id: "m34",
      name: "Seafood Bouillabaisse",
      price: 44,
      description: "Classic French saffron seafood stew with prawns, mussels, clams, squid, and white fish, toasted rouille.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1534080391025-0979e8316f21?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 18
    },
    {
      id: "m35",
      name: "Saffron Seafood Paella",
      price: 45,
      description: "Bomba rice infused with saffron, topped with jumbo prawns, calamari, mussels, and house-made chorizo.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1534080391025-0979e8316f21?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 22
    },
    {
      id: "m36",
      name: "A5 Japanese Wagyu Sirloin",
      price: 125,
      description: "6oz authentic Japanese Miyazaki beef sirloin served with sea salt flakes and house wasabi paste.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 15
    },
    {
      id: "m37",
      name: "Handcrafted Gnocchi al Pesto",
      price: 27,
      description: "Pillowy potato gnocchi tossed in fresh sweet basil pesto, toasted pine nuts, and aged pecorino.",
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 11
    },
    {
      id: "m38",
      name: "Grand Marnier Souffl\xE9",
      price: 17,
      description: "Classic warm French souffl\xE9 infused with orange liqueur, served with fresh raspberry coulis.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 15
    },
    {
      id: "m39",
      name: "Vanilla Bean Cr\xE8me Br\xFBl\xE9e",
      price: 14,
      description: "Rich custard infused with Tahitian vanilla bean, topped with a crisp layer of caramelized sugar.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1470124118117-292a175074f6?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 5
    },
    {
      id: "m40",
      name: "Deconstructed Lemon Meringue",
      price: 15,
      description: "Tangy Meyer lemon curd, toasted Italian meringue peaks, butter shortbread crumbs, and basil oil.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 8
    },
    {
      id: "m41",
      name: "Warm Sticky Date Pudding",
      price: 14.5,
      description: "Traditional British sponge cake with finely chopped dates, drenched in warm toffee sauce.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 6
    },
    {
      id: "m42",
      name: "Affogato al Caff\xE8",
      price: 11,
      description: "A scoop of artisanal double vanilla gelato drowned in a freshly pulled shot of dark espresso.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 3
    },
    {
      id: "m43",
      name: "Artisanal French Macarons",
      price: 16,
      description: "Assortment of five delicate almond flour shells filled with pistachio, dark chocolate, raspberry, and vanilla.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 4
    },
    {
      id: "m44",
      name: "Poached Pear in Red Wine",
      price: 15.5,
      description: "Bosc pear slow-cooked in spiced Cabernet wine, served with mascarpone whip and cinnamon bark.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 7
    },
    {
      id: "m45",
      name: "Premium Pistachio Gelato",
      price: 12,
      description: "Three scoops of creamy Sicilian pistachio gelato, finished with raw crushed pistachios.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 3
    },
    {
      id: "m46",
      name: "New York Style Cheesecake",
      price: 14,
      description: "Dense and creamy classic cheesecake on graham cracker crust with a wild strawberry compote.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 4
    },
    {
      id: "m47",
      name: "Trio of House Sorbets",
      price: 12,
      description: "Refreshing dairy-free scoop selection of mango-passionfruit, blood orange, and dark forest berry.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 3
    },
    {
      id: "m48",
      name: "Royal Crystal Martini",
      price: 24,
      description: "Ultra-premium vodka, dry vermouth, rinsed with single-malt scotch, served with olive-stuffed gold caviar.",
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 5
    },
    {
      id: "m49",
      name: "Spiced Pear Negroni",
      price: 19,
      description: "Artisanal dry gin, spiced sweet vermouth, Campari, infused with baked pear skin and star anise.",
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 4
    },
    {
      id: "m50",
      name: "Espresso Chocolate Martini",
      price: 18.5,
      description: "Cold-pressed espresso, house vanilla bean vodka, dark cacao liqueur, and dusted shaved dark chocolate.",
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 5
    },
    {
      id: "m51",
      name: "Elderflower Spritz",
      price: 16,
      description: "St-Germain elderflower liqueur, premium Prosecco, club soda, served with fresh cucumber wheels.",
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 4
    },
    {
      id: "m52",
      name: "Matcha Ginger Elixir",
      price: 11.5,
      description: "Organic Japanese ceremonial matcha, pressed ginger root juice, wildflower honey, and carbonated mountain water.",
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 4
    },
    {
      id: "m53",
      name: "Pomegranate Rosemary Fizz",
      price: 10.5,
      description: "Fresh pomegranate press, squeezed lemon, rosemary herb-infused syrup, topped with dry tonic water.",
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 3
    },
    {
      id: "m54",
      name: "Napa Valley Cabernet 2018",
      price: 28,
      description: "Full-bodied Cabernet Sauvignon with dark plum notes, black currant complexity, and a velvety oak finish.",
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 2
    },
    {
      id: "m55",
      name: "Chablis Premier Cru",
      price: 26,
      description: "Elegant French white burgundy Chardonnay, boasting flinty minerality, green apple, and crisp citrus notes.",
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 2
    },
    {
      id: "m56",
      name: "Dom P\xE9rignon Champagne",
      price: 85,
      description: "Epitome of vintage Champagne, dry with complex toasted yeast, almond, and vibrant pear notes.",
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 2
    },
    {
      id: "m57",
      name: "Smoked Pineapple Mezcalita",
      price: 18,
      description: "Smoky mezcal, charred pineapple juice, agave nectar, lime, and salt-rimmed glassware.",
      category: "Drinks",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 4
    },
    {
      id: "m58",
      name: "Pan-Roasted Squab Pigeon",
      price: 54,
      description: "Roasted squab breast with braised leg confit, served with black truffle polenta and port wine reduction.",
      category: "Specials",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 22
    },
    {
      id: "m59",
      name: "Truffle Lobster Mac & Cheese",
      price: 49,
      description: "Creste di gallo pasta baked with rich fontina, gruy\xE8re, fresh Maine lobster claw meat, shaved white truffle.",
      category: "Specials",
      image: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 18
    },
    {
      id: "m60",
      name: "Pan-Seared Sweetbreads",
      price: 45.5,
      description: "Glazed veal sweetbreads, creamed morel mushrooms, roasted parsnip pur\xE9e, and light madeira reduction.",
      category: "Specials",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 20
    },
    {
      id: "m61",
      name: "Wood-Fired Dover Sole",
      price: 65,
      description: "Whole Dover sole, filleted tableside, dressed in classic meuni\xE8re brown butter, capers, parsley, and lemon.",
      category: "Specials",
      image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 24
    },
    {
      id: "m62",
      name: "Glazed Kurobuta Pork Belly",
      price: 42,
      description: "Sous-vide master-stock pork belly, crispy crackling skin, parsnip cream, apple-mustard jam, pork reduction.",
      category: "Specials",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 16
    },
    {
      id: "m63",
      name: "Roasted Rack of Venison",
      price: 58,
      description: "Herb-crusted wild venison rack, charred root vegetables, celery root mousse, and elderberry-gin jus.",
      category: "Specials",
      image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 22
    },
    {
      id: "m64",
      name: "Beluga Caviar Service",
      price: 180,
      description: "30g premium Beluga caviar served on ice with blinis, grated egg yolk, chives, shallots, and cr\xE8me fra\xEEche.",
      category: "Specials",
      image: "https://images.unsplash.com/photo-1553618551-fba689030290?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 5
    },
    {
      id: "m65",
      name: "Black Cod with Miso",
      price: 48,
      description: "Sablefish marinated for three days in sweet white miso, broiled to caramelized perfection.",
      category: "Specials",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80",
      available: true,
      preparationTime: 18
    }
  ],
  tables: [
    {
      id: "t1",
      number: 1,
      capacity: 2,
      status: "Occupied",
      currentOrderId: "o1",
      customerName: "Sophia Loren",
      guestsCount: 2
    },
    {
      id: "t2",
      number: 2,
      capacity: 2,
      status: "Available"
    },
    {
      id: "t3",
      number: 3,
      capacity: 4,
      status: "Reserved",
      customerName: "Marcus Aurelius",
      guestsCount: 4
    },
    {
      id: "t4",
      number: 4,
      capacity: 4,
      status: "Occupied",
      currentOrderId: "o2",
      customerName: "Evelyn Carter",
      guestsCount: 3
    },
    {
      id: "t5",
      number: 5,
      capacity: 6,
      status: "Cleaning"
    },
    {
      id: "t6",
      number: 6,
      capacity: 6,
      status: "Available"
    },
    {
      id: "t7",
      number: 7,
      capacity: 2,
      status: "Available"
    },
    {
      id: "t8",
      number: 8,
      capacity: 4,
      status: "Occupied",
      currentOrderId: "o3",
      customerName: "Liam Harrison",
      guestsCount: 2
    },
    {
      id: "t9",
      number: 9,
      capacity: 8,
      status: "Reserved",
      customerName: "The Rockefeller Party",
      guestsCount: 8
    },
    {
      id: "t10",
      number: 10,
      capacity: 2,
      status: "Available"
    },
    {
      id: "t11",
      number: 11,
      capacity: 4,
      status: "Cleaning"
    },
    {
      id: "t12",
      number: 12,
      capacity: 10,
      status: "Available"
    }
  ],
  orders: [
    {
      id: "o1",
      orderNumber: "DF-4001",
      tableNumber: 1,
      customerName: "Sophia Loren",
      items: [
        {
          menuItemId: "m1",
          name: "Truffle Parmesan Fries",
          price: 14,
          quantity: 1
        },
        {
          menuItemId: "m5",
          name: "Pan-Seared Atlantic Salmon",
          price: 36,
          quantity: 1,
          notes: "Medium-well, dill sauce on side"
        },
        {
          menuItemId: "m9",
          name: "Smoked Maple Old Fashioned",
          price: 18,
          quantity: 2
        }
      ],
      subtotal: 86,
      discount: 10,
      tax: 8,
      grandTotal: 83.59,
      status: "Preparing",
      createdAt: "2026-06-27T13:24:23.413Z",
      updatedAt: "2026-06-27T13:34:23.414Z",
      specialNotes: "Anniversary celebration. Place Old Fashioned glasses at the same time.",
      waiterId: "s4",
      waiterName: "Sarah Jenkins"
    },
    {
      id: "o2",
      orderNumber: "DF-4002",
      tableNumber: 4,
      customerName: "Evelyn Carter",
      items: [
        {
          menuItemId: "m2",
          name: "Heirloom Tomato Bruschetta",
          price: 16,
          quantity: 2
        },
        {
          menuItemId: "m6",
          name: "Wild Mushroom Risotto",
          price: 28,
          quantity: 2
        },
        {
          menuItemId: "m10",
          name: "Hibiscus Lime Mocktail",
          price: 9.5,
          quantity: 3
        }
      ],
      subtotal: 116.5,
      discount: 0,
      tax: 8,
      grandTotal: 125.82,
      status: "New",
      createdAt: "2026-06-27T13:44:23.414Z",
      updatedAt: "2026-06-27T13:44:23.414Z",
      waiterId: "s5",
      waiterName: "David Lee"
    },
    {
      id: "o3",
      orderNumber: "DF-4003",
      tableNumber: 8,
      customerName: "Liam Harrison",
      items: [
        {
          menuItemId: "m3",
          name: "Crispy Calamari Fritti",
          price: 19.5,
          quantity: 1
        },
        {
          menuItemId: "m4",
          name: "Prime Dry-Aged Ribeye",
          price: 49,
          quantity: 2,
          notes: "One medium rare, one medium"
        },
        {
          menuItemId: "m7",
          name: "Molten Chocolate Lava Cake",
          price: 15,
          quantity: 1
        }
      ],
      subtotal: 132.5,
      discount: 5,
      tax: 8,
      grandTotal: 135.95,
      status: "Ready",
      createdAt: "2026-06-27T13:09:23.414Z",
      updatedAt: "2026-06-27T13:39:23.414Z",
      waiterId: "s4",
      waiterName: "Sarah Jenkins"
    },
    {
      id: "o4",
      orderNumber: "DF-3998",
      tableNumber: 3,
      customerName: "Marcus Aurelius",
      items: [
        {
          menuItemId: "m1",
          name: "Truffle Parmesan Fries",
          price: 14,
          quantity: 2
        },
        {
          menuItemId: "m6",
          name: "Wild Mushroom Risotto",
          price: 28,
          quantity: 1
        }
      ],
      subtotal: 56,
      discount: 0,
      tax: 8,
      grandTotal: 60.48,
      status: "Paid",
      paymentMethod: "UPI",
      createdAt: "2026-06-27T11:59:23.414Z",
      updatedAt: "2026-06-27T12:49:23.414Z",
      waiterId: "s5",
      waiterName: "David Lee"
    },
    {
      id: "o5",
      orderNumber: "DF-3999",
      tableNumber: 10,
      customerName: "The Rockefeller Party",
      items: [
        {
          menuItemId: "m11",
          name: "Gourmet Wagyu Truffle Burger",
          price: 42,
          quantity: 2
        },
        {
          menuItemId: "m8",
          name: "Classic Espresso Tiramisu",
          price: 13.5,
          quantity: 2
        }
      ],
      subtotal: 111,
      discount: 15,
      tax: 8,
      grandTotal: 101.89,
      status: "Served",
      createdAt: "2026-06-27T12:44:23.414Z",
      updatedAt: "2026-06-27T13:19:23.414Z",
      waiterId: "s4",
      waiterName: "Sarah Jenkins"
    }
  ],
  reservations: [
    {
      id: "r1",
      customerName: "Marcus Aurelius",
      phone: "+1 (555) 123-4567",
      date: "2026-06-27",
      time: "19:00",
      guests: 4,
      tablePreference: "Table 3 (Indoors)",
      status: "Confirmed",
      createdAt: "2026-06-25T13:49:23.414Z"
    },
    {
      id: "r2",
      customerName: "The Rockefeller Party",
      phone: "+1 (555) 987-6543",
      date: "2026-06-27",
      time: "20:30",
      guests: 8,
      tablePreference: "Table 9 (Private Room)",
      status: "Confirmed",
      createdAt: "2026-06-22T13:49:23.414Z"
    },
    {
      id: "r3",
      customerName: "Eleanor Vance",
      phone: "+1 (555) 443-8821",
      date: "2026-06-28",
      time: "18:15",
      guests: 2,
      tablePreference: "Window Side",
      status: "Pending",
      createdAt: "2026-06-27T13:43:23.414Z"
    },
    {
      id: "r4",
      customerName: "Chef Gordon Watson",
      phone: "+1 (555) 234-5678",
      date: "2026-06-29",
      time: "21:00",
      guests: 2,
      tablePreference: "Near Bar",
      status: "Confirmed",
      createdAt: "2026-06-27T13:37:23.414Z"
    },
    {
      id: "r5",
      customerName: "Aria Sterling",
      phone: "+1 (555) 876-5432",
      date: "2026-06-26",
      time: "19:30",
      guests: 3,
      tablePreference: "Standard",
      status: "Confirmed",
      createdAt: "2026-06-24T13:49:23.414Z"
    }
  ],
  inventory: [
    {
      id: "i1",
      name: "A5 Wagyu Beef",
      category: "Meats",
      currentStock: 8.5,
      minimumStock: 5,
      unit: "kg",
      supplier: "Miyazaki Farms",
      expiryDate: "2026-07-05",
      unitCost: 150
    },
    {
      id: "i2",
      name: "Maine Lobster Tail",
      category: "Seafood",
      currentStock: 3,
      minimumStock: 10,
      unit: "units",
      supplier: "Atlantic Harbors Ltd",
      expiryDate: "2026-06-30",
      unitCost: 18.5
    },
    {
      id: "i3",
      name: "White Truffle Oil",
      category: "Oils & Condiments",
      currentStock: 1.2,
      minimumStock: 1.5,
      unit: "liters",
      supplier: "Alba Imports",
      expiryDate: "2027-02-14",
      unitCost: 95
    },
    {
      id: "i4",
      name: "Arborio Rice",
      category: "Dry Goods",
      currentStock: 25,
      minimumStock: 10,
      unit: "kg",
      supplier: "Vercelli Grains",
      expiryDate: "2027-06-15",
      unitCost: 3.5
    },
    {
      id: "i5",
      name: "Fresh Atlantic Salmon",
      category: "Seafood",
      currentStock: 12,
      minimumStock: 8,
      unit: "kg",
      supplier: "Nordic Blue Salmon",
      expiryDate: "2026-07-02",
      unitCost: 24
    },
    {
      id: "i6",
      name: "Pecorino Romano",
      category: "Dairy",
      currentStock: 14.5,
      minimumStock: 6,
      unit: "kg",
      supplier: "Lazio Dairy Co",
      expiryDate: "2026-08-20",
      unitCost: 16
    },
    {
      id: "i7",
      name: "Madagascar Vanilla Pods",
      category: "Spices",
      currentStock: 0.1,
      minimumStock: 0.2,
      unit: "kg",
      supplier: "Bourbon Spices",
      expiryDate: "2027-12-01",
      unitCost: 450
    },
    {
      id: "i8",
      name: "Fresh Organic Mint",
      category: "Produce",
      currentStock: 4.2,
      minimumStock: 2,
      unit: "kg",
      supplier: "Green Valley Labs",
      expiryDate: "2026-07-01",
      unitCost: 8
    }
  ],
  staff: [
    {
      id: "s1",
      name: "Chef Alessandro Rossi",
      role: "Chef",
      contact: "+1 (555) 765-4321",
      shiftTiming: "12:00 PM - 10:00 PM",
      attendanceStatus: "Present",
      performanceRating: 4.9,
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s2",
      name: "Julianna Vance",
      role: "Manager",
      contact: "+1 (555) 231-9988",
      shiftTiming: "09:00 AM - 07:00 PM",
      attendanceStatus: "Present",
      performanceRating: 4.8,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s3",
      name: "Marcus Sterling",
      role: "Cashier",
      contact: "+1 (555) 345-6789",
      shiftTiming: "03:00 PM - 11:00 PM",
      attendanceStatus: "Present",
      performanceRating: 4.5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s4",
      name: "Sarah Jenkins",
      role: "Waiter",
      contact: "+1 (555) 456-7890",
      shiftTiming: "04:00 PM - 12:00 AM",
      attendanceStatus: "Present",
      performanceRating: 4.7,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s5",
      name: "David Lee",
      role: "Waiter",
      contact: "+1 (555) 567-8901",
      shiftTiming: "11:00 AM - 07:00 PM",
      attendanceStatus: "Present",
      performanceRating: 4.6,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s6",
      name: "Chef Kenji Sato",
      role: "Chef",
      contact: "+1 (555) 890-1234",
      shiftTiming: "08:00 AM - 05:00 PM",
      attendanceStatus: "On Leave",
      performanceRating: 4.9,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s7",
      name: "Chef Julian Mercer",
      role: "Chef",
      contact: "+1 (555) 712-4433",
      shiftTiming: "11:00 AM - 09:00 PM",
      attendanceStatus: "Present",
      performanceRating: 4.8,
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s8",
      name: "Clarissa Vance",
      role: "Waiter",
      contact: "+1 (555) 609-1122",
      shiftTiming: "04:00 PM - 11:00 PM",
      attendanceStatus: "Present",
      performanceRating: 4.9,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s9",
      name: "Dimitri Ivanov",
      role: "Manager",
      contact: "+1 (555) 303-4040",
      shiftTiming: "02:00 PM - 11:00 PM",
      attendanceStatus: "Present",
      performanceRating: 4.9,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s10",
      name: "Emily Watson",
      role: "Chef",
      contact: "+1 (555) 902-8877",
      shiftTiming: "06:00 AM - 03:00 PM",
      attendanceStatus: "Present",
      performanceRating: 4.7,
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s11",
      name: "Ravi Patel",
      role: "Cashier",
      contact: "+1 (555) 554-3210",
      shiftTiming: "10:00 AM - 06:00 PM",
      attendanceStatus: "Present",
      performanceRating: 4.6,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s12",
      name: "Sophia Sterling",
      role: "Waiter",
      contact: "+1 (555) 887-2211",
      shiftTiming: "04:00 PM - 12:00 AM",
      attendanceStatus: "Present",
      performanceRating: 4.8,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s13",
      name: "Marcus Thorne",
      role: "Waiter",
      contact: "+1 (555) 667-8899",
      shiftTiming: "05:00 PM - 01:00 AM",
      attendanceStatus: "Present",
      performanceRating: 4.9,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "s14",
      name: "Amelia Du Pont",
      role: "Manager",
      contact: "+1 (555) 231-5544",
      shiftTiming: "04:00 PM - 11:00 PM",
      attendanceStatus: "Present",
      performanceRating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    }
  ],
  activities: [
    {
      id: "a1",
      type: "order",
      message: "New order DF-4002 created for Table 4.",
      time: "2026-06-27T13:44:23.414Z",
      severity: "info"
    },
    {
      id: "a2",
      type: "order",
      message: "Order DF-4003 marked as READY for Table 8.",
      time: "2026-06-27T13:39:23.414Z",
      severity: "success"
    },
    {
      id: "a3",
      type: "inventory",
      message: "Low stock warning: Maine Lobster Tail is below minimum threshold.",
      time: "2026-06-27T11:49:23.414Z",
      severity: "warning"
    },
    {
      id: "a4",
      type: "reservation",
      message: "New online reservation confirmed for Eleanor Vance (2 guests) tomorrow.",
      time: "2026-06-27T13:43:23.414Z",
      severity: "success"
    },
    {
      id: "a5",
      type: "table",
      message: "Table 5 changed status to Cleaning.",
      time: "2026-06-27T13:34:23.414Z",
      severity: "info"
    },
    {
      id: "a6",
      type: "staff",
      message: "Sarah Jenkins checked in for the Evening shift.",
      time: "2026-06-27T09:54:23.414Z",
      severity: "info"
    }
  ],
  settings: {
    restaurantName: "Bistro",
    currencySymbol: "$",
    taxPercentage: 8,
    defaultDiscountPercentage: 10,
    enableSoundNotifications: true,
    kdsRefreshRate: 15,
    brandLogo: "",
    primaryBrandColor: "#f97316",
    secondaryBrandColor: "#ea580c"
  },
  feedback: [
    {
      id: "f1",
      customerName: "Robert Langdon",
      rating: 5,
      comment: "Absolutely delightful evening! The Wagyu Beef Tenderloin was cooked to absolute perfection. Our server Sophia was extremely attentive and quick.",
      waiterId: "s12",
      waiterName: "Sophia Sterling",
      createdAt: "2026-06-27T13:19:23.414Z",
      status: "Approved",
      category: "Food Quality"
    },
    {
      id: "f2",
      customerName: "Clara Oswald",
      rating: 4,
      comment: "The ambiance is modern and high-end. Saffron Risotto was a bit salty, but the cocktails made up for it. Highly recommend the Crimson Elixir!",
      createdAt: "2026-06-27T11:49:23.414Z",
      status: "Pending",
      category: "Ambiance"
    },
    {
      id: "f3",
      customerName: "Alistair Vance",
      rating: 5,
      comment: "Marcus Thorne gave us the best table recommendations and guided us through the specials beautifully. The Truffle Fries are addictive.",
      waiterId: "s13",
      waiterName: "Marcus Thorne",
      createdAt: "2026-06-27T10:49:23.414Z",
      status: "Approved",
      category: "Service"
    },
    {
      id: "f4",
      customerName: "Fiona Gallagher",
      rating: 3,
      comment: "Food was decent but took almost 40 minutes to arrive. It was rush hour so understandable, but expected quicker turnaround.",
      createdAt: "2026-06-27T08:49:23.414Z",
      status: "Pending",
      category: "Service"
    },
    {
      id: "f5",
      customerName: "Julian Devorak",
      rating: 5,
      comment: "Clean table, perfectly aligned cutlery, and incredibly hygienic food preparation. The whole team did an outstanding job.",
      createdAt: "2026-06-27T05:49:23.414Z",
      status: "Approved",
      category: "Cleanliness"
    }
  ]
};

// db.ts
import_dotenv.default.config();
var pool = null;
var FALLBACK_FILE = import_path.default.join(process.cwd(), "db_fallback.json");
function getPool() {
  if (pool) return pool;
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("No POSTGRES_URL or DATABASE_URL provided. Falling back to local JSON file database.");
    return null;
  }
  try {
    console.log("Connecting to PostgreSQL database using connection string...");
    pool = new import_pg.Pool({
      connectionString,
      ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1") ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5e3,
      idleTimeoutMillis: 1e4
    });
    pool.on("error", (err) => {
      console.error("Unexpected error on idle client or pool:", err);
      pool = null;
    });
    return pool;
  } catch (poolErr) {
    console.error("Failed to initialize PostgreSQL pool:", poolErr);
    pool = null;
    return null;
  }
}
var getFallbackDefaults = () => ({
  menu: mockDataDefaults_default.menu,
  tables: mockDataDefaults_default.tables,
  orders: mockDataDefaults_default.orders,
  reservations: mockDataDefaults_default.reservations,
  inventory: mockDataDefaults_default.inventory,
  staff: mockDataDefaults_default.staff,
  activities: mockDataDefaults_default.activities,
  settings: mockDataDefaults_default.settings,
  feedbacks: mockDataDefaults_default.feedback
});
function readFallbackFile() {
  if (!import_fs.default.existsSync(FALLBACK_FILE)) {
    const defaults = getFallbackDefaults();
    try {
      import_fs.default.writeFileSync(FALLBACK_FILE, JSON.stringify(defaults, null, 2));
    } catch (writeErr) {
      console.warn("Failed to write fallback default file (possibly read-only filesystem):", writeErr);
    }
    return defaults;
  }
  try {
    const data = import_fs.default.readFileSync(FALLBACK_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading fallback JSON database. Using defaults.", err);
    return getFallbackDefaults();
  }
}
function writeFallbackFile(data) {
  try {
    import_fs.default.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing fallback JSON database.", err);
  }
}
function parseMenu(row) {
  const preparationTime = row.preparationTime !== void 0 ? row.preparationTime : row.preparationtime;
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    description: row.description,
    category: row.category,
    image: row.image,
    available: row.available,
    preparationTime: Number(preparationTime)
  };
}
function parseTable(row) {
  const currentOrderId = row.currentOrderId !== void 0 ? row.currentOrderId : row.currentorderid;
  const customerName = row.customerName !== void 0 ? row.customerName : row.customername;
  const guestsCount = row.guestsCount !== void 0 ? row.guestsCount : row.guestscount;
  return {
    id: row.id,
    number: Number(row.number),
    capacity: Number(row.capacity),
    status: row.status,
    currentOrderId: currentOrderId || void 0,
    customerName: customerName || void 0,
    guestsCount: guestsCount != null ? Number(guestsCount) : void 0
  };
}
function parseOrder(row) {
  const orderNumber = row.orderNumber !== void 0 ? row.orderNumber : row.ordernumber;
  const tableNumber = row.tableNumber !== void 0 ? row.tableNumber : row.tablenumber;
  const customerName = row.customerName !== void 0 ? row.customerName : row.customername;
  const grandTotal = row.grandTotal !== void 0 ? row.grandTotal : row.grandtotal;
  const paymentMethod = row.paymentMethod !== void 0 ? row.paymentMethod : row.paymentmethod;
  const createdAt = row.createdAt !== void 0 ? row.createdAt : row.createdat;
  const updatedAt = row.updatedAt !== void 0 ? row.updatedAt : row.updatedat;
  const specialNotes = row.specialNotes !== void 0 ? row.specialNotes : row.specialnotes;
  const waiterId = row.waiterId !== void 0 ? row.waiterId : row.waiterid;
  const waiterName = row.waiterName !== void 0 ? row.waiterName : row.waitername;
  return {
    id: row.id,
    orderNumber,
    tableNumber: Number(tableNumber),
    customerName: customerName || void 0,
    items: typeof row.items === "string" ? JSON.parse(row.items) : row.items,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    tax: Number(row.tax),
    grandTotal: Number(grandTotal),
    status: row.status,
    paymentMethod: paymentMethod || void 0,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    specialNotes: specialNotes || void 0,
    waiterId: waiterId || void 0,
    waiterName: waiterName || void 0
  };
}
function parseReservation(row) {
  const customerName = row.customerName !== void 0 ? row.customerName : row.customername;
  const tablePreference = row.tablePreference !== void 0 ? row.tablePreference : row.tablepreference;
  const createdAt = row.createdAt !== void 0 ? row.createdAt : row.createdat;
  return {
    id: row.id,
    customerName,
    phone: row.phone,
    date: row.date,
    time: row.time,
    guests: Number(row.guests),
    tablePreference: tablePreference || void 0,
    status: row.status,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt
  };
}
function parseInventory(row) {
  const currentStock = row.currentStock !== void 0 ? row.currentStock : row.currentstock;
  const minimumStock = row.minimumStock !== void 0 ? row.minimumStock : row.minimumstock;
  const expiryDate = row.expiryDate !== void 0 ? row.expiryDate : row.expirydate;
  const unitCost = row.unitCost !== void 0 ? row.unitCost : row.unitcost;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    currentStock: Number(currentStock),
    minimumStock: Number(minimumStock),
    unit: row.unit,
    supplier: row.supplier,
    expiryDate,
    unitCost: unitCost != null ? Number(unitCost) : void 0
  };
}
function parseStaff(row) {
  const shiftTiming = row.shiftTiming !== void 0 ? row.shiftTiming : row.shifttiming;
  const attendanceStatus = row.attendanceStatus !== void 0 ? row.attendanceStatus : row.attendancestatus;
  const performanceRating = row.performanceRating !== void 0 ? row.performanceRating : row.performancerating;
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    contact: row.contact,
    shiftTiming: shiftTiming || "",
    attendanceStatus: attendanceStatus || "Present",
    performanceRating: Number(performanceRating),
    image: row.image
  };
}
function parseFeedback(row) {
  const customerName = row.customerName !== void 0 ? row.customerName : row.customername;
  const waiterId = row.waiterId !== void 0 ? row.waiterId : row.waiterid;
  const waiterName = row.waiterName !== void 0 ? row.waiterName : row.waitername;
  const createdAt = row.createdAt !== void 0 ? row.createdAt : row.createdat;
  return {
    id: row.id,
    customerName,
    rating: Number(row.rating),
    comment: row.comment,
    waiterId: waiterId || void 0,
    waiterName: waiterName || void 0,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    status: row.status,
    category: row.category || void 0
  };
}
async function initDb() {
  const activePool = getPool();
  if (!activePool) {
    readFallbackFile();
    console.log(`Fallback JSON database initialized at ${FALLBACK_FILE}`);
    return;
  }
  const client = await activePool.connect();
  client.on("error", (err) => {
    console.error("Database client error during initDb:", err);
  });
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        image TEXT,
        available BOOLEAN DEFAULT true,
        "preparationTime" INTEGER DEFAULT 10
      );

      CREATE TABLE IF NOT EXISTS tables (
        id VARCHAR(50) PRIMARY KEY,
        number INTEGER UNIQUE NOT NULL,
        capacity INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL,
        "currentOrderId" VARCHAR(50),
        "customerName" VARCHAR(255),
        "guestsCount" INTEGER
      );

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        "orderNumber" VARCHAR(50) UNIQUE NOT NULL,
        "tableNumber" INTEGER NOT NULL,
        "customerName" VARCHAR(255),
        items JSONB NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        discount NUMERIC(5, 2) DEFAULT 0,
        tax NUMERIC(5, 2) DEFAULT 8,
        "grandTotal" NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        "paymentMethod" VARCHAR(50),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "specialNotes" TEXT,
        "waiterId" VARCHAR(50),
        "waiterName" VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id VARCHAR(50) PRIMARY KEY,
        "customerName" VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        date VARCHAR(20) NOT NULL,
        time VARCHAR(20) NOT NULL,
        guests INTEGER NOT NULL,
        "tablePreference" VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Pending',
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inventory_items (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        "currentStock" NUMERIC(10, 2) NOT NULL,
        "minimumStock" NUMERIC(10, 2) NOT NULL,
        unit VARCHAR(50) NOT NULL,
        supplier VARCHAR(255),
        "expiryDate" VARCHAR(20),
        "unitCost" NUMERIC(10, 2)
      );

      CREATE TABLE IF NOT EXISTS staff_members (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        contact VARCHAR(100),
        "shiftTiming" VARCHAR(100),
        "attendanceStatus" VARCHAR(50) DEFAULT 'Present',
        "performanceRating" NUMERIC(3, 2) DEFAULT 5.0,
        image TEXT
      );

      CREATE TABLE IF NOT EXISTS live_activities (
        id VARCHAR(50) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        time VARCHAR(100) NOT NULL,
        severity VARCHAR(50) DEFAULT 'info'
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        id VARCHAR(50) PRIMARY KEY,
        value JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS customer_feedbacks (
        id VARCHAR(50) PRIMARY KEY,
        "customerName" VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        "waiterId" VARCHAR(50),
        "waiterName" VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'Pending',
        category VARCHAR(100)
      );
    `);
    console.log("PostgreSQL Database tables verified/initialized.");
    const menuCountRes = await client.query("SELECT COUNT(*) FROM menu_items");
    if (parseInt(menuCountRes.rows[0].count) === 0) {
      console.log("Seeding menu_items...");
      for (const item of mockDataDefaults_default.menu) {
        await client.query(
          `INSERT INTO menu_items (id, name, price, description, category, image, available, "preparationTime")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [item.id, item.name, item.price, item.description, item.category, item.image, item.available, item.preparationTime]
        );
      }
    }
    const tablesCountRes = await client.query("SELECT COUNT(*) FROM tables");
    if (parseInt(tablesCountRes.rows[0].count) === 0) {
      console.log("Seeding tables...");
      for (const t of mockDataDefaults_default.tables) {
        await client.query(
          `INSERT INTO tables (id, number, capacity, status, "currentOrderId", "customerName", "guestsCount")
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [t.id, t.number, t.capacity, t.status, t.currentOrderId || null, t.customerName || null, t.guestsCount || null]
        );
      }
    }
    const ordersCountRes = await client.query("SELECT COUNT(*) FROM orders");
    if (parseInt(ordersCountRes.rows[0].count) === 0) {
      console.log("Seeding orders...");
      for (const o of mockDataDefaults_default.orders) {
        await client.query(
          `INSERT INTO orders (id, "orderNumber", "tableNumber", "customerName", items, subtotal, discount, tax, "grandTotal", status, "paymentMethod", "createdAt", "updatedAt", "specialNotes", "waiterId", "waiterName")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [
            o.id,
            o.orderNumber,
            o.tableNumber,
            o.customerName || null,
            JSON.stringify(o.items),
            o.subtotal,
            o.discount,
            o.tax,
            o.grandTotal,
            o.status,
            o.paymentMethod || null,
            o.createdAt,
            o.updatedAt,
            o.specialNotes || null,
            o.waiterId || null,
            o.waiterName || null
          ]
        );
      }
    }
    const resCountRes = await client.query("SELECT COUNT(*) FROM reservations");
    if (parseInt(resCountRes.rows[0].count) === 0) {
      console.log("Seeding reservations...");
      for (const r of mockDataDefaults_default.reservations) {
        await client.query(
          `INSERT INTO reservations (id, "customerName", phone, date, time, guests, "tablePreference", status, "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [r.id, r.customerName, r.phone, r.date, r.time, r.guests, r.tablePreference, r.status, r.createdAt]
        );
      }
    }
    const invCountRes = await client.query("SELECT COUNT(*) FROM inventory_items");
    if (parseInt(invCountRes.rows[0].count) === 0) {
      console.log("Seeding inventory_items...");
      for (const i of mockDataDefaults_default.inventory) {
        await client.query(
          `INSERT INTO inventory_items (id, name, category, "currentStock", "minimumStock", unit, supplier, "expiryDate", "unitCost")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [i.id, i.name, i.category, i.currentStock, i.minimumStock, i.unit, i.supplier, i.expiryDate, i.unitCost || null]
        );
      }
    }
    const staffCountRes = await client.query("SELECT COUNT(*) FROM staff_members");
    if (parseInt(staffCountRes.rows[0].count) === 0) {
      console.log("Seeding staff_members...");
      for (const s of mockDataDefaults_default.staff) {
        await client.query(
          `INSERT INTO staff_members (id, name, role, contact, "shiftTiming", "attendanceStatus", "performanceRating", image)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [s.id, s.name, s.role, s.contact, s.shiftTiming, s.attendanceStatus, s.performanceRating, s.image]
        );
      }
    }
    const actCountRes = await client.query("SELECT COUNT(*) FROM live_activities");
    if (parseInt(actCountRes.rows[0].count) === 0) {
      console.log("Seeding live_activities...");
      for (const a of mockDataDefaults_default.activities) {
        await client.query(
          `INSERT INTO live_activities (id, type, message, time, severity)
           VALUES ($1, $2, $3, $4, $5)`,
          [a.id, a.type, a.message, a.time, a.severity]
        );
      }
    }
    const settingsCountRes = await client.query("SELECT COUNT(*) FROM system_settings");
    if (parseInt(settingsCountRes.rows[0].count) === 0) {
      console.log("Seeding system_settings...");
      await client.query(
        `INSERT INTO system_settings (id, value) VALUES ($1, $2)`,
        ["current", JSON.stringify(mockDataDefaults_default.settings)]
      );
    }
    const fbCountRes = await client.query("SELECT COUNT(*) FROM customer_feedbacks");
    if (parseInt(fbCountRes.rows[0].count) === 0) {
      console.log("Seeding customer_feedbacks...");
      for (const f of mockDataDefaults_default.feedback) {
        await client.query(
          `INSERT INTO customer_feedbacks (id, "customerName", rating, comment, "waiterId", "waiterName", "createdAt", status, category)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [f.id, f.customerName, f.rating, f.comment, f.waiterId || null, f.waiterName || null, f.createdAt, f.status, f.category || null]
        );
      }
    }
    console.log("PostgreSQL Database seeded successfully with default values.");
  } catch (err) {
    console.error("Error initializing and seeding PostgreSQL database:", err);
  } finally {
    client.release();
  }
}
async function loadAllData() {
  const activePool = getPool();
  if (!activePool) {
    const fallback = readFallbackFile();
    return {
      menuItems: fallback.menu,
      tables: fallback.tables,
      orders: fallback.orders,
      reservations: fallback.reservations,
      inventory: fallback.inventory,
      staff: fallback.staff,
      activities: fallback.activities,
      settings: fallback.settings,
      feedbacks: fallback.feedbacks
    };
  }
  let client;
  try {
    client = await activePool.connect();
    client.on("error", (err) => {
      console.error("Database client error during loadAllData:", err);
    });
  } catch (connErr) {
    console.error("Error connecting to database, falling back to local file:", connErr);
    const fallback = readFallbackFile();
    return {
      menuItems: fallback.menu,
      tables: fallback.tables,
      orders: fallback.orders,
      reservations: fallback.reservations,
      inventory: fallback.inventory,
      staff: fallback.staff,
      activities: fallback.activities,
      settings: fallback.settings,
      feedbacks: fallback.feedbacks
    };
  }
  try {
    const menuItems = await client.query("SELECT * FROM menu_items");
    const tables = await client.query("SELECT * FROM tables ORDER BY number ASC");
    const orders = await client.query('SELECT * FROM orders ORDER BY "createdAt" DESC');
    const reservations = await client.query("SELECT * FROM reservations ORDER BY date ASC, time ASC");
    const inventory = await client.query("SELECT * FROM inventory_items");
    const staff = await client.query("SELECT * FROM staff_members");
    const activities = await client.query("SELECT * FROM live_activities ORDER BY time DESC");
    const settingsRes = await client.query("SELECT value FROM system_settings WHERE id = $1", ["current"]);
    const feedbacks = await client.query('SELECT * FROM customer_feedbacks ORDER BY "createdAt" DESC');
    const settings = settingsRes.rows[0]?.value || mockDataDefaults_default.settings;
    return {
      menuItems: menuItems.rows.map(parseMenu),
      tables: tables.rows.map(parseTable),
      orders: orders.rows.map(parseOrder),
      reservations: reservations.rows.map(parseReservation),
      inventory: inventory.rows.map(parseInventory),
      staff: staff.rows.map(parseStaff),
      activities: activities.rows,
      settings,
      feedbacks: feedbacks.rows.map(parseFeedback)
    };
  } catch (err) {
    console.error("Error loading data from PostgreSQL, falling back to local file:", err);
    const fallback = readFallbackFile();
    return {
      menuItems: fallback.menu,
      tables: fallback.tables,
      orders: fallback.orders,
      reservations: fallback.reservations,
      inventory: fallback.inventory,
      staff: fallback.staff,
      activities: fallback.activities,
      settings: fallback.settings,
      feedbacks: fallback.feedbacks
    };
  } finally {
    client.release();
  }
}
async function saveDataKey(key, data) {
  const activePool = getPool();
  if (!activePool) {
    const fallback = readFallbackFile();
    fallback[key] = data;
    writeFallbackFile(fallback);
    return;
  }
  const client = await activePool.connect();
  client.on("error", (err) => {
    console.error("Database client error during saveDataKey:", err);
  });
  try {
    await client.query("BEGIN");
    if (key === "menu") {
      await client.query("DELETE FROM menu_items");
      for (const item of data) {
        await client.query(
          `INSERT INTO menu_items (id, name, price, description, category, image, available, "preparationTime")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [item.id, item.name, item.price, item.description, item.category, item.image, item.available, item.preparationTime]
        );
      }
    } else if (key === "tables") {
      await client.query("DELETE FROM tables");
      for (const t of data) {
        await client.query(
          `INSERT INTO tables (id, number, capacity, status, "currentOrderId", "customerName", "guestsCount")
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [t.id, t.number, t.capacity, t.status, t.currentOrderId || null, t.customerName || null, t.guestsCount || null]
        );
      }
    } else if (key === "orders") {
      await client.query("DELETE FROM orders");
      for (const o of data) {
        await client.query(
          `INSERT INTO orders (id, "orderNumber", "tableNumber", "customerName", items, subtotal, discount, tax, "grandTotal", status, "paymentMethod", "createdAt", "updatedAt", "specialNotes", "waiterId", "waiterName")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           ON CONFLICT (id) DO NOTHING`,
          [
            o.id,
            o.orderNumber,
            o.tableNumber,
            o.customerName || null,
            JSON.stringify(o.items),
            o.subtotal,
            o.discount,
            o.tax,
            o.grandTotal,
            o.status,
            o.paymentMethod || null,
            o.createdAt,
            o.updatedAt,
            o.specialNotes || null,
            o.waiterId || null,
            o.waiterName || null
          ]
        );
      }
    } else if (key === "reservations") {
      await client.query("DELETE FROM reservations");
      for (const r of data) {
        await client.query(
          `INSERT INTO reservations (id, "customerName", phone, date, time, guests, "tablePreference", status, "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [r.id, r.customerName, r.phone, r.date, r.time, r.guests, r.tablePreference, r.status, r.createdAt]
        );
      }
    } else if (key === "inventory") {
      await client.query("DELETE FROM inventory_items");
      for (const i of data) {
        await client.query(
          `INSERT INTO inventory_items (id, name, category, "currentStock", "minimumStock", unit, supplier, "expiryDate", "unitCost")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [i.id, i.name, i.category, i.currentStock, i.minimumStock, i.unit, i.supplier, i.expiryDate, i.unitCost || null]
        );
      }
    } else if (key === "staff") {
      await client.query("DELETE FROM staff_members");
      for (const s of data) {
        await client.query(
          `INSERT INTO staff_members (id, name, role, contact, "shiftTiming", "attendanceStatus", "performanceRating", image)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [s.id, s.name, s.role, s.contact, s.shiftTiming, s.attendanceStatus, s.performanceRating, s.image]
        );
      }
    } else if (key === "activities") {
      await client.query("DELETE FROM live_activities");
      for (const a of data) {
        await client.query(
          `INSERT INTO live_activities (id, type, message, time, severity)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [a.id, a.type, a.message, a.time, a.severity]
        );
      }
    } else if (key === "settings") {
      await client.query("DELETE FROM system_settings");
      await client.query(
        `INSERT INTO system_settings (id, value) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET value = $2`,
        ["current", JSON.stringify(data)]
      );
    } else if (key === "feedbacks") {
      await client.query("DELETE FROM customer_feedbacks");
      for (const f of data) {
        await client.query(
          `INSERT INTO customer_feedbacks (id, "customerName", rating, comment, "waiterId", "waiterName", "createdAt", status, category)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [f.id, f.customerName, f.rating, f.comment, f.waiterId || null, f.waiterName || null, f.createdAt, f.status, f.category || null]
        );
      }
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Error saving key ${key} to PostgreSQL database:`, err);
    throw err;
  } finally {
    client.release();
  }
}
async function resetDb() {
  const activePool = getPool();
  if (!activePool) {
    const defaults = getFallbackDefaults();
    writeFallbackFile(defaults);
    console.log("Fallback JSON database reset to default values.");
    return;
  }
  const client = await activePool.connect();
  client.on("error", (err) => {
    console.error("Database client error during resetDb:", err);
  });
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM menu_items");
    await client.query("DELETE FROM tables");
    await client.query("DELETE FROM orders");
    await client.query("DELETE FROM reservations");
    await client.query("DELETE FROM inventory_items");
    await client.query("DELETE FROM staff_members");
    await client.query("DELETE FROM live_activities");
    await client.query("DELETE FROM system_settings");
    await client.query("DELETE FROM customer_feedbacks");
    await client.query("COMMIT");
    console.log("Database cleared for reset.");
    await initDb();
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error resetting database:", err);
    throw err;
  } finally {
    client.release();
  }
}

// server.ts
import_dotenv2.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not defined.");
  }
  return new import_genai.GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
};
app.post("/api/ai/auto-price", async (req, res) => {
  try {
    const {
      menuItemName,
      description,
      category,
      selectedIngredients,
      profitMargin,
      availableInventory
    } = req.body;
    if (!menuItemName) {
      return res.status(400).json({ error: "Menu item name is required" });
    }
    const marginValue = profitMargin || 70;
    const ai = getGeminiClient();
    let prompt = "";
    if (selectedIngredients && selectedIngredients.length > 0) {
      prompt = `
        You are a restaurant pricing consultant.
        Calculate the optimal menu price for the following menu item:
        - Name: "${menuItemName}"
        - Category: "${category}"
        - Description: "${description || "N/A"}"
        - Desired Profit Margin: ${marginValue}% (meaning raw cost should be ${100 - marginValue}% of the retail price)

        The user has selected the following specific ingredients from the inventory:
        ${JSON.stringify(selectedIngredients, null, 2)}

        Calculate the total cost of these ingredients based on their quantities and unit costs.
        Then, calculate the suggested retail price that achieves the desired ${marginValue}% profit margin.
        Formula: Suggested Price = Total Ingredient Cost / (1 - (Desired Margin / 100))
        
        Provide the calculation, cost contributions, and a clear pricing rationale.
      `;
    } else {
      prompt = `
        You are an expert culinary operations and pricing consultant.
        A chef wants to add a new menu item:
        - Name: "${menuItemName}"
        - Category: "${category}"
        - Description: "${description || "N/A"}"
        - Desired Profit Margin: ${marginValue}% (meaning raw cost should be ${100 - marginValue}% of the retail price)

        Here is the restaurant's active raw stock inventory:
        ${JSON.stringify(availableInventory || [], null, 2)}

        Tasks:
        1. Identify which inventory ingredients from the list are likely used in this recipe.
        2. Estimate standard, realistic portion sizes/quantities of these ingredients for a single serving.
        3. Retrieve their corresponding "unitCost" to find the total food cost.
        4. If some standard ingredients are missing from the inventory list, use realistic market prices for them, but mark them as "estimated/off-inventory" items.
        5. Calculate the suggested retail price to meet the ${marginValue}% profit margin.
           Formula: Suggested Price = Total Ingredient Cost / (1 - (Desired Margin / 100))
        6. Return a comprehensive breakdown of the costs and the reasoning.
      `;
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional restaurant revenue manager and executive chef. You specialize in menu engineering, costing, and strategic pricing. Always respond with valid JSON matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          required: ["suggestedPrice", "totalCostOfIngredients", "calculatedMargin", "ingredientsUsed", "reasoning"],
          properties: {
            suggestedPrice: {
              type: import_genai.Type.NUMBER,
              description: "The suggested optimal selling price for the menu item"
            },
            totalCostOfIngredients: {
              type: import_genai.Type.NUMBER,
              description: "The total raw ingredient cost for a single portion"
            },
            calculatedMargin: {
              type: import_genai.Type.NUMBER,
              description: "The exact profit margin achieved (equal to the desired profit margin)"
            },
            ingredientsUsed: {
              type: import_genai.Type.ARRAY,
              description: "List of ingredients used in the cost breakdown",
              items: {
                type: import_genai.Type.OBJECT,
                required: ["name", "quantityNeeded", "unit", "costContribution", "isFromInventory"],
                properties: {
                  name: { type: import_genai.Type.STRING },
                  quantityNeeded: { type: import_genai.Type.NUMBER, description: "Quantity used per serving" },
                  unit: { type: import_genai.Type.STRING, description: "E.g., kg, unit, liter" },
                  costContribution: { type: import_genai.Type.NUMBER, description: "Total cost of this ingredient in the serving" },
                  isFromInventory: { type: import_genai.Type.BOOLEAN, description: "Whether this ingredient was matched from the active inventory list" }
                }
              }
            },
            reasoning: {
              type: import_genai.Type.STRING,
              description: "Detailed, chef-professional breakdown of the recommended price, portion assumptions, and profitability"
            }
          }
        }
      }
    });
    const resultText = response.text || "{}";
    const pricingData = JSON.parse(resultText.trim());
    res.json(pricingData);
  } catch (error) {
    console.error("AI Auto-Price Error:", error);
    res.status(500).json({
      error: "Failed to generate price suggestion. Please ensure GEMINI_API_KEY is configured properly.",
      details: error?.message || String(error)
    });
  }
});
app.post("/api/ai/smart-schedule", async (req, res) => {
  try {
    const { staff, orders } = req.body;
    if (!staff || !Array.isArray(staff)) {
      return res.status(400).json({ error: "Staff list is required and must be an array" });
    }
    const hourlyOrders = {};
    const dailyOrders = {};
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let validOrdersCount = 0;
    (orders || []).forEach((o) => {
      if (!o.createdAt || o.status === "Cancelled") return;
      try {
        const d = new Date(o.createdAt);
        const hour = d.getHours();
        const hourLabel = `${String(hour).padStart(2, "0")}:00`;
        hourlyOrders[hourLabel] = (hourlyOrders[hourLabel] || 0) + 1;
        const day = weekdays[d.getDay()];
        dailyOrders[day] = (dailyOrders[day] || 0) + 1;
        validOrdersCount++;
      } catch {
      }
    });
    const ai = getGeminiClient();
    const prompt = `
      You are an expert restaurant operations planner and labor optimization consultant.
      Your task is to analyze historical order volume peaks and automatically design an optimal shift schedule for our staff roster.

      Here is the historical order data parsed from our active ReportsView:
      - Total completed orders analyzed: ${validOrdersCount}
      - Daily order counts: ${JSON.stringify(dailyOrders)}
      - Hourly order counts: ${JSON.stringify(hourlyOrders)}

      If the above distribution has low data points, assume standard fine-dining peaks:
      - Lunch Rush: 11:30 AM - 02:30 PM (High demand, high ticket throughput)
      - Dinner Rush: 05:30 PM - 09:30 PM (Critical demand, premium Wagyu/Steak focus, requires top Chefs & Waiters)
      - Late Lounge: 09:30 PM - 12:00 AM (Medium demand, high cocktail/beverage focus)

      Here is our active staff roster:
      ${JSON.stringify(staff, null, 2)}

      Tasks:
      1. Predict 3 major peak intensity periods based on the order timings.
      2. Recommend an optimal shift timing assignment for each employee in the staff roster. The standard shifts to choose from are:
         - "08:00 AM - 04:00 PM" (Morning Shift: heavy kitchen prep, lunch service)
         - "11:00 AM - 07:00 PM" (Day Shift: covers both lunch and dinner transition)
         - "04:00 PM - 12:00 AM" (Evening Shift: heavy dinner rush, closing)
         - "12:00 PM - 10:00 PM" (Double/Split/Chef Shift: coverage for entire high-intensity core day)
         Or suggest a custom shift if it fits their role better!
      3. Strategically place higher-rated employees (performanceRating) and align staff counts with the peak periods (e.g. more waiters and chefs during the Dinner Rush than the Morning shift).
      4. Compute a capacity coverage score for each shift (Morning, Day, Evening).
      5. Provide an executive summary of your labor strategy.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional hospitality consultant and senior restaurant operations scheduler. Always respond with valid JSON matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          required: ["predictedPeaks", "scheduleSuggestions", "capacityCoverage", "executiveSummary"],
          properties: {
            predictedPeaks: {
              type: import_genai.Type.ARRAY,
              description: "The identified high-volume peak times predicted from reports analytics",
              items: {
                type: import_genai.Type.OBJECT,
                required: ["timeRange", "intensity", "description"],
                properties: {
                  timeRange: { type: import_genai.Type.STRING, description: "e.g. 12:00 PM - 02:00 PM" },
                  intensity: { type: import_genai.Type.STRING, description: "Low, Medium, High, Critical" },
                  description: { type: import_genai.Type.STRING, description: "What is happening during this peak (e.g. Lunch rush, cocktail hours)" }
                }
              }
            },
            scheduleSuggestions: {
              type: import_genai.Type.ARRAY,
              description: "The suggested shift assignments for each member of the staff roster",
              items: {
                type: import_genai.Type.OBJECT,
                required: ["staffId", "staffName", "role", "suggestedShift", "reason"],
                properties: {
                  staffId: { type: import_genai.Type.STRING },
                  staffName: { type: import_genai.Type.STRING },
                  role: { type: import_genai.Type.STRING },
                  suggestedShift: { type: import_genai.Type.STRING, description: "e.g. 04:00 PM - 12:00 AM" },
                  reason: { type: import_genai.Type.STRING, description: "Specific, professional reason for this assignment based on role and rating" }
                }
              }
            },
            capacityCoverage: {
              type: import_genai.Type.ARRAY,
              description: "The analyzed coverage levels across standard shift blocks",
              items: {
                type: import_genai.Type.OBJECT,
                required: ["shiftName", "staffCount", "coverageLevel"],
                properties: {
                  shiftName: { type: import_genai.Type.STRING, description: "e.g. Morning, Day, Evening" },
                  staffCount: { type: import_genai.Type.NUMBER, description: "Number of staff members assigned to this shift" },
                  coverageLevel: { type: import_genai.Type.STRING, description: "e.g. Understaffed, Optimal, Robust" }
                }
              }
            },
            executiveSummary: {
              type: import_genai.Type.STRING,
              description: "Strategic overview explanation of how this layout maximizes profit, speed, and lowers cost"
            }
          }
        }
      }
    });
    const resultText = response.text || "{}";
    const scheduleData = JSON.parse(resultText.trim());
    res.json(scheduleData);
  } catch (error) {
    console.error("AI Smart Scheduling Error:", error);
    res.status(500).json({
      error: "Failed to generate smart schedule recommendations. Please verify your GEMINI_API_KEY is configured.",
      details: error?.message || String(error)
    });
  }
});
app.get("/api/data", async (req, res) => {
  try {
    const data = await loadAllData();
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.json(data);
  } catch (error) {
    console.error("Failed to load restaurant data:", error);
    res.status(500).json({ error: "Failed to load restaurant data", details: error?.message });
  }
});
app.post("/api/save", async (req, res) => {
  const { key, data } = req.body;
  try {
    if (!key) {
      return res.status(400).json({ error: "Key is required" });
    }
    await saveDataKey(key, data);
    res.json({ success: true, message: `Successfully saved ${key} data.` });
  } catch (error) {
    console.error(`Failed to save data for key ${key}:`, error);
    res.status(500).json({ error: `Failed to save data for key ${key}`, details: error?.message });
  }
});
app.post("/api/reset", async (req, res) => {
  try {
    await resetDb();
    res.json({ success: true, message: "System database successfully reset to default values." });
  } catch (error) {
    console.error("Failed to reset database:", error);
    res.status(500).json({ error: "Failed to reset database", details: error?.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
    console.log("Serving compiled production assets.");
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bistro server listening on host 0.0.0.0 port ${PORT}`);
  });
}
var server_default = app;
initDb().catch((err) => console.error("Database initialization failed:", err));
if (!process.env.VERCEL) {
  startServer();
}

// api/index.ts
var handler = (req, res) => {
  return new Promise((resolve) => {
    res.on("finish", resolve);
    res.on("close", resolve);
    server_default(req, res);
  });
};
module.exports = handler;
