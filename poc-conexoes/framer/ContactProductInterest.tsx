import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
interface Props { label?: string; defaultProduct?: string; style?: React.CSSProperties }
/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function ContactProductInterest({label="Solução de interesse",defaultProduct="",style}:Props) {
    const [product,setProduct]=React.useState(defaultProduct)
    const [origin,setOrigin]=React.useState("Contato")
    const id=React.useId()
    React.useEffect(()=>{
        const update=()=>{
            const query=new URLSearchParams(window.location.search)
            const products:Record<string,string>={neuralstudio:"NeuralStudio",sofia:"SofIA",prioscan:"PrioScan"}
            const origins:Record<string,string>={neuralstudio:"NeuralStudio",matriculas:"NeuralStudio / Matrículas"}
            setProduct(products[query.get("produto")||""]||defaultProduct)
            setOrigin(origins[query.get("origem")||""]||"Contato")
        }
        update();window.addEventListener("popstate",update)
        return ()=>window.removeEventListener("popstate",update)
    },[defaultProduct])
    return <div style={{width:"100%",display:"flex",flexDirection:"column",gap:9,fontFamily:"Outfit, Arial, sans-serif",color:"#290241",...style}}>
        <label htmlFor={id} style={{fontSize:13,lineHeight:1.65}}>{label}</label>
        <select id={id} name="Produto" value={product} onChange={event=>setProduct(event.target.value)} style={{boxSizing:"border-box",width:"100%",minHeight:50,border:0,borderRadius:0,padding:14,background:"#f3eff5",color:"#290241",font:"inherit",fontSize:16,lineHeight:1.5}}>
            <option value="">Selecione uma solução</option><option value="NeuralStudio">NeuralStudio</option><option value="SofIA">SofIA</option><option value="PrioScan">PrioScan</option><option value="Outra">Outra</option>
        </select>
        <input type="hidden" name="Origem" value={origin} />
    </div>
}
addPropertyControls(ContactProductInterest,{label:{type:ControlType.String,title:"Rótulo",defaultValue:"Solução de interesse"},defaultProduct:{type:ControlType.Enum,title:"Padrão",options:["","NeuralStudio","SofIA","PrioScan","Outra"],optionTitles:["Sem seleção","NeuralStudio","SofIA","PrioScan","Outra"],defaultValue:""}})
