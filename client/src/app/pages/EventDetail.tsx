import { useParams, Link, useNavigate } from "react-router";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Select } from "../components/Select";
import { Zap } from "lucide-react";
import { useApp } from "../../context/AppContext";

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, registrations, cars, users, currentUser, registerForEvent, cancelRegistration } = useApp();
  const [selectedCarId, setSelectedCarId] = useState("");
  const [message, setMessage] = useState("");

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
  const isFull = eventRegs.length >= event.maxParticipants;
  const userReg = currentUser
    ? registrations.find(r => r.eventId === event.id && r.pilotId === currentUser.id)
    : null;
  const myCars = currentUser ? cars.filter(c => c.ownerId === currentUser.id) : [];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const handleRegister = () => {
    if (!currentUser) { navigate("/login"); return; }
    if (!selectedCarId) { setMessage("Please select a car."); return; }
    const ok = registerForEvent(event.id, Number(selectedCarId));
    if (ok) setMessage("Successfully registered!");
    else setMessage("You are already registered for this event.");
  };

  const handleCancel = () => {
    cancelRegistration(event.id);
    setMessage("Registration cancelled.");
  };

  return (
    <div>
      <Navbar />
      <div className="px-8 py-8 max-w-[1400px] mx-auto">
        {/* Event Header */}
        <div className="mb-8">
          <h1 className="text-white mb-4" style={{ fontSize: "32px", fontWeight: 700 }}>
            {event.title}
          </h1>
          <div className="flex gap-4 items-center text-[#888888]">
            <span>{event.circuit}</span>
            <span>•</span>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex gap-3 mt-4">
            <Badge variant="grey">{event.groupLevel}</Badge>
            <Badge>€{event.price}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-[65%_35%] gap-8">
          {/* Left Column */}
          <div>
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-white mb-4" style={{ fontSize: "18px", fontWeight: 600 }}>
                About this event
              </h3>
              <p className="text-[#888888] leading-relaxed">{event.description}</p>
            </div>

            {/* Participants */}
            <div className="mb-8">
              <h3 className="text-white mb-4" style={{ fontSize: "18px", fontWeight: 600 }}>
                Registered Participants ({eventRegs.length}/{event.maxParticipants})
              </h3>
              {eventRegs.length === 0 ? (
                <p className="text-[#888888]">No participants yet.</p>
              ) : (
                <div className="space-y-3">
                  {eventRegs.map((reg) => {
                    const pilot = users.find(u => u.id === reg.pilotId);
                    const car = cars.find(c => c.id === reg.carId);
                    const initials = pilot?.name.split(" ").map(n => n[0]).join("") || "?";
                    return (
                      <div
                        key={reg.id}
                        className="flex items-center gap-4 bg-[#1A1A24] rounded-xl p-4 border border-[#2A2A35]"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#E8003D] flex items-center justify-center text-white" style={{ fontWeight: 600 }}>
                          {initials}
                        </div>
                        <div>
                          <div className="text-white" style={{ fontWeight: 500 }}>
                            {pilot?.name || "Unknown"}
                          </div>
                          <div className="text-[#888888]" style={{ fontSize: "14px" }}>
                            {car ? `${car.make} ${car.model}` : "No car"}
                          </div>
                        </div>
                        <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                          reg.status === "Approved"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-amber-500/15 text-amber-400"
                        }`}>
                          {reg.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tech Advantage */}
            {userReg && (
              <div className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35]">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-6 h-6 text-[#E8003D]" />
                  <h3 className="text-white" style={{ fontSize: "18px", fontWeight: 600 }}>
                    Tech Advantage
                  </h3>
                </div>
                <p className="text-[#888888] mb-4">
                  Compare your specs against other pilots on this event
                </p>
                <Link to={`/tech-advantage/${event.id}`}>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Tech Advantage
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="sticky top-8 h-fit">
            <div className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35]">
              <div className="mb-6">
                <div className="text-[#888888] mb-2" style={{ fontSize: "14px" }}>
                  Available Slots
                </div>
                <div className="text-white" style={{ fontSize: "24px", fontWeight: 700 }}>
                  {event.maxParticipants - eventRegs.length}/{event.maxParticipants}
                </div>
              </div>

              {message && (
                <p className={`text-sm mb-4 ${message.includes("Success") ? "text-green-400" : "text-[#E8003D]"}`}>
                  {message}
                </p>
              )}

              {!userReg ? (
                <>
                  {currentUser?.role === "pilot" && (
                    <Select
                      label="Select Your Car"
                      value={selectedCarId}
                      onChange={(e) => setSelectedCarId(e.target.value)}
                      options={[
                        { value: "", label: "Choose a car..." },
                        ...myCars.map(c => ({ value: String(c.id), label: `${c.make} ${c.model}` })),
                      ]}
                      className="mb-6"
                    />
                  )}
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleRegister}
                  >
                    {isFull ? "Join Waitlist" : "Register for Event"}
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleCancel}
                >
                  Cancel Registration
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}