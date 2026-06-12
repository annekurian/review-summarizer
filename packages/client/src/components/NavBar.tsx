import { NavLink } from 'react-router';

const NavBar = () => {
  return (
    <div className="flex flex-col w-1/5 mt-5 pt-5 gap-3">
      <h1 className="font-bold text-2xl"> Mini AI apps</h1>
      <ul className="text-gray-500">
        <li>
          <NavLink
            to="/chat"
            className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
          >
            Wonderworld Bot Guide
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
          >
            Product Reviews
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
