export type DashboardRole = 'admin' | 'student'

export interface DashboardMetrics {
  role: DashboardRole
  metrics: {
    documentsPending?: number
    documentsUploaded?: number
    appointmentsUpcoming?: number
    requestsActive?: number
    academicAverage?: number | null
    requestsPending?: number
    requestsInReview?: number
    requirementsPending?: number
    scholarshipsActive?: number
    disbursementsPending?: number
  }
}

export interface DashboardActivityItem {
  type: 'document' | 'validation' | 'request' | string
  title: string
  description: string
  occurred_at: string
}
