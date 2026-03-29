import { useState } from "react";
import { useParams, Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Badge } from "../components/Badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { List, BarChart3, ArrowLeft, Users, Calendar, Gauge } from "lucide-react";
import { useApp } from "../../context/AppContext";

const ITEMS_PER_PAGE = 6;
const GROUP_COLORS = ["#666666", "#888888", "#E8003D"];
const STATUS_COLORS = ["#10B981", "#F59E0B"];

export function EventStatistics() {
  const { id } = useParams();
  const { events, registrations, cars, users, getGroupLevel } = useApp();
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [page, setPage] = useState(1);

  const event = events.find(e => e.id === Number(id));
  if (!event) return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[#888888]">Event not found.</p>
      </div>
    </div>
  );

  const eventRegs = registrations.filter(r => r.eventId === event.id);
  const totalPages = Math.max(1, Math.ceil(eventRegs.length / ITEMS_PER_PAGE));
  const paginated = eventRegs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalRegistered = eventRegs.length;
  const approvedCount = eventRegs.filter(r => r.status === "Approved").length;
  const waitlistCount = eventRegs.filter(r => r.status === "Waitlist").length;
  const slotsRemaining = event.maxParticipants - approvedCount;

  const hpValues = eventRegs.map(r => {
    const car = cars.find(c => c.id === r.carId);
    return car?.horsepower || 0;
  }).filter(hp => hp > 0);
  const avgHP = hpValues.length > 0
    ? Math.round(hpValues.reduce((a, b) => a + b, 0) / hpValues.length)
    : 0;

  // Registrations per day
  const dateCountMap: Record<string, number> = {};
  eventRegs.forEach(r => {
    dateCountMap[r.registeredAt] = (dateCountMap[r.registeredAt] || 0) + 1;
  });
  const registrationsPerDay = Object.entries(dateCountMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      count,
    }));

  // Group level split
  const groupLevelData = ["Novice", "Intermediate", "Pro"].map(level => ({
    name: level,
    value: eventRegs.filter(r => {
      const car = cars.find(c => c.id === r.carId);
      return car ? getGroupLevel(car.horsepower, car.tireType) === level : false;
    }).length,
  })).filter(d => d.value > 0);

  const statusData = [
    { name: "Approved", value: approvedCount },
    { name: "Waitlist", value: waitlistCount },
  ].filter(d => d.value > 0);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      <Navbar />
      <div className="px-8 py-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <Link
              to="/organizer/dashboard"
              className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-white mb-2" style={{ fontSize: "32px", fontWeight: 700 }}>
              {event.title}
            </h1>
            <p className="text-[#888888]">Event Statistics</p>
          </div>

          {/* Toggle */}
          <div className="bg-[#1A1A24] rounded-lg p-1 flex gap-1 border border-[#2A2A35]">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 h-12 rounded-lg flex items-center gap-2 transition-colors ${
                viewMode === "table" ? "bg-[#E8003D] text-white" : "text-[#888888] hover:text-white"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={`px-4 h-12 rounded-lg flex items-center gap-2 transition-colors ${
                viewMode === "chart" ? "bg-[#E8003D] text-white" : "text-[#888888] hover:text-white"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <>
            <div className="bg-[#1A1A24] rounded-xl overflow-hidden border border-[#2A2A35]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A2A35]">
                    {["Pilot Name", "Car", "Group Level", "HP", "Registration Date", "Status"].map(h => (
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
                        No participants yet.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((reg) => {
                      const pilot = users.find(u => u.id === reg.pilotId);
                      const car = cars.find(c => c.id === reg.carId);
                      const gl = car ? getGroupLevel(car.horsepower, car.tireType) : "-";
                      return (
                        <tr key={reg.id} className="border-b border-[#2A2A35] last:border-0" style={{ height: "56px" }}>
                          <td className="p-4 text-white" style={{ fontWeight: 500 }}>
                            {pilot?.name || "Unknown"}
                          </td>
                          <td className="p-4 text-[#888888]">
                            {car ? `${car.make} ${car.model}` : "-"}
                          </td>
                          <td className="p-4 text-[#888888]">{gl}</td>
                          <td className="p-4 text-white">{car?.horsepower || "-"} HP</td>
                          <td className="p-4 text-[#888888]">{formatDate(reg.registeredAt)}</td>
                          <td className="p-4">
                            <Badge variant={reg.status === "Approved" ? "green" : "grey"}>
                              {reg.status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg ${
                      page === p ? "bg-[#E8003D] text-white" : "bg-[#1A1A24] text-white hover:bg-[#2A2A35] border border-[#2A2A35]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Chart View */}
        {viewMode === "chart" && (
          <>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { label: "Total Registered", value: totalRegistered, icon: Users },
                { label: "Slots Remaining", value: slotsRemaining, icon: Calendar },
                { label: "Avg Car HP", value: avgHP, icon: Gauge },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35]">
                  <div className="w-12 h-12 rounded-lg bg-[#E8003D]/10 flex items-center justify-center mb-4">
                    <stat.icon className="w-6 h-6 text-[#E8003D]" />
                  </div>
                  <div className="text-white mb-1" style={{ fontSize: "32px", fontWeight: 700 }}>
                    {stat.value}
                  </div>
                  <div className="text-[#888888]" style={{ fontSize: "14px" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-10 gap-6">
              {/* Bar Chart */}
              <div className="col-span-6 bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35]">
                <h3 className="text-white mb-6" style={{ fontSize: "18px", fontWeight: 600 }}>
                  Registrations per Day
                </h3>
                {registrationsPerDay.length === 0 ? (
                  <p className="text-[#888888] text-center py-10">No registration data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={registrationsPerDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" />
                      <XAxis dataKey="date" stroke="#888888" tick={{ fill: "#888888", fontSize: 12 }} />
                      <YAxis stroke="#888888" tick={{ fill: "#888888", fontSize: 12 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid #2A2A35", borderRadius: "8px", color: "#fff" }}
                        cursor={{ fill: "#2A2A35" }}
                      />
                      <Bar dataKey="count" fill="#E8003D" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Pie + Donut */}
              <div className="col-span-4 flex flex-col gap-6">
                <div className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35]">
                  <h3 className="text-white mb-4" style={{ fontSize: "18px", fontWeight: 600 }}>
                    Group Level Split
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={groupLevelData}
                        cx="50%" cy="50%"
                        outerRadius={75}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => percent ? `${name} ${(percent * 100).toFixed(0)}%` : ""}
                       >
                        {groupLevelData.map((_, i) => (
                          <Cell key={i} fill={GROUP_COLORS[i % GROUP_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid #2A2A35", borderRadius: "8px", color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35]">
                  <h3 className="text-white mb-4" style={{ fontSize: "18px", fontWeight: 600 }}>
                    Registration Status
                  </h3>
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%" cy="50%"
                          outerRadius={75}
                          innerRadius={45}
                          dataKey="value"
                          labelLine={false}
                         label={({ name, percent }) => percent ? `${name} ${(percent * 100).toFixed(0)}%` : ""}
                         >
                          {statusData.map((_, i) => (
                            <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid #2A2A35", borderRadius: "8px", color: "#fff" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-white" style={{ fontSize: "24px", fontWeight: 700 }}>{totalRegistered}</div>
                        <div className="text-[#888888]" style={{ fontSize: "12px" }}>Total</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}