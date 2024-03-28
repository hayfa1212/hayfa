import React, { useState } from 'react';
import supabase from '../../utils/api';

const DragImage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            // Lire le contenu du fichier sélectionné
            const fileContent = await selectedFile.arrayBuffer();

            // Insérer l'image dans la table 'product' de Supabase
            const { data, error } = await supabase.from('product').insert([
                { image: fileContent }
            ]);

            if (error) {
                console.error('Error uploading image:', error);
                return;
            }

            console.log('Image uploaded successfully:', data);

            // Convertir les données binaires en URL d'image
            const blob = new Blob([fileContent]);
            const url = URL.createObjectURL(blob);
            setImageURL(url);
        } catch (error) {
            console.error('Error processing file:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {imageURL && <img src={imageURL} alt="Uploaded" />}
        </div>
    );
};

export default DragImage;
