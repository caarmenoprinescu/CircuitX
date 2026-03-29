import { Link } from "react-router";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Pencil, Trash2, Calendar, Users, CheckCircle, BarChart3 } from "lucide-react";
import { useApp } from "../../context/AppContext";

const ITEMS_PER_PAGE = 5;

export function OrganizerDashboard() {
  const { events, registrations, currentUser, deleteEvent } = useApp();
  const [page, setPage] = useState(1);

  const myEvents = events.filter(e => e.organizerId === currentUser?.id);
  const totalPages = Math.max(1, Math.ceil(myEvents.length / ITEMS_PER_PAGE));
  const paginated = myEvents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalRegs = registrations.filter(r =>
    myEvents.some(e => e.id === r.eventId)
  ).length;
  const activeEvents = myEvents.filter(e => e.status === "Published").length;

  const stats = [
    { label: "Total Events", value: String(myEvents.length), icon: Calendar, trend: `${myEvents.filter(e => e.status === "Published").length} published` },
    { label: "Total Registrations", value: String(totalRegs), icon: Users, trend: "across all events" },
    { label: "Active Events", value: String(activeEvents), icon: CheckCircle, trend: `${myEvents.filter(e => e.status === "Draft").length} drafts` },
  ];

  const statusVariants: Record<string, "green" | "grey" | "muted"> = {
    Published: "green",
    Draft: "grey",
    Completed: "muted",
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent(id);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="px-8 py-8 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-white mb-2" style={{ fontSize: "32px", fontWeight: 700 }}>
              My Events
            </h1>
            <p className="text-[#888888]">Manage your track day events</p>
          </div>
          <Link to="/organizer/event/new">
            <Button variant="primary">+ Host Event</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35]">
              <div className="w-12 h-12 rounded-lg bg-[#E8003D]/10 flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6 text-[#E8003D]" />
              </div>
              <div className="text-white mb-1" style={{ fontSize: "28px", fontWeight: 700 }}>
                {stat.value}
              </div>
              <div className="text-[#888888] mb-2" style={{ fontSize: "14px" }}>
                {stat.label}
              </div>
              <div className="text-[#E8003D]" style={{ fontSize: "12px", fontWeight: 500 }}>
                {stat.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#1A1A24] rounded-xl overflow-hidden border border-[#2A2A35]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A35]">
                {["Event Name", "Circuit", "Date", "Slots", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left p-4 text-[#888888]" style={{ fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#888888]">
                    No events yet. Create your first event!
                  </td>
                </tr>
              ) : (
                paginated.map((event) => {
                  const regCount = registrations.filter(r => r.eventId === event.id).length;
                  return (
                    <tr key={event.id} className="border-b border-[#2A2A35] h-14 last:border-0">
                      <td className="p-4">
                        <Link
                          to={`/organizer/event/${event.id}`}
                          className="text-white hover:text-[#E8003D] transition-colors"
                          style={{ fontWeight: 500 }}
                        >
                          {event.title}
                        </Link>
                      </td>
                      <td className="p-4 text-[#888888]">{event.circuit}</td>
                      <td className="p-4 text-[#888888]">{formatDate(event.date)}</td>
                      <td className="p-4 text-white">{regCount}/{event.maxParticipants}</td>
                      <td className="p-4">
                        <Badge variant={statusVariants[event.status]}>
                          {event.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <Link to={`/organizer/event/${event.id}/statistics`}>
                            <button className="text-[#888888] hover:text-white transition-colors" title="Statistics">
                              <BarChart3 className="w-4 h-4" />
                            </button>
                          </Link>
                          <Link to={`/organizer/event/${event.id}/edit`}>
                            <button className="text-[#888888] hover:text-white transition-colors" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-[#E8003D] hover:text-[#c00034] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded-lg ${
                  page === p ? "bg-[#E8003D] text-white" : "bg-[#1A1A24] text-white hover:bg-[#2A2A35]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}