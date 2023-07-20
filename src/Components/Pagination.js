import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { deleteGlamping, fetchGlampings } from '../store/actions/glampingActions';
import { useParams } from 'react-router-dom';
import { deleteSelectedItem } from '../Features/gampling/gamplingSlice';
import { toast } from 'react-toastify';

const Pagination = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [renderedList, setRenderedList] = useState([])
    const { isLoading, glampingsList } = useSelector((store) => store.glampings)
    
    const dispatch = useDispatch()
    //const {id} =useParams()
    console.log(glampingsList)
    //console.log(id)

    useEffect(() => {
      dispatch(fetchGlampings())
      setRenderedList(glampingsList);
    }, [dispatch, glampingsList])

    const handleDelete = (id) => {
      try {
        dispatch(deleteGlamping(id));
        toast.success("Item was deleted successfully");
        setRenderedList((prevList) => prevList.filter((item) => item[0] !== id));
        console.log('Deletion successful');
      } catch (error) {
        console.log('Deletion failed:', error.message);
      }
    };
    
    if(isLoading && renderedList.length === 0) {
      return <div className="spinner"></div>
    }

    const itemsPerPage = 6;
    const totalPages = Math.ceil(renderedList.length / itemsPerPage);
  
    const handlePageChange = ({ selected }) => {
      setCurrentPage(selected);
    };
  
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = renderedList.slice(startIndex, endIndex);

   
  
  return (
    <>
    <div className="delete-list">
      {currentData.map((item)=>(
        <div key={item[0]} className="delete-list-item">
          <div>
            <img
             src={item[3]}
             alt={item[1]}
             className="item-image"
            />
          </div>
          <div>
            <h3>{item[1]}</h3>
            <button 
              type="button" 
              className="button btn-delete"
              onClick={() => handleDelete(item[0])}
            >
              delete
            </button>
          </div>
      </div>
      ))}
    </div>
    {renderedList.length > 0 && (<ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      pageCount={totalPages}
      onPageChange={handlePageChange}
      containerClassName={'pagination'}
      activeClassName={'active'}
    />
    )}

    </>
  )
}

export default Pagination