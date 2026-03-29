import { useParams } from "react-router";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Select } from "../components/Select";
import { Zap } from "lucide-react";
import { useApp, Car } from "../../context/AppContext";

export function TechAdvantage() {
  const { eventId } = useParams();
  const { events, registrations, cars, users, currentUser } = useApp();
  const [selectedOpponentRegId, setSelectedOpponentRegId] = useState("");

  const event = events.find(e => e.id === Number(eventId));
  const myReg = registrations.find(r => r.eventId === Number(eventId) && r.pilotId === currentUser?.id);
  const myCar = myReg ? cars.find(c => c.id === myReg.carId) : null;

  const otherRegs = registrations.filter(
    r => r.eventId === Number(eventId) && r.pilotId !== currentUser?.id
  );

  const selectedReg = otherRegs.find(r => r.id === Number(selectedOpponentRegId));
  const opponentCar = selectedReg ? cars.find(c => c.id === selectedReg.carId) : null;
  const opponentUser = selectedReg ? users.find(u => u.id === selectedReg.pilotId) : null;

  function calculateScore(car: Car): number {
    let score = 0;
    score += Math.floor(car.horsepower / 10) * 2;
    score += Math.floor(car.torque / 50) * 1.5;
    score += (2000 - car.weight) / 50;
    score += (5 - car.zeroToHundred) * 4;
    if (car.aeroMods) score += 10;
    if (car.tireType === "Slick") score += 10;
    else if (car.tireType === "Semi-Slick") score += 7;
    else if (car.tireType === "Sport") score += 4;
    if (car.driveType === "RWD") score += 10;
    else if (car.driveType === "AWD") score += 7;
    else score += 4;
    return Math.round(score);
  }

  const yourScore = myCar ? calculateScore(myCar) : 0;
  const opponentScore = opponentCar ? calculateScore(opponentCar) : 0;
  const isWinner = yourScore > opponentScore;

  type Spec = {
    name: string;
    yourValue: string | number;
    oppValue: string | number | undefined;
    unit?: string;
    lowerWins?: boolean;
  };

  const specs: Spec[] = myCar ? [
    { name: "Horsepower", yourValue: myCar.horsepower, oppValue: opponentCar?.horsepower, unit: "HP" },
    { name: "Torque", yourValue: myCar.torque, oppValue: opponentCar?.torque, unit: "Nm" },
    { name: "Weight", yourValue: myCar.weight, oppValue: opponentCar?.weight, unit: "kg", lowerWins: true },
    { name: "0-100 km/h", yourValue: myCar.zeroToHundred, oppValue: opponentCar?.zeroToHundred, unit: "s", lowerWins: true },
    { name: "Drive Type", yourValue: myCar.driveType, oppValue: opponentCar?.driveType },
    { name: "Tire Type", yourValue: myCar.tireType, oppValue: opponentCar?.tireType },
    { name: "Aero Mods", yourValue: myCar.aeroMods ? "Yes" : "No", oppValue: opponentCar ? (opponentCar.aeroMods ? "Yes" : "No") : undefined },
  ] : [];

  if (!event || !myCar) return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[#888888]">You must be registered with a car to use Tech Advantage.</p>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="px-8 py-8 max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-white mb-2" style={{ fontSize: "32px", fontWeight: 700 }}>
            {event.title}
          </h1>
          <div className="flex items-center gap-2 text-[#888888]">
            <Zap className="w-5 h-5 text-[#E8003D]" />
            <span style={{ fontSize: "18px" }}>Tech Advantage</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Your Car */}
          <div className="bg-[#1A1A24] rounded-xl p-6 border-2 border-[#E8003D] shadow-[0_0_20px_rgba(232,0,61,0.3)]">
            <div className="text-[#888888] mb-2" style={{ fontSize: "12px" }}>Your Car</div>
            <h2 className="text-white mb-6" style={{ fontSize: "24px", fontWeight: 700 }}>
              {myCar.make} {myCar.model}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Year", value: myCar.year },
                { label: "Horsepower", value: `${myCar.horsepower} HP` },
                { label: "Torque", value: `${myCar.torque} Nm` },
                { label: "Weight", value: `${myCar.weight} kg` },
                { label: "0-100 km/h", value: `${myCar.zeroToHundred}s` },
                { label: "Drive Type", value: myCar.driveType },
                { label: "Tire Type", value: myCar.tireType },
                { label: "Aero Mods", value: myCar.aeroMods ? "Yes" : "No" },
              ].map(spec => (
                <div key={spec.label}>
                  <div className="text-[#888888]" style={{ fontSize: "12px" }}>{spec.label}</div>
                  <div className="text-white" style={{ fontWeight: 600 }}>{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Opponent */}
          <div>
            <Select
              label="Select Opponent"
              value={selectedOpponentRegId}
              onChange={(e) => setSelectedOpponentRegId(e.target.value)}
              options={[
                { value: "", label: "Choose a pilot..." },
                ...otherRegs.map(r => {
                  const pilot = users.find(u => u.id === r.pilotId);
                  const car = cars.find(c => c.id === r.carId);
                  return {
                    value: String(r.id),
                    label: `${pilot?.name || "Unknown"} — ${car ? `${car.make} ${car.model}` : "No car"}`,
                  };
                }),
              ]}
              className="mb-6"
            />
            {opponentCar && (
              <div className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35]">
                <div className="text-[#888888] mb-2" style={{ fontSize: "12px" }}>Opponent</div>
                <h2 className="text-white mb-6" style={{ fontSize: "24px", fontWeight: 700 }}>
                  {opponentCar.make} {opponentCar.model}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Year", value: opponentCar.year },
                    { label: "Horsepower", value: `${opponentCar.horsepower} HP` },
                    { label: "Torque", value: `${opponentCar.torque} Nm` },
                    { label: "Weight", value: `${opponentCar.weight} kg` },
                    { label: "0-100 km/h", value: `${opponentCar.zeroToHundred}s` },
                    { label: "Drive Type", value: opponentCar.driveType },
                    { label: "Tire Type", value: opponentCar.tireType },
                    { label: "Aero Mods", value: opponentCar.aeroMods ? "Yes" : "No" },
                  ].map(spec => (
                    <div key={spec.label}>
                      <div className="text-[#888888]" style={{ fontSize: "12px" }}>{spec.label}</div>
                      <div className="text-white" style={{ fontWeight: 600 }}>{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        {opponentCar && (
          <>
            <div className="bg-[#1A1A24] rounded-xl overflow-hidden border border-[#2A2A35] mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A2A35]">
                    {["Spec", "Your Car", "Opponent", "Advantage"].map(h => (
                      <th key={h} className="text-left p-4 text-[#888888]" style={{ fontWeight: 500 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specs.map((spec, i) => {
                    const yourWins = typeof spec.yourValue === "number" && typeof spec.oppValue === "number"
                      ? spec.lowerWins
                        ? spec.yourValue < spec.oppValue
                        : spec.yourValue > spec.oppValue
                      : false;
                    const tied = spec.yourValue === spec.oppValue;
                    return (
                      <tr key={i} className="border-b border-[#2A2A35] h-14 last:border-0">
                        <td className="p-4 text-white">{spec.name}</td>
                        <td className={`p-4 ${yourWins ? "bg-[#E8003D]/15 text-[#E8003D] font-semibold" : "text-[#888888]"}`}>
                          {spec.yourValue} {spec.unit || ""}
                        </td>
                        <td className={`p-4 ${!yourWins && !tied ? "bg-[#E8003D]/15 text-[#E8003D] font-semibold" : "text-[#888888]"}`}>
                          {spec.oppValue} {spec.unit || ""}
                        </td>
                        <td className="p-4">
                          {tied
                            ? <span className="text-[#888888]">Tied</span>
                            : yourWins
                              ? <span className="text-[#E8003D] font-semibold">You</span>
                              : <span className="text-[#888888]">Opponent</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Your Total Score", score: yourScore, winner: isWinner },
                { label: `${opponentUser?.name || "Opponent"} Total Score`, score: opponentScore, winner: !isWinner },
              ].map((box) => (
                <div
                  key={box.label}
                  className={`bg-[#1A1A24] rounded-xl p-8 text-center ${
                    box.winner
                      ? "border-2 border-[#E8003D] shadow-[0_0_30px_rgba(232,0,61,0.4)]"
                      : "border border-[#2A2A35]"
                  }`}
                >
                  <div className="text-[#888888] mb-2" style={{ fontSize: "14px" }}>{box.label}</div>
                  <div className="text-white mb-4" style={{ fontSize: "48px", fontWeight: 700 }}>{box.score}</div>
                  {box.winner && (
                    <div className="flex items-center justify-center gap-2 bg-[#E8003D]/15 text-[#E8003D] px-4 py-2 rounded-full">
                      <Zap className="w-4 h-4" />
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>Technical Advantage</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}