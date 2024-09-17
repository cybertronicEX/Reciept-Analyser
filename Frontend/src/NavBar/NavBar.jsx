import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className="bg-blue-600 flex items-center justify-between px-4 py-3">
          <Link to="#" className="text-white text-2xl">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <div className="text-white text-lg font-semibold">
            {/* Add any user information or branding here */}
          </div>
        </div>

        <nav className={`fixed top-0 left-0 w-64 h-full bg-blue-800 transition-transform ${sidebar ? 'translate-x-0' : '-translate-x-full'} z-50`}>
          <ul className="flex flex-col p-4 space-y-4">
            <li className="flex justify-end">
              <Link to="#" className="text-white text-2xl" onClick={showSidebar}>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className="flex items-center space-x-4 text-white p-2 hover:bg-blue-700 rounded-md">
                  <Link to={item.path} className="flex items-center w-full">
                    {item.icon}
                    <span className="ml-4">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
