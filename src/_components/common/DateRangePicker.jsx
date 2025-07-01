"use client";
import { useRef, useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateRangeInput({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    startDate: value.start,
    endDate: value.end,
  });

  const wrapperRef = useRef(null);

  useEffect(() => {
    setDraft({ startDate: value.start, endDate: value.end });
  }, [value.start, value.end]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = ({ selection }) => {
    const firstPick = isSameDay(selection.startDate, selection.endDate);
    setDraft(selection);
    onChange({ start: selection.startDate, end: selection.endDate });
    if (!firstPick) setOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <input
        type="text"
        className="form-control cursor-pointer"
        readOnly
        value={`${format(value.start, "yyyy-MM-dd")} – ${format(
          value.end,
          "yyyy-MM-dd"
        )}`}
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 1000,
            background: "#fff",
            border: "1px solid #dee2e6",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            marginTop: 4,
          }}
        >
          <DateRange
            ranges={[{ ...draft, key: "selection" }]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            editableDateInputs
            rangeColors={["#4e79ff"]}
          />
        </div>
      )}
    </div>
  );
}
