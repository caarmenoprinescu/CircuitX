import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { useApp, Event } from "../../context/AppContext";

type GroupLevel = Event["groupLevel"];
type Status = Event["status"];

export function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, addEvent, updateEvent } = useApp();

  const isEdit = Boolean(id);
  const existing = isEdit ? events.find(e => e.id === Number(id)) : null;

  const [form, setForm] = useState({
    title: existing?.title || "",
    circuit: existing?.circuit || "",
    country: existing?.country || "",
    date: existing?.date || "",
    maxParticipants: existing?.maxParticipants?.toString() || "",
    price: existing?.price?.toString() || "",
    groupLevel: existing?.groupLevel || "" as GroupLevel | "",
    description: existing?.description || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Event name is required.";
    if (!form.circuit.trim()) e.circuit = "Circuit name is required.";
    if (!form.country) e.country = "Country is required.";
    if (!form.date) e.date = "Date is required.";
    if (!form.maxParticipants || Number(form.maxParticipants) <= 0) e.maxParticipants = "Must be greater than 0.";
    if (!form.price || Number(form.price) <= 0) e.price = "Must be greater than 0.";
    if (!form.groupLevel) e.groupLevel = "Group level is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    return e;
  }

  function handleSaveDraft() {
    const errs = validate();
    if (errs.title) { setErrors(errs); return; }
    submit("Draft");
  }

  function handlePublish() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    submit("Published");
  }

  function submit(status: Status) {
    const payload = {
      title: form.title,
      circuit: form.circuit,
      country: form.country,
      date: form.date,
      maxParticipants: Number(form.maxParticipants),
      price: Number(form.price),
      groupLevel: form.groupLevel as GroupLevel,
      description: form.description,
      status,
    };
    if (isEdit && existing) {
      updateEvent(existing.id, payload);
    } else {
      addEvent(payload);
    }
    navigate("/organizer/dashboard");
  }

  return (
    <div>
      <Navbar />
      <div className="px-8 py-8 max-w-[1000px] mx-auto">
        <h1 className="text-white mb-8" style={{ fontSize: "32px", fontWeight: 700 }}>
          {isEdit ? "Edit Event" : "Host a Track Day"}
        </h1>

        <div className="bg-[#1A1A24] rounded-xl p-8 border border-[#2A2A35]">
          <div className="space-y-6">
            <div>
              <Input
                label="Event Name"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Monza Track Day"
              />
              {errors.title && <p className="text-[#E8003D] text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input
                  label="Circuit Name"
                  name="circuit"
                  value={form.circuit}
                  onChange={handleChange}
                  placeholder="e.g., Silverstone Circuit"
                />
                {errors.circuit && <p className="text-[#E8003D] text-xs mt-1">{errors.circuit}</p>}
              </div>
              <div>
                <Select
                  label="Country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select country..." },
                    { value: "United Kingdom", label: "United Kingdom" },
                    { value: "Italy", label: "Italy" },
                    { value: "Belgium", label: "Belgium" },
                    { value: "Germany", label: "Germany" },
                    { value: "Spain", label: "Spain" },
                    { value: "France", label: "France" },
                    { value: "Netherlands", label: "Netherlands" },
                    { value: "Romania", label: "Romania" },
                  ]}
                />
                {errors.country && <p className="text-[#E8003D] text-xs mt-1">{errors.country}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input
                  label="Date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                />
                {errors.date && <p className="text-[#E8003D] text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <Input
                  label="Max Participants"
                  name="maxParticipants"
                  type="number"
                  value={form.maxParticipants}
                  onChange={handleChange}
                  placeholder="e.g., 20"
                />
                {errors.maxParticipants && <p className="text-[#E8003D] text-xs mt-1">{errors.maxParticipants}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input
                  label="Price (€)"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g., 250"
                />
                {errors.price && <p className="text-[#E8003D] text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <Select
                  label="Group Level"
                  name="groupLevel"
                  value={form.groupLevel}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select level..." },
                    { value: "Novice", label: "Novice" },
                    { value: "Intermediate", label: "Intermediate" },
                    { value: "Pro", label: "Pro" },
                    { value: "Mixed", label: "Mixed" },
                  ]}
                />
                {errors.groupLevel && <p className="text-[#E8003D] text-xs mt-1">{errors.groupLevel}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#888888] text-xs">Description</label>
              <textarea
                name="description"
                className="px-4 py-3 rounded-lg bg-[#0A0A0F] border border-[#2A2A35] text-white focus:border-[#E8003D] focus:outline-none transition-colors resize-none"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your event..."
              />
              {errors.description && <p className="text-[#E8003D] text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="secondary" onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              <Button variant="primary" onClick={handlePublish}>
                {isEdit ? "Update Event" : "Publish Event"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}