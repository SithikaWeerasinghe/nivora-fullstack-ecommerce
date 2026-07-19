import {
  CheckIcon,
  PackageIcon,
  ReceiptIcon,
  ShieldIcon,
} from "@/components/ui/icons";

const trustCards = [
  {
    number: "N-01",
    icon: PackageIcon,
    title: "Accurate availability",
    description:
      "Current stock levels are shown clearly so customers can make informed decisions.",
    label: "Clear stock information",
  },
  {
    number: "N-02",
    icon: ShieldIcon,
    title: "Secure account access",
    description:
      "Cart and checkout access remain connected to the customer’s account.",
    label: "Protected customer journey",
  },
  {
    number: "N-03",
    icon: ReceiptIcon,
    title: "Clear order confirmation",
    description:
      "Every completed order includes a readable order number and complete summary.",
    label: "Simple confirmation",
  },
];

export function TrustStrip() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
          Why Nivora
        </p>
        <h2
          id="trust-heading"
          className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          Built around a clearer shopping experience.
        </h2>
        <p className="mt-2 leading-7 text-muted sm:text-lg sm:leading-8">
          Every part of Nivora is designed to keep product information, account
          access, and order confirmation easy to understand.
        </p>
      </div>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {trustCards.map((card) => (
          <li key={card.number} className="h-full">
            <div className="group flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-[border-color,box-shadow,translate] duration-500 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-md motion-reduce:translate-none">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 scale-100 items-center justify-center rounded-xl bg-primary/10 text-primary transition-[background-color,color,scale] duration-500 ease-out group-hover:scale-[1.03] group-hover:bg-primary group-hover:text-white motion-reduce:scale-100">
                  <card.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold tracking-widest text-muted">
                  {card.number}
                </span>
              </div>
              <h3 className="mt-5 font-semibold text-ink">{card.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-6 text-muted">
                {card.description}
              </p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                <CheckIcon className="h-3.5 w-3.5" />
                {card.label}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
