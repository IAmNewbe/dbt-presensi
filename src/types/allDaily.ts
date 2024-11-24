import axios from 'axios';

export type AllDaily = [
  {
    group: string,
    dates: [
      {
        date: string,
        data: [
          {
            employee_id: string,
            person_name: string,
            person_group: string,
            first_access_time: string,
            status: string,
            auth_type: string,
            attendance_status: string,
            resource_name: string,
          }
        ]
      }
    ]
  }
]

export const fetchAllDailyDate = async (): Promise<AllDaily[]> => {
  const baseUrl = '36.92.168.180';
  const basePort = 7499;
  
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `http://${baseUrl}:${basePort}/api/get_presence_report_json_all`,
      {
        late_time: "09:00"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Replace with actual token
        }
      }
    );

    // Ensure the response is of type Log[]
    const allDaily: AllDaily[] = response.data;
    return allDaily;
  } catch (error) {
    console.error('Error fetching log data:', error);
    throw error;
  }
};