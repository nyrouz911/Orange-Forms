import React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

const page = () => {
  return (
<main className="min-h-[60vh] grid place-items-center px-4">
     <div className="w-full max-w-md">
<Alert variant="default" className="shadow-sm">
        <CheckCircle2 className="h-5 w-5" />
         <AlertTitle className="font-semibold">Success</AlertTitle>
         <AlertDescription>
           Your answers were saved successfully. Thank you for submitting the form!
         </AlertDescription>
       </Alert>
      </div>
    </main>
  )
}

export default page
