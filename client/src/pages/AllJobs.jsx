import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';

export const loader = async ({request})=>{
  //console.log(request.url);
  //http://localhost:5173/dashboard/all-jobs?search=a&jobStatus=all&jobType=all&sort=newest
  //Creating an object of the queries that are exist it the url.
  const params=Object.fromEntries([...new URL(request.url).searchParams.entries()]);
  //console.log(params); //{search: 'a', jobStatus: 'all', jobType: 'all', sort: 'newest'}
  try {
    const {data}=await customFetch.get('/jobs',{params}); //{totalJobs:100,numOfPages:10, currentPage:1,jobs:[{},{},{}]}
    return {data, searchValues:{...params}};
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error
  }
};

const AllJobsContext=createContext();

const AllJobs = () => {
  //accessing the data we query to the server from loader () above. The data will be in the form of object with multiple objects in an array ({jobs:[{},{},{}})
  const {data, searchValues} = useLoaderData();
  return (
    <AllJobsContext.Provider value={{data,searchValues}}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  )
}

export const useAllJobsContext= ()=> useContext(AllJobsContext);
export default AllJobs