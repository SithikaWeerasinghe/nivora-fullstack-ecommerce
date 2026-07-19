import {
  CartIcon,
  CheckIcon,
  ReceiptIcon,
  SearchIcon,
} from "@/components/ui/icons";

const steps = [
  {
    number: "01",
    icon: SearchIcon,
    title: "Discover products",
    description:
      "Browse the catalogue, search by name, or filter products by category.",
  },
  {
    number: "02",
    icon: CheckIcon,
    title: "Choose and review",
    description:
      "Check product information, current availability, and select the quantity you need.",
  },
  {
    number: "03",
    icon: CartIcon,
    title: "Secure your cart",
    description:
      "Sign in, review quantities and totals, then continue to the protected checkout.",
  },
  {
    number: "04",
    icon: ReceiptIcon,
    title: "Receive confirmation",
    description:
      "Place the order and receive a clear confirmation with an order number and full summary.",
  },
];

export function OrderFlow() {
  return (
    <section
      aria-labelledby="order-flow-heading"
      className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
          How Nivora works
        </p>
        <h2
          id="order-flow-heading"
          className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          A simple path from discovery to confirmation.
        </h2>
        <p className="mt-2 leading-7 text-muted sm:text-lg sm:leading-8">
          Browse useful technology, review your cart, and complete your order
          through a clear four-step experience.
        </p>
      </div>
      <div className="relative mt-8">
        {/* Desktop connector line: sits behind the cards and shows in the gaps. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-8 top-12 hidden h-px bg-line lg:block"
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="h-full">
              <div className="group relative flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-[border-color,box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md motion-reduce:translate-none">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold tracking-widest text-primary">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
