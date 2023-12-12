import {Form,redirect, useActionData, Link, useNavigate } from "react-router-dom"
import Wrapper from "../assets/wrappers/RegisterAndLoginPage"
import {FormRow, Logo, SubmitBtn} from "../components/"
import customFetch from "../utils/customFetch"
import {toast} from "react-toastify"

export const action = async ({request})=>{
  // we catch the data from the form using method provided by react-router library. it is basically invoking FormData JavaScript API
  const formData= await request.formData();
  //we turn the array of array about the input-form data into an object
  const data= Object.fromEntries(formData);

  //set an errors object and insert the msg value if the condition met. The value can be access using useActionData() below
  const errors = {msg:''};
  if (data.password.length < 3){
    errors.msg ='password too short';
    return errors
  }

  try {
    await customFetch.post('/auth/login',data);
    toast.success('Login successful');
    return redirect('/dashboard');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    // errors.msg=error?.response?.data?.msg
    // return errors;
    return error;
  }
}

const Login = () => {
  //accessing the errors object data created above in the action. The value initially is undefined when the component mount. But when we submit the form and if there is an error and we return it, the we access the data being returned.
  const errors=useActionData();

  const navigate= useNavigate();

  const loginDemoUser= async ()=>{
    const data ={
      email:"test@gmail.com",
      password:"secret123"
    };

    try {
      await customFetch.post('/auth/login',data)
      toast.success('Login as a test user successful');
      return navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  }

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        {/* conditional rendering with errors object exist */}
        {errors?.msg && <p style={{color:'red'}}>{errors.msg}</p>} 

        <FormRow type='email' name='email'/>
        <FormRow type='password' name='password'/>
        
        <SubmitBtn />
        <button type='button' className="btn btn-block" onClick={loginDemoUser}>explore the app</button>
        <p>
          Not a member yet?
          <Link to='/register' className="member-btn">register</Link>
        </p>
      </Form>
    </Wrapper>
  )
}
export default Login