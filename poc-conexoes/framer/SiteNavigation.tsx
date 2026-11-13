import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
interface NavItem { label:string; href:string; group:string; cta?:boolean }
interface Props { items?:NavItem[]; textColor?:string; compact?:boolean; solutionsLabel?:string; casesLabel?:string; style?:React.CSSProperties }
const defaults:NavItem[]=[
 {label:"NeuralStudio",href:"/neuralstudio",group:"solucoes"},{label:"SofIA",href:"/sofia",group:"solucoes"},{label:"PrioScan",href:"/prioscan",group:"solucoes"},
 {label:"ANS/SofIA",href:"/cases/ans",group:"cases"},{label:"TCU - AssertIA/ Tecnologia SofIA",href:"/assertia",group:"cases"},{label:"HCPA/PrioScan",href:"/prioscan",group:"cases"},
 {label:"Tecnologia e P&D",href:"/#tecnologia",group:"main"},{label:"Sobre",href:"/#sobre",group:"main"},{label:"Conteúdos",href:"/blog",group:"main"},{label:"Trabalhe conosco",href:"/trabalhe-conosco",group:"main"},{label:"Contato",href:"/contato?origem=menu#formulario",group:"main",cta:true}
]
/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function SiteNavigation({items=defaults,textColor="#290241",compact=false,solutionsLabel="Soluções",casesLabel="Cases",style}:Props) {
 const [mobileOpen,setMobileOpen]=React.useState(false)
 const [open,setOpen]=React.useState("")
 const root=React.useRef<HTMLElement>(null)
 const trigger=React.useRef<HTMLButtonElement>(null)
 const dropdowns=React.useRef<Record<string,HTMLButtonElement|null>>({})
 const uid=React.useId()
 const close=()=>{setOpen("");setMobileOpen(false)}
 React.useEffect(()=>{
  const outside=(event:PointerEvent)=>{if(root.current&&!root.current.contains(event.target as Node)){setOpen("");setMobileOpen(false)}}
  document.addEventListener("pointerdown",outside)
  return ()=>document.removeEventListener("pointerdown",outside)
 },[])
 React.useEffect(()=>{setOpen("");setMobileOpen(false)},[compact])
 const base:React.CSSProperties={fontFamily:"Outfit, Arial, sans-serif",fontSize:13,lineHeight:1.65,fontWeight:400,color:textColor}
 const plain:React.CSSProperties={...base,border:0,background:"transparent",padding:compact?"12px": "10px 0",cursor:"pointer",textDecoration:"none",whiteSpace:"nowrap"}
 const panel:React.CSSProperties={display:"flex",flexDirection:"column",gap:4,padding:12,background:"#fffffc",color:"#290241",border:"1px solid #ded7e2",borderRadius:8,boxShadow:"0 14px 35px #29024112",zIndex:45}
 const anchor=(item:NavItem,inside=false)=><a key={item.group+item.label} href={item.href} onClick={close} style={item.cta?{...plain,padding:"12px 20px",background:"#290241",color:"#fffffc",textAlign:"center",display:"block"}:{...plain,color:inside||compact?"#290241":textColor,padding:inside||compact?"12px":"10px 0",display:"block",whiteSpace:compact?"normal":"nowrap"}}>{item.label}</a>
 const dropdown=(key:string,title:string)=>{
  const children=items.filter(item=>item.group===key)
  return <div key={key} style={{position:"relative",minWidth:0}}><button ref={element=>{dropdowns.current[key]=element}} type="button" aria-expanded={open===key} aria-controls={uid+key} onClick={()=>setOpen(open===key?"":key)} style={{...plain,width:compact?"100%":"auto",color:compact?"#290241":textColor,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>{title}<span aria-hidden="true" style={{fontSize:12}}>{open===key?"⌃":"⌄"}</span></button>{open===key&&<div id={uid+key} style={compact?{...panel,position:"relative",boxShadow:"none",border:0,borderLeft:"1px solid #ded7e2",borderRadius:0,padding:"0 8px",margin:"0 12px 12px"}:{...panel,position:"absolute",top:"100%",left:-18,minWidth:200}}>{children.map(item=>anchor(item,true))}</div>}</div>
 }
 const links=<>{dropdown("solucoes",solutionsLabel)}{dropdown("cases",casesLabel)}{items.filter(item=>item.group==="main").map(item=>anchor(item))}</>
 return <nav ref={root} aria-label="Principal" onKeyDown={event=>{if(event.key==="Escape"){event.preventDefault();if(open){dropdowns.current[open]?.focus();setOpen("")}else{setMobileOpen(false);trigger.current?.focus()}}}} style={{...base,position:"relative",display:"flex",alignItems:"center",gap:22,overflow:"visible",...style}}>
  {compact?<><button ref={trigger} type="button" aria-expanded={mobileOpen} aria-controls={uid+"menu"} onClick={()=>{setMobileOpen(!mobileOpen);setOpen("")}} style={{...plain,border:"1px solid currentColor",padding:"9px 14px",fontSize:12}}>{mobileOpen?"Fechar":"Menu"}</button>{mobileOpen&&<div id={uid+"menu"} style={{...panel,position:"absolute",right:0,top:"calc(100% + 12px)",width:"min(320px, calc(100vw - 48px))",boxSizing:"border-box",gap:4,padding:16}}>{links}</div>}</>:links}
 </nav>
}
addPropertyControls(SiteNavigation,{textColor:{type:ControlType.Color,title:"Texto",defaultValue:"#290241"},compact:{type:ControlType.Boolean,title:"Compacto",defaultValue:false},solutionsLabel:{type:ControlType.String,title:"Soluções",defaultValue:"Soluções"},casesLabel:{type:ControlType.String,title:"Cases",defaultValue:"Cases"},items:{type:ControlType.Array,title:"Links",defaultValue:defaults,control:{type:ControlType.Object,controls:{label:{type:ControlType.String,title:"Texto"},href:{type:ControlType.String,title:"Destino"},group:{type:ControlType.Enum,title:"Grupo",options:["solucoes","cases","main"],optionTitles:["Soluções","Cases","Principal"]},cta:{type:ControlType.Boolean,title:"Destaque",defaultValue:false}}}}})
