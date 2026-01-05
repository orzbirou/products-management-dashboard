import { Product } from "../data-access/models/product.model";
import { ProductsQuery } from "../data-access/models/products-query.model";


export interface ProductsQueryResult {
  items: Product[];
  total: number;
}

export function applyProductsQuery(products: readonly Product[], query: ProductsQuery): ProductsQueryResult {
  const q = query.q.trim().toLowerCase();

  //Filter by status + search
  const filtered = products.filter((p) => {
    const statusOk = query.status === 'all' ? true : p.status === query.status;

    if (!statusOk) return false;
    if (!q) return true;

    const name = (p.name ?? '').toLowerCase();
    const desc = (p.description ?? '').toLowerCase();

    return name.includes(q) || desc.includes(q);
  });

  //Sort
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;

    switch (query.sortBy) {
      case 'name': {
        const an = a.name ?? '';
        const bn = b.name ?? '';
        cmp = an.localeCompare(bn);
        break;
      }
      case 'price': {
        const ap = a.price ?? 0;
        const bp = b.price ?? 0;
        cmp = ap - bp;
        break;
      }
      case 'createdAt':
      default: {
        const at = toTime(a.createdAt);
        const bt = toTime(b.createdAt);
        cmp = at - bt;
        break;
      }
    }

    return query.sortDir === 'asc' ? cmp : -cmp;
  });

  //Pagination
  const total = sorted.length;
  const start = query.page * query.pageSize;
  const end = start + query.pageSize;
  const items = sorted.slice(start, end);

  return { items, total };
}

function toTime(value: unknown): number {
  const t = new Date(String(value ?? '')).getTime();
  return Number.isFinite(t) ? t : 0;
}
