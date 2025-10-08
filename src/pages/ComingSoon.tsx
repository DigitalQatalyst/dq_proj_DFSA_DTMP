import React from "react";
import { useLocation } from "react-router-dom";
import ComingSoonView, { ComingSoonViewProps } from "../components/ComingSoonView";

const ComingSoon: React.FC = () => {
  const location = useLocation();
  const state = (location.state || {}) as Partial<ComingSoonViewProps>;

  const defaults: ComingSoonViewProps = {
    title: "Coming Soon",
    description:
      "We're crafting an effortless enterprise registration experience. Stay tuned while we put on the finishing touches.",
    bullets: [
      "Guided registration tailored to your business type",
      "Seamless document uploads and validation",
      "Real-time status updates and support",
    ],
    primaryAction: { label: "Back to Home", to: "/", variant: "secondary" },
    secondaryAction: { label: "Contact Us", href: "/#contact", variant: "primary" },
    logoText: "EJP",
    gradientFrom: "indigo-900",
    gradientVia: "blue-900",
    gradientTo: "teal-900",
  };

  const props: ComingSoonViewProps = { ...defaults, ...state };

  return <ComingSoonView {...props} />;
};

export default ComingSoon;
