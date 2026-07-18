import {
  PackageIcon,
  ReceiptIcon,
  ShieldIcon,
} from "@/components/ui/icons";

const trustPoints = [
  {
    icon: PackageIcon,
    title: "Accurate availability",
    text: "Live stock levels are shown on every product — no false urgency.",
  },
  {
    icon: ShieldIcon,
    title: "Secure account access",
    text: "Your cart and checkout are protected behind your account.",
  },
  {
    icon: ReceiptIcon,
    title: "Clear order confirmation",
    text: "Every order ends with a full summary and a readable order number.",
  },
];

export function TrustStrip() {
  return (
    <section aria-label="Why shop with Nivora" className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <ul className="grid gap-4 sm:grid-cols-3">
        {trustPoints.map((point) => (
          <li
            key={point.title}
            className="flex items-start gap-3.5 rounded-xl border border-line bg-surface p-5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <point.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-ink">{point.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{point.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
