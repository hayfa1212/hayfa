import './sigincommun.css'

export default function Msglink({msg,destination,direction}:{
    msg:string
    destination:string
    direction:string
}){
    return(
        <div id='link'>
        
        <p id='msg'>{msg}</p>
<a href={direction} className='destination'>{destination}</a>
        </div>
    )
}