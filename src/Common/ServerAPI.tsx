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
type UpdateFormData = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};
type ResetFormData = {
  token: string;
  password: string;
};
type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  referral_code?: string;
};
type GenerateAffiliateFromData = {
  user_id: any;
};
type getReferredUsersFromData = {
  referralcode: string;
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
  custom_domain?: string;
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
  //  BaseUrl: "http://192.168.1.29:5025/api", //local
  BaseUrl: "http://localhost:3000/api", //local
  // BaseUrl: import.meta.env.VITE_API_BASE_URL || "https://z3z1ppsdij.execute-api.us-east-1.amazonaws.com/api",
};

export const EndPoint = {
  login: "/auth/login",
  refreshToken: "/auth/refresh-token",
  forgot: "/auth/forgot-password",
  me: "/auth/me",
  updatepassword: "/auth/update/password",
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
  allFormData: "/readiness-question/get-formdata",
  allPlanData: "/person-plan/user/plan",
  emailverify: "/auth/email-verify",
  paymentverify: "/payment/payment-confirm",
  profile: "/profile",
  organizationProfile: "/organization-profile",
  organizationNumber: "/organization-profile/verify-identify",
  organization_profile_create: "/organization-profile",
  organization_Listing_profile_create: "/organization-listing",
  interests: "/interests",
  industry: "/industry",
  profession: "/profession",
  country: "/country",
  service: "/service",
  state: "/state",
  company_profile: "/organization-profile/company-profile",
  user_profile: "/profile/user-profile",
  rating: "/profile/rating",
  score_result: "/quiz/get/score-result",
  directory_search_profile: "/profile/public-directory",
  public_user_profile: "/profile/public-user-profile",
  get_popular_company: "/profile/get-popular-company",
  get_inspire_company: "/profile/get-inspire-company",
  org_type: "/organization",
  questions: "/quiz/get/question",
  questions_file: "/quiz/upload-answer-file",
  answer: "/quiz/answer",
  final_submission: "/quiz/final-submition",
  report: "/quiz/report",
  get_all_post: "/user/posts/get/all",
  create_post: "/user/posts",
  postComments: "/user/post/comments",
  postChildComment: "/user/post/comments/child",
  postCommentLike: "/user/post/comments/like",
  like: "/user/posts/like",
  Post_AllComments: "/user/post/comments",
  single_post: "/user/posts/get",
  story: "/story",
  story_like: "/story/like",
  story_comment: "/story/comment",
  event: "/event",
  trending_post: "/user/posts/trending",
  trending_movie: "/movie/trending",
  following: "/user/following",
  connection: "/friend",
  connection_request: "/friend/request",
  follow: "/user/follow",
  vote: "/poll/vote",
  googleLogin: "/auth/google-login",
  all_bestPractices: "/best-practice/all",
  add_bestpractices: "/best-practice",
  singleBp: "/best-practice/get",
  user_notification: "/notification",
  logout: "/auth/logout",
  gernerate_affiliate_code: "/profile/user/generate_referral_code",
  get_my_referrals: "/profile/user/getmyreferrals",
};

export const GoogleLoginDetails = async (googleToken: string): ApiResponse => {
  const data = { token: googleToken };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.googleLogin);
};

export const LoginDetails = async (formData: LoginFormData): ApiResponse => {
  const data: Partial<LoginFormData> = {
    email: formData?.email,
    password: formData?.password,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.login);
};
export const RefreshTokenDetails = async (): ApiResponse => {
  const data = {}
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.refreshToken);
};
export const MeDetails = async (): ApiResponse => {
  const data = {}
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.me);
};
export const ForgotPasswordDetails = (
  formData: ForgotFormData
): ApiResponse => {
  const data: Partial<ForgotFormData> = {
    email: formData?.email,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.forgot);
};
export const UpdatePasswordDetails = (
  formData: UpdateFormData
): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.updatepassword
  );
};
export const ForgotPasswordDetailsSubmit = (
  formData: ResetFormData
): ApiResponse => {
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
    referral_code: formData?.referral_code,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.register);
};

export const GenerateAffiliateCode = (formData: GenerateAffiliateFromData): ApiResponse => {
  const data: Partial<GenerateAffiliateFromData> = {
    user_id: formData?.user_id,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.gernerate_affiliate_code);
};

export const getReferredUsers = (formData: getReferredUsersFromData): ApiResponse => {
 
  return executeAPI(ServerAPI.APIMethod.GET, null, `${EndPoint.get_my_referrals}?referralcode=${formData.referralcode}`);
};

export const AccountDetails = (formData: AccountData): ApiResponse => {
  const data: Partial<AccountData> = {
    person_organization_complete: formData?.person_organization_complete,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.acount_type);
};
export const QuestionFileDetails = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.questions_file
  );
};
export const QuestionFinalSubmission = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.final_submission);
};
export const GetReport = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.report);
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
    custom_domain: formData?.custom_domain,
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
export const submitPersonDetails = (formData: any): ApiResponse => {
  const data: Partial<any> = {
    interest_id: formData?.interests,
    profession_id: formData?.professions,
    first_name: formData?.first_name,
    last_name: formData?.last_name,
    question: formData?.question,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.person_profile);
};
export const submitAnswerDetails = (formData: any): ApiResponse => {
  console.log("🚀 ~ submitAnswerDetails ~ formData:", formData)
  // Initialize the data array
  const data: Array<{ question_id: string; answer: any }> = [];

  // Handle selectedCheckboxIds and checkboxes_question_id
  if (formData.selectedCheckboxIds && formData.checkboxes_question_id) {
    data.push({
      question_id: formData.checkboxes_question_id,
      answer: formData.selectedCheckboxIds,
    });
  }

  // Handle purposePauseAnswers
  if (
    formData.purposePauseAnswers &&
    Array.isArray(formData.purposePauseAnswers)
  ) {
    formData.purposePauseAnswers.forEach((item: any) => {
      if (item.id) {
        data.push({
          question_id: item.id,
          answer: item.answer, // Or use item.answer if you want the actual answer text
        });
      }
    });
  }

  // Handle bestPractice
  if (formData.bestPractice && formData.bestPractice.question_id) {
    data.push({
      question_id: formData.bestPractice.question_id,
      answer: formData.bestPractice.answer, // Or use formData.bestPractice.answer
    });
  }

  // // Handle referenceLink (if needed)
  // // You'll need to know the question_id for the referenceLink
  // // For example:
  if (formData.referenceLink) {
    data.push({
      question_id: formData.referenceLink.question_id,
      answer: formData.referenceLink.url
    });
  }

  // Handle uploads (if needed)
  // You'll need to know how to map uploads to question_ids
  // For example:
  if (formData.uploads && Array.isArray(formData.uploads)) {
    formData.uploads.forEach((upload: any) => {
      if (upload) {
        data.push({
          question_id: upload.id,
          answer: upload.file, // or process the upload as needed
        });
      }
    });
  }

  // Return the formatted data
  return executeAPI(ServerAPI.APIMethod.POST, { data }, EndPoint.answer);
};

export const DashboardDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.dashboard);
};
export const OrgTypeDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.org_type);
};
export const QuestionDetails = (sectionId: any): ApiResponse => {
  const data: Partial<any> = {
    section_id: sectionId,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.questions);
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
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.paymentverify,
    params
  );
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
  return executeAPI(ServerAPI.APIMethod.POST, formData, EndPoint.profile);
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
export const SubmitOrganizationListingDetails = (
  formData: any
): ApiResponse => {
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
export const GetPopularCompanyDetails = (
  page: number,
  limit: number
): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  params["limit"] = limit;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.get_popular_company,
    params
  );
};
export const GetInspiringCompanies = (
  page: number,
  limit: number
): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  params["limit"] = limit;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.get_inspire_company,
    params
  );
};
export const GetAllBestPractices = (
  page: number,
  limit: number,
  professionId: string,
  searchText: string,
): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  params["limit"] = limit;
  params["profession"] = professionId;
  params["text"] = searchText;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.all_bestPractices,
    params
  );
};
export const CreateBestPractice = (formData: any): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.POST, formData, EndPoint.add_bestpractices);
};
export const GetSingleBestPractice = (id: any): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, `${EndPoint.singleBp}/${id}`);
};
export const GetUserNotification = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, `${EndPoint.user_notification}`);
};
export const GetProfileDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.profile);
};
export const GetOrganiZationProfileDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.organizationProfile
  );
};
export const GetOrganiZationNumberVerify = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.organizationNumber
  );
};
export const GetInterestsDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.interests);
};
export const GetIndustryDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.industry);
};
export const GetProfessionalDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.profession);
};
export const GetCountryDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.country);
};
export const GetServiceDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.service);
};
export const GetStateDetails = (id: any): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, `${EndPoint.state}/${id}`);
};
export const GetCompanyProfileDetails = (id: any): ApiResponse => {
  const data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.company_profile}/${id}`
  );
};
export const GetUserProfileDetails = (id: any): ApiResponse => {
  const data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.user_profile}/${id}`
  );
};
export const AddUserRating = (payload: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    payload,
    `${EndPoint.rating}`
  );
};
export const GetUserRating = (payload: any): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["profile_id"] = payload.profile_id;
  params["user_type"] = payload.user_type;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    payload,
    EndPoint.rating,
    params
  );
};
export const GetUserScoreResult = (): ApiResponse => {
  const data: Partial<any> = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.score_result
  );
};
export const GetUsersearchProfileDetails = (
  selectedDomain: any,
  searchQuery: any,
  page: any,
  limit: any
): ApiResponse => {
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

// Social APIS

export const PostsDetails = (page: any) => {
  let data = {};
  let params: { [key: string]: any } = {};
  params["pagination[page]"] = page;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.get_all_post,
    params
  );
};

export const AddPost = (formData: any): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.POST, formData, EndPoint.create_post);
};

export const PostComments = (formattedData: any) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formattedData,
    EndPoint.postComments
  );
};
export const PostChildComments = (formattedData: any) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formattedData,
    EndPoint.postChildComment
  );
};
export const PostCommentLike = (formattedData: any) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formattedData,
    EndPoint.postCommentLike
  );
};

export const PostsLike = (formattedData: any) => {
  return executeAPI(ServerAPI.APIMethod.POST, formattedData, EndPoint.like);
};

export const GetComment = (id: any) => {
  let data = {};
  let params: { [key: string]: any } = {};
  params["post_id"] = id;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.Post_AllComments}`,
    params
  );
};
export const GetSinglePost = (id: any) => {
  let data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.single_post}/${id}`
  );
};
export const GetStory = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.story);
};
export const LikeStory = (story_id: any) => {
  const data: Partial<any> = {
    story_id: story_id,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.story_like);
};
export const CommentStory = (formattedData: any) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formattedData,
    EndPoint.story_comment
  );
};
export const FetchCommentStory = (id: any) => {
  let data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.story_comment}?story_id=${id}`
  );
};
export const AddStory = (formData: any) => {
  return executeAPI(ServerAPI.APIMethod.POST, formData, EndPoint.story);
};
export const GetEvent = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.event);
};
export const GetTrendingPost = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.trending_post);
};
export const GetTrendingMovie = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.trending_movie);
};
export const GetFollowingUser = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.following);
};
export const GetConnectionUser = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.connection);
};
export const SendConnectionRequest = (formattedData: any) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formattedData,
    EndPoint.connection_request
  );
};
export const SendFollowRequest = (formattedData: any) => {
  return executeAPI(ServerAPI.APIMethod.POST, formattedData, EndPoint.follow);
};
export const AddVote = (formattedData: any) => {
  return executeAPI(ServerAPI.APIMethod.POST, formattedData, EndPoint.vote);
};

export const LogOut = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.logout);
};

export const executeAPI = async <T = any,>(
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
        ...(API.BaseUrl.trim().toLowerCase().startsWith("https://") && { withCredentials: true })
      });

    const access_token = response.headers['access_token'];

    if (access_token != 'not-provide') {
      console.log('access token response check sets', true)
      localStorage.setItem('jwt', access_token)
    }

    return response.data;
  } catch (error: any) {
    // console.log("🚀 ~ error:", error)

    if (error.response.data.error.statusCode == 401) {
      localStorage.clear();
      window.location.href = '/';
    }

    throw error;

  }
};
