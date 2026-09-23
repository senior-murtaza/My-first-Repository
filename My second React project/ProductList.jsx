
function ProductList({ addToBasket }) {
  const products = [
    { id: 1, name: "Laptop", price: 650 },
    { id: 2, name: "Headphones", price: 45 },
    { id: 3, name: "Keyboard", price: 30 },
    { id: 4, name: "Mouse", price: 20 },
  ];

  return (
    <section className="products-section">
      <h2>Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <button onClick={() => addToBasket(product)}>Add to Basket</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductList;
