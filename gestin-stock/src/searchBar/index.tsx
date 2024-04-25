// SearchInput.tsx
import React, { useState } from "react";
import notif from '../Assets/notification.png'
import './search.css'
import search from "../Assets/recherche.png"
import ThresholdComponent from "../pages/notif";

interface SearchInputProps {
    onSearch: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
    const [showThreshold, setShowThreshold] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };

    const handleIconClick = () => {
        setShowThreshold(!showThreshold);
    };

    return (
        <div className="searchBar">
            <input 
                type="search"
                className="search"
                placeholder="Search product, supplier, order "
                onChange={handleChange}
            />
            {showThreshold && <ThresholdComponent />}
            <img src={notif} className="notif" onClick={handleIconClick} /> 
        </div>
    );
}

export default SearchInput;
