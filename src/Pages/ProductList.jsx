import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AddToCartNotification from '../Components/AddToCartNotification';
import star from '../icons/Star.svg';
import heart from '../icons/Heart.svg';
import heartFilled from '../icons/heart-filled.svg';
import addCart from '../icons/CartShoppingBag.svg';
import leftArrow from '../icons/LeftArrow.svg';
import rightArrow from '../icons/RightArrow.svg';
import searchIcon from '../icons/Search Icon.svg';

const ProductList = ({ products, addToCart }) => {
  const [notificationItem, setNotificationItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All Products');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 12;

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    let filtered = products.map((product) => ({
      ...product,
      rating: product.rating || 'N/A', 
      category: product.category || 'N/A',
    }));

    if (selectedFilter !== 'All Products') {
      filtered = filtered.filter((product) => product.category === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedFilter, searchQuery, products]);

  useEffect(() => {
    let sortedProducts = [...filteredProducts];
    switch (sortBy) {
      case 'az':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
        case 'za':
          sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
      case 'price':
        sortedProducts.sort(
          (a, b) => (b.current_price?.[0]?.NGN?.[0] || 0) - (a.current_price?.[0]?.NGN?.[0] || 0)
        );
        break;
        case 'priceLH':
          sortedProducts.sort(
            (a, b) => (a.current_price?.[0]?.NGN?.[0] || 0) - (b.current_price?.[0]?.NGN?.[0] || 0)
          );
          break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  }, [sortBy, filteredProducts]);


  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotificationItem({
      name: product.name,
      pic: product.photos?.[0]?.url || '',
      price: product.current_price?.[0]?.NGN?.[0] || '600',
    });
    setTimeout(() => {
      setNotificationItem(null);
    }, 9000);
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
  const displayedProducts = filteredProducts.slice(startIndex, endIndex);
  const resultStart = startIndex + 1;
  const resultEnd = Math.min(endIndex, filteredProducts.length);

  const filterOptions = ['All Products', 'Living room', 'Bedroom', 'Dining room', 'Table'];
  const sortOptions = [
    { value: 'default', label: 'Filter' },
    { value: 'az', label: 'A-Z' },
    { value: 'za', label: 'Z-A' },
    { value: 'price', label: 'Price(H)' },
    { value: 'priceLH', label: 'Price(L)' },
    { value: 'rating', label: 'Rating' },
  ];

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };
  return (
    <div id='ourproducts' className='flex flex-col w-[95vw] gap-10 mx-auto tablet:px-6 phone:px-4 pt-5 bg-white pr-6 pl-3'>
      <div className='flex flex-col items-center justify-start gap-9'>
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <img src={searchIcon} alt="Search Icon" />
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-[#343A40] rounded-[10px] focus:outline-none focus:border-blue-500"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='flex flex-row justify-between w-full mx-auto tablet:flex-col tablet:gap-4 phone:gap-4 text-[#343A40] capitalize'>
          {window.innerWidth < 768 ? (
            <>
              <select
                className='w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-[#343A40] font-semibold phone:w-fit capitalize'
                value={selectedFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option} className="capitalize">{option}</option>
                ))}
              </select>
              <select
                className='w-full  py-2 px-3 border border-gray-300 rounded-md bg-white text-[#343A40] font-semibold phone:w-fit'
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </>
          ) : (
            <>
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
              <div className='flex flex-row items-center justify-between gap-6 text-[#747373] font-semibold tablet:flex-wrap phone:flex-wrap'>
                <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
        <div className={`grid grid-cols-3 gap-7 tablet:grid-cols-2 phone:grid-cols-1 ${currentPage === 1 ? 'grid-cols-3' : ''}`}>
          {displayedProducts.map(product => (
            <div key={product.id} className="bg-[#fdfdfd] w-full rounded-xl tablet:w-full phone:w-full border-[#F5F5F5] border">
              <Link to={`/product/${product.id}`}>
              {product.photos.map((photo, index) => (
              <img key={index} src={`https://api.timbu.cloud/images/${photo.url}`} alt={product.name}  className="w-full h-[320px] mb-2 rounded-t-xl"/>
            ))}
              
              </Link>
              <div className='flex flex-row items-center justify-between px-3 py-4'>
                <div className='flex flex-col gap-4'>
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                  </Link>
                  <div className='flex flex-col gap-1'>
                     <p className="font-semibold text-2xl">Price: £{product.current_price[0].NGN ? product.current_price[0].NGN[0] : "600"}</p>
                    <p className='text-xs font-normal flex flex-row gap-1 items-center'>
                      <img src={star} alt="" />
                      <span>{product.rating} </span>
                      <span className='text-[#747373]'> ({product.rating} Reviews) </span>
                    </p>
                  </div>
                </div>
                <div className='flex flex-row gap-2'>
                  <button onClick={() => handleAddToCart(product)}><img src={addCart} alt="Add to Cart" /></button>
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
              className={`px-3 py-2 mx-2 rounded-[24px] border border-[#E2E6E8] text-[#5F676D]  text-[16px] bg-[#343A40] ${currentPage === 1 ? 'cursor-not-allowed opacity-50 bg-[#343A4099]' : ''}`}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <img src={leftArrow} alt="Previous Page" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-4 py-2 mx-1 rounded-full border text-[16px] ${currentPage === index + 1 ? 'bg-[#343A40] text-white border-[#343A40]' : 'border-[#E2E6E8] text-[#343A40]'}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={`px-3 py-2 mx-2 bg-[#343A40] border border-[#343A40] text-[#5F676D] text-[16px] rounded-full ${currentPage === totalPages ? 'cursor-not-allowed opacity-50 bg-[#343A4099]' : ''}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <img src={rightArrow} alt="Next Page" />
            </button>
          </div>
        </div>
        <div className='text-[#747373] font-normal'>{resultStart} - {resultEnd} of {filteredProducts.length} Results</div>
      </div>
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    pic: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    review: PropTypes.number.isRequired,
  })).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default ProductList;
