import { useEffect, useId, useRef, useState } from "react";

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

/** Geoapify suggestions with free-text entry as a fallback. */
const LocationAutocomplete = ({
    value,
    onChange,
    onSelect,
    onSuggestionsOpenChange,
    className = "",
    inputClassName = "",
    placeholder = "Start typing a city or location",
    id,
    name,
    required = false,
    ...inputProps
}) => {
    const generatedId = useId();
    const listId = `${id || generatedId}-suggestions`;
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const rootRef = useRef(null);
    const selectedValueRef = useRef("");

    useEffect(() => {
        onSuggestionsOpenChange?.(isOpen && suggestions.length > 0);
    }, [isOpen, onSuggestionsOpenChange, suggestions.length]);

    useEffect(() => {
        const query = String(value || "").trim();
        if (!API_KEY || query.length < 3 || query === selectedValueRef.current) {
            setSuggestions([]);
            setIsOpen(false);
            return undefined;
        }

        const controller = new AbortController();
        const timeoutId = window.setTimeout(async () => {
            try {
                const params = new URLSearchParams({ text: query, limit: "5", format: "json", apiKey: API_KEY });
                const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params}`, { signal: controller.signal });
                if (!response.ok) throw new Error("Location lookup failed");
                const data = await response.json();
                const results = (data.results || []).map((place) => {
                    const props = place.properties || place;
                    const label = place.formatted || props.formatted;
                    const value = props.city || props.town || props.village || props.municipality || label?.split(",")[0]?.trim();
                    return {
                        label,
                        value,
                        key: `${place.place_id || label}-${place.lat}-${place.lon}`,
                    };
                }).filter((place) => place.label && place.value);
                setSuggestions(results);
                setIsOpen(results.length > 0);
                setActiveIndex(-1);
            } catch (error) {
                if (error.name !== "AbortError") {
                    setSuggestions([]);
                    setIsOpen(false);
                }
            }
        }, 300);

        return () => {
            window.clearTimeout(timeoutId);
            controller.abort();
        };
    }, [value]);

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (!rootRef.current?.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", closeOnOutsideClick);
        return () => document.removeEventListener("mousedown", closeOnOutsideClick);
    }, []);

    const chooseSuggestion = (suggestion) => {
        selectedValueRef.current = suggestion.value;
        onChange({ target: { name, value: suggestion.value } });
        onSelect?.(suggestion.value);
        setIsOpen(false);
        setSuggestions([]);
    };

    const handleChange = (event) => {
        selectedValueRef.current = "";
        onChange(event);
    };

    const handleKeyDown = (event) => {
        if (!isOpen || suggestions.length === 0) {
            inputProps.onKeyDown?.(event);
            return;
        }
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => (index + 1) % suggestions.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
        } else if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            chooseSuggestion(suggestions[activeIndex]);
        } else if (event.key === "Escape") {
            setIsOpen(false);
        } else {
            inputProps.onKeyDown?.(event);
        }
    };

    return (
        <div ref={rootRef} className={`relative ${className}`}>
            <input
                {...inputProps}
                id={id || generatedId}
                name={name}
                type="text"
                value={value}
                required={required}
                placeholder={placeholder}
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isOpen}
                aria-controls={listId}
                aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
                className={inputClassName}
                onChange={handleChange}
                onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                onKeyDown={handleKeyDown}
            />
            {isOpen && suggestions.length > 0 && (
                <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                    {suggestions.map((suggestion, index) => (
                        <li key={suggestion.key} role="option" aria-selected={index === activeIndex}>
                            <button
                                id={`${listId}-${index}`}
                                type="button"
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-indigo-50 ${index === activeIndex ? "bg-indigo-50" : ""}`}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => chooseSuggestion(suggestion)}
                            >
                                {suggestion.label}
                            </button>
                        </li>
                    ))}
                    <li className="px-3 py-1.5 text-right text-[10px] text-slate-400">OpenStreetMap contributors | Powered by Geoapify</li>
                </ul>
            )}
        </div>
    );
};

export default LocationAutocomplete;
