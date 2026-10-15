import { redirect } from 'next/navigation';
import { productService } from '@/services/product/productService';

export default async function ProductIndexPage() {
  try {
    const res = await productService.getProducts({ limit: 1 });
    if (res?.success && res?.data && res.data.length > 0) {
      redirect(`/product/${res.data[0].slug || res.data[0].id}`);
    }
  } catch {
    // API failed, redirect to catalog
  }

  redirect('/category');
}
