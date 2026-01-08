import Navbar from "@/components/Navbar";
import Catalog from "@/components/Catalog";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import { getProducts, getCategories } from "@/lib/db/queries";

export const dynamic = "force-dynamic"; // Ensure fresh data on each request

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      <Navbar />
      <PromoBanner />
      <Catalog products={products} categories={categories} />
      <Footer />
    </main>
  );
}



