import { Loader } from "@/components/Loader/Loader"
import { Button } from "@mui/material"
import { useState } from "react"

const usePaymentMethods = ( ) => {
  const [isLoading, setLoading] = useState(false) 
  const handlePayBlik = async () => {
    const payment = await new Promise((resolve, reject) => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        resolve(null)
        // send ordered Stuff to backend
        // show Order ID
        // 
      }, 2000)
    })
  }
  return {
    handlePayBlik,
    isLoading
  }
}
export const PaymentMethods = () => {
  const {handlePayBlik, isLoading} = usePaymentMethods()
  return (
    <div className="payment-methods">
      {isLoading ? <Loader/> : 
      <Button onClick={handlePayBlik} variant="contained" size="large">
        Blik
      </Button>}
    </div>
  )
}
