import axios, { type AxiosResponse } from "axios";

// Define types for your API
type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";
type LoginFormData = {
  email: string;
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
  // BaseUrl: "http://localhost:5025/api", //local
  BaseUrl: "https://z3z1ppsdij.execute-api.us-east-1.amazonaws.com/api", //live
};

export const EndPoint = {
  login: "/auth/login",
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
};

export const LoginDetails = (formData: LoginFormData): ApiResponse => {
  const data: Partial<LoginFormData> = {
    email: formData?.email,
    password: formData?.password,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.login);
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
export const GetSubDomainDetails = (formData: string): ApiResponse => {
  const data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.subdomain}/${formData}`
  );
};

export const executeAPI = async <T = any,>(
  method: ApiMethod,
  data: any,
  endpoint: string,
  params?: Record<string, any>
): ApiResponse<T> => {
  try {
    const token = localStorage.getItem("jwt");
    const response: AxiosResponse<T> = await axios({
      method: method,
      url: API.BaseUrl + endpoint,
      data: data,
      params: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ? token : ""}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // toast.error(error.response.data.error.message);
    } else {
      // toast.error("An unexpected error occurred");
    }
    throw error; // Re-throw the error if you want calling code to handle it
  }
};
