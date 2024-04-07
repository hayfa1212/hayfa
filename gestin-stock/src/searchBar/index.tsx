import React from "react";
import notif from '../Assets/notification.png'
import './search.css'
import search from "../Assets/recherche.png"

interface SearchInputProps {
    onSearch: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };

    return (
        <div   className="searchBar">
            <input 
                type="search"
             className="search"
                placeholder="Search product, supplier, order "
                onChange={handleChange}
            />
                
           
            <img src={notif} className="notif"/>
        </div>
    );
}

export default SearchInput;
