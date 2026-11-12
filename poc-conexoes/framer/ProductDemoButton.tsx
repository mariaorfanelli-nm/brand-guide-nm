import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
interface Props { label?:string; product?:string; origin?:string; style?:React.CSSProperties }
/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function ProductDemoButton({label="Solicite uma demonstração",product="neuralstudio",origin="neuralstudio",style}:Props) {
    const [hover,setHover]=React.useState(false)
    const knownProduct=["neuralstudio","sofia","prioscan"].includes(product)?product:"neuralstudio"
    const knownOrigin=["neuralstudio","matriculas","prioscan"].includes(origin)?origin:"neuralstudio"
    return <a href={"/contato?produto="+knownProduct+"&origem="+knownOrigin+"#formulario"} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{boxSizing:"border-box",display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"14px 22px",background:hover?"#4c1c6b":"#290241",color:"#fffffc",fontFamily:"Outfit, Arial, sans-serif",fontSize:13,fontWeight:500,lineHeight:1.65,textDecoration:"none",cursor:"pointer",...style}}>{label}</a>
}
addPropertyControls(ProductDemoButton,{label:{type:ControlType.String,title:"Texto",defaultValue:"Solicite uma demonstração"},product:{type:ControlType.Enum,title:"Produto",options:["neuralstudio","sofia","prioscan"],optionTitles:["NeuralStudio","SofIA","PrioScan"],defaultValue:"neuralstudio"},origin:{type:ControlType.Enum,title:"Origem",options:["neuralstudio","matriculas","prioscan"],optionTitles:["NeuralStudio","Matrículas","PrioScan"],defaultValue:"neuralstudio"}})
