import React from 'react';
import { Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductSpecsProps {
  product: Product;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ product }) => {
  return (
    <section className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] shadow-sm flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#e2e7ff]">
        <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#412ce7] flex items-center justify-center">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#131b2e]">Tactile Specifications & Engineering</h2>
          <p className="text-xs text-[#464556]">Monolithic materials, structural tolerances, and origin calibration.</p>
        </div>
      </div>

      {/* Description & Curator Note */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#777588]">Design Statement</h4>
          <p className="text-sm text-[#464556] leading-relaxed">{product.description}</p>
        </div>
        {product.curatorNote && (
          <div className="p-4 rounded-2xl bg-[#eaedff]/60 border border-[#dae2fd] flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#412ce7] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#fd6a49]" />
              <span>Curator Verification</span>
            </div>
            <p className="text-xs text-[#131b2e] leading-relaxed">{product.curatorNote}</p>
          </div>
        )}
      </div>

      {/* Specs Key-Value Table */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#777588] mb-4">
          Hardware & Material Specs
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(product.specs).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#faf8ff] border border-[#e2e7ff]"
            >
              <span className="text-xs text-[#464556] font-medium">{key}</span>
              <span className="text-xs font-bold text-[#131b2e] text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Authentic Materials Badges */}
      {product.materials && product.materials.length > 0 && (
        <div className="pt-4 border-t border-[#e2e7ff] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#777588] mr-2">
            Verified Materials:
          </span>
          {product.materials.map((mat) => (
            <div
              key={mat}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] text-xs font-semibold text-[#131b2e] border border-[#e2e7ff]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span>{mat}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
