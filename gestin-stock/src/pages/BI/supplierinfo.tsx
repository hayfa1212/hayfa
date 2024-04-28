import React, { useState, useEffect } from 'react';
import supabase from '../../utils/api';
import supp from '../../Assets/suppNumber.png'
import categ from '../../Assets/Categories.png'
import './suppinfo.css'

const SupplierStats: React.FC = () => {
  const [totalSuppliers, setTotalSuppliers] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  useEffect(() => {
    const fetchSupplierStats = async () => {
      // Récupérer tous les fournisseurs
      const { data: suppliers, error: supplierError } = await supabase
        .from('supplier')
        .select('name');

      if (supplierError) {
        console.error('Erreur lors de la récupération des fournisseurs:', supplierError.message);
        return;
      }

      if (suppliers) {
        // Utiliser un ensemble pour stocker les identifiants uniques des fournisseurs
        const uniqueSupplierIds = new Set<string>();
        suppliers.forEach((supplier: any) => uniqueSupplierIds.add(supplier.name));
        setTotalSuppliers(uniqueSupplierIds.size);
      }

      // Récupérer le nombre total de produits
      const { data: products, error: productError } = await supabase
        .from('product')
        .select('id');

      if (productError) {
        console.error('Erreur lors de la récupération des produits:', productError.message);
        return;
      }

      if (products) {
        setTotalProducts(products.length);
      }
    };

    fetchSupplierStats();
  }, []);

  return (
    <div className='font'>
      <p id="inve">Product Summary</p>
      <div className='supp-info'>
      <div className='calcule'>
      <img  src={supp}/>
      <p className='vale'>{totalSuppliers}</p>
      <p  className='num'>Number of Supplier</p>
      </div>
      <p className="bar"></p>
      <div>
      <img src={categ} className='cate'/>
      <p className='vale'> {totalProducts}</p>
      <p className='num'style={{fontSize:'0.8rem'}}> Number of Categorie</p>
      </div>
      </div>
    </div>
  );
};

export default SupplierStats;
