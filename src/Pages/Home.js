import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGlampings } from '../store/actions/glampingActions';
import '../assets/Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { isLoading, glampingsList } = useSelector((state) => state.glampings);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobileView = window.innerWidth <= 768;

  useEffect(() => {
    dispatch(fetchGlampings());

    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [dispatch]);

  const getVisibleGlampingsCount = () => {
    if (windowWidth <= 768) {
      return 1;
    } if (windowWidth <= 1280) {
      return 2;
    }
    return 3;
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1
      : glampingsList.length - getVisibleGlampingsCount()));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < glampingsList.length
       - getVisibleGlampingsCount() ? prevIndex + 1 : 0));
  };

  const handlePrevMobile = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : glampingsList.length - 1));
  };

  const handleNextMobile = () => {
    setCurrentIndex((prevIndex) => (prevIndex < glampingsList.length - 1 ? prevIndex + 1 : 0));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const touchDelta = touchEndX - touchStartX;
      if (touchDelta > 0) {
        handlePrevMobile();
      } else if (touchDelta < 0) {
        handleNextMobile();
      }
      setTouchStartX(null);
      setTouchEndX(null);
    }
  };

  const visibleGlampings = (() => {
    if (glampingsList.length <= getVisibleGlampingsCount()) {
      return glampingsList;
    }

    const endIndex = currentIndex + getVisibleGlampingsCount();
    const overflow = endIndex - glampingsList.length;

    if (overflow <= 0) {
      return glampingsList.slice(currentIndex, endIndex);
    }

    return [...glampingsList.slice(currentIndex), ...glampingsList.slice(0, overflow)];
  })();

  if (isLoading) {
    return <div className="spinner" />;
  }

  return (
    <div className="glamping-list">
      <h1>Glampings</h1>
      <h4>Please select a glamping.</h4>
      <div
        className="glamping-carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {visibleGlampings.map(([id, name, type, imageSrc]) => (
          <div className="glamping-item" key={id}>
            <Link to={`/glamping/${id}`}>
              {' '}
              <img
                src={imageSrc}
                alt={name}
                className="glamping-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300';
                }}
              />
            </Link>
            <p className="glamping-name">{name}</p>
            <p className="glamping-type">{type}</p>
          </div>
        ))}
      </div>
      {glampingsList.length > getVisibleGlampingsCount() && (
        <div className="carousel-navigation">
          {!isMobileView && (
            <button aria-label="Previous" className="arrow arrow-left" type="button" onClick={handlePrev}>
              &#8249;
            </button>
          )}
          {!isMobileView && (
            <button aria-label="Next" className="arrow arrow-right" type="button" onClick={handleNext}>
              &#8250;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
