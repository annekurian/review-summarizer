import { Route, Routes } from 'react-router';
import Products from './components/products/Products';
import ProductDetail from './components/products/ProductDetail';

function App() {
  return (
    <div className="p-4 h-screen w-full">
      <div className="flex flex-row h-full">
        <div className="flex flex-col w-4/5 p-5">
          <Routes>
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/" element={<Products />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
