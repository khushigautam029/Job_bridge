import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const InlineFormValidation = () => {
    useEffect(() => {
        const showError = (event) => {
            const field = event.target;
            if (!(field instanceof HTMLElement) || !field.matches("input, select, textarea")) return;
            event.preventDefault();
            field.classList.add("field-invalid");
            field.setAttribute("aria-invalid", "true");
            const wrapper = field.parentElement;
            if (!wrapper) return;
            let message = wrapper.querySelector(":scope > .field-error");
            if (!message) {
                message = document.createElement("p");
                message.className = "field-error";
                message.setAttribute("role", "alert");
                wrapper.append(message);
            }
            message.textContent = field.validationMessage || "Please check this field.";
        };
        const clearError = (event) => {
            const field = event.target;
            if (!(field instanceof HTMLElement) || !field.matches("input, select, textarea")) return;
            if (field.validity.valid) {
                field.classList.remove("field-invalid");
                field.removeAttribute("aria-invalid");
                field.parentElement?.querySelector(":scope > .field-error")?.remove();
            }
        };
        document.addEventListener("invalid", showError, true);
        document.addEventListener("input", clearError, true);
        document.addEventListener("change", clearError, true);
        return () => {
            document.removeEventListener("invalid", showError, true);
            document.removeEventListener("input", clearError, true);
            document.removeEventListener("change", clearError, true);
        };
    }, []);
    return null;
};

createRoot(document.getElementById("root")).render(
    // <StrictMode>
        <><InlineFormValidation /><App /></>
    // </StrictMode>
);
