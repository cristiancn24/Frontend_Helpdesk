import TicketDetailsComponent from "@/components/tickets/ticket-details-component"

export default function TicketDetailsPage({ params }) {
  return <TicketDetailsComponent ticketId={params.id} withModals={true} />
}
