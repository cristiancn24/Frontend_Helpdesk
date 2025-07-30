"use client"

import DashboardComponent from "@/components/dashboard/dashboard-component"
import withAuth from "../../hoc/withAuth"

export default withAuth(function DashboardPage() {
  return <DashboardComponent />
})
