import React from 'react'


 function  useFetch<T>(url:RequestInfo | URL, options?: RequestInit) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);


  const optionsRef = React.useRef(options)
  optionsRef.current = options

  React.useEffect(() => {

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setData(null);
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          ...optionsRef.current
        })

        if(!response.ok) throw new Error(`Error: ${response.status}`)

        const json = (await response.json()) as T;

        if(!controller.signal.aborted) setData(json);

      } catch (error) {
        if(!controller.signal.aborted && error instanceof Error)  setError(error.message)
       
      } finally{
      if(!controller.signal.aborted)  setLoading(false);
      }
    }

    fetchData();

    return ()=>{
      controller.abort();
    }
   
  }, [url])
  


  return {data, loading, error}
}

export default useFetch
