import React from "react";
import { Link, useNavigate } from "react-router";
import { FiHome, FiArrowLeft, FiCompass } from "react-icons/fi";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 font-sans">
      <div className="relative w-full max-w-lg rounded-3xl p-8 sm:p-12 text-center studio-card border border-border shadow-xl overflow-hidden">
        {/* Subtle top laser highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        {/* Status Icon */}
        <div className="w-16 h-16 rounded-2xl studio-well flex items-center justify-center text-accent mx-auto mb-6 border border-border">
          <FiCompass className="w-8 h-8" />
        </div>

        {/* Telemetry Badge */}
        <div className="mb-3">
          <span className="studio-badge-coral text-[10px]">
            STATUS 404 · ROUTE NOT FOUND
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-3 font-display">
          Lost in the Stack
        </h1>
        <p className="type-body text-secondary max-w-sm mx-auto mb-8 leading-relaxed font-normal">
          The dossier or endpoint you requested cannot be located. It may have been archived or repositioned.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white studio-btn-primary flex items-center justify-center gap-2"
          >
            <FiHome className="w-4 h-4" />
            <span>Return to Console</span>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-primary studio-btn-secondary flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
