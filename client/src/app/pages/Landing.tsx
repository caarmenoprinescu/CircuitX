import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Flag, Gauge, Users, BarChart3 } from "lucide-react";

export function Landing() {
  const events = [
    {
      id: 1,
      name: "Monza Track Day",
      circuit: "Autodromo Nazionale di Monza",
      date: "April 15, 2026",
      price: "€250",
      groupLevel: "Intermediate",
    },
    {
      id: 2,
      name: "Silverstone Experience",
      circuit: "Silverstone Circuit",
      date: "April 22, 2026",
      price: "£320",
      groupLevel: "Pro",
    },
    {
      id: 3,
      name: "Spa-Francorchamps",
      circuit: "Circuit de Spa-Francorchamps",
      date: "May 5, 2026",
      price: "€400",
      groupLevel: "Mixed",
    },
  ];

  const features = [
    {
      icon: Flag,
      title: "Discover Events",
      description:
        "Browse track days at iconic circuits across Europe — from Monza to the Nürburgring. Filter by skill level, date, and location.",
    },
    {
      icon: Gauge,
      title: "Tech Advantage",
      description:
        "Register your car and compare horsepower, torque, and lap potential against other participants before race day.",
    },
    {
      icon: Users,
      title: "For Organizers",
      description:
        "Create and manage your track day events with ease. Set participant limits, group levels, and track registrations in real-time.",
    },
    {
      icon: BarChart3,
      title: "Event Analytics",
      description:
        "Organisers get full visibility into participant stats — group level split, registration timelines, and capacity planning.",
    },
  ];

  return (
    <div>
      <Navbar />

      {/* Presentation / Hero Section */}
      <div className="px-8 pt-24 pb-16 max-w-[1400px] mx-auto">
        <div className="text-center mb-6">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ width: 72, height: 72, background: "#E8003D" }}
            >
              <Flag className="w-9 h-9 text-white" />
            </div>
          </div>

          {/* App name */}
          <h1
            className="text-white mb-3"
            style={{ fontSize: "56px", fontWeight: 800, letterSpacing: "-1px" }}
          >
            Circuit<span style={{ color: "#E8003D" }}>X</span>
          </h1>

          {/* Tagline */}
          <p
            className="mb-4"
            style={{ fontSize: "22px", fontWeight: 500, color: "#CCCCCC" }}
          >
            Your Track Day, Engineered.
          </p>

          {/* Description */}
          <p
            className="text-[#888888] mb-10 mx-auto"
            style={{ fontSize: "16px", lineHeight: "1.75", maxWidth: "560px" }}
          >
            CircuitX is the all-in-one platform for motorsport enthusiasts. Discover
            track day events at legendary circuits, register your vehicle, and gain
            the technical edge over the competition — all in one place.
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/events">
              <Button variant="primary">Browse Events</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary">Host an Event</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="px-8 py-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-4 gap-6 mb-20">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35]"
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "rgba(232,0,61,0.12)" }}
              >
                <f.icon className="w-5 h-5" style={{ color: "#E8003D" }} />
              </div>
              <h3
                className="text-white mb-2"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                {f.title}
              </h3>
              <p
                className="text-[#888888]"
                style={{ fontSize: "14px", lineHeight: "1.6" }}
              >
                {f.description}
              </p>
            </div>
          ))}
        </div>

        {/* Upcoming Events Preview */}
        <h2
          className="text-white mb-6"
          style={{ fontSize: "24px", fontWeight: 700 }}
        >
          Upcoming Events
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35]"
            >
              <div className="flex justify-between items-start mb-3">
                <h3
                  className="text-white"
                  style={{ fontWeight: 600, fontSize: "18px" }}
                >
                  {event.name}
                </h3>
                <Badge>{event.price}</Badge>
              </div>
              <p className="text-[#888888] mb-2" style={{ fontSize: "14px" }}>
                {event.circuit}
              </p>
              <p className="text-[#888888] mb-3" style={{ fontSize: "14px" }}>
                {event.date}
              </p>
              <Badge variant="grey">{event.groupLevel}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2A2A35] py-6 mt-16">
        <div
          className="max-w-[1400px] mx-auto px-8 text-center text-[#888888]"
          style={{ fontSize: "14px" }}
        >
          © 2026 CircuitX. All rights reserved.
        </div>
      </footer>
    </div>
  );
}