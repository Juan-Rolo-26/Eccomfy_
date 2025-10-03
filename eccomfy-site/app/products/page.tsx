import StyleCard from "../../components/StyleCard";

export default function Products() {
  return (
    <div className="container-xl py-12">
      <h1 className="text-3xl font-bold mb-8">Productos</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <StyleCard title="Mailer" desc="Premium para e‑commerce" href="/design/mailer" img="/box-mailer.svg" />
        <StyleCard title="Shipping Box" desc="Resistente para envíos" href="/design/shipper" img="/box-shipper.svg" />
        <StyleCard title="Product Box" desc="Liviana para retail" href="/design/product" img="/box-product.svg" />
      </div>
    </div>
  );
}
