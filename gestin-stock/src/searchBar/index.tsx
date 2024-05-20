// SearchInput.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import notif from '../Assets/notification.png';
 // Placeholder image for user
import './search.css';
import search from "../Assets/recherche.png";
import ThresholdComponent from "../pages/notif";
import supabase from "../utils/api";
 // Assuming you have a Supabase client instance

interface SearchInputProps {
    onSearch: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
    const [showThreshold, setShowThreshold] = useState(false);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const role= async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user){
        const { data: userData, error: userError } = await supabase
        .from("utilisateur")
        .select("role")
        .eq("email", user.email)
        .single();
    
    if (userError) {
        console.error("Error fetching user data:", userError);
        toast.error("An error occurred while fetching user data");
    } else {
        const role = userData?.role;
        if (!role) {
            console.error("User role not found");
            toast.error("User role not found");
        } else {
            setUserRole(role);
        }}
    }
    };
    role();
    
    useEffect(() => {
        checkLoggedIn();
    }, []); // Run only once on component mount

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };

    const handleIconClick = () => {
        if (userRole !== "responsable stock") {
        setShowThreshold(!showThreshold);
    }
    };

    const checkLoggedIn = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: userData, error: userError } = await supabase
                .from("utilisateur")
                .select("image") // Assuming the column name is "image"
                .eq("email", user.email)
                .single();
            if (userData && userData.image) {
                setUserImage(userData.image);
            } 
        } else {
            toast.error('You should login');
        }
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
          <div className="utili">
              {userImage && <img src={userImage} alt="User" className="userim" />}
            <img src={notif} className="notif" onClick={handleIconClick} /> 
          
            </div> 
        </div>
    );
}

export default SearchInput;
