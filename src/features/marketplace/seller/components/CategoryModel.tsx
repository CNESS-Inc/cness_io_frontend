
import { X } from "lucide-react"; // or your icon

interface CategoryItem {
  title: string;
  subtitle: string;
  image: string;
  color?: string;
  onClick?: () => void;
}

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryItem[];
}

export default function CategoryModal({ open, onClose, categories }: CategoryModalProps) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Box */}
      <div className="
        relative bg-white rounded-2xl shadow-xl
        w-[90%] max-w-4xl p-6 sm:p-8 animate-scaleIn
      ">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Select Product Category</h2>
            <p className="text-gray-600 text-sm">
              Choose the category that best fits your product
            </p>
          </div>

          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X size={22}/>
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">

          {categories.map((cat, i) => (
            <div 
              key={i}
              onClick={cat.onClick}
              className={`
                rounded-xl cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg
                p-4 flex flex-col gap-2
              `}
              style={{ backgroundColor: cat.color || "#F4F4F4" }}
            >

              <p className="text-xs text-gray-600">{cat.subtitle}</p>
              <h3 className="font-bold text-xl">{cat.title}</h3>

              <img 
                src={cat.image}
                className="h-24 mt-auto object-contain mx-auto"
                alt={cat.title}
              />
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}


/* Add animation */
<style>
{`
@keyframes scaleIn {
  0% { transform: scale(0.9); opacity: 0 }
  100% { transform: scale(1); opacity: 1 }
}
.animate-scaleIn { animation: scaleIn .25s ease-out }
`}
</style>
