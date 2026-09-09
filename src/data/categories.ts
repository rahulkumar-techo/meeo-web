export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  itemCount: number;
  featuredImage: string;
  subcategories: string[];
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-all',
    slug: 'all',
    name: 'All Categories',
    description: 'The entire spectrum of engineered hardware, tactile objects, and studio apparel.',
    itemCount: 48,
    featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-OqvFJ9Jq4rAD2WZ09ddauyJ96v_Jjo9zZGaUT5-2Q3mE1h4q0LolxR7l72iG0KRQ9hkpDWerA_xsSedGeJC6HwhssAvCW2yh9NAfN547jqMdHDDzjTm_2l4f5fgSkd-6VudOtzbYAoHcI_LIEmXdX2yTZxI_ELZotvRtNSZXx0jiczB5E0b0FVW9bTuSTZQTRhHJiYu07h4U4mgoZEIVax5Wvsp24Iy6TvdcXVCTbE6Uzta8iB_Bpg',
    subcategories: ['All', 'Curated Picks', 'New Arrivals', 'Archival Editions'],
  },
  {
    id: 'cat-footwear',
    slug: 'footwear',
    name: "Men's Footwear",
    description: 'Engineered ergonomics, architectural silhouettes, and premium materials designed for daily motion.',
    itemCount: 18,
    featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFz_4n49d79QvD3zNrk5mffQxXUoGgZ0j934Yh3N3g9QJqHnZ-7a6bE5FvLw_m=s1600',
    subcategories: ['All Shoes', 'Minimalist Sneakers', 'Urban Techwear', 'Leather Derbies', 'Running & Motion', 'Loafers & Mules'],
  },
  {
    id: 'cat-workspace',
    slug: 'workspace',
    name: 'Workspace & Tech',
    description: 'High-tactility input devices, solid aluminum charging hubs, and quiet desktop accessories.',
    itemCount: 14,
    featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-OqvFJ9Jq4rAD2WZ09ddauyJ96v_Jjo9zZGaUT5-2Q3mE1h4q0LolxR7l72iG0KRQ9hkpDWerA_xsSedGeJC6HwhssAvCW2yh9NAfN547jqMdHDDzjTm_2l4f5fgSkd-6VudOtzbYAoHcI_LIEmXdX2yTZxI_ELZotvRtNSZXx0jiczB5E0b0FVW9bTuSTZQTRhHJiYu07h4U4mgoZEIVax5Wvsp24Iy6TvdcXVCTbE6Uzta8iB_Bpg',
    subcategories: ['Keyboards & Input', 'Magnetic Charging', 'Cable Architecture', 'Desk Pads & Risers'],
  },
  {
    id: 'cat-audio',
    slug: 'audio',
    name: 'Audio & Sound',
    description: 'Acoustic lab headphones, beryllium dynamic monitors, and low-resonance listening pieces.',
    itemCount: 8,
    featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3-3pUFszAOGHgA_jQzKwl01e8Q3ZQy-mbmwLW1eJMrHW5src2l95G1pB5qtQMnxBzqt03RKdhHoqP1sEOFyJx3V_qH4V-hZ2h2sm0xxxUgJweWVa6Wm1TpfbI11CfM837p4ungawt9W5__vxyZs7ZKcRyZJsilad9Ch8YEdFe4ewDFWXebelExtBtKeUjOWxW_ZlzNWjqrCi_D78M-LXZORKXG2dZvw9bSl-tqUMXTBm7n4aj_m0Y3g',
    subcategories: ['Studio Headphones', 'Wireless Earbuds', 'DAC Amplifiers', 'Desk Speakers'],
  },
  {
    id: 'cat-living',
    slug: 'living',
    name: 'Home & Living',
    description: 'Tactile stoneware, ambient luminescent lamps, and sculptural objects for focused rituals.',
    itemCount: 11,
    featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFz_4n49d79QvD3zNrk5mffQxXUoGgZ0j934Yh3N3g9QJqHnZ-7a6bE5FvLw_m=s1600',
    subcategories: ['Ceramics & Vessels', 'Ambient Lighting', 'Incense & Fragrance', 'Trays & Holders'],
  },
  {
    id: 'cat-objects',
    slug: 'objects',
    name: 'Objects & Bags',
    description: 'Weatherproof waxed canvas packs, titanium cardholders, and precision everyday carry items.',
    itemCount: 9,
    featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3-3pUFszAOGHgA_jQzKwl01e8Q3ZQy-mbmwLW1eJMrHW5src2l95G1pB5qtQMnxBzqt03RKdhHoqP1sEOFyJx3V_qH4V-hZ2h2sm0xxxUgJweWVa6Wm1TpfbI11CfM837p4ungawt9W5__vxyZs7ZKcRyZJsilad9Ch8YEdFe4ewDFWXebelExtBtKeUjOWxW_ZlzNWjqrCi_D78M-LXZORKXG2dZvw9bSl-tqUMXTBm7n4aj_m0Y3g',
    subcategories: ['Carry Packs', 'Travel Organizers', 'Everyday Hardware', 'Leather Goods'],
  },
];
