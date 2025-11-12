import React, { useState, useRef, useEffect  } from 'react';

import { Badge } from 'antd';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './dropdown.css'
const DropdownComponent = ({options}) => {
  const dropdownRef = useRef(null);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedRules, setSelectedRules] = useState([]);

  const updateRulesStatus = (status) => {
    
    // Handle updating rules status here
    console.log(`Updated status to: ${status}`);
    setDropdownVisible(!dropdownVisible);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false); // Close dropdown if click is outside
      }
    };

    // Add event listener to detect clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when component is unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-dropdown-container">
   
      <Badge count={selectedRules.length} color="#fe9900">
        <div className="dropdownContent__schedule"  ref={dropdownRef}>
          <p
            onClick={toggleDropdown}
            id="dropdownMenuButton1"
            aria-expanded={dropdownVisible}
          >
            Bulk Operation
            <KeyboardArrowDownIcon
              className={`down-arrow-right ${dropdownVisible ? 'd-none' : ''}`}
            />
            {/* ArrowUp Icon - visible when dropdown is open */}
            <KeyboardArrowUpIcon
              className={`up-arrow-right ${dropdownVisible ? '' : 'd-none'}`}
            />
          </p>
          <ul
            className={`dropdown-menu__schedule dropdown-menu shadow rounded ${dropdownVisible ? 'show' : ''}`}
            aria-labelledby="dropdownMenuButton1"
            style={{ minWidth: '130px' }}
          >
            <li onClick={() => updateRulesStatus("Enabled")}>Resync</li>
            
          </ul>
        </div>
      </Badge>
    </div>
  );
};

export default DropdownComponent;