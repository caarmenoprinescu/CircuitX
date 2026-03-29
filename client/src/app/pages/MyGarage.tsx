import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Pencil, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";

export function MyGarage() {
  const { cars, currentUser, deleteCar, getGroupLevel } = useApp();
  const myCars = cars.filter(c => c.ownerId === currentUser?.id);
  const primaryCar = myCars[0];
  const secondaryCars = myCars.slice(1);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      deleteCar(id);
    }
  };

  const groupBadgeVariant = (gl: string) =>
    gl === "Pro" ? "red" : gl === "Intermediate" ? "green" : "grey";

  return (
    <div>
      <Navbar />
      <div className="px-8 py-8 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-white mb-2" style={{ fontSize: "32px", fontWeight: 700 }}>
              My Garage
            </h1>
            <p className="text-[#888888]">Manage your car collection</p>
          </div>
          <Link to="/garage/add">
            <Button variant="primary">+ Add Car</Button>
          </Link>
        </div>

        {myCars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#888888] mb-4">No cars in your garage yet.</p>
            <Link to="/garage/add">
              <Button variant="primary">+ Add Your First Car</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[60%_40%] gap-6">
            {/* Primary Car */}
            <div className="bg-[#1A1A24] rounded-xl p-8 border-2 border-[#E8003D] shadow-[0_0_20px_rgba(232,0,61,0.2)]">
              <div className="mb-6">
                <h2 className="text-white mb-2" style={{ fontSize: "28px", fontWeight: 700 }}>
                  {primaryCar.make} {primaryCar.model}
                </h2>
                <Badge variant={groupBadgeVariant(getGroupLevel(primaryCar.horsepower, primaryCar.tireType))}>
                  {getGroupLevel(primaryCar.horsepower, primaryCar.tireType)}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { label: "Year", value: primaryCar.year },
                  { label: "Horsepower", value: `${primaryCar.horsepower} HP` },
                  { label: "Torque", value: `${primaryCar.torque} Nm` },
                  { label: "Weight", value: `${primaryCar.weight} kg` },
                  { label: "0-100 km/h", value: `${primaryCar.zeroToHundred}s` },
                  { label: "Drive Type", value: primaryCar.driveType },
                  { label: "Tire Type", value: primaryCar.tireType },
                  { label: "Aero Mods", value: primaryCar.aeroMods ? "Yes" : "No" },
                ].map(spec => (
                  <div key={spec.label}>
                    <div className="text-[#888888] mb-1" style={{ fontSize: "12px" }}>{spec.label}</div>
                    <div className="text-white" style={{ fontWeight: 600 }}>{spec.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link to={`/garage/${primaryCar.id}/edit`}>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Pencil className="w-4 h-4" /> Edit
                  </Button>
                </Link>
                <button aria-label="delete car"
                  onClick={() => handleDelete(primaryCar.id)}
                  className="h-12 px-6 rounded-lg border border-[#E8003D] text-[#E8003D] hover:bg-[#E8003D] hover:text-white transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>

            {/* Secondary Cars */}
            <div className="flex flex-col gap-6">
              {secondaryCars.map((car) => (
                <div key={car.id} className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A35]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white mb-1" style={{ fontSize: "18px", fontWeight: 600 }}>
                        {car.make} {car.model}
                      </h3>
                      <p className="text-[#888888]" style={{ fontSize: "14px" }}>{car.horsepower} HP</p>
                    </div>
                    <Badge variant={groupBadgeVariant(getGroupLevel(car.horsepower, car.tireType))}>
                      {getGroupLevel(car.horsepower, car.tireType)}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/garage/${car.id}/edit`}>
                      <button className="p-2 text-[#888888] hover:text-white transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="p-2 text-[#E8003D] hover:text-[#c00034] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <Link to="/garage/add">
                <div className="bg-transparent rounded-xl p-6 border-2 border-dashed border-[#2A2A35] hover:border-[#E8003D] transition-colors flex items-center justify-center h-[140px] cursor-pointer">
                  <span className="text-[#888888] hover:text-[#E8003D] transition-colors" style={{ fontSize: "16px" }}>
                    + Add Car
                  </span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}