import Sidebar from "@/components/shared/Sidebar"

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#FDF8F4]">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    )
}