import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AddToCartNotification from './AddToCartNotification';
import star from '../icons/Star.svg';
import heart from '../icons/Heart.svg';
import heartFilled from '../icons/heart-filled.svg';
import addCart from '../icons/CartShoppingBag.svg';
import leftArrow from '../icons/LeftArrow.svg';
import rightArrow from '../icons/RightArrow.svg';
import Navbar from './Navbar';

const ProductList = ({ products, addToCart }) => {
  const [notificationItem, setNotificationItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const itemsPerPage = 6;

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotificationItem(product);
    setTimeout(() => {
      setNotificationItem(null);
    }, 3000);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddToFavorites = (product) => {
    let updatedFavorites;
    if (favorites.includes(product.id)) {
      updatedFavorites = favorites.filter((id) => id !== product.id);
    } else {
      updatedFavorites = [...favorites, product.id];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);

  const resultStart = startIndex + 1;
  const resultEnd = Math.min(endIndex, products.length);

  const filterOptions = [
    'All Products',
    'Living Room',
    'Bathroom',
    'Kitchen',
    'Table'
  ];

 const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <div id='ourproducts' className='flex flex-col  w-[95vw]  gap-10 mx-auto  tablet:px-6 phone:px-4 pt-5 '>
      <div className='flex flex-col items-center justify-start gap-9'>
      <h2 className='font-medium text-[32px] text-center'>Our Products</h2>
      <div className='flex flex-row justify-between w-full mx-auto tablet:flex-col tablet:gap-4 phone:flex-col phone:gap-4'>
        {window.innerWidth < 768 ? (
          <select
            className='w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-[#747373] font-semibold'
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <div className='flex flex-row items-center justify-between gap-6 text-[#747373] font-semibold tablet:flex-wrap phone:flex-wrap'>
            {filterOptions.map((option) => (
              <button
                key={option}
                className={option === selectedFilter ? 'text-black' : ''}
                onClick={() => handleFilterChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        <select className='w-fit'>
          <option value="Price" key="1">Filter</option>
        </select>
      </div>
      <div className={`grid grid-cols-3 gap-7 tablet:grid-cols-2 phone:grid-cols-1 ${currentPage === 1 ? 'grid-cols-3' : ''}`}>
        {displayedProducts.map(product => (
          <div key={product.id} className="bg-white w-full rounded-xl tablet:w-full phone:w-full">
            <Link to={`/product/${product.id}`}>
              <img src={product.pic} alt={product.name} className="w-full mb-2 rounded-t-xl" />
            </Link>
            <div className='flex flex-row items-center justify-between px-3 py-4'>
              <div className='flex flex-col gap-4'>
                <Link key={product.id} to={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                </Link>
                <div className='flex flex-col gap-1'>
                  <p className="font-semibold text-2xl">£{product.price.toFixed(2)}</p>
                  <p className='text-xs font-normal flex flex-row gap-1'>
                    <img src={star} alt="" />{product.rating} 
                    <span className='text-[#747373]'> ({product.review} Reviews) </span>
                  </p>
                </div>
              </div>
              <div className='flex flex-row gap-2'>
                <button onClick={() => handleAddToCart(product)}><img src={addCart} alt="" /></button>
                <button onClick={() => handleAddToFavorites(product)}>
                  <img src={favorites.includes(product.id) ? heartFilled : heart} alt="Favorite" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {notificationItem && (
        <AddToCartNotification item={notificationItem} onClose={() => setNotificationItem(null)} />
      )}
      <div className='flex justify-center items-center mt-4 w-full'>
        <div className='flex gap-2'>
          <button
            className={`px-3 py-2 mx-2 rounded-[24px] ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#343A40] text-white'}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <img src={leftArrow} alt="Previous Page" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 rounded-[24px] ${currentPage === index + 1 ? 'bg-[#343A40] text-white' : 'bg-white text-[#343A40]'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`rounded-[24px] px-3 py-2 mx-2 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#343A40] text-white'}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <img src={rightArrow} alt="Next Page" />
          </button>
        </div>
      </div>
      <div className='mt-2 text-[#343A40]'>
        Result {resultStart}-{resultEnd} of {products.length}
      </div>
      </div>
     
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      pic: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      review: PropTypes.number.isRequired,
    })
  ).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default ProductList;