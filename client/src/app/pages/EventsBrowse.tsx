import { Link } from "react-router";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { useApp } from "../../context/AppContext";

const ITEMS_PER_PAGE = 6;

export function EventsBrowse() {
  const { events } = useApp();
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [groupLevel, setGroupLevel] = useState("all");
  const [page, setPage] = useState(1);

  const published = events.filter(e => e.status === "Published");

  const filtered = published.filter(e => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.circuit.toLowerCase().includes(search.toLowerCase());
    const matchCountry = country === "all" || e.country === country;
    const matchLevel = groupLevel === "all" || e.groupLevel === groupLevel;
    return matchSearch && matchCountry && matchLevel;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const totalPages = Math.max(1, Math.ceil(rest.length / ITEMS_PER_PAGE));
  const paginated = rest.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const countries = [...new Set(published.map(e => e.country))];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      <Navbar />
      <div className="px-8 py-8 max-w-[1400px] mx-auto">
        <h1 className="text-white mb-8" style={{ fontSize: "32px", fontWeight: 700 }}>
          Upcoming Events
        </h1>

        {/* Filter Bar */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <Input type="date" />
          <Select
            value={country}
            onChange={(e) => { setCountry(e.target.value); setPage(1); }}
            options={[
              { value: "all", label: "All Countries" },
              ...countries.map(c => ({ value: c, label: c })),
            ]}
          />
          <Select
            value={groupLevel}
            onChange={(e) => { setGroupLevel(e.target.value); setPage(1); }}
            options={[
              { value: "all", label: "All Levels" },
              { value: "Novice", label: "Novice" },
              { value: "Intermediate", label: "Intermediate" },
              { value: "Pro", label: "Pro" },
              { value: "Mixed", label: "Mixed" },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#888888]" style={{ fontSize: "16px" }}>No events found.</p>
          </div>
        ) : (
          <>
            {/* Featured Event */}
            {featured && (
              <div className="bg-[#1A1A24] rounded-xl p-8 border border-[#2A2A35] mb-6 h-[280px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-white mb-2" style={{ fontSize: "28px", fontWeight: 700 }}>
                        {featured.title}
                      </h2>
                      <p className="text-[#888888]" style={{ fontSize: "16px" }}>{featured.circuit}</p>
                      <p className="text-[#888888]" style={{ fontSize: "16px" }}>{formatDate(featured.date)}</p>
                    </div>
                    <Badge>€{featured.price}</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <Badge variant="grey">{featured.groupLevel}</Badge>
                  <Link to={`/events/${featured.id}`}>
                    <Button variant="primary">View Details</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Events Grid */}
            {paginated.length > 0 && (
              <div className="grid grid-cols-3 gap-6">
                {paginated.map((event) => (
                  <div
                    key={event.id}
                    className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35] h-[160px] flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-white mb-2" style={{ fontSize: "14px", fontWeight: 700 }}>
                        {event.title}
                      </h3>
                      <p className="text-[#888888] mb-1" style={{ fontSize: "12px" }}>
                        {formatDate(event.date)}
                      </p>
                      <p className="text-[#888888] mb-2" style={{ fontSize: "12px" }}>
                        {event.circuit}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge>€{event.price}</Badge>
                      <Link
                        to={`/events/${event.id}`}
                        className="text-[#E8003D] hover:underline"
                        style={{ fontSize: "14px" }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg ${
                      page === p
                        ? "bg-[#E8003D] text-white"
                        : "bg-[#1A1A24] text-white hover:bg-[#2A2A35]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}