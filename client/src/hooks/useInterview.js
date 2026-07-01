import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, deleteInterviewReport } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../context/InterviewContext";
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, pdfLoading, setPdfLoading, report, setReport, reports, setReports, totalReports, setTotalReports } = context

    const generateReport = async ({ jobDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
            return null
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async (page = 1, limit = 6) => {
        if (page === 1) setLoading(true) // Only show main loader for initial fetch
        let response = null
        try {
            response = await getAllInterviewReports(page, limit)
            if (page === 1) {
                setReports(response.interviewReports)
            } else {
                setReports(prev => [...prev, ...response.interviewReports])
            }
            if (response.totalCount !== undefined) {
                setTotalReports(response.totalCount)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response?.interviewReports || []
    }

    const deleteReport = async (id) => {
        try {
            await deleteInterviewReport(id)
            setReports(prev => prev.filter(report => report.id !== id))
        } catch (error) {
            console.error("Failed to delete report:", error)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setPdfLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setPdfLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    return { loading, pdfLoading, report, reports, totalReports, generateReport, getReportById, getReports, getResumePdf, deleteReport }

}
