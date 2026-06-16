import { Route, Routes } from 'react-router';
import NavBar from './components/NavBar';
import ChatBot from './components/chat/ChatBot';
import Products from './components/Products';

function App() {
  return (
    <div className="p-4 h-screen w-full">
      <div className="flex flex-row h-full">
        <NavBar />
        <div className="flex flex-col w-4/5 border-l p-5">
          <Routes>
            <Route path="/chat" element={<ChatBot />} />
            <Route path="/products/:id" element={<Products />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
