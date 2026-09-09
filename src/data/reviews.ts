import { ReviewItem } from '@/types/filter';

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-01',
    productId: 'prod-01',
    author: 'Devansh M.',
    rating: 5,
    date: '3 days ago',
    title: 'Flawless calfskin leather and incredible arch comfort',
    comment:
      'The leather feels substantial yet buttery right out of the zero-plastic packaging. Wore them walking around south Mumbai all day with zero heel friction. The natural gum sole has great tactile grip.',
    verifiedPurchase: true,
    helpfulCount: 38,
    attributes: {
      tactileFeel: 'Exceptional',
      durability: 'High',
      ergonomics: 'True to Size',
    },
  },
  {
    id: 'rev-02',
    productId: 'prod-01',
    author: 'Aanya Sharma',
    rating: 5,
    date: '1 week ago',
    title: 'Minimal design that elevates any clean outfit',
    comment:
      'The silhouette is clean without loud logos. The chalk off-white tone looks very premium in person. Worth every rupee compared to mass commercial sneaker brands.',
    verifiedPurchase: true,
    helpfulCount: 24,
    attributes: {
      tactileFeel: 'Very Soft',
      durability: 'Solid',
      ergonomics: 'Comfortable Arch',
    },
  },
  {
    id: 'rev-03',
    productId: 'prod-02',
    author: 'Rohan Sen',
    rating: 5,
    date: '2 weeks ago',
    title: 'The acoustic dampening on this keyboard is unmatched',
    comment:
      'Zero ping or hollow rattle. The solid 6063 aluminum body weighs almost 1.8kg and stays rock solid on the desk pad. Rotary dial has very satisfying detents.',
    verifiedPurchase: true,
    helpfulCount: 52,
    attributes: {
      tactileFeel: 'Heavy & Dense',
      durability: 'Bulletproof',
      ergonomics: 'Gasket Cushioned',
    },
  },
];
