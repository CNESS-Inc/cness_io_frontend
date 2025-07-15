import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditPublicListing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/user-profile?tab=publicProfile");
  }, [navigate]);

  return null; // since you don't need to render anything
};

export default EditPublicListing;
