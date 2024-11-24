import axios from 'axios';

export type Log = {
  id: number,
  employee_id: string, 
  access_date: string, 
  access_time: string, 
  auth_type: string, 
  resource_name: string, 
  person_name: string, 
  person_group: string,  
  attendance_status: string
};

export const fetchLogData = async (): Promise<Log[]> => {
  const baseUrl = '36.92.168.180';
  const basePort = 7499;
  
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `http://${baseUrl}:${basePort}/api/get_last_data`,
      {
        limit: '5',
        date: formattedDate
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Replace with actual token
        }
      }
    );

    // Ensure the response is of type Log[]
    const logs: Log[] = response.data;
    return logs;
  } catch (error) {
    console.error('Error fetching log data:', error);
    throw error;
  }
};