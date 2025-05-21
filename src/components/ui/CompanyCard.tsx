

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/DashboardCard';

import { iconMap } from '../../assets/icons';


interface CompanyCardProps {
  name: string;
  domain: string;
  logoUrl: string;
  bannerUrl: string;
  location: string;
  description: string;
  tags: string[];
  rating?: number;
  isCertified?: boolean;
}

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;

  return (
    <div className="flex items-center gap-[2px]">
      {[...Array(totalStars)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          fill={i < rating ? "#FFA500" : "none"}
          stroke="#FFA500"
          viewBox="0 0 24 24"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 17.25l-6.16 3.88 1.64-7.03-5.48-4.73 7.19-.61L12 2.25l2.81 6.51 7.19.61-5.48 4.73 1.64 7.03L12 17.25z"
          />
        </svg>
      ))}
    </div>
  );
};

export default function CompanyCard({
  name,
  location,
  logoUrl,
  bannerUrl,
  description,
  tags,
  rating,
}: CompanyCardProps) {
  return (
    
 <Card className="bg-white max-w-sm rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm hover:ring-[1.5px] hover:ring-[#F07EFF]/40">
  <CardHeader className="px-4 pt-4 pb-0">
    <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
      <img src={logoUrl} alt={`${name} logo`} className="h-8 w-8 rounded-full" />
      <div>
        <CardTitle className="text-sm font-semibold">{name}</CardTitle>
        <CardDescription className="text-xs text-gray-500">{location}</CardDescription>
      </div>
    </div>
    <img src={iconMap['inslogo']} alt="CNESS Logo"className="h-8 w-auto object-contain" />
    </div>
  </CardHeader>

  <CardContent className="px-4 pt-2 pb-0">
    <div className="rounded-xl overflow-hidden mb-3">
      <img
        src={bannerUrl}
        alt={`${name} banner`}
        className="w-full h-36 object-cover"
      />
    </div>

   <div className="flex justify-between items-center mb-1">
  <p className="text-sm font-semibold text-gray-800">Overview</p>
  <div className="flex items-center text-yellow-500 text-sm">
    {'★'.repeat(rating || 0)}
    {'☆'.repeat(5 - (rating || 0))}
  </div>
</div>

    <p className="text-sm text-gray-600 leading-snug">
      {description}{' '}
      <span className="text-purple-600 underline cursor-pointer">Read More</span>
    </p>
   

    <div className="flex flex-wrap gap-2 mt-3">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs"
        >
          {tag}
        </span>
      ))}
    </div>
  </CardContent>

  <CardFooter className="flex justify-between items-center px-4 py-3">
  

  </CardFooter>
</Card>

  );
}