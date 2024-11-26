import axios from 'axios';
import SERVER from '../../common/config';

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
const API_BASE_URL = SERVER.baseURL;
const API_PORT = SERVER.basePORT;

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

  try {
    const response = await axios.get<Daily[]>(
      `${API_BASE_URL}:${API_PORT}/api/getAccumulatedData`,
      { headers: getAuthHeaders() }
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
