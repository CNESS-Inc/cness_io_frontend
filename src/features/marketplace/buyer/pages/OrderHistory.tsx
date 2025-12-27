import OrderHeader from "../components/Orders/OrderHeader";
import Orderplace from "../components/Orders/OrderPlace";
import OrderContent from "../components/Orders/OrderContent";
import ContactCard from "../components/Orders/ContactCard";
import WhyCness from '../../../../assets/whycness.jpg'; 
import nandhiji from '../../../../assets/nandhiji.svg';
const orders = [
  {
    orderId: "#ORD-10293",
    date: "12 Dec 2025",
    total: "$89.00",
    originalPrice: "$99.00",
    discount: "-10%",
    product: {
      title: "Cosmic Dance of Siddhars",
      description: "An ode to the Siddhars where divine wisdom flows.",
      category: "Music",
      categoryColor: "purple",
      image: "https://cdn.cness.io/feat1.png",
      author: {
        name: "Nandhiji",
        avatar: nandhiji
      },
    },
  },
  {
    orderId: "#ORD-10294",
    date: "12 Dec 2025",
    total: "$49.00",
    originalPrice: "$59.00",
    discount: "-15%",
    product: {
      title: "Sacred Sound of Silence",
      description: "A meditative journey through stillness.",
      category: "Podcast",
      categoryColor: "blue",
      image: WhyCness,
      author: {
        name: "Arul Master",
        avatar: nandhiji
      },
    },
  },
];
export default function OrderHistory() {
  return (
<div
  className="
    pt-20        /* mobile */
    md:pt-16     /* tablet */
    lg:pt-2     /* desktop */
    grid grid-cols-1 lg:grid-cols-[1fr_265px]
    gap-6
    items-start
  "
>    
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-6">
        
        {/* Header aligned to orders */}
        <OrderHeader orderCount={orders.length} />

        {/* Orders */}
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="rounded-2xl overflow-hidden border border-[#f3f3f3]"
          >
            <Orderplace
              date={order.date}
              total={order.total}
              originalPrice={order.originalPrice}
              discount={order.discount}
              orderId={order.orderId}
            />

            <OrderContent
              product={order.product}
              showRatingBanner
            />
          </div>
        ))}
      </div>

      {/* RIGHT COLUMN */}
      <div className="sticky top-44">
        <ContactCard />
      </div>

    </div>
  );
}