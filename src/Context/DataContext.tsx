import React from 'react'
import useFetch from '../Hooks/useFetch';

type IDataContext = {
  data: IVenda[] | null;
  error: string | null;
  loading: boolean;
  inicio: string;
  setInicio: React.Dispatch<React.SetStateAction<string>>;
  final: string;
  setFinal: React.Dispatch<React.SetStateAction<string>>;

}

export type IVenda = {
  id: string;
  nome: string;
  preco: number;
  status: 'pago' | 'processando' | "falha";
  pagamento: 'boleto' | 'pix' | 'cartao';
  parcelas: number | null;
  data: string;
}

const DataContext = React.createContext<IDataContext | null>(null);


export const useData = () => {
  const context =  React.useContext(DataContext);
 
  if(context === null) throw new Error("useContext deve estar dentro do Provider");
 
  return context;
  
 }

 function getDate(n: number) {
  const date = new Date();
  date.setDate(date.getDate() - n)
  const dd = String(date.getDate()).padStart(2,'0')
  const mm = String(date.getMonth() + 1).padStart(2,'0')
  const yyyy = String(date.getFullYear())
  // console.log(yyyy)
  return `${yyyy}-${mm}-${dd}`
 }

//  console.log(getDate())

 export const DataContextProvider = ({children}: React.PropsWithChildren)=>{

  const [inicio, setInicio] = React.useState(getDate(14))
  const [final, setFinal] = React.useState(getDate(0))
  const {data, error, loading} = useFetch<Venda[]>(`https://data.origamid.dev/vendas/?inicio=${inicio}&final=${final}`)

  // console.log(data)

  return <DataContext.Provider value={{data, error, loading, inicio, setInicio, final, setFinal}}>{children}</DataContext.Provider>
}