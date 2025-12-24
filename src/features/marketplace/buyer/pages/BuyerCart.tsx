import CartItemCard from "../components/CartItem";
import BillingSummary from "../components/BillingSummary";
import carticon from "../../../../assets/solar_cart-broken.svg";
import nandhiji from '../../../../assets/nandhiji.svg';
const cartItems = [
    { id: 1 },
    { id: 2 },
    
  ];

export default function CartPage() {
  return (


<div
      className="
        w-full
        pt-20        /* mobile */
        md:pt-16     /* tablet */
        lg:pt-20       /* desktop */
        flex flex-col
        gap-6
      "
    > 
      {/* ================= CART HEADER ================= */}
<div className="flex items-center gap-3 px-4 sm:px-0">
        {/* Icon */}
<img src={carticon} alt="cart" className="w-6 h-6"></img>
        {/* Title */}
        <h1 className="text-[20px] font-semibold text-[#080f20]">
          Cart
        </h1>

        {/* Dynamic Count */}
        <span className="px-2 py-[2px] text-[14px] font-medium bg-[#eef0ff] text-[#4f5dff] rounded-[5px]">
          {cartItems.length.toString().padStart(2, "0")}
        </span>
      </div>

    
<div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 px-4 sm:px-0">
      
      {/* LEFT */}
<div className="flex flex-col gap-4 w-full min-w-0">
        <CartItemCard
          title="Dance of Siddhars"
          description="After over 5 years of intent to create a wave of music..."
          category="Music"
          image="https://cdn.cness.io/feat1.png"
          author={{
            name: "Nandhiji",
            avatar: nandhiji,
          }}
          price="$89.00"
          originalPrice="$99.00"
          discount="-10%"
        />

        <CartItemCard
          title="Dance of Siddhars"
          description="After over 5 years of intent to create a wave of music..."
          category="Music"
          image="https://cdn.cness.io/feat1.png"
          author={{
            name: "Nandhiji",
            avatar: nandhiji,
          }}
          price="$89.00"
          originalPrice="$99.00"
          discount="-10%"
        />
      </div>

      {/* RIGHT */}
      <div className="xl:sticky xl:top-24">

      <BillingSummary
        subtotal="$3720.27"
        discount="$749.99"
        tax="$228.72"
        total="$3,439.00"
        points={500}
      />
      </div>
    </div>
    </div>

  );
}
