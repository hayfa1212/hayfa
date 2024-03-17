import { NavLink } from "react-router-dom";
import {Code} from "../../Components/siginCommun/codeInput";
import Logo from "../../Components/siginCommun/logoSigin";


import Title from "../../Components/siginCommun/title";
import './verification.css'




export default function Verifier(){
    const verifeCode=[
        { id:1},  {id:2},{id:3}, {  id:4}
    ]

   

    return(
        <div className="verifieForm">

            <Logo/>

            <form className="verified">

       <Title  title={'Verification'}
      subTitle={'Enter your 4 digits code that you received on your email.'}/>

  <div className="content">
      <p className="codeTitle">code</p>

      <div className='map'>
        {
        verifeCode.length > 0 &&  verifeCode.map((folder) => (
         <Code/>
        ))}
      </div>
     
      <div className='log'>
       <p className='existmsg'>If you didn’t receive a code!</p>
        <NavLink to={'/verifieAccount'}><button className='logi'> Resend</button> </NavLink>
      </div>
      <button className='start' type="submit">continue</button>
      </div>

      
      </form>
      
      </div>
    
    )
}



