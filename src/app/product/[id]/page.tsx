import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailsView } from '@/components/urbannest/pdp/ProductDetailsView';
import { productService } from '@/services/product/productService';
import { mapApiProductToProductDetail } from '@/services/product/productAdapter';

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchProductData(id: string) {
  try {
    const res = await productService.getProductById(id);
    if (res?.success && res?.data) {
      return mapApiProductToProductDetail(res.data);
    }
  } catch {
    // API failed or product not found
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductData(id);
  if (!product) {
    return {
      title: 'Product Not Found · Meeo',
      description: 'The requested product could not be found.',
    };
  }
  return {
    title: `${product.name} · Meeo Online Store`,
    description: product.description || `Buy ${product.name} at the best price on Meeo.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchProductData(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailsView initialProduct={product} />;
}
