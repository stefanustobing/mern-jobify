import { FormRow, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useOutletContext } from 'react-router-dom';
import { Form } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({request})=>{
  const formData= await request.formData();
  const file = formData.get('avatar');

  // if file exist and the size more than 0.5MB
  if (file && file.size > 500000){
    toast.error('Image size too large');
    return null;
  }
  try {
    //as we are sending file, instead of sending the data in JSON format, we are sending the form itself include the file.
    await customFetch.patch('/users/update-user',formData);
    toast.success('Profile updated successfully');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
  }
  //The input in the profile page will be updated automatically because everytime we make a request, right after that we make the current-user request at the DashboardLayout component. From DashoardLayout component, the information about the user is passed to the Outlet context.
  return null;
}

const Profile = () => {
  //to catch the data being passed from the parent component (DashboardLayout) using outlet context
  const {user} = useOutletContext();
  const {name,lastName,email,location}=user;

  return (
    <Wrapper>
      <Form method='post' className='form' encType='multipart/form-data'>
        <h4 className="form-title">profile</h4>
        <div className="form-center">
          {/* avatar pict upload */}
          <div className="form-row">
            <label htmlFor="avatar" className='form-label'>
              Select an image file (max 0.5 MB)
            </label>
            <input 
              type="file" 
              name="avatar" 
              id="avatar" 
              className='form-input' 
              accept='image/*'
            />
          </div>
          <FormRow type='text' name='name' defaultValue={name} />
          <FormRow type='text' name='lastName' labelText='lastName' defaultValue={lastName} />
          <FormRow type='text' name='email' defaultValue={email} />
          <FormRow type='text' name='location' defaultValue={location} />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  )
}
export default Profile