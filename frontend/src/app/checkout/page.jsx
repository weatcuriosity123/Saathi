import Button from "@/components/ui/Button";
import PageTemplate from "@/components/shared/PageTemplate";

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <PageTemplate
        title="Checkout"
        description="Complete your enrollment securely"
        sections={[
          { title: "Order Summary", content: "Selected course and pricing details." },
          { title: "Payment", content: "Payment method integration placeholder." },
        ]}
      />
      <Button variant="accent">Proceed to payment</Button>
    </div>
  );
}
