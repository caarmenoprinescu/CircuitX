import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { useApp, Car } from "../../context/AppContext";

type DriveType = Car["driveType"];
type TireType = Car["tireType"];

export function CarForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, addCar, updateCar, getGroupLevel } = useApp();

  const isEdit = Boolean(id);
  const existing = isEdit ? cars.find(c => c.id === Number(id)) : null;

  const [form, setForm] = useState({
    make: existing?.make || "",
    model: existing?.model || "",
    year: existing?.year?.toString() || "",
    horsepower: existing?.horsepower?.toString() || "",
    torque: existing?.torque?.toString() || "",
    weight: existing?.weight?.toString() || "",
    zeroToHundred: existing?.zeroToHundred?.toString() || "",
    driveType: existing?.driveType || "" as DriveType | "",
    tireType: existing?.tireType || "" as TireType | "",
    aeroMods: existing?.aeroMods ?? false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [groupLevel, setGroupLevel] = useState("");

  useEffect(() => {
    if (form.horsepower && form.tireType) {
      setGroupLevel(getGroupLevel(Number(form.horsepower), form.tireType));
    }
  }, [form.horsepower, form.tireType]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.make.trim()) e.make = "Required";
    if (!form.model.trim()) e.model = "Required";
    if (!form.year || Number(form.year) < 1990 || Number(form.year) > 2026) e.year = "Enter valid year (1990-2026)";
    if (!form.horsepower || Number(form.horsepower) <= 0) e.horsepower = "Must be > 0";
    if (!form.torque || Number(form.torque) <= 0) e.torque = "Must be > 0";
    if (!form.weight || Number(form.weight) <= 0) e.weight = "Must be > 0";
    if (!form.zeroToHundred || Number(form.zeroToHundred) <= 0) e.zeroToHundred = "Must be > 0";
    if (!form.driveType) e.driveType = "Required";
    if (!form.tireType) e.tireType = "Required";
    return e;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const payload = {
      make: form.make,
      model: form.model,
      year: Number(form.year),
      horsepower: Number(form.horsepower),
      torque: Number(form.torque),
      weight: Number(form.weight),
      zeroToHundred: Number(form.zeroToHundred),
      driveType: form.driveType as DriveType,
      tireType: form.tireType as TireType,
      aeroMods: form.aeroMods,
    };
    if (isEdit && existing) updateCar(existing.id, payload);
    else addCar(payload);
    navigate("/garage");
  }

  const groupBadgeVariant = (gl: string) =>
    gl === "Pro" ? "red" : gl === "Intermediate" ? "green" : "grey";

  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8 py-24">
        <div className="bg-[#1A1A24] rounded-xl p-8 w-full max-w-[600px] border border-[#2A2A35]">
          <h1 className="text-white mb-8" style={{ fontSize: "28px", fontWeight: 700 }}>
            {isEdit ? "Edit Your Car" : "Add Your Car"}
          </h1>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input label="Make" name="make" value={form.make} onChange={handleChange} placeholder="e.g., Porsche" />
                {errors.make && <p className="text-[#E8003D] text-xs mt-1">{errors.make}</p>}
              </div>
              <div>
                <Input label="Model" name="model" value={form.model} onChange={handleChange} placeholder="e.g., 911 GT3" />
                {errors.model && <p className="text-[#E8003D] text-xs mt-1">{errors.model}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input label="Year" name="year" type="number" value={form.year} onChange={handleChange} placeholder="e.g., 2022" />
                {errors.year && <p className="text-[#E8003D] text-xs mt-1">{errors.year}</p>}
              </div>
              <div>
                <Input label="Horsepower (HP)" name="horsepower" type="number" value={form.horsepower} onChange={handleChange} placeholder="e.g., 502" />
                {errors.horsepower && <p className="text-[#E8003D] text-xs mt-1">{errors.horsepower}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input label="Torque (Nm)" name="torque" type="number" value={form.torque} onChange={handleChange} placeholder="e.g., 470" />
                {errors.torque && <p className="text-[#E8003D] text-xs mt-1">{errors.torque}</p>}
              </div>
              <div>
                <Input label="Weight (kg)" name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="e.g., 1435" />
                {errors.weight && <p className="text-[#E8003D] text-xs mt-1">{errors.weight}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input label="0-100 km/h (s)" name="zeroToHundred" type="number" step="0.1" value={form.zeroToHundred} onChange={handleChange} placeholder="e.g., 3.4" />
                {errors.zeroToHundred && <p className="text-[#E8003D] text-xs mt-1">{errors.zeroToHundred}</p>}
              </div>
              <div>
                <Select
                  label="Drive Type"
                  name="driveType"
                  value={form.driveType}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select drive type..." },
                    { value: "FWD", label: "FWD" },
                    { value: "RWD", label: "RWD" },
                    { value: "AWD", label: "AWD" },
                  ]}
                />
                {errors.driveType && <p className="text-[#E8003D] text-xs mt-1">{errors.driveType}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Select
                  label="Tire Type"
                  name="tireType"
                  value={form.tireType}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select tire type..." },
                    { value: "Street", label: "Street" },
                    { value: "Sport", label: "Sport" },
                    { value: "Semi-Slick", label: "Semi-Slick" },
                    { value: "Slick", label: "Slick" },
                  ]}
                />
                {errors.tireType && <p className="text-[#E8003D] text-xs mt-1">{errors.tireType}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#888888] text-xs">Aero Modifications</label>
                <div className="flex gap-3 h-12 items-center">
                  {[true, false].map(val => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, aeroMods: val }))}
                      className={`flex-1 h-12 rounded-lg border transition-all ${
                        form.aeroMods === val
                          ? "border-[#E8003D] bg-[#E8003D]/10 text-white"
                          : "border-[#2A2A35] text-[#888888]"
                      }`}
                    >
                      {val ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {groupLevel && (
              <div className="pt-2">
                <div className="text-[#888888] mb-2" style={{ fontSize: "12px" }}>Calculated Group Level</div>
                <Badge variant={groupBadgeVariant(groupLevel)}>{groupLevel}</Badge>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button variant="secondary" onClick={() => navigate("/garage")} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} className="flex-1">
                Save Car
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}