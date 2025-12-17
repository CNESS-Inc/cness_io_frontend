import Mentorform from "../components/zohoforms/Mentorform";

const BecomeMentor = () => {
  return (
    <>
      <div className="p-0">
        <div className="rounded-xl border border-gray-200 bg-white p-0">
          <Mentorform
            // Use your actual Marketplace form’s public URL (formperma link)
            src="https://forms.zohopublic.com/vijicn1/form/BecameanMentor/formperma/mwyGIJHdCeSv97Vv2SwTmygPofaQEi7OwYEyE3hLqSg"
            title="Marketplace Submission"
            minHeight={900}
          />
        </div>
      </div>
    </>
  );
};

export default BecomeMentor;
