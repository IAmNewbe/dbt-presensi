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

// Fetch groups from the API
export const fetchTribes = async (): Promise<Tribe[]> => {
  try {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.get('http://192.168.254.74:3000/api/get_group',{
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });
    return response.data.map((item: { person_group: string }) => ({
      name: item.person_group,
    }));
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error; // Rethrow to handle errors in the component
  }
};

export const fetchDailyReport = async (date: string, lateTime: string): Promise<Daily[]> => {
  try {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) throw new Error('Authentication token is missing');

    const response = await axios.post(
      'http://192.168.254.74:3000/api/get_presence_report_json',
      { date, late_time: lateTime },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in headers
        },
      }
    );

    return response.data as Daily[];
  } catch (error) {
    console.error('Error fetching daily report:', error);
    throw error;
  }
};