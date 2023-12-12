import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useOutletContext } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const action = async ({request})=>{
   // we catch the data from the form using method provided by react-router library. it is basically invoking FormData JavaScript API
  const formData= await request.formData();
  //we turn the array of array about the input-form data into an object
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post('/jobs',data);
    toast.success('Job added successfully');
    return redirect('all-jobs');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
}

const AddJob = () => {
  //grab the data we passed in as a prop in <Outlet> tag in DashboardLayout
  const {user} = useOutletContext();
  
  return (
    <Wrapper>
      <Form method='post' className='form'>
        <h4 className="form-title">add job</h4>
        <div className="form-center">
          <FormRow type='text' name='position' />
          <FormRow type='text' name='company' />
          <FormRow type='text' labelText='job location' name='jobLocation' defaultValue={user.location} />
          <FormRowSelect labelText='job status' name='jobStatus' defaultValue={JOB_STATUS.PENDING} list={Object.values(JOB_STATUS)} />
          <FormRowSelect labelText='job type' name='jobType' defaultValue={JOB_TYPE.FULL_TIME} list={Object.values(JOB_TYPE)} />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  )
}
export default AddJob