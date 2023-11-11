import { FlameIcon, TrendingUp } from "lucide-react";

import ProductList from "@/components/shop/product/product-list";
import { getShopBanners, getShopCategories, getShopProducts } from "@/lib/getDataSVOnly";
import Banner from "@/components/shop/banner";
import CategoryList from "@/components/shop/category-list";

const HomePage = async () => {
  const { data: products } = await getShopProducts({ take: "8", isTrending: true });
  const { data: bestsellerProducts } = await getShopProducts({ take: "8", isBestseller: true });
  const { data: newestProducts } = await getShopProducts({ take: "8", newest: true });
  const { data: banners } = await getShopBanners();
  const { data: categories } = await getShopCategories({ take: "8" });

  return (
    <div className="space-y-4">
      <Banner data={banners} />
      <ProductList
        title={<span className="flex items-center text-3xl">
          <FlameIcon className="text-red-400 mr-2" /> Trending
        </span>
        }
        data={products}
      />
      <CategoryList
        data={categories}
        className="mt-4"
      />
      <ProductList
        title={<span className="flex items-center text-3xl">
          <TrendingUp className="text-red-400 mr-2" /> Bestseller
        </span>
        }
        data={bestsellerProducts}
      />
      <ProductList
        title='Newest'
        data={newestProducts}
      />
    </div>
  )
}

export default HomePage;
