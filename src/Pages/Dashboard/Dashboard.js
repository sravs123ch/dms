import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { FaFileSignature, FaFileAlt, FaFilePdf } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import {
  BsFileEarmarkCheck,
  BsArrowUpRight,
  BsArrowDownRight,
} from "react-icons/bs";
import { AiOutlineFileDone } from "react-icons/ai";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  GET_OVERALL_DATA_FOR_DASHBOARD,
  TRIGGER_MAIL,
  DashboardOrderStatus,
  CustomerStatusCount,
} from "../../Constants/apiRoutes";
import Datepicker from "react-tailwindcss-datepicker";
import { GET_SALES_AND_PAYMENT_REPORT_BY_MONTH } from "../../Constants/apiRoutes";
import axios from "axios";
import "chart.js/auto";
import LoadingAnimation from "../../Components/Loading/LoadingAnimation";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

Chart.register(...registerables);

const Dashboard = () => {
  const lineChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  // State to hold the API data
  const [salesAndPaymentData, setSalesAndPaymentData] = useState([]);
  const [overallData, setOverallData] = useState({});
  const [loading, setLoading] = useState(true);

  const [storeNames, setStoreNames] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [isStoreDataLoading, setIsStoreDataLoading] = useState(true);
  const [orderStatusData, setOrderStatusData] = useState({});
  const [customerStatusData, setCustomerStatusData] = useState({});
  const navigate = useNavigate();

  const tenantID = localStorage.getItem("TenantID");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const statusOptions = [
    { id: "all", name: "Select Status" },
    { id: "approved", name: "Approved" },
    { id: "pending", name: "Pending" },
    { id: "rejected", name: "Rejected" },
  ];

  useEffect(() => {
    const loadStoreData = () => {
      const storedData = localStorage.getItem("storesData");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setStoreNames(parsedData);
          setIsStoreDataLoading(false);

          // Automatically set selectedStore if there's only one store
          if (parsedData.length === 1) {
            setSelectedStore(parsedData[0]); // Set to the first store
          }
        } catch (error) {
          console.error("Error parsing store data:", error);
          setIsStoreDataLoading(false);
        }
      } else {
        setIsStoreDataLoading(false);
      }
    };

    loadStoreData();

    // Listen for the storeDataReady event
    const handleStoreDataReady = () => {
      loadStoreData();
    };

    window.addEventListener("storeDataReady", handleStoreDataReady);

    return () => {
      window.removeEventListener("storeDataReady", handleStoreDataReady);
    };
  }, []);

  useEffect(() => {
    const loadData = () => {
      if (storeNames.length > 0) {
        fetchSalesAndPaymentData();
        fetchOverallData();
      }
    };

    loadData();
  }, [storeNames]);

  const getStoreIDs = () => {
    const storeIDs = storeNames.map((store) => store.StoreID);
    return storeIDs;
  };

  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });

  const fetchOverallData = async () => {
    try {
      let storeIDs;
      if (selectedStore.StoreID) {
        storeIDs = selectedStore.StoreID;
      } else {
        storeIDs = getStoreIDs();
      }

      if (!storeIDs || storeIDs.length === 0) {
        console.warn("No StoreIDs provided. Skipping network call.");
        setLoading(false);
        return;
      }
      setLoading(true);
      const response = await axios.post(GET_OVERALL_DATA_FOR_DASHBOARD, {
        StartDate: value.startDate,
        EndDate: value.endDate,
        StoreIDs: String(storeIDs),
      });
      if (response.data.StatusCode === "SUCCESS") {
        setOverallData(response.data);
      }
    } catch (error) {
      console.error("Error fetching overall dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for the storeDataReady event

  const fetchOrderStatusData = async () => {
    try {
      let storeIDs = selectedStore?.StoreID || getStoreIDs();

      if (!storeIDs || storeIDs.length === 0) {
        console.warn("No StoreIDs provided. Skipping network call.");
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await axios.get(DashboardOrderStatus, {
        params: {
          StartDate: value.startDate,
          EndDate: value.endDate,
          StoreIDs: Array.isArray(storeIDs) ? storeIDs : [storeIDs],
        },
      });

      if (response.data.success) {
        setOrderStatusData(response.data.data); // ✅ Store only the "data" part
      } else {
        console.warn("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching overall dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerStatusData = async () => {
    try {
      let storeIDs = selectedStore?.StoreID || getStoreIDs();

      if (!storeIDs || storeIDs.length === 0) {
        console.warn("No StoreIDs provided. Skipping network call.");
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await axios.get(CustomerStatusCount, {
        params: {
          StoreIDs: Array.isArray(storeIDs) ? storeIDs : [storeIDs],
        },
      });

      if (response.data.success) {
        setCustomerStatusData(response.data.data); // ✅ Store only the "data" part
      } else {
        console.warn("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching overall dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadStoreData = () => {
      const storedData = localStorage.getItem("storesData");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setStoreNames(parsedData);
          setIsStoreDataLoading(false);

          if (parsedData.length === 1) {
            setSelectedStore(parsedData[0]); // Set to the first store
          }
        } catch (error) {
          console.error("Error parsing store data:", error);
          setIsStoreDataLoading(false);
        }
      } else {
        setIsStoreDataLoading(false);
      }
    };

    loadStoreData();

    // Listen for the storeDataReady event
    const handleStoreDataReady = () => {
      loadStoreData();
    };

    window.addEventListener("storeDataReady", handleStoreDataReady);

    return () => {
      window.removeEventListener("storeDataReady", handleStoreDataReady);
    };
  }, []);
  useEffect(() => {
    const loadData = () => {
      if (storeNames.length > 0) {
        fetchSalesAndPaymentData();
        fetchOverallData();
        fetchOrderStatusData();
        fetchCustomerStatusData();
      }
    };

    loadData();
  }, [storeNames]);

  useEffect(() => {
    if (selectedStore || (value.startDate && value.endDate)) {
      fetchOverallData();
    }
  }, [selectedStore, value.startDate, value.endDate]);

  useEffect(() => {
    if (selectedStore) {
      fetchSalesAndPaymentData();
    }
  }, [selectedStore]);

  const fetchSalesAndPaymentData = async () => {
    try {
      let storeIDs;
      if (selectedStore.StoreID) {
        storeIDs = selectedStore.StoreID;
      } else {
        storeIDs = getStoreIDs();
      }

      if (!storeIDs || storeIDs.length === 0) {
        console.warn("No StoreIDs provided. Skipping network call.");
        setLoading(false);
        return;
      }
      setLoading(true);
      const response = await axios.post(
        GET_SALES_AND_PAYMENT_REPORT_BY_MONTH,
        { StoreIDs: String(storeIDs) } // Pass selected store ID
      );
      if (response.data.StatusCode === "SUCCESS") {
        setSalesAndPaymentData(response.data.OrdersAndPayments);
      }
    } catch (error) {
      console.error("Error fetching sales and payment data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOverallData();
    fetchSalesAndPaymentData();
  }, []);
  useEffect(() => {
    if (selectedStore) {
      // Check if a store is selected
      fetchOverallData();
      fetchSalesAndPaymentData();
    }
  }, [selectedStore]);

  const lineData = {
    labels: salesAndPaymentData.map((item) => item.Month),
    datasets: [
      {
        label: "Approved Documents",
        data: salesAndPaymentData.map((item) => parseInt(item.OrderCount)),
        fill: true,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "#10B981",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#10B981",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        borderWidth: 2,
        cubicInterpolationMode: "monotone",
      },
      {
        label: "Pending Documents",
        data: salesAndPaymentData.map((item) => parseFloat(item.TotalPayments)),
        fill: true,
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderColor: "#F59E0B",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#F59E0B",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        borderWidth: 2,
        cubicInterpolationMode: "monotone",
      },
      {
        label: "Rejected Documents",
        data: salesAndPaymentData.map(
          (item) => parseFloat(item.TotalPayments) * 0.3
        ),
        fill: true,
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "#EF4444",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#EF4444",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        borderWidth: 2,
        cubicInterpolationMode: "monotone",
      },
    ],
  };

  const doughnutData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          "rgba(34, 197, 94, 0.2)",
          "rgba(234, 179, 8, 0.2)",
          "rgba(239, 68, 68, 0.2)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Cleanup chart instances on component unmount

  useEffect(() => {
    const lineChartInstance = lineChartRef.current;
    const doughnutChartInstance = doughnutChartRef.current;
    return () => {
      if (lineChartInstance) {
        lineChartInstance.destroy();
      }

      if (doughnutChartInstance) {
        doughnutChartInstance.destroy();
      }
    };
  }, []);

  const handleMailTrigger = async () => {
    const token = localStorage.getItem("token"); // Adjust the key if necessary
    if (!token) {
      console.error("No token found in local storage.");
      return;
    }

    try {
      const response = await axios.post(
        TRIGGER_MAIL,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.StatusCode === "SUCCESS") {
        // You can add any additional success handling here
      } else {
        console.error("Failed to trigger mail:", response.data);
      }
    } catch (error) {
      console.error("Error triggering mail:", error);
    }
  };
  const [isExpanded, setIsExpanded] = useState(() => {
    const storedCollapsed = localStorage.getItem("navbar-collapsed");
    return storedCollapsed !== "true"; // Default to expanded if not set
  });

  // Update state when localStorage value changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedCollapsed = localStorage.getItem("navbar-collapsed");
      setIsExpanded(storedCollapsed !== "true"); // Set expanded if 'navbar-collapsed' is not 'true'
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  const goToCustomers = () => {
    navigate("/Customer", { state: { fromDashboard: true } });
  };
  // const goToFollowups = () => {
  //   navigate("/Followups");
  // };
  const goToFollowups = () => {
    navigate("/Followups/1");
  };

  const goToOrders = () => {
    navigate("/Orders");
  };
  const goToOrdersInstallation = () => {
    navigate("/Orders?filter=Installation"); // Pass filter as a query parameter
  };
  const goToOrdersCompleted = () => {
    navigate("/Orders?filter=Completion"); // Pass filter as a query parameter
  };
  const goToProduction = () => {
    navigate("/production");
  };
  return (
    <div className="main-container">
      {(loading || isStoreDataLoading) && <LoadingAnimation />}

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Document Management
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-64">
            <Combobox value={selectedStatus} onChange={setSelectedStatus}>
              <div className="relative">
                <Combobox.Input
                  className="w-full h-10 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  displayValue={(status) => {
                    const option = statusOptions.find(
                      (opt) => opt.id === status
                    );
                    return option ? option.name : "Select Status";
                  }}
                  placeholder="Select Status"
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </Combobox.Button>
                <Combobox.Options className="absolute z-30 w-full mt-1 bg-white rounded-md shadow-lg">
                  {statusOptions.map((status) => (
                    <Combobox.Option
                      key={status.id}
                      value={status.id}
                      className={({ active }) =>
                        `p-2 cursor-pointer ${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        }`
                      }
                    >
                      {status.name}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>

          <div className="w-72">
            <Datepicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              showShortcuts={true}
              primaryColor="blue"
              inputClassName="h-10 w-full rounded-lg border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Approved Documents */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BsFileEarmarkCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Approved Documents
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {overallData.TotalOrderCount || 0}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm text-green-600">
                65% of total documents
              </span>
            </div>
          </div>
        </div>

        {/* Pending Documents */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <MdPendingActions className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Pending Documents
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {orderStatusData?.productionCount || 0}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm text-yellow-600">
                25% of total documents
              </span>
            </div>
          </div>
        </div>

        {/* Rejected Documents */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <FaFilePdf className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Rejected Documents
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {orderStatusData?.completionCount || 0}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm text-red-600">
                10% of total documents
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Timeline Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Document Analytics
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Document flow analysis
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4 bg-gray-50/80 px-4 py-2 rounded-xl">
                  <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                    1D
                  </button>
                  <button className="px-3 py-1 text-sm font-medium bg-white text-gray-900 shadow-sm rounded-lg">
                    1W
                  </button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                    1M
                  </button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                    1Y
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-900">
                    Approved
                  </span>
                  <span className="flex items-center text-xs font-medium text-emerald-600">
                    <BsArrowUpRight className="w-3 h-3 mr-1" />
                    +12.5%
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-emerald-900">
                    2,619
                  </span>
                  <span className="ml-2 text-sm text-emerald-700">
                    documents
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-amber-900">
                    Pending
                  </span>
                  <span className="flex items-center text-xs font-medium text-amber-600">
                    <BsArrowDownRight className="w-3 h-3 mr-1" />
                    -3.2%
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-amber-900">
                    1,432
                  </span>
                  <span className="ml-2 text-sm text-amber-700">documents</span>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-900">
                    Rejected
                  </span>
                  <span className="flex items-center text-xs font-medium text-red-600">
                    <BsArrowDownRight className="w-3 h-3 mr-1" />
                    -8.4%
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-red-900">892</span>
                  <span className="ml-2 text-sm text-red-700">documents</span>
                </div>
              </div>
            </div>

            <div className="relative h-[320px] mt-2">
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: "index",
                    intersect: false,
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: "white",
                      titleColor: "#111827",
                      bodyColor: "#4B5563",
                      borderColor: "#E5E7EB",
                      borderWidth: 1,
                      padding: 12,
                      boxPadding: 6,
                      usePointStyle: true,
                      callbacks: {
                        label: function (context) {
                          let label = context.dataset.label || "";
                          if (label) {
                            label += ": ";
                          }
                          if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat("en-US", {
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(context.parsed.y);
                          }
                          return label;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        font: {
                          size: 12,
                          family: "Inter",
                        },
                        color: "#9CA3AF",
                        maxRotation: 0,
                      },
                    },
                    y: {
                      position: "right",
                      grid: {
                        color: "#F3F4F6",
                        drawBorder: false,
                        lineWidth: 1,
                      },
                      ticks: {
                        font: {
                          size: 12,
                          family: "Inter",
                        },
                        color: "#9CA3AF",
                        padding: 12,
                        callback: function (value) {
                          return new Intl.NumberFormat("en-US", {
                            notation: "compact",
                            compactDisplay: "short",
                          }).format(value);
                        },
                      },
                      border: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Document Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Document Status Distribution
          </h2>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                  title: {
                    display: true,
                    text: "Current Document Status",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
