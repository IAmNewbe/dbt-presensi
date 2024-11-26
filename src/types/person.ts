import axios from 'axios';
import SERVER from '../common/config';

export type Person = [
  {
    group: string,
    dates: [
      {
        date: string,
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

export const fetchAllReportByName = async (name: string): Promise<Person[]> => {
  const baseUrl = SERVER.baseURL;
  const basePort = SERVER.basePORT;
  
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${baseUrl}:${basePort}/api/get_presence_report_json_all_by_name`,
      {
        name: name,
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
    const person: Person[] = response.data;
    return person;
  } catch (error) {
    console.error('Error fetching log data:', error);
    throw error;
  }
};