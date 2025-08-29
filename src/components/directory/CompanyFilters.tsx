"use client";
import { Menu } from "@headlessui/react";
import { LiaCertificateSolid } from "react-icons/lia";
import { FaCheck, FaSortAlphaUp, FaAngleDown, FaAngleUp } from "react-icons/fa";

interface Option {
  value: string;
  label: string;
}

interface CompanyFiltersProps {
  options: Option[];
  selected: string;
  setSelected: (val: string) => void;
  order: "asc" | "desc";
  setOrder: (val: "asc" | "desc") => void;
}

export default function CompanyFilters({
  options,
  selected,
  setSelected,
  order,
  setOrder,
}: CompanyFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Certification Dropdown */}
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex items-center gap-2 px-2 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50">
            <LiaCertificateSolid className="text-pink-700" size={20} />
            {selected
              ? options.find((o) => o.value === selected)?.label
              : "Certification Level"}
          </Menu.Button>
        </div>

        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
          <div className="py-2">
            {options.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => setSelected(option.value)}
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    <span
                      className={`w-4 h-4 mr-3 rounded-full border flex items-center justify-center ${
                        selected === option.value
                          ? "border-pink-600 bg-pink-600"
                          : "border-gray-400"
                      }`}
                    >
                      {selected === option.value && (
                        <FaCheck className="text-white text-[10px]" />
                      )}
                    </span>
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Menu>

      {/* Sort Button */}
      <button
        onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
        className="flex items-center justify-between w-28 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <FaSortAlphaUp className="text-indigo-600" />
          <span>A - Z</span>
        </div>
        {order === "asc" ? (
          <FaAngleDown className="text-gray-500" />
        ) : (
          <FaAngleUp className="text-gray-500" />
        )}
      </button>
    </div>
  );
}
