import './sideBar.css'
import box from '../Assets/box.png'
import { NavLink, Outlet } from 'react-router-dom'
export default function Sidebar (){
  return(
<div  className='sideBar'>

  <div>
  <img src={box} alt="logo" className='box' />
   
    <NavLink to='/dashbord'> <p>Dashbord</p></NavLink>
    <a href='/inventory'> <p>Inventory</p></a>
    <a href='/Report'> <p>Reports</p></a>
    <a href='/supplier' > <p>Suppliers</p></a>
    <a href='/order'> <p>Oreders</p></a>
    <a href='/mangeStore'> <p>Mange Store</p></a>
    </div>

    <div>
    <a href='setting'> <p>Setting</p></a>
    <a href='lougOut'> <p>Loug Out</p></a>
    </div>
   <Sidebar/>
    </div>
  
    )
}