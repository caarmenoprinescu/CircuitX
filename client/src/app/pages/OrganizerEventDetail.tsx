import { useParams, useNavigate, Link } from "react-router";
import { Pencil, Trash2, ArrowLeft, Users, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { useApp } from "../../context/AppContext";

export function OrganizerEventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, registrations, cars, users, deleteEvent } = useApp();

  const event = events.find(e => e.id === Number(id));

if (!event) return (
  <div>
    <Navbar />
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-[#888888]">Event not found.</p>
    </div>
  </div>
);

const safeEvent = event;
const eventRegs = registrations.filter(r => r.eventId === safeEvent.id);
const approvedCount = eventRegs.filter(r => r.status === "Approved").length;

  const statusVariants: Record<string, "green" | "grey" | "muted"> = {
    Published: "green",
    Draft: "grey",
    Completed: "muted",
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent(safeEvent.id);
      navigate("/organizer/dashboard");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="px-8 py-8 max-w-[1000px] mx-auto">

        {/* Back arrow */}
        <button
          onClick={() => navigate("/organizer/dashboard")}
          className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Events</span>
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-white mb-3" style={{ fontSize: "32px", fontWeight: 700 }}>
              {safeEvent.title}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant={statusVariants[safeEvent.status]}>{safeEvent.status}</Badge>
              <Badge variant="grey">{safeEvent.groupLevel}</Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={`/organizer/event/${safeEvent.id}/edit`}>
              <Button variant="secondary" className="flex items-center gap-2">
                <Pencil className="w-4 h-4" /> Edit
              </Button>
            </Link>
            <button
              onClick={handleDelete}
              className="h-12 px-6 rounded-lg border border-[#E8003D] text-[#E8003D] hover:bg-[#E8003D] hover:text-white transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>

        {/* Info Cards Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { icon: Calendar, label: "Date", value: formatDate(safeEvent.date) },
            { icon: Users, label: "Participants", value: `${approvedCount} / ${safeEvent.maxParticipants}` },
            { icon: DollarSign, label: "Price", value: `€${safeEvent.price}` },
            { icon: BarChart3, label: "Slots Left", value: String(safeEvent.maxParticipants - approvedCount) },
          ].map(card => (
            <div key={card.label} className="bg-[#1A1A24] rounded-xl p-5 border border-[#2A2A35]">
              <div className="w-10 h-10 rounded-lg bg-[#E8003D]/10 flex items-center justify-center mb-3">
                <card.icon className="w-5 h-5 text-[#E8003D]" />
              </div>
              <div className="text-[#888888] mb-1" style={{ fontSize: "12px" }}>{card.label}</div>
              <div className="text-white" style={{ fontWeight: 600 }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35] mb-6">
          <h2 className="text-white mb-2" style={{ fontSize: "18px", fontWeight: 600 }}>Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-[#888888] mb-1" style={{ fontSize: "12px" }}>Circuit</div>
              <div className="text-white">{safeEvent.circuit}</div>
            </div>
            <div>
              <div className="text-[#888888] mb-1" style={{ fontSize: "12px" }}>Country</div>
              <div className="text-white">{safeEvent.country}</div>
            </div>
          </div>
          <div>
            <div className="text-[#888888] mb-1" style={{ fontSize: "12px" }}>Description</div>
            <div className="text-white leading-relaxed">{safeEvent.description}</div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white" style={{ fontSize: "18px", fontWeight: 600 }}>
              Registered Participants
            </h2>
            <Link
              to={`/organizer/event/${safeEvent.id}/statistics`}
              className="text-[#E8003D] hover:underline flex items-center gap-1"
              style={{ fontSize: "14px" }}
            >
              <BarChart3 className="w-4 h-4" /> View Statistics
            </Link>
          </div>

          {eventRegs.length === 0 ? (
            <p className="text-[#888888]">No participants yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A35]">
                  {["Pilot", "Car", "Registered", "Status"].map(h => (
                    <th key={h} className="text-left p-3 text-[#888888]" style={{ fontWeight: 500, fontSize: "14px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {eventRegs.map(reg => {
                  const pilot = users.find(u => u.id === reg.pilotId);
                  const car = cars.find(c => c.id === reg.carId);
                  return (
                    <tr key={reg.id} className="border-b border-[#2A2A35] last:border-0" style={{ height: "52px" }}>
                      <td className="p-3 text-white" style={{ fontWeight: 500 }}>
                        {pilot?.name || "Unknown"}
                      </td>
                      <td className="p-3 text-[#888888]">
                        {car ? `${car.make} ${car.model}` : "-"}
                      </td>
                      <td className="p-3 text-[#888888]">{formatDate(reg.registeredAt)}</td>
                      <td className="p-3">
                        <Badge variant={reg.status === "Approved" ? "green" : "grey"}>
                          {reg.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}