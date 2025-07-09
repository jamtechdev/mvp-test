"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Button } from "react-bootstrap";

/* Hook to detect dark mode via <html data-theme="dark"> */
function useHtmlDataTheme() {
  const getTheme = () =>
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") || "light"
      : "light";

  const [scheme, setScheme] = useState(getTheme);

  useEffect(() => {
    const obs = new MutationObserver(() => setScheme(getTheme()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  return scheme; // "dark" or "light"
}

export default function DateRangeInput({ value, onChange }) {
  const scheme = useHtmlDataTheme();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    startDate: value.start,
    endDate: value.end,
  });
  const [touched, setTouched] = useState(false); // ✨ Track user interaction
  const wrapperRef = useRef(null);

  // Sync external value to draft
  useEffect(() => {
    setDraft({ startDate: value.start, endDate: value.end });
  }, [value.start, value.end]);

  // Close calendar on outside click
  useEffect(() => {
    const handleClick = (e) =>
      wrapperRef.current &&
      !wrapperRef.current.contains(e.target) &&
      setOpen(false);
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = ({ selection }) => {
    setTouched(true); // ✨ User picked something
    setDraft(selection);
    onChange({ start: selection.startDate, end: selection.endDate });

    if (!isSameDay(selection.startDate, selection.endDate)) {
      setOpen(false);
    }
  };

  const handleClear = () => {
    const today = new Date();
    onChange({ start: today, end: today });
    setOpen(false);
    setTouched(false); // ✨ Reset touch state
  };

  const popStyle = useMemo(
    () => ({
      position: "absolute",
      zIndex: 1000,
      marginTop: 4,
      borderRadius: 8,
      overflow: "hidden",
      boxShadow:
        scheme === "dark"
          ? "0 4px 18px rgba(0,0,0,0.8)"
          : "0 4px 16px rgba(0,0,0,0.1)",
      border: `1px solid ${scheme === "dark" ? "#2a354d" : "#dee2e6"}`,
      background: scheme === "dark" ? "#0c1427" : "#ffffff",
    }),
    [scheme]
  );

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {/* Dark mode patch for react-date-range */}
      {scheme === "dark" && (
        <style jsx global>{`
          .rdrCalendarWrapper,
          .rdrMonths,
          .rdrMonth,
          .rdrMonthAndYearWrapper,
          .rdrMonthAndYearPickers select,
          .rdrWeekDays,
          .rdrDay,
          .rdrDateDisplayWrapper {
            background: #0c1427 !important;
            color: #e6e6e6 !important;
          }
          .rdrDayNumber span {
            color: #e6e6e6 !important;
          }
          .rdrDayDisabled {
            opacity: 0.3 !important;
          }
          .rdrNextPrevButton {
            background: rgba(230, 230, 230, 0.08) !important;
          }
          .rdrDayToday .rdrDayNumber span:after {
            background: #37beb0 !important;
          }
          .rdrSelected,
          .rdrInRange,
          .rdrStartEdge,
          .rdrEndEdge {
            background: #37beb0 !important;
            color: #fff !important;
          }
          .rdrDayHovered,
          .rdrDayActive {
            background: rgba(55, 190, 176, 0.3) !important;
            color: #fff !important;
          }
          .rdrMonthAndYearPickers select {
            border: 1px solid #2a354d !important;
          }
        `}</style>
      )}

      {/* Input & Clear */}
      <div className="d-flex gap-2 align-items-center">
        <input
          type="text"
          readOnly
          className="form-control cursor-pointer"
          value={`${format(value.start, "yyyy-MM-dd")} – ${format(
            value.end,
            "yyyy-MM-dd"
          )}`}
          onClick={() => setOpen((o) => !o)}
        />
        {touched && !isSameDay(value.start, value.end) && (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleClear}
            title="Clear selection"
          >
            Clear
          </Button>
        )}
      </div>

      {open && (
        <div style={popStyle}>
          <DateRange
            ranges={[{ ...draft, key: "selection" }]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            editableDateInputs
            rangeColors={[scheme === "dark" ? "#37BEB0" : "#4e79ff"]}
          />
        </div>
      )}
    </div>
  );
}
