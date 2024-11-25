import axios from 'axios';

// Define the Tribe interface
export interface Tribe {
  name: string;
}

export interface Daily {
  group: string;
  data: Array<{
    employee_id: string;
    person_name: string;
    person_group: string;
    first_access_time: string;
    status: string;
    auth_type: string;
    attendance_status: string;
    resource_name: string;
  }>;
}

// Common base URL configuration for API
const API_BASE_URL = "http://36.92.168.180";
const API_PORT = 7499;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication token is missing');
  return { Authorization: `Bearer ${token}` };
};

// Fetch tribes (groups) from the API
export const fetchTribes = async (): Promise<Tribe[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}:${API_PORT}/api/get_group`, {
      headers: getAuthHeaders(),
    });

    // Mapping the response data to return only the necessary 'name' for each tribe
    return response.data.map((item: { person_group: string }) => ({
      name: item.person_group,
    }));
  } catch (error) {
    console.error('Error fetching tribes:', error);
    throw error;
  }
};

// Fetch daily attendance report
export const fetchDailyReport = async (date: string, lateTime: string): Promise<Daily[]> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}:${API_PORT}/api/get_presence_report_json`,
      { date, late_time: lateTime },
      { headers: getAuthHeaders() }
    );
    return response.data as Daily[];
  } catch (error) {
    console.error('Error fetching daily report:', error);
    throw error;
  }
};

// Fetch accumulated presence data (resume report)
export const fetchResumePresence = async (): Promise<Daily[]> => {
  const baseUrl = "36.92.168.180";
  const basePort = 7499;

  // Data body yang akan dikirimkan ke API
  const requestData = {
    start_date: "2024-11-1",
    end_date: "2024-11-23",
    late_time: "09:00",
  };

  try {
    const response = await axios.post<Daily[]>(
      `http://${baseUrl}:${basePort}/api/getAccumulatedData`, 
      requestData, // Body data dikirim sebagai JSON
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeaders()?.Authorization, // Ambil Authorization dari fungsi getAuthHeaders()
        },
      }
    );

    if (!response.data) throw new Error('No data received from the server');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching daily report:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error.message);
    }
    throw error;
  }
};

