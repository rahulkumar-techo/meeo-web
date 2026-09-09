'use client';

import React, { useState } from 'react';
import { Layers, Plus, Minus, Edit, AlertCircle } from 'lucide-react';
import { InventoryItem } from '@/types/admin';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export const AdminInventoryTable: React.FC = () => {
  const { showToast } = useToast();

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'inv-1',
      sku: 'MEEO-FW-AETH-01',
      name: 'Aethel-01 Italian Sneaker',
      category: "Men's Footwear",
      price: 8499,
      stock: 14,
      threshold: 5,
      status: 'In Stock',
    },
    {
      id: 'inv-2',
      sku: 'MEEO-KB-APEX-75',
      name: 'Apex Studio Tactile 75 Keyboard',
      category: 'Workspace & Tech',
      price: 18499,
      stock: 8,
      threshold: 10,
      status: 'Low Stock',
    },
    {
      id: 'inv-3',
      sku: 'MEEO-CH-MAG-PRO',
      name: 'MagDock Pro Fast Magnetic Hub',
      category: 'Workspace & Tech',
      price: 4299,
      stock: 22,
      threshold: 8,
      status: 'In Stock',
    },
    {
      id: 'inv-4',
      sku: 'MEEO-AU-KANSO-ANC',
      name: 'Kanso Minimalist ANC Headphone',
      category: 'Audio & Sound',
      price: 14999,
      stock: 16,
      threshold: 6,
      status: 'In Stock',
    },
  ]);

  const handleAdjustStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          const newStatus =
            newStock === 0
              ? 'Out of Stock'
              : newStock <= item.threshold
              ? 'Low Stock'
              : 'In Stock';
          return { ...item, stock: newStock, status: newStatus };
        }
        return item;
      })
    );
    showToast('Vault stock updated successfully');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e7ff]">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#412ce7]" />
          <h3 className="text-base font-bold text-[#131b2e]">Product Catalog &amp; Vault Stock</h3>
        </div>
        <span className="text-xs font-semibold text-[#777588]">
          {inventory.length} Active SKUs
        </span>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e2e7ff] text-[#777588] font-bold uppercase tracking-wider">
              <th className="pb-3">SKU &amp; Product</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Stock Units</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Quick Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f3ff]">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-[#faf8ff] transition-colors">
                <td className="py-3.5 pr-4">
                  <span className="font-bold text-[#131b2e] block">{item.name}</span>
                  <span className="text-[11px] font-mono text-[#777588]">{item.sku}</span>
                </td>
                <td className="py-3.5 pr-4 text-[#464556]">{item.category}</td>
                <td className="py-3.5 pr-4 font-bold text-[#131b2e]">
                  ₹{item.price.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 pr-4">
                  <span className="font-extrabold text-[#131b2e] text-sm">{item.stock}</span>
                </td>
                <td className="py-3.5 pr-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.status === 'In Stock'
                        ? 'bg-[#dcfce7] text-[#15803d]'
                        : item.status === 'Low Stock'
                        ? 'bg-[#ffdad2] text-[#ae3115]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleAdjustStock(item.id, -1)}
                      className="p-1 rounded bg-[#f2f3ff] hover:bg-[#eaedff] text-[#464556]"
                      title="Decrease Stock"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustStock(item.id, 1)}
                      className="p-1 rounded bg-[#f2f3ff] hover:bg-[#eaedff] text-[#464556]"
                      title="Increase Stock"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
