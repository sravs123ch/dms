export const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// export const LOGIN = '${BASE_URL}/auth/login';
export const LOGIN = `${BASE_URL}/auth/login`;
export const UpdatePassword =`${BASE_URL}/auth/updatePassword`;
export const ForgotPassword =`${BASE_URL}/auth/forgotPassword`;

export const createTenantSettings=`${BASE_URL}/admin/createTenantSettings`;
export const updateTenantSettings=`${BASE_URL}/admin/updateTenantSettings`;
export const getTenantSettings=`${BASE_URL}/admin/getTenantSettings`;

export const CREATEORUPDATE_USERS_API = `${BASE_URL}/admin/createOrUpdateUser`;
export const GETALLUSERS_API = `${BASE_URL}/admin/getAllUsers`;
export const GETALLUSERSBYID_API = `${BASE_URL}/admin/getUserById`;
export const DELETEUSERSBYID_API = `${BASE_URL}/admin/deleteUser`;

export const CREATEORUPDATE_CUSTOMERS_API = `${BASE_URL}/customers/createOrUpdateCustomer`;
export const CREATEORUPDATE_CUSTOMERS_ADDRESS_API = `${BASE_URL}/customers/createOrUpdateAddress`;
export const GETALLCUSTOMERS_API = `${BASE_URL}/customers/getAllCustomers`;
export const GETALLCUSTOMERSBYID_API = `${BASE_URL}/customers/getCustomerById`;
export const DELETECUSTOMERSBYID_API = `${BASE_URL}/customers/deleteCustomer`;
export const ORDERBYCUSTOMERID_API = `${BASE_URL}/customers/getOrderByCustomerId`;
export const CUSTOMERID_API = `${BASE_URL}/customers/getCustomerByIdWithoutAddress`;
export const ADDRESS_API = `${BASE_URL}/address/getAddressesByCustomerId`;

export const CREATEORUPDATE_STORES_API = `${BASE_URL}/stores/createOrUpdatestore`;
export const GETALLSTORES_API = `${BASE_URL}/stores/getAllStores`;
export const GETALLSTORESBYID_API = `${BASE_URL}/stores/getstoreById`;
export const DELETESTORESSBYID_API = `${BASE_URL}/stores/deletestore`;
export const STOREUSERSBYSTORE_ID_API = `${BASE_URL}/mapstoreusers/mapstoreuser`;
export const GETALLSTOREUSERSBYSTORE_ID_API = `${BASE_URL}/mapstoreusers/getallmapstoreuser`;

export const CREATEORUPDATE_ROLES_API = `${BASE_URL}/admin/createOrUpdateRole`;
export const GETALLROLESS_API = `${BASE_URL}/admin/getAllRoles`;
export const GETALLROLESBYID_API = `${BASE_URL}/admin/getRoleById`;
export const DELETEROLESBYID_API = `${BASE_URL}/admin/deleteRole`;

export const GetAllReference=`${BASE_URL}/admin/getAllData`;
export const createParentOrChindreference=`${BASE_URL}/admin/createParentOrChindreference`;
export const PostSubReference=`${BASE_URL}/admin/sub-reference`;
export const GetReferenceById=`${BASE_URL}/admin/getByIdReferences`;
export const updateParentOrChindreference=`${BASE_URL}/admin/reference`;
export const GetAllParentReference=`${BASE_URL}/admin/parents`;

export const DeleteReference=`${BASE_URL}/admin/reference`;

export const getProjects=`${BASE_URL}/admin/listProjectTypes`;
export const createProject=`${BASE_URL}/admin/addProjectType`;
export const updateProject=`${BASE_URL}/admin/updateProjectType`;
export const deleteProjectType=`${BASE_URL}/admin/deleteProjectType`;
export const getProjectTypeById=`${BASE_URL}/admin/getProjectTypeById`;

export const ADD_DOCUMENT_API=`${BASE_URL}/doc/createDocument`;
export const UPDATE_DOCUMENT_API=`${BASE_URL}/doc/updateDocument`;
export const GET_DOCUMENT_API=`${BASE_URL}/doc/getDocumentById`;
export const FETCH_PERMISSION_URL = `${BASE_URL}/admin/getAllPermissions`;

export const FETCH_PERMISSION_URL_BY_ROLEID = `${BASE_URL}/admin/getAllPermissionsByRoleId`;

export const CREATE_OR_UPDATE_ROLE_URL = `${BASE_URL}/admin/createOrUpdateRolePermissions`;
export const COUNTRIES_API = `${BASE_URL}/admin/getCountries`;


export const DELETE_CUSTOMERS_ADDRESS_API = `${BASE_URL}/customers/deleteAddress`;

export const CREATE_ORDERS = `${BASE_URL}/orders/createOrder`;
export const UPDATE_ORDERS = `${BASE_URL}/orders/updateOrder`;

export const GET_ALL_ORDERS = `${BASE_URL}/orders/getAllOrders`;
export const SEARCH_CUSTOMERS = `${BASE_URL}/customers/getCustomerById`;

export const CITIES_API = `${BASE_URL}/cities/getCitiesByState?$filter=StateID eq`;
export const STATES_API = `${BASE_URL}/cities/getStatesByCountry?$filter=CountryID eq`;


export const GETORDERBYID_API = `${BASE_URL}/orders/getOrderById`;

export const CREATEORUPDATE_ORDER_HISTORY__API = `${BASE_URL}/orderhistory/order-histories/createorderhistory`;

export const CREATEORUPDATE_PAYMENT_API = `${BASE_URL}/payments/payments/createOrUpdatePayment`;
export const GETPAYMENTSBY_PAYMETID_API = `${BASE_URL}/payments/payments`;
export const GET_ALL_PAYMENTS_API = `${BASE_URL}/payments/GetAllPayments`;
export const CREATEORUPDATE_PAYMENTS_API = `${BASE_URL}payments/createOrUpdatePayment`;
export const GET_PAYMENTSBY_ORDERID_API = `${BASE_URL}/payments/payment`;

export const CREATEORUPDATE_MAPSTOREUSER = `${BASE_URL}/mapstoreusers/mapstoreuser`;
export const GET_MAPSTOREUSERBY_USERID = `${BASE_URL}/mapstoreusers//mapstoreuserbyUserID`;
export const GET_MAPSTORE_USERBYSTOREID = `${BASE_URL}/mapstoreusers/mapstoreuser`;
export const DELETEMAPSTOREUSER = `${BASE_URL}/mapstoreusers/deleteMapStoreUser`;
export const GET_ALL_HYSTORYID_API = `${BASE_URL}/orderhistory/order-history/`;

export const ORDER_STATUS_API = `${BASE_URL}/Orderstatus/getAllOrderStatus`;
export const PAYMENT_REPORT_API = `${BASE_URL}/reports/getPaymentReport`;
export const CUSTOMER_REPORT_API = `${BASE_URL}/reports/getCustomerReport`;
export const GET_INVENTORY_FILE_API = (fileID) =>
  `${BASE_URL}/InventoryFile/uploadDownloadInventoryFile/${fileID}`;
export const GET_INVENTORY_FILE_UPL_API = `${BASE_URL}/InventoryFile/uploadDownloadInventoryFile`;
export const GET_ORDER_REPORT = `${BASE_URL}/reports/getOrderReport`;


export const GET_TASKS = `${BASE_URL}/orderhistory/getusertasks`;

export const GET_SALES_AND_PAYMENT_REPORT_BY_MONTH = `${BASE_URL}/Dashboard/getSalesAndPaymentReportByMonth
`;
export const GET_OVERALL_DATA_FOR_DASHBOARD = `${BASE_URL}/Dashboard/getOverAllDataForDashboard`;
export const  UPDATESUBORDERSTATUSAPI  = `${BASE_URL}/orders/updateSubOrderStatus`;
export const getAllFeedbacksAPI=`${BASE_URL}/Feedback/GetAllFeedBacks`;
export const getOrderByIdAPI=`${BASE_URL}/orders/createOrderOrUpdate`;


export const emailForProduction=`${BASE_URL}/orders/triggerAdvanceMeasurementPaymentEmail`;


export const getTasksForUser=`${BASE_URL}/orderhistory/getTasksForUser`;

export const TaskStatusUpdate=`${BASE_URL}/orderhistory/updateProgressStatus`;


export const ChatBox=`${BASE_URL}/auth/chat`;

export const VerifyOTP =`${BASE_URL}/users/validateOtp`;

export const ResetPassword =`${BASE_URL}/users/validateOtpAndUpdatePassword`;

export const HolidaysList=`${BASE_URL}/holidayCalender/listHolidays`;


export const TRIGGER_MAIL=`${BASE_URL}/orders/schedulePreDeliveryNotifications`;


export const GetAllChildrenByParentId=`${BASE_URL}/referenceRoutes/getChildrenByParentId`;


export const emailForBalancePayment=`${BASE_URL}/orderhistory/checkPaymentStatusAndSendEmail`;


export const CreateEnquirydepartment=`${BASE_URL}/enquirydepartment/CreateEnquirydepartment`;
export const UpdateEnquirydepartment=`${BASE_URL}/enquirydepartment/UpdateEnquirydepartment`;
export const GetAllEnquirydepartment=`${BASE_URL}/enquirydepartment/getAllEnquirydepartment`;
export const GetbyidEnquirydepartment=`${BASE_URL}/enquirydepartment/getbyidEnquirydepartment`;
export const GetEnquirydepartmentbyCustomer=`${BASE_URL}/enquirydepartment/getEnquirydepartmentbyCustomer`;

export const DashboardOrderStatus=`${BASE_URL}/orders/order-status-counts`;

export const CustomerStatusCount=`${BASE_URL}/customers/customer-status-counts`;
export const SendEmailToUser=`${BASE_URL}/enquirydepartment/send-email-to-user`;