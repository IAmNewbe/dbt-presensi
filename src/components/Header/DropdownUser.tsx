import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import UserOne from '/user-anonim.png';
import { useNavigate } from 'react-router-dom';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
           Digital Business and Technology 
          </span>
          <span className="block text-xs">View Report</span>
        </span>

        <span className="h-12 w-12 rounded-full border-2 border-gray-300">
          <img src={UserOne} alt="User" className="rounded-full" />
        </span>


        
      </Link>

      
    </ClickOutside>
  );
};

export default DropdownUser;
