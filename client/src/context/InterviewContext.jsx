import { createContext, useState } from "react";

export const InterviewContext = createContext()

export const InterviewProvider = ({children}) => {
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [reports, setReports] = useState([])
  const [totalReports, setTotalReports] = useState(0)

  return(
    <InterviewContext.Provider value={{loading, setLoading, pdfLoading, setPdfLoading, report, setReport, reports, setReports, totalReports, setTotalReports}}>
      {children}
    </InterviewContext.Provider>
  )
}

