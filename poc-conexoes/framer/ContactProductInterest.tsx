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
            const products:Record<string,string>={neuralstudio:"NeuralStudio",sofia:"SofIA",prioscan:"PrioScan","parcerias-pd":"Parcerias/P&D",outro:"Outro"}
            const origins:Record<string,string>={"menu": "Menu principal", "rodape": "Rodapé", "home-hero": "Home / abertura", "home-final": "Home / chamada final", "sofia": "SofIA", "sofia-hero": "SofIA / abertura", "sofia-final": "SofIA / chamada final", "neuralstudio": "NeuralStudio", "neuralstudio-hero": "NeuralStudio / abertura", "neuralstudio-final": "NeuralStudio / chamada final", "matriculas": "NeuralStudio / Matrículas", "matriculas-hero": "Matrículas / abertura", "matriculas-final": "Matrículas / chamada final", "prioscan": "PrioScan", "prioscan-hero": "PrioScan / abertura", "prioscan-final": "PrioScan / chamada final", "case-ans": "Case / ANS", "case-tcu": "Case / TCU", "case-hcpa": "Case / HCPA", "conteudos": "Conteúdos", "guia-prioscan": "Guia / avaliação de IA em radiologia", "teste-formulario": "Teste técnico do formulário"}
            const productKey=query.get("produto")||""
            setProduct(Object.prototype.hasOwnProperty.call(products,productKey)?products[productKey]:defaultProduct)
            const originKey=query.get("origem")||""
            setOrigin(Object.prototype.hasOwnProperty.call(origins,originKey)?origins[originKey]:"Contato")
        }
        update();window.addEventListener("popstate",update)
        return ()=>window.removeEventListener("popstate",update)
    },[defaultProduct])
    return <div style={{width:"100%",display:"flex",flexDirection:"column",gap:9,fontFamily:"Outfit, Arial, sans-serif",color:"#290241",...style}}>
        <label htmlFor={id} style={{fontSize:13,lineHeight:1.65}}>{label}</label>
        <select id={id} name="Produto" value={product} onChange={event=>setProduct(event.target.value)} style={{boxSizing:"border-box",width:"100%",minHeight:50,border:0,borderRadius:0,padding:14,background:"#f3eff5",color:"#290241",font:"inherit",fontSize:16,lineHeight:1.5}}>
            <option value="">Selecione uma solução</option><option value="NeuralStudio">NeuralStudio</option><option value="SofIA">SofIA</option><option value="PrioScan">PrioScan</option><option value="Parcerias/P&D">Parcerias/P&D</option><option value="Outro">Outro</option>
        </select>
        <input type="hidden" name="Origem" value={origin} />
    </div>
}
addPropertyControls(ContactProductInterest,{label:{type:ControlType.String,title:"Rótulo",defaultValue:"Solução de interesse"},defaultProduct:{type:ControlType.Enum,title:"Padrão",options:["","NeuralStudio","SofIA","PrioScan","Parcerias/P&D","Outro"],optionTitles:["Sem seleção","NeuralStudio","SofIA","PrioScan","Parcerias/P&D","Outro"],defaultValue:""}})
