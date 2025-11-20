import axios, { type AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
// import { Server } from "lucide-react";
// Define types for your API
type ApiMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
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
type getReferralAmountFromData = {
  user_id: any;
};
type getMyRefferralCodeFromData = {
  user_id: string;
};
type getGenerateSSOTokenFromData = {
  token: any;
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

type FriendSuggestionData = {
  search?: string;
  limit?: number;
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
    PATCH: "PATCH" as const,
    PUT: "PUT" as const,
    DELETE: "DELETE" as const,
  },
};

export const API = {
  //  BaseUrl: "http://192.168.1.18:5025/api", //local
  // BaseUrl: "http://localhost:5025/api", //local
  BaseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    "https://z3z1ppsdij.execute-api.us-east-1.amazonaws.com/api",
  MarketplaceBaseUrl: "http://localhost:3000/",
};

export const EndPoint = {
  login: "/auth/login",
  refreshToken: "/auth/refresh-token",
  forgot: "/auth/forgot-password",
  me: "/auth/me",
  wallet: "/credits/history",
  updatepassword: "/auth/update/password",
  reset: "/auth/reset-password",
  register: "/auth/sign-up",
  organization_profile: "/readiness-question/organization/answer",
  person_profile: "/readiness-question/person/information",
  person_readiness: "/readiness-question/person/answer",
  acount_type: "/auth/update/person",
  payment: "/payment",
  dashboard: "/dashboard",
  domain: "/domain",
  subdomain: "/sub-domain/by-domain",
  readinessQuestion: "/readiness-question",
  allFormData: "/readiness-question/get-formdata",
  getAspiringQuestion: "/readiness-question/get-aspiring-question",
  get_certification_details: "/quiz/certifications",
  nomination_application: "/nomination-application",
  get_retake_assensment: "/quiz/retake-assessment",
  allPlanData: "/person-plan/user/plan",
  emailverify: "/auth/email-verify",
  paymentverify: "/payment/payment-confirm",
  profile: "/profile",
  public_profile: "/profile/public",
  profile_remove: "/profile/image/remove",
  organizationProfile: "/organization-profile",
  organizationNumber: "/organization-profile/verify-identify",
  organization_profile_create: "/organization-profile",
  organization_Listing_profile_create: "/organization-listing",
  interests: "/interests",
  industry: "/industry",
  badge_list: "/profile/person-badge-list",
  profession: "/profession",
  valid_profession: "/profession/get-valid-profession",
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
  get_aspire_company: "/profile/get-aspire-company",
  org_type: "/organization",
  questions: "/quiz/get/question",
  questions_file: "/quiz/upload-answer-file",
  answer: "/quiz/answer",
  removeuploadedfile: "/quiz/remove-upload-answer-file",
  final_submission: "/quiz/final-submition",
  report: "/quiz/report",
  get_front_all_post: "/user/posts/get/front/all",
  get_all_post: "/user/posts/get/all",
  get_all_feed_post: "/user/posts/feed",
  create_post: "/user/posts",
  delete_post: "/user/posts",
  postComments: "/user/post/comments",
  postChildComment: "/user/post/comments/child",
  postCommentLike: "/user/post/comments/like",
  postchildCommentLike: "/user/post/comments/reply/like",
  like: "/user/posts/like",
  Post_AllComments: "/user/post/comments",
  single_post: "/user/posts/get",
  user_post: "/user/posts",
  save_post: "/user/posts/save",
  unsave_post: "/user/posts/unsave",
  get_save_posts: "/user/posts/get/save/posts",
  report_post: "/user/posts/report",
  mention_user_profile: "/user/post/comments/getuserprofile",
  story: "/story",
  story_viewed: "/story/viewed",
  get_front_all_story: "/story/get/front/all",
  story_like: "/story/like",
  story_comment: "/story/comment",
  event: "/event",
  trending_post: "/user/posts/trending-post",
  trending_movie: "/movie/trending",
  following: "/user/following",
  follow_status: "/user/follow/status",
  followers: "/user/follower",
  story_user: "/story/user",
  following_followers: "/user/following-followers",
  connection: "/friend",
  user_connection: "/friend/get-friend-status",
  connection_request: "/friend/request",
  suggested_connection: "/friend/suggestions",
  delete_friend: "/friend/delete/friend",
  friend_request_accept: "/friend/request/accept",
  friend_request_reject: "/friend/request/reject",
  follow: "/user/follow",
  vote: "/poll/vote",
  googleLogin: "/auth/google-login",
  resendMail: "/auth/resend-verification",
  all_bestPractices: "/best-practice/all",
  all_bestPractices_by_profession: "/best-practice/profession-wise",
  all_bestPractices_by_interest: "/best-practice/interest-wise",
  bp: "/best-practice",
  bp_recommended: "/best-practice/recommended",
  bp_related: "/best-practice/related",
  save_bestPractices: "/best-practice/get/save/best-practice",
  mine_bestPractices: "/best-practice/get-by-user-id",
  add_bestpractices: "/best-practice",
  like_bestpractices: "/best-practice/like",
  save_bestpractices: "/best-practice/save",
  get_savebestpractices: "/best-practice/get/save/best-practice",
  get_bestpractice_by_user_profile: "/best-practice/get-by-user-profile",
  //get_followbestpractices:"/best-practice/folow"
  create_bestpracticescomment: "/best-practice/comment",
  get_bestpracticescomment: "/best-practice/comment",
  bp_comment_like: "/best-practice/comment/like",
  bp_comment_reply: "/best-practice/comment/reply",
  bp_comment_reply_like: "/best-practice/comment/reply/like",
  singleBp: "/best-practice/get",
  followBp: "/best-practice/follow",
  getFollowBp: "/best-practice/get-by-follow",
  user_notification: "/notification",
  notification_count: "/notification/count",
  update_notification: "/notification/update-status",
  logout: "/auth/logout",
  gernerate_affiliate_code: "/profile/user/generate_referral_code",
  get_my_referrals: "/profile/user/getmyreferrals",
  get_my_referral_code: "/profile/user/getMyReferralCode",
  get_referral_amount: "/profile/user/getReferralAmount",
  affiliate_withdrawal_request: "/profile/user/affiliateWithdrawalRequest",
  subscription: "/subscription",
  get_badge: "/profile/get-user-badge",
  generate_sso_token: "/auth/generate-sso-token",
  profile_get_by_user_id: "/profile/get-user",
  user_posts_by_user_id: "/user/posts/get-user-post",


  // Messaging endpoints
  conversations: "/messaging/conversations",
  sendMessage: "/messaging/send",
  conversationMessages: "/messaging/conversations",

  // Topics endpoints
  get_topics: "/topics",
  select_topic: "/userselecttopics",
  by_topic_post: "/user/posts/topic",
  get_all_topics: "/topics/get/all",
  add_partner_inquiry: "/partner-inquiry",

  // payment-method endpoints
  payment_method: "/payment-method",

  add_mentor: "/mentor",
  check_mentor_or_partner: "/bussiness-hub/form-submited",

  //marketplace endpoints
  create_shop: "/seller-onboarding",
  update_shop: "/seller-onboarding/update",
  get_shop: "/seller-onboarding/profile",
  upload_seller_documents: "/seller-onboarding/upload",
  delete_seller_documents: "/seller-onboarding/remove",
  save_extra_banners: "/seller-onboarding/save-extra-banners",
  remove_extra_banners: "/seller-onboarding/remove/extra-banners",
  seller_sales_history: "/seller-sales/history",
  remove_specific_extra_banners: "/seller-onboarding/remove/extra-banners",
  remove_team_member_image: "/seller-onboarding/remove/team-member-image",
  remove_team_member: "/seller-onboarding/remove/team-member",
  get_products: "/vendor/products",
  get_seller_products: "/seller-onboarding/my-products",
  delete_seller_products: "/marketplace-product/product",
  get_wallet: "/seller-sales/wallet",
  get_withdrawal_history: "/seller-sales/withdrawals",
  submit_withdrawal: "/seller-sales/withdraw",
  update_bank_details: "/seller-sales/bank-details",

  // marketplace product endpoints
  get_categories: "/marketplace-product/product-categories",
  get_moods: "/marketplace-product/moods",
  get_preview_product: "/marketplace-product",
  expand_product_overview: "/marketplace-product/ai/expand-overview",
  improve_product_overview: "/marketplace-product/ai/improve-overview",
  generate_signed_url: "/marketplace-product/generate-signed-url",

  create_video_product: "/marketplace-product/video",
  update_video_product: "/marketplace-product",
  upload_product_thumbnail: "/marketplace-product/product/upload-thumbnail",
  upload_product_document: "/marketplace-product/upload",
  update_video: "/marketplace-product",


  create_music_product: "/marketplace-product/music",
  update_music_product: "/marketplace-product",
  update_music: "/marketplace-product/music",
  delete_music: "/marketplace-product/music",

  podcast_product: "/marketplace-product/podcast",
  ebook_product: "/marketplace-product/ebook",
  art_product: "/marketplace-product/art",
  course_product: "/marketplace-product/course",

  get_buyer_moods: "/marketplace-buyer/moods",
  get_buyer_categories: "/marketplace-buyer/categories",
  get_buyer_product_list: "/marketplace-buyer/products",
  get_buyer_filters: "/marketplace-buyer/filters",

  marketplace_wishlist: "/marketplace-buyer/wishlist",
  marketplace_cart: "/marketplace-buyer/cart",
  marketplace_seller_orders: "/seller-sales/orders",

  marketplace_shop_list: "/marketplace-buyer/shops",
  marketplace_followed_list: "/marketplace-buyer/my-followed-shops",

  // reviews apis
  marketplace_buyer_review: "/marketplace-buyer/reviews",
  marketplace_get_product_review: "/marketplace-buyer/products",

  // checkout apis
  marketplace_checkout: "/marketplace-buyer/checkout",
  marketplace_checkout_confirm: "/marketplace-buyer/checkout/confirm",
  marketplace_retry_payment: "/marketplace-buyer/retry-payment",
  marketplace_order_details: "/marketplace-buyer/orders",
  marketplace_order_details_by_order_id: "/marketplace-buyer/orders",
  marketplace_buyer_library: "/marketplace-buyer/library",

  // collections apis
  marketplace_collection_list: "/marketplace-buyer/collections",

  // progress apis
  marketplace_buyer_continue_watching: "/marketplace-buyer/progress/continue-watching",
  marketplace_buyer_progress: "/marketplace-buyer/progress",
  upload_art_sample_image :"/marketplace-product/upload/art-sample-image",
};

// Messaging endpoints
export const GetConversations = () => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, EndPoint.conversations);
};

export const GetConversationMessages = (conversationId: string | number) => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.conversationMessages}/${conversationId}/messages`
  );
};

export const HandleSendMessage = (formData: FormData) => {
  return executeAPI(ServerAPI.APIMethod.POST, formData, EndPoint.sendMessage);
};

export const GoogleLoginDetails = async (googleToken: string): ApiResponse => {
  const data = { token: googleToken };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.googleLogin);
};

export const ResendVerificationMail = async (mail: string): ApiResponse => {
  const data = { email: mail };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.resendMail);
};

export const LoginDetails = async (formData: LoginFormData): ApiResponse => {
  const data: Partial<LoginFormData> = {
    email: formData?.email,
    password: formData?.password,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.login);
};
export const RefreshTokenDetails = async (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.refreshToken);
};
export const MeDetails = async (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.me);
};
export const WalletDetails = async (page: number, limit: number): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  params["limit"] = limit;

  return executeAPI(ServerAPI.APIMethod.GET, {}, EndPoint.wallet, params);
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

export const GenerateAffiliateCode = (
  formData: GenerateAffiliateFromData
): ApiResponse => {
  const data: Partial<GenerateAffiliateFromData> = {
    user_id: formData?.user_id,
  };
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.gernerate_affiliate_code
  );
};

export const getReferredUsers = (
  formData: getReferredUsersFromData
): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    `${EndPoint.get_my_referrals}?referralcode=${formData.referralcode}`
  );
};

export const getMyRefferralCode = (
  formData: getMyRefferralCodeFromData
): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    `${EndPoint.get_my_referral_code}?user_id=${formData.user_id}`
  );
};

export const getReferralEarning = (
  formData: getReferralAmountFromData
): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    `${EndPoint.get_referral_amount}?user_id=${formData.user_id}`
  );
};

export const withdrawalAmount = (formData: {
  user_id: any;
  amount: number;
  country_code: string;
  phone: string;
}): ApiResponse => {
  const data: Partial<{
    user_id: any;
    amount: number;
    country_code: string;
    phone: string;
  }> = {
    user_id: formData?.user_id,
    amount: formData?.amount,
    country_code: formData?.country_code,
    phone: formData?.phone,
  };
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.affiliate_withdrawal_request
  );
};

export const generateSSOToken = (
  formData: getGenerateSSOTokenFromData
): ApiResponse => {
  const data: Partial<getGenerateSSOTokenFromData> = {
    token: formData.token,
  };
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.generate_sso_token
  );
};

export const getSubscriptionDetails = (): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.GET, null, EndPoint.subscription);
};
export const getUserBadgeDetails = (): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.GET, null, EndPoint.get_badge);
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
export const submitPersonReadinessDetails = (formData: any): ApiResponse => {
  const data: Partial<any> = {
    question: formData?.question,
  };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.person_readiness);
};
export const submitAnswerDetails = (formData: any): ApiResponse => {
  const data: Array<{
    question_id: string;
    answer: any;
    show_answer_in_public?: boolean;
  }> = [];

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
          answer: item.answer,
        });
      }
    });
  }

  // Handle bestPractice
  if (formData.bestPractice && formData.bestPractice.question_id) {
    data.push({
      question_id: formData.bestPractice.question_id,
      answer: formData.bestPractice.answer,
      show_answer_in_public: formData.bestPractice.showInPublic || false,
    });
  }

  // Handle referenceLink
  if (formData.referenceLink && formData.referenceLink?.question_id) {
    data.push({
      question_id: formData.referenceLink.question_id,
      answer: formData.referenceLink.url,
    });
  }

  // Handle uploads
  if (formData.uploads && Array.isArray(formData.uploads)) {
    formData.uploads.forEach((upload: any) => {
      if (upload) {
        data.push({
          question_id: upload.id,
          answer: upload.fileUrl || upload.file, // Use fileUrl if available, otherwise the file object
        });
      }
    });
  }
  

  // Return the formatted data
  return executeAPI(ServerAPI.APIMethod.POST, { data }, EndPoint.answer);
};
export const submitAssesmentAnswerDetails = (payload: any): ApiResponse => {

  return executeAPI(ServerAPI.APIMethod.POST, payload, EndPoint.answer);
};
export const removeUploadedFile = (payload: any): ApiResponse => {

  return executeAPI(ServerAPI.APIMethod.POST, payload, EndPoint.removeuploadedfile);
};

export const DashboardDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.dashboard);
};
export const OrgTypeDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.org_type);
};
export const QuestionDetails = (sectionId?: any): ApiResponse => {
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
export const GetAspiringQuestionDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.getAspiringQuestion);
};
export const GetCertificationDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.get_certification_details);
};
export const GetRetakeAssesment = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.get_retake_assensment);
};
export const GetAllPlanDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.allPlanData);
};
export const AddNomination = (formDataToSend: any): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.POST, formDataToSend, EndPoint.nomination_application);
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
export const removeProfileImage = (type: any): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["type"] = type;
  return executeAPI(ServerAPI.APIMethod.GET, null, EndPoint.profile_remove, params);
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
export const GetAspiringCompanies = (
  page: number,
  limit: number
): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  params["limit"] = limit;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.get_aspire_company,
    params
  );
};
export const GetAllBestPractices = (
  page: number,
  limit: number,
  professionId: string,
  interestId: string,
  searchText: string
): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  params["limit"] = limit;
  params["profession"] = professionId;
  params["interest"] = interestId;
  params["text"] = searchText;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.all_bestPractices,
    params
  );
};

export const GetAllBestPracticesByProfession = (
  page: number,
  limit: number,
  professionId: string,
  searchText: string
): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  params["limit"] = limit;
  params["profession"] = professionId;
  params["text"] = searchText;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.all_bestPractices_by_profession,
    params
  );
};
export const GetAllBestPracticesByInterest = (
  page: number,
  limit: number,
  interestId: string,
  searchText: string
): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  params["limit"] = limit;
  params["interest"] = interestId;
  params["text"] = searchText;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.all_bestPractices_by_interest,
    params
  );
};
export const DeleteBestPractices = (id: number): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.DELETE, {}, `${EndPoint.bp}/${id}`);
};
export const GetBestPracticesById = (id: number): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.GET, null, `${EndPoint.bp}/get/${id}`);
};
export const GetRecommendedBestPractices = (): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    `${EndPoint.bp_recommended}`
  );
};
export const GetRelatedBestPractices = (id: any): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["bp_id"] = id;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    `${EndPoint.bp_related}`,
    params
  );
};
export const UpdateBestPractice = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST, // or PATCH depending on your API
    formData,
    `${EndPoint.bp}/update`
  );
};
export const GetAllSavedBestPractices = (
  page: number,
  limit: number,
  professionId: string,
  searchText: string
): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  params["limit"] = limit;
  params["profession"] = professionId;
  params["text"] = searchText;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.save_bestPractices,
    params
  );
};
export const GetAllmineBestPractices = (
  page: number,
  limit: number,
  professionId: string,
  searchText: string
): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  params["limit"] = limit;
  params["profession"] = professionId;
  params["text"] = searchText;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.mine_bestPractices,
    params
  );
};
export const CreateBestPractice = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.add_bestpractices
  );
};

export const LikeBestpractices = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.like_bestpractices
  );
};
export const BPCommentLike = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.bp_comment_like
  );
};

export const SaveBestpractices = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.save_bestpractices
  );
};

export const GetSaveBestpractices = (): ApiResponse => {
  const data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.get_savebestpractices}`
  );
};

export const GetBestpracticesByUserProfile = (id: any): ApiResponse => {
  const data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.get_bestpractice_by_user_profile}/${id}`
  );
};

export const CreateBestpracticesComment = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.create_bestpracticescomment
  );
};
export const CreateBestpracticesCommentReply = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.bp_comment_reply
  );
};
export const CreateBestpracticesCommentReplyLike = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.bp_comment_reply_like
  );
};

export const GetBestpracticesComment = (params: {
  post_id: string;
}): ApiResponse => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${EndPoint.get_bestpracticescomment}?${queryString}`;
  return executeAPI(ServerAPI.APIMethod.GET, null, url);
};

export const GetSingleBestPractice = (id: any): ApiResponse => {
  const data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.singleBp}/${id}`
  );
};
export const SendBpFollowRequest = (payload: any) => {
  return executeAPI(ServerAPI.APIMethod.POST, payload, EndPoint.followBp);
};

export const GetFollowBestpractices = (): ApiResponse => {
  const data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.getFollowBp}`
  );
};

export const GetUserNotification = (): ApiResponse => {
  const data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.user_notification}`
  );
};
export const GetUserNotificationCount = (): ApiResponse => {
  const data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.notification_count}`
  );
};
export const MarkNotificationAsRead = (
  notificationId: string,
  status: any
): ApiResponse => {
  const data: Partial<any> = {
    id: notificationId,
    status: status,
  };
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    `${EndPoint.update_notification}`
  );
};
export const GetProfileDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.profile);
};
export const GetProfileDetailsById = (id: any): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, `${EndPoint.profile}/${id}`);
};
export const GetPublicProfileDetailsById = (id: any): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, `${EndPoint.public_profile}/${id}`);
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
export const GetBadgeListDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.badge_list);
};
export const GetProfessionalDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.profession);
};
export const GetValidProfessionalDetails = (): ApiResponse => {
  const data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.valid_profession);
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
  return executeAPI(ServerAPI.APIMethod.POST, payload, `${EndPoint.rating}`);
};
export const GetUserRating = (payload: any): ApiResponse => {
  let params: { [key: string]: any } = {};
  params["profile_id"] = payload.profile_id;
  params["user_type"] = payload.user_type;
  return executeAPI(ServerAPI.APIMethod.GET, payload, EndPoint.rating, params);
};
export const GetUserScoreResult = (): ApiResponse => {
  const data: Partial<any> = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.score_result);
};
export const GetUsersearchProfileDetails = (
  selectedDomain: any,
  searchQuery: any,
  page: any,
  limit: any,
  selectedCert: string,
  _sort: string
): ApiResponse => {
  const data: Partial<any> = {
    profession: selectedDomain,
    text: searchQuery,
    page_no: page,
    limit: limit,
    badge: selectedCert,
  };
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.directory_search_profile
  );
};

// Social APIS
export const GetPostsDetails = (page: any) => {
  let data = {};
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.get_front_all_post,
    params
  );
};
export const GetAllStory = () => {
  let data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.get_front_all_story
  );
};
export const PostsDetails = (page: any) => {
  let data = {};
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.get_all_post,
    params
  );
};

export const FeedPostsDetails = (page: any) => {
  let data = {};
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.get_all_feed_post,
    params
  );
};

export const AddPost = (formData: any): ApiResponse => {
  // console.log('POST FORMDATA----->', Object.fromEntries(formData.entries()));
  return executeAPI(ServerAPI.APIMethod.POST, formData, EndPoint.create_post);
};

export const DeleteUserPost = (id: string): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.delete_post}/${id}`
  );
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
export const GetChildComments = (id: any) => {
  let data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.postChildComment}/${id}`
  );
};
export const PostCommentLike = (formattedData: any) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formattedData,
    EndPoint.postCommentLike
  );
};
export const PostChildCommentLike = (formattedData: any) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formattedData,
    EndPoint.postchildCommentLike
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
export const getMentionUserProfile = (id: any) => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, `${EndPoint.mention_user_profile}?comment_id=${id}`);
}
export const GetStory = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.story);
};
export const PostStoryViewd = (story_id: any) => {
  let data = { story_id };
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.story_viewed);
};
export const GetUserPost = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.user_post);
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
export const GetTrendingPost = (
  tag: string,
  tab: string | null = null,
  page: any
) => {
  let data = {};
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  params["tag"] = tag;

  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `/user/posts/${tab ? tab : "trending"}`,
    params
  );
};

export const GetAllTrendingPost = (page: any) => {
  let data = {};
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.trending_post,
    params
  );
};

export const GetTrendingMovie = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.trending_movie);
};
export const GetFollowingUser = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.following);
};
export const GetFollowerUser = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.followers);
};
export const GetUserReel = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.story_user);
};
export const GetFollowingFollowerUsers = () => {
  let data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.following_followers
  );
};
export const GetConnectionUser = (search?: string) => {
  let data = {};
  let params: { [key: string]: any } = {};
  params["search"] = search;

  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.connection, params);
};
export const SendConnectionRequest = (formattedData: any) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formattedData,
    EndPoint.connection_request
  );
};
export const UnFriend = (formattedData: any) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formattedData,
    EndPoint.delete_friend
  );
};
export const GetFriendRequest = (search?: string) => {
  let data = {};
  let params: { [key: string]: any } = {};
  params["search"] = search;
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.connection_request, params);
};
export const GetSuggestedFriend = (search?: string) => {
  let data = {};
  let params: { [key: string]: any } = {};
  params["search"] = search;
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.suggested_connection, params);
};
export const GetFriendSuggestions = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.suggested_connection);
};
export const AcceptFriendRequest = (formattedData: any) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formattedData,
    EndPoint.friend_request_accept
  );
};

export const RejectFriendRequest = (formattedData: any) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formattedData,
    EndPoint.friend_request_reject
  );
};
export const GetProfileByUserId = (userId: string) => {
  let data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.profile_get_by_user_id}/${userId}`
  );
};

export const GetFollowStatus = (userId: string) => {
  let data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.follow_status}/${userId}`
  );
};

export const GetUserPostsByUserId = (userId: string, page: number = 1) => {
  let data = {};
  let params: { [key: string]: any } = {};
  params["page_no"] = page;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.user_posts_by_user_id}/${userId}`,
    params
  );
};

export const GetFollowingFollowersByUserId = (userId: string) => {
  let data = {};
  let params: { [key: string]: any } = {};
  params["user_id"] = userId;
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    EndPoint.following_followers,
    params
  );
};

export const SendFriendRequest = (formattedData: any) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formattedData,
    EndPoint.connection_request
  );
};

export const GetFriendStatus = (userId: string) => {
  const data = {};
  return executeAPI(
    ServerAPI.APIMethod.GET,
    data,
    `${EndPoint.user_connection}/${userId}`
  );
};

export const SendFollowRequest = (formattedData: any) => {
  return executeAPI(ServerAPI.APIMethod.POST, formattedData, EndPoint.follow);
};
export const AddVote = (formattedData: any) => {
  return executeAPI(ServerAPI.APIMethod.POST, formattedData, EndPoint.vote);
};

export const SavePost = (postId: string) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    { post_id: postId },
    EndPoint.save_post
  );
};

export const UnsavePost = (postId: string) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    { post_id: postId },
    EndPoint.unsave_post
  );
};

export const GetSavedPosts = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.get_save_posts);
};

export const ReportPost = (postId: string, reason: string) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    { post_id: postId, reason: reason },
    EndPoint.report_post
  );
};

export const getTopics = (): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.GET, null, EndPoint.get_topics);
};

export const getAllTopics = (): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.GET, null, EndPoint.get_all_topics);
};

export const UserSelectedTopic = (
  id: string,
  payload: { topicIds: string[] }
): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    payload,
    `${EndPoint.select_topic}/${id}/topics`
  );
};

export const getUserSelectedTopic = (id: string): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    `${EndPoint.select_topic}/${id}/topics`
  );
};

export const updateUserSelectedTopic = (
  id: string,
  payload: { topicIds: string[] }
): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.PUT,
    payload,
    `${EndPoint.select_topic}/${id}/topics`
  );
};

export const getPostByTopicId = (
  id: string,
  page_no: number = 1,
  limit: number = 10
): ApiResponse => {
  const params: { [key: string]: any } = {
    page_no,
    limit,
  };
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    `${EndPoint.by_topic_post}/${id}`,
    params
  );
};

export const addPaymentMethod = (payload: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    payload,
    EndPoint.payment_method
  );
};

export const getPaymentMethods = (): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.GET, null, EndPoint.payment_method);
};

export const getPaymentMethodById = (
  id: string,
): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    `${EndPoint.payment_method}/${id}`
  );
};

export const updatePaymentMethod = (
  id: string,
  payload: any
): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.PUT,
    payload,
    `${EndPoint.payment_method}/${id}`
  );
};

export const DeletePaymentMethod = (id: any): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.DELETE, {}, `${EndPoint.payment_method}/${id}`);
};

export const createPartnerInquiry = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.add_partner_inquiry
  );
};
export const createMentor = (formData: any): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.POST, formData, EndPoint.add_mentor);
};
export const isMentorOrPartner = (): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, EndPoint.check_mentor_or_partner);
};

export const LogOut = () => {
  let data = {};
  return executeAPI(ServerAPI.APIMethod.GET, data, EndPoint.logout);
};

export const getFriendsForTagging = (
  params: FriendSuggestionData
): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    null,
    EndPoint.postComments + "/friends-for-tagging",
    params
  );
};

export const GetProducts = () => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, EndPoint.get_products);
};

export const GetSellerProducts = (page: number = 1, limit: number = 10): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.get_seller_products}?page=${page}&limit=${limit}`
  );
};

export const CreateSellerShop = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.create_shop
  );
};

export const UpdateSellerShop = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.PATCH,
    data,
    EndPoint.update_shop
  );
};

export const GetSellerShop = () => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, EndPoint.get_shop);
};

export const UploadSellerDocument = (fileType: string, formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    `${EndPoint.upload_seller_documents}/${fileType}`
  );
};

export const RemoveSellerDocument = (fileType: string): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.delete_seller_documents}/${fileType}`
  );
};

export const RemoveSpecificExtraBanner = (id: any): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.remove_specific_extra_banners}/${id}`
  );
};

export const RemoveAllExtraBanner = (): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.DELETE,
    {},
    EndPoint.remove_extra_banners
  );
};

export const RemoveTeamMemberImage = (id: any): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.remove_team_member_image}/${id}`
  );
};

export const RemoveTeamMember = (id: any): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.remove_team_member}/${id}`
  );
};

export const SaveExtraBanners = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.save_extra_banners
  );
};

export const GetMarketPlaceCategories = () => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, EndPoint.get_categories);
};

export const GetMarketPlaceMoods = () => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, EndPoint.get_moods);
};

export const GetPreviewProduct = (category: any, id: any) => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, `${EndPoint.get_preview_product}/${category}/${id}`);
};

export const ExpandProductOverview = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.expand_product_overview
  );
};

export const ImproveProductOverview = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.improve_product_overview
  );
};

export const GenerateSignedUrl = (fileType: string, data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    `${EndPoint.generate_signed_url}?resource_type=${fileType}`
  );
};

export const CreateVideoProduct = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.create_video_product
  );
};

export const GetSellerOrders = (): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    EndPoint.marketplace_seller_orders
  );
};

export const UpdateVideoProduct = (data: any, id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.PATCH,
    data,
    `${EndPoint.update_video_product}/${id}`
  );
};

export const UpdateProductStatus = (data: any, id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.PATCH,
    data,
    `${EndPoint.update_video_product}/${id}/status`
  );
};

export const UploadProductThumbnail = (formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.upload_product_thumbnail
  );
};

export const UploadProductDocument = (fileType: string, formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    `${EndPoint.upload_product_document}/${fileType}`
  );
};

export const UpdateVideo = (pid: any, fileType: string, formData: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    `${EndPoint.update_video}/${pid}/${fileType}`
  );
};

export const CreateMusicProduct = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.create_music_product
  );
};

export const UpdateMusicProduct = (data: any, id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.PATCH,
    data,
    `${EndPoint.update_music_product}/music/${id}`
  );
};

export const UpdateMusic = (pid: any, fileType: string, data: any, tid: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    `${EndPoint.update_music}/${pid}/${fileType}/${tid}`
  );
};

export const DeleteMusicTrack = (pid: any, tid: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.delete_music}/${pid}/tracks/${tid}`
  );
};

export const CreatePodcastProduct = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.podcast_product
  );
};

export const UpdatePodcastProduct = (data: any, id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.PATCH,
    data,
    `${EndPoint.update_music_product}/podcast/${id}`
  );
};

export const DeletPodcastEpisode = (pid: any, cid: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.podcast_product}/${pid}/episodes/${cid}`
  );
};

export const CreateEbookProduct = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.ebook_product
  );
};

export const UpdateEbookProduct = (data: any, id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.PATCH,
    data,
    `${EndPoint.ebook_product}/${id}`
  );
};

export const DeleteEbookChapter = (pid: any, cid: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.ebook_product}/${pid}/chapters/${cid}`
  );
};

export const CreateArtProduct = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.art_product
  );
};

export const UpdateArtProduct = (data: any, id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.PATCH,
    data,
    `${EndPoint.art_product}/${id}`
  );
};

export const DeleteArtChapter = (pid: any, cid: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.art_product}/${pid}/chapters/${cid}`
  );
};

export const CreateCourseProduct = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.course_product
  );
};

export const UpdateCourseProduct = (data: any, id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.PATCH,
    data,
    `${EndPoint.course_product}/${id}`
  );
};

export const DeleteCourseChapter = (pid: any, cid: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.course_product}/${pid}/chapters/${cid}`
  );
};

export const DeleteSellerProduct = (id: any) => {
  return executeAPI(ServerAPI.APIMethod.DELETE, {}, `${EndPoint.delete_seller_products}/${id}`);
};

export const get_wallet = () => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    EndPoint.get_wallet
  );
};

export const get_withdrawal_history = () => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    EndPoint.get_withdrawal_history
  );
};

export const submit_withdrawal = (payload: { amount: number }) => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    payload,
    EndPoint.submit_withdrawal
  );
};

export const update_bank_details = (payload: {
  bank_name: string;
  account_number: string;
  swift_code: string;
  account_type: string;
}) => {
  return executeAPI(
    ServerAPI.APIMethod.PUT,
    payload,
    EndPoint.update_bank_details
  );
};


export const GetMarketPlaceBuyerMoods = () => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, EndPoint.get_buyer_moods);
};

export const GetMarketPlaceBuyerCategories = () => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, EndPoint.get_buyer_categories);
};

export const GetMarketPlaceBuyerProducts = (params?: {
  mood_slug?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: string;
  category_slug?: string;
  language?: string;
  page?: number;
  limit?: number;
}): ApiResponse => {
  const queryParams = new URLSearchParams();

  if (params?.mood_slug) queryParams.append('mood_slug', params.mood_slug);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.min_price) queryParams.append('min_price', params.min_price.toString());
  if (params?.max_price) queryParams.append('max_price', params.max_price.toString());
  if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
  if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
  if (params?.category_slug) queryParams.append('category_slug', params.category_slug);
  if (params?.language) queryParams.append('language', params.language);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `${EndPoint.get_buyer_product_list}?${queryString}`
    : EndPoint.get_buyer_product_list;

  return executeAPI(ServerAPI.APIMethod.GET, {}, endpoint);
};

export const GetMarketPlaceBuyerProductById = (id: any) => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, `${EndPoint.get_buyer_product_list}/${id}`);
};

export const GetMarketPlaceBuyerFilters = () => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, EndPoint.get_buyer_filters);
};

export const AddProductToWishlist = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.marketplace_wishlist
  );
};

export const GetProductWishlist = (params?: {
  search?: string;
  min_price?: number;
  max_price?: number;
  language?: string;
  min_duration?: string;
  max_duration?: string;
  min_rating?: number;
  sort_by?: string;
  page?: number;
  limit?: number;
  category_slug?: string;
}): ApiResponse => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
  if (params?.language) queryParams.append('language', params.language);
  if (params?.min_duration) queryParams.append('min_duration', params.min_duration);
  if (params?.max_duration) queryParams.append('max_duration', params.max_duration);
  if (params?.min_rating) queryParams.append('min_rating', params.min_rating.toString());
  if (params?.min_price) queryParams.append('min_price', params.min_price.toString());
  if (params?.max_price) queryParams.append('max_price', params.max_price.toString());
  if (params?.category_slug) queryParams.append('category_slug', params.category_slug);

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `${EndPoint.marketplace_wishlist}?${queryString}`
    : EndPoint.marketplace_wishlist;

  return executeAPI(ServerAPI.APIMethod.GET, {}, endpoint);
};

export const RemoveProductToWishlist = (id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.marketplace_wishlist}/${id}`
  );
};

export const EmptyProductWishlist = (): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    EndPoint.marketplace_wishlist
  );
};

export const AddProductToCart = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.marketplace_cart
  );
};

export const GetProductCart = () => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, EndPoint.marketplace_cart);
};
export const GetOrderDetailsByOrdId = (order_id:string,pid:string) => {
  if(!pid){
    return executeAPI(ServerAPI.APIMethod.GET, {}, `${EndPoint.marketplace_order_details}/${order_id}`);
  }
  return executeAPI(ServerAPI.APIMethod.GET, {}, `${EndPoint.marketplace_order_details}/${order_id}?product_id=${pid}`);
};

export const RemoveProductToCart = (id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.marketplace_cart}/${id}`
  );
};

export const EmptyProductCart = (): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    EndPoint.marketplace_cart
  );
};

export const GetMarketPlaceShops = (params?: {
  search?: string;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
}): ApiResponse => {
  const queryParams = new URLSearchParams();

  if (params?.search) queryParams.append('search', params.search);
  if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
  if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `${EndPoint.marketplace_shop_list}?${queryString}`
    : EndPoint.marketplace_shop_list;

  return executeAPI(ServerAPI.APIMethod.GET, {}, endpoint);
};

export const GetMarketPlaceShopById = (id: any) => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, `${EndPoint.marketplace_shop_list}/${id}`);
};

export const FollowUnfollowMarketPlaceShop = (id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    {},
    `${EndPoint.marketplace_shop_list}/${id}/follow`
  );
};

export const GetFollowedMarketPlaceShop = (): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    EndPoint.marketplace_followed_list
  );
};

export const CheckMarketPlaceShopFollowStatus = (id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.marketplace_shop_list}/${id}/follow-status`
  );
};

export const GetMarketPlaceShopFollowCount = (id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.marketplace_shop_list}/${id}/follower-count`
  );
};

export const CreateBuyerReview = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.marketplace_buyer_review
  );
};

export const GetBuyerReviewByProductId = (productId: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.marketplace_get_product_review}/${productId}/my-review`
  );
}

export const UpdateBuyerReview = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.PUT,
    data,
    EndPoint.marketplace_buyer_review
  );
};

export const DeleteBuyerReview = (id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.marketplace_buyer_review}/${id}`
  );
};

export const BuyerCanReview = (id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.marketplace_get_product_review}/${id}/can-review`
  );
};

export const BuyerOwnReview = (id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.marketplace_get_product_review}/${id}/my-review`
  );
};

export const GetProductReviws = (
  productId: string,
  params?: {
    page?: number;
    limit?: number;
  }
): ApiResponse => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `${EndPoint.marketplace_get_product_review}/${productId}/reviews?${queryString}`
    : `${EndPoint.marketplace_get_product_review}/${productId}/reviews`;

  return executeAPI(ServerAPI.APIMethod.GET, {}, endpoint);
};

export const CreateCheckoutSession = (appliedDonation:number) => {
  return executeAPI(ServerAPI.APIMethod.POST, {donation_amount:appliedDonation}, EndPoint.marketplace_checkout);
};

export const GetCheckoutDetails = (): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.GET, {}, EndPoint.marketplace_checkout);
};

export const ConfirmPayment = (session_id: string): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.marketplace_checkout_confirm}?session_id=${session_id}`
  );
};

export const RetryPayment = (data: { order_id: string }): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.POST, data, EndPoint.marketplace_retry_payment);
};

export const GetLibraryrFilters = (): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.marketplace_buyer_library}/filters/options`);
}


export const UploadArtSampleImage = (formData: FormData): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    formData,
    EndPoint.upload_art_sample_image
  );
};

export const GetLibraryrDetails = (params?: {
  page?: number;
  limit?: number;
  category_slug?: string;
  sort_by?: string;
}): ApiResponse => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.category_slug) queryParams.append("category_slug", params.category_slug.toString());
  if (params?.sort_by) queryParams.append("sort_by", params.sort_by.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `${EndPoint.marketplace_buyer_library}?${queryString}`
    : `${EndPoint.marketplace_buyer_library}`;

  return executeAPI(ServerAPI.APIMethod.GET, {}, endpoint);
}

export const GetLibraryrDetailsById = (id: any): ApiResponse => {
  return executeAPI(ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.marketplace_buyer_library}/${id}`);
}

export const CreateCollectionList = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    EndPoint.marketplace_collection_list
  );
}

export const GetCollectionList = (): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    EndPoint.marketplace_collection_list
  );
}

export const GetCollectionListById = (id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.marketplace_collection_list}/${id}`
  );
}

export const UpdateCollectionList = (id: any, data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.PUT,
    data,
    `${EndPoint.marketplace_collection_list}/${id}`
  );
}

export const DeleteCollectionList = (id: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.marketplace_collection_list}/${id}`
  );
}

export const AddProductToCollection = (cid: any, data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    `${EndPoint.marketplace_collection_list}/${cid}/products`
  );
}

export const RemoveProductToCollection = (cid: any, pid: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.DELETE,
    {},
    `${EndPoint.marketplace_collection_list}/${cid}/products/${pid}`
  );
}

export const GetContinueWatchingProductList = (): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    EndPoint.marketplace_buyer_continue_watching
  );
}
export const GetContinueWatchingProductById = (pid: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.marketplace_buyer_progress}/product/${pid}`
  );
}
export const TrackProgressProduct = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    `${EndPoint.marketplace_buyer_progress}/track`
  );
}
export const MarkAsComplete = (data: any): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.POST,
    data,
    `${EndPoint.marketplace_buyer_progress}/complete`
  );
}

export const GetOrderDetails = (): ApiResponse => {
  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    EndPoint.marketplace_order_details
  );
}

export const GetSellerSalesHistory = (
  params: {
    customer?: string;
    orderId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}
) => {
  const searchParams = new URLSearchParams();
  if (params.customer) searchParams.append('customer_name', params.customer);
  if (params.orderId) searchParams.append('order_id', params.orderId);
  if (params.startDate) searchParams.append('start_date', params.startDate);
  if (params.endDate) searchParams.append('end_date', params.endDate);
  searchParams.append('page', params.page?.toString() || '1');
  searchParams.append('limit', params.limit?.toString() || '10');

  return executeAPI(
    ServerAPI.APIMethod.GET,
    {},
    `${EndPoint.seller_sales_history}?${searchParams.toString()}`
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
    const isFormData = data instanceof FormData;
    const requestId = uuidv4();
    // const requestId = localStorage.getItem("requestId");
    const appCatId = localStorage.getItem("appCatId");
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token || ""}`,
    };

    if (requestId) {
      headers["x-request-id"] = requestId;
    }
    if (appCatId) {
      headers["x-app-cat-id"] = appCatId;
    }
    const response: AxiosResponse<T> = await axios({
      method: method,
      url: API.BaseUrl + endpoint,
      data: data,
      params: params,
      headers,
      ...(API.BaseUrl.trim().toLowerCase().startsWith("https://") && {
        withCredentials: true,
      }),
    });
    const requestIdres = response.headers["x-request-id"];
    if (requestIdres) {
      localStorage.setItem("requestId", requestIdres);
    }
    const appCatIdres = response.headers["x-app-cat-id"];
    if (appCatIdres) {
      localStorage.setItem("appCatId", appCatIdres);
    }

    // const access_token = response.headers["access_token"];

    // if (access_token != "not-provide") {
    //   console.log("access token response check sets", true);
    //   localStorage.setItem("jwt", access_token);
    // }

    return response.data;
  } catch (error: any) {

    // if (error.response?.data?.error?.statusCode == 401) {
    //   localStorage.clear();
    //   window.location.href = "/";
    // }

    throw error;
  }
};