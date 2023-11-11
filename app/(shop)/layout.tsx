import Footer from "@/components/shop/footer";
import NavBar from "@/components/shop/nav-bar";

const ShopLayout = (props: {
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-secondary min-h-screen">
      <NavBar />
      <main className="max-w-6xl mx-auto px-2">{props.children}</main>
      <Footer />
    </div>
  )
}

export default ShopLayout;
