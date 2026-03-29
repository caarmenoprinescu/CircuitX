import { Navbar } from "../components/Navbar";
import { Badge } from "../components/Badge";
import { Link } from "react-router";
import { Car } from "lucide-react";
import { useApp } from "../../context/AppContext";

export function MyProfile() {
  const { currentUser, registrations, cars, events } = useApp();
  if (!currentUser) return null;

  const myRegs = registrations.filter(r => r.pilotId === currentUser.id);
  const myCars = cars.filter(c => c.ownerId === currentUser.id);

  const initials = currentUser.name.split(" ").map(n => n[0]).join("");

  const statusVariants: Record<string, "green" | "grey"> = {
    Approved: "green",
    Waitlist: "grey",
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      <Navbar />
      <div className="px-8 py-8 max-w-[1000px] mx-auto">
        {/* Profile Header */}
        <div className="bg-[#1A1A24] rounded-xl p-8 border border-[#2A2A35] mb-8">
          <div className="flex items-center gap-6">
            <div
              className="w-20 h-20 rounded-full bg-[#E8003D] flex items-center justify-center text-white"
              style={{ fontSize: "28px", fontWeight: 700 }}
            >
              {initials}
            </div>
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "28px", fontWeight: 700 }}>
                {currentUser.name}
              </h1>
              <p className="text-[#888888] mb-2">{currentUser.email}</p>
              <Badge variant="red">
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* My Registrations — only for pilots */}
        {currentUser.role === "pilot" && (
          <div className="mb-8">
            <h2 className="text-white mb-4" style={{ fontSize: "24px", fontWeight: 700 }}>
              My Registrations
            </h2>
            <div className="bg-[#1A1A24] rounded-xl overflow-hidden border border-[#2A2A35]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A2A35]">
                    {["Event Name", "Date", "Car Used", "Status"].map(h => (
                      <th key={h} className="text-left p-4 text-[#888888]" style={{ fontWeight: 500 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myRegs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-[#888888]">
                        No registrations yet.
                      </td>
                    </tr>
                  ) : (
                    myRegs.map((reg) => {
                      const event = events.find(e => e.id === reg.eventId);
                      const car = cars.find(c => c.id === reg.carId);
                      return (
                        <tr key={reg.id} className="border-b border-[#2A2A35] h-14 last:border-0">
                          <td className="p-4 text-white" style={{ fontWeight: 500 }}>
                            {event?.title || "Unknown Event"}
                          </td>
                          <td className="p-4 text-[#888888]">
                            {event ? formatDate(event.date) : "-"}
                          </td>
                          <td className="p-4 text-[#888888]">
                            {car ? `${car.make} ${car.model}` : "-"}
                          </td>
                          <td className="p-4">
                            <Badge variant={statusVariants[reg.status]}>
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
          </div>
        )}

        {/* My Garage — only for pilots */}
        {currentUser.role === "pilot" && (
          <div>
            <h2 className="text-white mb-4" style={{ fontSize: "24px", fontWeight: 700 }}>
              My Garage
            </h2>
            <div className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#E8003D]/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-[#E8003D]" />
                </div>
                <div>
                  <div className="text-white mb-1" style={{ fontSize: "18px", fontWeight: 600 }}>
                    {myCars.length} {myCars.length === 1 ? "Car" : "Cars"}
                  </div>
                  <p className="text-[#888888]">Manage your car collection</p>
                </div>
              </div>
              <Link
                to="/garage"
                className="text-[#E8003D] hover:underline"
                style={{ fontSize: "16px", fontWeight: 500 }}
              >
                Go to Garage →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}