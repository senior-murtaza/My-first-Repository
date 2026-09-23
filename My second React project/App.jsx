import ProductList from "./ProductList";
import Basket from "./Basket";
import { useState } from "react";

function App() {
  const [basket, setBasket] = useState([]);

  function addToBasket(product) {
    setBasket([...basket, product]);
  }

  function removeFromBasket(id) {
    setBasket(basket.filter((item) => item.id !== id));
  }

  const totalPrice = basket.reduce((total, item) => total + item.price, 0);

  return (
    <div className="app">
      <header>
        <h1>Shopping Basket</h1>
        <p>Simple React Shopping Application</p>
      </header>

      <main className="shop-container">
        <ProductList addToBasket={addToBasket} />
        <Basket
          basket={basket}
          removeFromBasket={removeFromBasket}
          totalPrice={totalPrice}
        />
      </main>
    </div>
  );  
}

export default App;
