// Cocktail list shown on the 3D rail + in the cocktail section.
// Order = order on the rail. Index 0 starts in the centre.
export const DRINKS = [
  {
    id: 'ruby', name: 'Signature Ruby', kind: 'signature', glass: 'coupe', strength: 3, swatch: '#9d1228',
    en: { tagline: 'Sour cherry, hibiscus and a velvet gin finish.', ingredients: ['Gin', 'Sour cherry liqueur', 'Hibiscus syrup', 'Fresh lemon juice', 'Orange bitters'], garnish: 'Orange twist · Edible pansy', tags: ['Fruity', 'Floral'] },
    tr: { tagline: 'Vişne, hibiskus ve kadife gibi bir cin finali.', ingredients: ['Cin', 'Vişne likörü', 'Hibiskus şurubu', 'Taze limon suyu', 'Portakal bitter'], garnish: 'Portakal kabuğu · Yenilebilir hercai menekşe', tags: ['Meyvemsi', 'Çiçeksi'] },
    ru: { tagline: 'Вишня, гибискус и бархатный джиновый финиш.', ingredients: ['Джин', 'Вишнёвый ликёр', 'Сироп гибискуса', 'Свежий лимонный сок', 'Апельсиновый биттер'], garnish: 'Цедра апельсина · Съедобная фиалка', tags: ['Фруктовый', 'Цветочный'] }
  },
  {
    id: 'french75', name: 'French 75', kind: 'classic', glass: 'flute', strength: 3, swatch: '#e6c46a',
    en: { tagline: 'Gin and lemon, lifted with cold bubbles.', ingredients: ['Gin', 'Fresh lemon juice', 'Sugar syrup', 'Sparkling wine'], garnish: 'Lemon twist', tags: ['Sparkling', 'Citrus'] },
    tr: { tagline: 'Cin ve limon, soğuk köpüklerle.', ingredients: ['Cin', 'Taze limon suyu', 'Şeker şurubu', 'Köpüklü şarap'], garnish: 'Limon kabuğu', tags: ['Köpüklü', 'Narenciye'] },
    ru: { tagline: 'Джин и лимон, поднятые холодными пузырьками.', ingredients: ['Джин', 'Свежий лимонный сок', 'Сахарный сироп', 'Игристое вино'], garnish: 'Цедра лимона', tags: ['Игристый', 'Цитрусовый'] }
  },
  {
    id: 'gnt', name: 'Garden G&T', kind: 'classic', glass: 'copa', strength: 2, swatch: '#bcd6a8',
    en: { tagline: 'Crisp, green and endlessly refreshing.', ingredients: ['Gin', 'Tonic water', 'Fresh cucumber', 'Basil'], garnish: 'Cucumber slices · Basil', tags: ['Fresh', 'Herbal'] },
    tr: { tagline: 'Ferah, yeşil ve bitmeyen bir serinlik.', ingredients: ['Cin', 'Tonik', 'Taze salatalık', 'Fesleğen'], garnish: 'Salatalık dilimleri · Fesleğen', tags: ['Ferah', 'Bitkisel'] },
    ru: { tagline: 'Хрустящий, зелёный, бесконечно освежающий.', ingredients: ['Джин', 'Тоник', 'Свежий огурец', 'Базилик'], garnish: 'Ломтики огурца · Базилик', tags: ['Свежий', 'Травяной'] }
  },
  {
    id: 'golden', name: 'Golden Garden', kind: 'signature', glass: 'goblet', strength: 3, swatch: '#e9b820',
    en: { tagline: 'Bright citrus. Fresh herbs. A golden finish.', ingredients: ['Gin', 'Melon liqueur', 'Fresh lemon juice', 'Sugar syrup'], garnish: 'Dried orange · Rosemary · Fresh thyme', tags: ['Citrus', 'Herbal'] },
    tr: { tagline: 'Parlak narenciye. Taze otlar. Altın bir final.', ingredients: ['Cin', 'Kavun likörü', 'Taze limon suyu', 'Şeker şurubu'], garnish: 'Kurutulmuş portakal · Biberiye · Taze kekik', tags: ['Narenciye', 'Bitkisel'] },
    ru: { tagline: 'Яркий цитрус. Свежие травы. Золотой финиш.', ingredients: ['Джин', 'Дынный ликёр', 'Свежий лимонный сок', 'Сахарный сироп'], garnish: 'Сушёный апельсин · Розмарин · Свежий тимьян', tags: ['Цитрусовый', 'Травяной'] }
  },
  {
    id: 'negroni', name: 'Negroni', kind: 'classic', glass: 'rocks', strength: 4, swatch: '#b81f1a',
    en: { tagline: 'Bitter, sweet and perfectly balanced.', ingredients: ['Gin', 'Campari', 'Sweet vermouth'], garnish: 'Orange slice', tags: ['Bitter', 'Strong'] },
    tr: { tagline: 'Acı, tatlı ve kusursuz dengede.', ingredients: ['Cin', 'Campari', 'Tatlı vermut'], garnish: 'Portakal dilimi', tags: ['Acı', 'Sert'] },
    ru: { tagline: 'Горький, сладкий и идеально сбалансированный.', ingredients: ['Джин', 'Кампари', 'Красный вермут'], garnish: 'Долька апельсина', tags: ['Горький', 'Крепкий'] }
  },
  {
    id: 'lavender', name: 'Lavender Sour', kind: 'signature', glass: 'nicknora', strength: 3, swatch: '#7a4a9e',
    en: { tagline: 'Silky violet foam over a bright, floral sour.', ingredients: ['Gin', 'Crème de violette', 'Lavender syrup', 'Fresh lemon juice', 'Aquafaba foam'], garnish: 'Blackberries · Lavender', tags: ['Floral', 'Sour'] },
    tr: { tagline: 'Parlak, çiçeksi bir sour üzerinde ipeksi mor köpük.', ingredients: ['Cin', 'Menekşe likörü', 'Lavanta şurubu', 'Taze limon suyu', 'Aquafaba köpüğü'], garnish: 'Böğürtlen · Lavanta', tags: ['Çiçeksi', 'Ekşi'] },
    ru: { tagline: 'Шёлковая фиолетовая пена над ярким цветочным сауэром.', ingredients: ['Джин', 'Фиалковый ликёр', 'Лавандовый сироп', 'Свежий лимонный сок', 'Пена аквафаба'], garnish: 'Ежевика · Лаванда', tags: ['Цветочный', 'Кислый'] }
  },
  {
    id: 'mulled', name: { en: 'Berlin Glühwein', tr: 'Berlin Sıcak Şarap', ru: 'Берлинский глинтвейн' }, kind: 'winter', glass: 'mug', strength: 2, swatch: '#6d0c16',
    en: { tagline: 'Hot spiced red wine — the terrace classic on cold nights.', ingredients: ['Red wine', 'Orange', 'Cinnamon', 'Cloves', 'Star anise', 'Honey'], garnish: 'Orange wheel · Cinnamon stick · Star anise', tags: ['Hot', 'Spiced'] },
    tr: { tagline: 'Baharatlı sıcak kırmızı şarap — soğuk gecelerin teras klasiği.', ingredients: ['Kırmızı şarap', 'Portakal', 'Tarçın', 'Karanfil', 'Yıldız anason', 'Bal'], garnish: 'Portakal dilimi · Tarçın çubuğu · Yıldız anason', tags: ['Sıcak', 'Baharatlı'] },
    ru: { tagline: 'Горячее пряное красное вино — классика террасы в холодные вечера.', ingredients: ['Красное вино', 'Апельсин', 'Корица', 'Гвоздика', 'Бадьян', 'Мёд'], garnish: 'Долька апельсина · Палочка корицы · Бадьян', tags: ['Горячий', 'Пряный'] }
  },
  {
    id: 'aperol', name: 'Aperol Spritz', kind: 'classic', glass: 'wine', strength: 1, swatch: '#f0661e',
    en: { tagline: 'Bitter orange, prosecco and a long golden hour.', ingredients: ['Aperol', 'Prosecco', 'Soda water'], garnish: 'Orange slice', tags: ['Bitter-sweet', 'Light'] },
    tr: { tagline: 'Acı portakal, prosecco ve uzun bir altın saat.', ingredients: ['Aperol', 'Prosecco', 'Soda'], garnish: 'Portakal dilimi', tags: ['Acı-tatlı', 'Hafif'] },
    ru: { tagline: 'Горький апельсин, просекко и долгий золотой час.', ingredients: ['Апероль', 'Просекко', 'Содовая'], garnish: 'Долька апельсина', tags: ['Горько-сладкий', 'Лёгкий'] }
  },
  {
    id: 'espresso', name: 'Espresso Martini', kind: 'classic', glass: 'martini', strength: 3, swatch: '#3a1c0e',
    en: { tagline: 'Fresh espresso, vodka and a velvet crema.', ingredients: ['Vodka', 'Coffee liqueur', 'Fresh espresso', 'Sugar syrup'], garnish: 'Three coffee beans', tags: ['Coffee', 'Velvet'] },
    tr: { tagline: 'Taze espresso, votka ve kadifemsi krema.', ingredients: ['Votka', 'Kahve likörü', 'Taze espresso', 'Şeker şurubu'], garnish: 'Üç kahve çekirdeği', tags: ['Kahve', 'Kadifemsi'] },
    ru: { tagline: 'Свежий эспрессо, водка и бархатная крема.', ingredients: ['Водка', 'Кофейный ликёр', 'Свежий эспрессо', 'Сахарный сироп'], garnish: 'Три кофейных зерна', tags: ['Кофейный', 'Бархатный'] }
  },
  {
    id: 'oldfashioned', name: 'Old Fashioned', kind: 'classic', glass: 'rocks', strength: 5, swatch: '#b3600f',
    en: { tagline: 'Bourbon, bitters and a slow, warm orange finish.', ingredients: ['Bourbon', 'Demerara sugar', 'Angostura bitters', 'Orange bitters'], garnish: 'Orange peel · Clear ice', tags: ['Strong', 'Classic'] },
    tr: { tagline: 'Burbon, bitter ve yavaş, sıcak bir portakal finali.', ingredients: ['Burbon', 'Demerara şekeri', 'Angostura bitter', 'Portakal bitter'], garnish: 'Portakal kabuğu · Kristal buz', tags: ['Sert', 'Klasik'] },
    ru: { tagline: 'Бурбон, биттеры и медленный тёплый апельсиновый финиш.', ingredients: ['Бурбон', 'Сахар демерара', 'Биттер Ангостура', 'Апельсиновый биттер'], garnish: 'Цедра апельсина · Прозрачный лёд', tags: ['Крепкий', 'Классика'] }
  },
  {
    id: 'berry', name: 'Bosphorus Berry', kind: 'signature', glass: 'highball', strength: 2, swatch: '#b0123a',
    en: { tagline: 'Raspberry, cranberry and lime over crushed ice.', ingredients: ['Vodka', 'Raspberry purée', 'Cranberry juice', 'Fresh lime juice', 'Soda water'], garnish: 'Cranberries · Rosemary', tags: ['Fruity', 'Refreshing'] },
    tr: { tagline: 'Ahududu, kızılcık ve lime, kırık buzla.', ingredients: ['Votka', 'Ahududu püresi', 'Kızılcık suyu', 'Taze lime suyu', 'Soda'], garnish: 'Kızılcık · Biberiye', tags: ['Meyvemsi', 'Ferah'] },
    ru: { tagline: 'Малина, клюква и лайм на дроблёном льду.', ingredients: ['Водка', 'Малиновое пюре', 'Клюквенный сок', 'Свежий сок лайма', 'Содовая'], garnish: 'Клюква · Розмарин', tags: ['Фруктовый', 'Освежающий'] }
  },
  {
    id: 'horn', name: 'Golden Horn', kind: 'signature', glass: 'highball', strength: 2, swatch: '#f28a4e',
    en: { tagline: 'Peach, passion fruit and rum — sunset over the Haliç.', ingredients: ['White rum', 'Peach purée', 'Passion fruit', 'Fresh lime juice', 'Ginger syrup'], garnish: 'Blueberries · Mint', tags: ['Tropical', 'Sweet'] },
    tr: { tagline: 'Şeftali, çarkıfelek ve rom — Haliç’te gün batımı.', ingredients: ['Beyaz rom', 'Şeftali püresi', 'Çarkıfelek', 'Taze lime suyu', 'Zencefil şurubu'], garnish: 'Yaban mersini · Nane', tags: ['Tropikal', 'Tatlı'] },
    ru: { tagline: 'Персик, маракуйя и ром — закат над Золотым Рогом.', ingredients: ['Белый ром', 'Персиковое пюре', 'Маракуйя', 'Свежий сок лайма', 'Имбирный сироп'], garnish: 'Голубика · Мята', tags: ['Тропический', 'Сладкий'] }
  }
];

export const KIND = {
  signature: { en: 'Signature cocktail', tr: 'İmza kokteyl', ru: 'Авторский коктейль' },
  classic: { en: 'Classic cocktail', tr: 'Klasik kokteyl', ru: 'Классический коктейль' },
  winter: { en: 'Winter special', tr: 'Kış özel', ru: 'Зимний хит' }
};

export const GLASS = {
  coupe: { en: 'Coupe', tr: 'Coupe kadeh', ru: 'Купе' },
  flute: { en: 'Flute', tr: 'Flüt', ru: 'Флюте' },
  copa: { en: 'Copa glass', tr: 'Kopa kadeh', ru: 'Копа' },
  goblet: { en: 'Crystal goblet', tr: 'Kristal kadeh', ru: 'Хрустальный бокал' },
  rocks: { en: 'Rocks glass', tr: 'Rocks bardak', ru: 'Рокс' },
  nicknora: { en: 'Nick & Nora', tr: 'Nick & Nora', ru: 'Ник и Нора' },
  mug: { en: 'Glass mug', tr: 'Cam kupa', ru: 'Стеклянная кружка' },
  wine: { en: 'Wine glass', tr: 'Şarap kadehi', ru: 'Винный бокал' },
  martini: { en: 'Martini glass', tr: 'Martini kadehi', ru: 'Бокал мартини' },
  highball: { en: 'Highball', tr: 'Highball bardak', ru: 'Хайбол' }
};

export const drinkName = (d, lang) => (typeof d.name === 'string' ? d.name : d.name[lang] || d.name.en);

// Kitchen menu (prices in ₺ from the printed menu)
export const MENU = [
  { id: 'doner', title: { en: 'Berlin Döner', tr: 'Berlin Döner', ru: 'Берлинский дёнер' }, items: [
    { n: 'Tombik Berlin Döner', p: '245', d: { en: '160 g chicken döner in tombik bread, fries, pickled onions.', tr: 'Tombik ekmekte 160 g tavuk döner, patates, turşu soğan.', ru: '160 г куриного дёнера в булке томбик, фри, маринованный лук.' } },
    { n: 'Berlin Dürüm Döner', p: '265', d: { en: '160 g döner wrapped in lavash, fries, pickles.', tr: 'Lavaşa sarılı 160 g döner, patates, turşu.', ru: '160 г дёнера в лаваше, фри, соленья.' } },
    { n: 'Caesar Burrito Dürüm', p: '260', hot: true, d: { en: 'Döner, romaine, Caesar sauce, parmesan, chili, fries.', tr: 'Döner, marul, sezar sos, parmesan, acı biber, patates.', ru: 'Дёнер, романо, соус цезарь, пармезан, чили, фри.' } },
    { n: 'Mushroom Berlin Dürüm', p: '295', d: { en: '160 g döner, creamy mushroom sauce, fries.', tr: '160 g döner, kremalı mantar sos, patates.', ru: '160 г дёнера, сливочный грибной соус, фри.' } }
  ] },
  { id: 'burger', title: { en: 'Burgers', tr: 'Burgerler', ru: 'Бургеры' }, items: [
    { n: 'Chicken Berlin Special', p: '380', sig: true, d: { en: 'Crispy chicken, melted Kars kaşar, mango sauce, fries.', tr: 'Çıtır tavuk, eritilmiş Kars kaşarı, mango sos, patates.', ru: 'Хрустящая курица, плавленый сыр Карс, манговый соус, фри.' } },
    { n: 'Legendary Burger', p: '330', hot: true, d: { en: 'Crispy chicken, caramelised onion, cheddar, chipotle.', tr: 'Çıtır tavuk, karamelize soğan, cheddar, chipotle.', ru: 'Хрустящая курица, карамелизированный лук, чеддер, чипотле.' } },
    { n: 'Truffle Burger', p: '360', d: { en: 'Crispy chicken, caramelised onion, truffle sauce, fries.', tr: 'Çıtır tavuk, karamelize soğan, trüf sos, patates.', ru: 'Хрустящая курица, карамелизированный лук, трюфельный соус, фри.' } },
    { n: 'Dynamite Burger', p: '330', hot: true, d: { en: 'Crispy chicken, jalapeño, cheddar, dynamite sauce.', tr: 'Çıtır tavuk, jalapeño, cheddar, dinamit sos.', ru: 'Хрустящая курица, халапеньо, чеддер, соус «динамит».' } }
  ] },
  { id: 'bowl', title: { en: 'Bowls', tr: 'Bowl', ru: 'Боулы' }, items: [
    { n: 'Turkish Bowl', p: '330', d: { en: 'Döner, basmati, shepherd’s salad, crispy chickpeas, haydari.', tr: 'Döner, basmati, çoban salata, çıtır nohut, haydari.', ru: 'Дёнер, басмати, пастуший салат, хрустящий нут, хайдари.' } },
    { n: 'Asian Bowl', p: '335', d: { en: 'Teriyaki chicken, basmati, soy-glazed vegetables, sesame.', tr: 'Teriyaki tavuk, basmati, soyalı sebzeler, susam.', ru: 'Курица терияки, басмати, овощи в соевой глазури, кунжут.' } },
    { n: 'German Bowl', p: '330', d: { en: 'Döner, basmati, roast vegetables, baby potatoes, coleslaw.', tr: 'Döner, basmati, fırın sebze, bebek patates, coleslaw.', ru: 'Дёнер, басмати, запечённые овощи, молодой картофель, коул-слоу.' } },
    { n: 'Veggie Bowl', p: '295', veg: true, d: { en: 'Basmati, green beans, steamed vegetables, hummus.', tr: 'Basmati, zeytinyağlı fasulye, buharda sebze, humus.', ru: 'Басмати, стручковая фасоль, овощи на пару, хумус.' } }
  ] },
  { id: 'wings', title: { en: 'Wings & Tenders', tr: 'Kanat & Tenders', ru: 'Крылья и тендеры' }, items: [
    { n: 'Hot Wings', p: '360', hot: true, d: { en: '5 crispy wings, house hot sauce, fries.', tr: '5 çıtır kanat, ev yapımı acı sos, patates.', ru: '5 хрустящих крыльев, острый соус от шефа, фри.' } },
    { n: 'BBQ · Buffalo Wings', p: '360', d: { en: '5 crispy wings in barbecue or buffalo sauce.', tr: 'Barbekü ya da buffalo soslu 5 çıtır kanat.', ru: '5 хрустящих крыльев в соусе барбекю или баффало.' } },
    { n: 'Tenders 3 / 5 / 7', p: '250 / 290 / 320', d: { en: 'Crispy tenders, fries, pickled onions.', tr: 'Çıtır tenders, patates, turşu soğan.', ru: 'Хрустящие тендеры, фри, маринованный лук.' } },
    { n: 'Dynamite Special', p: '320', d: { en: 'Crispy chicken bites, sesame, pickled red onion.', tr: 'Çıtır tavuk parçaları, susam, turşu kırmızı soğan.', ru: 'Хрустящие кусочки курицы, кунжут, маринованный красный лук.' } }
  ] },
  { id: 'sides', title: { en: 'Sides', tr: 'Yan lezzetler', ru: 'Закуски' }, items: [
    { n: 'Fries', p: '150', d: { en: '+₺20 with parmesan, cheddar or crispy onion.', tr: 'Parmesan, cheddar ya da çıtır soğanla +₺20.', ru: '+₺20 с пармезаном, чеддером или хрустящим луком.' } },
    { n: 'Onion rings', p: '140', d: { en: 'Golden, crunchy, with a house sauce.', tr: 'Altın renkli, çıtır, ev sosuyla.', ru: 'Золотистые, хрустящие, с домашним соусом.' } },
    { n: 'Crispy-onion hummus', p: '140', veg: true, d: { en: 'Creamy hummus topped with crispy onion.', tr: 'Çıtır soğanlı kremamsı humus.', ru: 'Нежный хумус с хрустящим луком.' } },
    { n: 'Coleslaw · Pickles', p: '70 / 65', veg: true, d: { en: 'Fresh and sharp, made in-house.', tr: 'Taze ve keskin, ev yapımı.', ru: 'Свежие и пикантные, собственного приготовления.' } }
  ] }
];
