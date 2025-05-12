import axios, { type AxiosResponse } from "axios";
import { toast } from "react-toastify";

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
  person_organization_complete: number;
};
type OrganizationFormData = {
  organization_name : string,
  domain : string,
  sub_domain : string,
  employee_size : string,
  revenue : string,
  statement : string,
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
  // BaseUrl: "http://192.168.1.21:5025/api", //local
  BaseUrl: "https://1i5208zy27.execute-api.us-east-1.amazonaws.com/api", //live
};

export const EndPoint = {
  login: "/auth/login",
  register: "/auth/sign-up",
  organization_profile: "/organization-profile",
  acount_type: "/auth/update/person",
  dashboard: "/dashboard",
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
export const AccountDetails = (formData: AccountFormData): ApiResponse => {
  const data: Partial<AccountFormData> = {
    person_organization_complete: formData?.person_organization_complete,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.acount_type);
};
export const submitOrganizationDetails = (formData: OrganizationFormData): ApiResponse => {
  const data: Partial<OrganizationFormData> = {
    organization_name : formData?.organization_name,
    domain : formData?.domain,
    sub_domain : formData?.sub_domain,
    employee_size : formData?.employee_size,
    revenue : formData?.revenue,
    statement : formData?.statement,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.organization_profile);
};

export const DashboardDetails = (): ApiResponse => {
  const data = {
  };
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.dashboard);
};

export const executeAPI = async <T = any>(
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
      toast.error(error.response.data.error.message);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error; // Re-throw the error if you want calling code to handle it
  }
};