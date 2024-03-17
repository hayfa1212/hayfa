import './sigincommun.css'

export default function Msglink({msg,destination,direction}:{
    msg:string
    destination:string
    direction:string
}){
    return(
        <div className='link'>
        
        <p>{msg}</p>
<a href={direction} className='destination'>{destination}</a>
        </div>
    )
}