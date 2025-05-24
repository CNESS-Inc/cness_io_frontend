import axios, { type AxiosResponse } from "axios";

// Define types for your API
type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";
type LoginFormData = {
  email: string;
  password: string;
};
type ForgotFormData = {
  email: string;
};
type ResetFormData = {
  token: string;
  password: string;
};
type RegisterFormData = {
  username: string;
  email: string;
  password: string;
};
type AccountFormData = {
  plan_id: string;
  plan_type: string;
};
type AccountData = {
  person_organization_complete: number;
};
type EmailVerifyData = {
  token: any;
};
type PaymentVerifyData = {
  session_id: any;
};
type OrganizationFormData = {
  sub_domain: string | undefined;
  domain: string | undefined;
  revenue: string | undefined;
  employee_size: string | undefined;
  organization_name: string;
  domain_id: string;
  sub_domain_id: string;
  organization_type_id: string;
  revenue_range_id: string;
  question: any;
};
type ApiResponse<T = any> = Promise<T>;

export const ServerAPI = {
  APIMethod: {
    GET: "GET" as const,
    POST: "POST" as const,
    PUT: "PUT" as const,
    DELETE: "DELETE" as const,
  },
};

export const API = {
  // BaseUrl: "http://192.168.1.3:5025/api", //local
  // BaseUrl: "http://localhost:5025/api", //local
  BaseUrl: "https://z3z1ppsdij.execute-api.us-east-1.amazonaws.com/api", //live
};

export const EndPoint = {
  login: "/auth/login",
  forgot: "/auth/forgot-password",
  reset: "/auth/reset-password",
  register: "/auth/sign-up",
  organization_profile: "/readiness-question/organization/answer",
  person_profile: "/readiness-question/person/answer",
  acount_type: "/auth/update/person",
  payment: "/payment",
  dashboard: "/dashboard",
  domain: "/domain",
  subdomain: "/sub-domain/by-domain",
  readinessQuestion: "/readiness-question",
  allFormData:"/readiness-question/get-formdata",
  allPlanData:"/person-plan/user/plan",
  emailverify:"/auth/email-verify",
  paymentverify:"/payment/payment-confirm",
  profile:"/profile",
  organizationProfile:"/organization-profile",
  organization_profile_create:"/organization-profile",
  organization_Listing_profile_create:"/organization-listing",
  interests:"/interests",
  industry:"/industry",
  profession:"/profession",
  country:"/country",
  service:"/service",
  state:"/state",
  company_profile:"/organization-profile/company-profile",
  user_profile:"/profile/user-profile",
  directory_search_profile:"/profile/public-directory",
  public_user_profile:"/profile/public-user-profile",
};

export const LoginDetails = (formData: LoginFormData): ApiResponse => {
  const data: Partial<LoginFormData> = {
    email: formData?.email,
    password: formData?.password,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.login);
};
export const ForgotPasswordDetails = (formData: ForgotFormData): ApiResponse => {
  const data: Partial<ForgotFormData> = {
    email: formData?.email,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.forgot);
};
export const ForgotPasswordDetailsSubmit = (formData: ResetFormData): ApiResponse => {
  const data: Partial<ResetFormData> = {
    token: formData?.token,
    password: formData?.password,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.reset);
};

export const RegisterDetails = (formData: RegisterFormData): ApiResponse => {
  const data: Partial<RegisterFormData> = {
    username: formData?.username,
    email: formData?.email,
    password: formData?.password,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.register);
};
export const AccountDetails = (formData: AccountData): ApiResponse => {
  const data: Partial<AccountData> = {
    person_organization_complete: formData?.person_organization_complete,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.acount_type);
};
export const PaymentDetails = (formData: AccountFormData): ApiResponse => {
  const data: Partial<AccountFormData> = {
    plan_id: formData?.plan_id,
    plan_type: formData?.plan_type,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.payment);
};
export const submitOrganizationDetails = (
  formData: OrganizationFormData
): ApiResponse => {
  const data: Partial<OrganizationFormData> = {
    organization_name: formData?.organization_name,
    domain_id: formData?.domain,
    sub_domain_id: formData?.sub_domain,
    organization_type_id: formData?.employee_size,
    revenue_range_id: formData?.revenue,
    question: formData?.question,

  };
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.organization_profile
  );
};
export const submitPersonDetails = (
  formData: OrganizationFormData
): ApiResponse => {
  console.log("🚀 ~ formData:", formData)
  const data: Partial<OrganizationFormData> = {
    question: formData?.question,
  };
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.person_profile
  );
};

export const DashboardDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.dashboard);
};
export const GetDomainDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.domain);
};
export const GetReadinessQuestionDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.readinessQuestion);
};
export const GetAllFormDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.allFormData);
};
export const GetAllPlanDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.allPlanData);
};
export const GetEmailVerify = (formData: EmailVerifyData): ApiResponse => {
   const data: Partial<EmailVerifyData> = {
    token: formData?.token,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.emailverify);
};
export const GetPaymentVerify = (formData: PaymentVerifyData): ApiResponse => {
  const params: Partial<PaymentVerifyData> = {
    session_id: formData?.session_id,
  };
  return executeAPI(ServerAPI.APIMethod.GET, null, EndPoint.paymentverify, params);
};
export const GetSubDomainDetails = (formData: string): ApiResponse => {
  const data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.subdomain}/${formData}`
  );
};
export const SubmitProfileDetails = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.profile
  );
};
export const SubmitPublicProfileDetails = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.public_user_profile
  );
};
export const SubmitOrganizationDetails = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.organization_profile_create
  );
};
export const SubmitOrganizationListingDetails = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.organization_Listing_profile_create
  );
};
export const GetOrganizationListingDetails = (): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.organization_Listing_profile_create
  );
};
export const GetPublicProfileDetails = (): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.public_user_profile
  );
};
export const GetProfileDetails = (): ApiResponse => {
  const data = {}
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.profile
  );
};
export const GetOrganiZationProfileDetails = (): ApiResponse => {
  const data = {}
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.organizationProfile
  );
};
export const GetInterestsDetails = (): ApiResponse => {
  const data = {}
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.interests
  );
};
export const GetIndustryDetails = (): ApiResponse => {
  const data = {}
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.industry
  );
};
export const GetProfessionalDetails = (): ApiResponse => {
  const data = {}
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.profession
  );
};
export const GetCountryDetails = (): ApiResponse => {
  const data = {}
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.country
  );
};
export const GetServiceDetails = (): ApiResponse => {
  const data = {}
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.service
  );
};
export const GetStateDetails = (id:any): ApiResponse => {
  const data = {}
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.state}/${id}`
  );
};
export const GetCompanyProfileDetails = (id:any): ApiResponse => {
  const data = {}
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.company_profile}/${id}`
  );
};
export const GetUserProfileDetails = (id:any): ApiResponse => {
  const data = {}
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.user_profile}/${id}`
  );
};
export const GetUsersearchProfileDetails = (selectedDomain:any,searchQuery:any,page:any,limit:any): ApiResponse => {
console.log("🚀 ~ GetUsersearchProfileDetails ~ selectedDomain:", selectedDomain)
const data: Partial<any> = {
    domain: selectedDomain,
    text: searchQuery,
    page_no: page,
    limit: limit,
  };
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.directory_search_profile
  );
};


export const executeAPI = async <T = any>(
  method: ApiMethod,
  data: any,
  endpoint: string,
  params?: Record<string, any>
): ApiResponse<T> => {
  try {
    const token = localStorage.getItem("jwt");

    const isFormData = data instanceof FormData;

    const response: AxiosResponse<T> = await axios({
      method: method,
      url: API.BaseUrl + endpoint,
      data: data,
      params: params,
      headers: {
        ...(isFormData
          ? {} // Don't set Content-Type manually for FormData
          : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token || ""}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // toast.error(error.response.data.error.message);
    } else {
      // toast.error("An unexpected error occurred");
    }
    throw error;
  }
};

