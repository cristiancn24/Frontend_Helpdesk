"use client"

import Sidebar from "./sidebar"
import Header from "./header"

export default function MainLayout({ children, title, showSidebar = true }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {showSidebar && <Sidebar />}
      <div className="flex-1 overflow-auto">
        <Header title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
