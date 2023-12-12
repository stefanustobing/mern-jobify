import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import Wrapper from '../assets/wrappers/PageBtnContainer';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAllJobsContext } from '../pages/AllJobs';

const PageBtnContainer = () => {
    const {data:{numOfPages,currentPage}}= useAllJobsContext();

    const pages = Array.from({length:numOfPages},(_,index)=> {return index + 1}); //[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    

    const {search,pathname} = useLocation();
    const navigate=useNavigate();

    const handlePageChange=(pageNumber)=>{
        //extract all the search params in the url
        const searchParams= new URLSearchParams(search);
        //injecting additional search params in the object
        searchParams.set('page',pageNumber);
        // console.log(searchParams);
        // console.log(pageNumber);
        //navigate to the same page with additional params that has been injected
        navigate(`${pathname}?${searchParams.toString()}`);
    }

    const addPageButton = ({pageNumber,activeClass})=>{
        return(
            <button 
                className={`btn page-btn ${activeClass && 'active'}`} 
                key={pageNumber} 
                onClick={()=>handlePageChange(pageNumber)}
            >
                {pageNumber}
            </button>
        )
    }

    const renderPageButtons = () =>{
        const pageButtons = [];

        //first page
        pageButtons.push(addPageButton({pageNumber:1, activeClass:currentPage===1}));

        //dots
        if (currentPage > 3){
            pageButtons.push(<span className='page-btn dots' key='dots-1'>...</span>)
        }


        //one before current page
        if(currentPage !==1 && currentPage !== 2) {
            pageButtons.push(addPageButton({pageNumber:currentPage-1, activeClass:false}));
        }
        
        //current page
        if(currentPage !==1 && currentPage !== numOfPages) {
            pageButtons.push(addPageButton({pageNumber:currentPage, activeClass:true}));
        }
        
        //one after current page
        if(currentPage !==numOfPages && currentPage !== numOfPages-1) {
            pageButtons.push(addPageButton({pageNumber:currentPage+1, activeClass:false}));
        }

        //dots
        if (currentPage < numOfPages-2){
            pageButtons.push(<span className='page-btn dots' key='dots+1'>...</span>)
        }

        //last page
        pageButtons.push(addPageButton({pageNumber:numOfPages, activeClass:currentPage===numOfPages}));

        return pageButtons;
    }

    return (
        <Wrapper>
            <button 
                className="btn prev-btn" 
                onClick={()=>{
                    let prevPage= currentPage-1;
                    if (prevPage < 1) prevPage= numOfPages;
                    handlePageChange(prevPage);
                }}
            >
                <HiChevronDoubleLeft/>
                prev
            </button>

            <div className="btn-container">
                {renderPageButtons()}
            </div>

            <button 
                className="btn next-btn"
                onClick={()=>{
                    let nextPage= currentPage+1;
                    if (nextPage > numOfPages) nextPage= 1;
                    handlePageChange(nextPage);
                }}
            >
                next
                <HiChevronDoubleRight/>
            </button>
        </Wrapper>
    )
}
export default PageBtnContainer