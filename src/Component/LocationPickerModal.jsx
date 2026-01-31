import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import Swal from 'sweetalert2';

// Google Maps API Key - You should move this to environment variable
const GOOGLE_MAPS_API_KEY = 'AIzaSyDQ5csDpZbI4g7G5YX07OtXzX5gQ_R6vj0';
const libraries = ['places'];

const LocationPickerModal = ({ isOpen, onClose, onLocationSelect, initialAddress = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [autocompletePredictions, setAutocompletePredictions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 33.6844, lng: 73.0479 }); // Default: Islamabad, Pakistan
  const [mapZoom, setMapZoom] = useState(13);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAutocompleteSuggestions, setShowAutocompleteSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  
  const searchTimeoutRef = useRef(null);
  const suggestionsRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const autocompleteDebounceRef = useRef(null);
  const mapRef = useRef(null);

  // Map container style - matching the example
  const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '400px',
    borderRadius: '8px',
    position: 'relative',
    zIndex: 1,
    cursor: 'pointer'
  };

  // Load Google Maps API
  const { isLoaded: isGoogleMapsLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('mapSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  // Initialize AutocompleteService when Google Maps is loaded
  useEffect(() => {
    if (isGoogleMapsLoaded && window.google && window.google.maps && window.google.maps.places) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
    
    return () => {
      if (autocompleteDebounceRef.current) {
        clearTimeout(autocompleteDebounceRef.current);
      }
    };
  }, [isGoogleMapsLoaded]);

  // Hide Google Places default autocomplete dropdown (we're using custom dropdown)
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'hide-google-autocomplete';
    style.textContent = `
      .pac-container {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById('hide-google-autocomplete');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  // Initialize map with user's current location if available
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = { lat: position.coords.latitude, lng: position.coords.longitude };
          setMapCenter(location);
          setMapZoom(15);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, [isOpen]);

  // Update map center when center state changes
  useEffect(() => {
    if (mapRef.current && mapCenter) {
      mapRef.current.setCenter(mapCenter);
    }
  }, [mapCenter]);

  // Save search history to localStorage
  const saveSearchHistory = (place) => {
    const newHistory = [
      { 
        name: place.formatted_address || place.name, 
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
        timestamp: Date.now(),
        placeId: place.place_id
      },
      ...searchHistory.filter(item => item.placeId !== place.place_id).slice(0, 9) // Keep only 10 items
    ];
    setSearchHistory(newHistory);
    localStorage.setItem('mapSearchHistory', JSON.stringify(newHistory));
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('mapSearchHistory');
    setShowSearchHistory(false);
  };

  // Enhanced autocomplete search function - shows suggestions as user types (with debouncing)
  const performAutocompleteSearch = (query) => {
    // Clear previous debounce timer
    if (autocompleteDebounceRef.current) {
      clearTimeout(autocompleteDebounceRef.current);
    }

    if (!autocompleteServiceRef.current || !query || query.trim().length === 0) {
      setAutocompletePredictions([]);
      setShowAutocompleteSuggestions(false);
      setIsLoadingSuggestions(false);
      return;
    }

    // Don't search for very short queries (less than 2 characters)
    if (query.trim().length < 2) {
      setAutocompletePredictions([]);
      setShowAutocompleteSuggestions(false);
      setIsLoadingSuggestions(false);
      return;
    }

    // Debounce the API call to avoid too many requests (300ms delay)
    autocompleteDebounceRef.current = setTimeout(() => {
      setIsLoadingSuggestions(true);
      setShowAutocompleteSuggestions(true);

      autocompleteServiceRef.current.getPlacePredictions({
        input: query,
        componentRestrictions: { country: 'pk' },
        types: ['geocode', 'establishment'], // Include both addresses and places
        fields: ['place_id', 'geometry', 'formatted_address', 'name', 'address_components', 'types']
      }, (predictions, status) => {
        setIsLoadingSuggestions(false);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
          // Limit to top 5 suggestions for better UX
          setAutocompletePredictions(predictions.slice(0, 5));
          setShowAutocompleteSuggestions(true);
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setAutocompletePredictions([]);
          setShowAutocompleteSuggestions(false);
        } else {
          // Handle other statuses (ERROR, OVER_QUERY_LIMIT, etc.)
          setAutocompletePredictions([]);
          setShowAutocompleteSuggestions(false);
        }
      });
    }, 300); // 300ms debounce delay
  };

  // Function to handle selection from autocomplete suggestions
  const handleSuggestionSelect = (prediction) => {
    if (!isGoogleMapsLoaded || !window.google) return;

    setIsSearching(true);
    setShowAutocompleteSuggestions(false);
    setSearchQuery(prediction.description);

    // Use Geocoder instead of deprecated PlacesService
    // Geocoder is still available and works well for this use case
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ placeId: prediction.place_id }, (results, status) => {
      setIsSearching(false);
      
      if (status === 'OK' && results && results.length > 0) {
        const result = results[0];
        const location = {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng()
        };

        // Create a place object compatible with saveSearchHistory
        const placeData = {
          formatted_address: result.formatted_address || prediction.description,
          name: result.formatted_address || prediction.description,
          geometry: {
            location: {
              lat: () => location.lat,
              lng: () => location.lng
            },
            viewport: result.geometry.viewport || null
          },
          place_id: prediction.place_id
        };

        // Save to search history
        saveSearchHistory(placeData);

        // Set searched location marker
        setSelectedLocation({ 
          lat: location.lat, 
          lon: location.lng, 
          address: result.formatted_address || prediction.description 
        });

        // Center map on searched location
        const mapLocation = { lat: location.lat, lng: location.lng };
        setMapCenter(mapLocation);
        setMapZoom(16);

        // Update search input with formatted address
        setSearchQuery(result.formatted_address || prediction.description);

        // Move map to location
        setTimeout(() => {
          if (mapRef.current) {
            if (result.geometry.viewport) {
              mapRef.current.fitBounds(result.geometry.viewport);
              // Set a minimum zoom level
              const listener = window.google.maps.event.addListener(mapRef.current, 'bounds_changed', () => {
                if (mapRef.current.getZoom() > 16) {
                  mapRef.current.setZoom(16);
                }
                window.google.maps.event.removeListener(listener);
              });
            } else {
              mapRef.current.setZoom(16);
              mapRef.current.setCenter(mapLocation);
            }
          }
        }, 200);
      } else {
        console.error('Geocoding failed:', status);
        alert('Could not find location details. Please try again.');
      }
    });
  };

  // Manual search function for when user presses Enter
  const performManualSearch = (query) => {
    if (!isGoogleMapsLoaded || !window.google) return;
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({
      address: query,
      componentRestrictions: { country: 'PK' }
    }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const result = results[0];
        const location = {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng()
        };
        
        // Update states
        const mapLocation = { lat: location.lat, lng: location.lng };
        setSelectedLocation({ lat: location.lat, lon: location.lng, address: result.formatted_address });
        setMapCenter(mapLocation);
        setMapZoom(16);
        setSearchQuery(result.formatted_address);
        
        // Move map to location
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.setCenter(mapLocation);
            mapRef.current.setZoom(16);
          }
        }, 100);
        
        // Hide all suggestions when location is selected
        setShowAutocompleteSuggestions(false);
        setAutocompletePredictions([]);
        setShowSearchHistory(false);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    });
  };

  // Select from search history
  const selectFromHistory = (historyItem) => {
    const mapLocation = { lat: historyItem.location.lat, lng: historyItem.location.lng };
    setSelectedLocation({ 
      lat: historyItem.location.lat, 
      lon: historyItem.location.lng, 
      address: historyItem.name 
    });
    setMapCenter(mapLocation);
    setMapZoom(16);
    setSearchQuery(historyItem.name);
    setShowSearchHistory(false);
    
    // Move map to location
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.setCenter(mapLocation);
        mapRef.current.setZoom(16);
      }
    }, 100);
  };

  // Handle map click
  const handleMapClick = (e) => {
    if (!isGoogleMapsLoaded || !window.google) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const mapLocation = { lat, lng };
    
    // Use Google Geocoder for reverse geocoding
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: mapLocation },
      (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const address = results[0].formatted_address;
          setSearchQuery(address);
          setSelectedLocation({ lat, lon: lng, address });
          setMapCenter(mapLocation);
        } else {
          setSelectedLocation({ lat, lon: lng, address: searchQuery || 'Selected Location' });
          setMapCenter(mapLocation);
        }
      }
    );
  };

  // Load map handler
  const onLoadMap = (map) => {
    mapRef.current = map;
    
    // Add click listener for map
    map.addListener('click', handleMapClick);
    
    // Ensure map is fully interactive
    map.setOptions({
      clickableIcons: true,
      gestureHandling: 'greedy',
      draggable: true,
      scrollwheel: true,
      disableDoubleClickZoom: false
    });
  };

  // Handle submit
  const handleSubmit = () => {
    if (!selectedLocation) {
      Swal.fire({
        icon: 'warning',
        title: 'No Location Selected',
        text: 'Please select a location on the map or choose from suggestions before submitting.',
        confirmButtonText: 'OK'
      });
      return;
    }

    setIsSubmitting(true);
    
    // Get clean address text (without coordinates)
    const addressText = selectedLocation.address || searchQuery;
    
    // Call the callback with location data - this will save to address state
    if (onLocationSelect) {
      onLocationSelect({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lon,
        address: addressText, // Save clean address to state
      });
    }
    
    // Small delay to show submitting state, then close
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  // Go to current location
  const goToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = { lat: position.coords.latitude, lng: position.coords.longitude };
          setMapCenter(location);
          setMapZoom(16);
          setSearchQuery('');
          setSelectedLocation(null);
          
          // Move map to location
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.setCenter(location);
              mapRef.current.setZoom(16);
            }
          }, 100);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  const clearSearch = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    setShowSearchHistory(false);
    setShowAutocompleteSuggestions(false);
    setAutocompletePredictions([]);
  };

  if (!isOpen) return null;

  // Show loading state while Google Maps is loading
  if (!isGoogleMapsLoaded) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="ml-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col p-8">
          <p className="text-red-600">Error loading Google Maps. Please check your API key.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ padding: '20px' }}>
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 40px)' }}>
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your exact location?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Providing your location enables more accurate search and delivery ETA, seamless order tracking and personalised recommendations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto flex flex-col" style={{ minHeight: '400px', maxHeight: 'calc(90vh - 280px)' }}>
          {/* Search Input */}
          <div className="p-6 border-b border-gray-200">
            <label htmlFor="locationSearch" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your address
            </label>
            <div className="relative" ref={suggestionsRef}>
              <input
                type="text"
                id="locationSearch"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-24 text-base"
                placeholder="Search for a location (e.g., Islamabad, Veevo tech)"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  
                  // Show search history only when input is empty
                  setShowSearchHistory(value === '');
                  
                  // Trigger autocomplete search as user types
                  performAutocompleteSearch(value);
                }}
                onFocus={() => {
                  if (searchQuery === '') {
                    setShowSearchHistory(true);
                  } else if (searchQuery.length >= 2) {
                    setShowAutocompleteSuggestions(true);
                  }
                }}
                onBlur={() => {
                  // Delay hiding to allow click on suggestions
                  setTimeout(() => {
                    setShowSearchHistory(false);
                    setShowAutocompleteSuggestions(false);
                  }, 300);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    // If there are suggestions, select the first one
                    if (autocompletePredictions.length > 0) {
                      handleSuggestionSelect(autocompletePredictions[0]);
                    } else if (searchQuery.trim()) {
                      // Otherwise, trigger manual search
                      performManualSearch(searchQuery.trim());
                    }
                  } else if (e.key === 'Escape') {
                    setShowAutocompleteSuggestions(false);
                    setAutocompletePredictions([]);
                  }
                }}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <button
                  onClick={goToCurrentLocation}
                  className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                  title="Go to my location"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                {(selectedLocation || searchQuery) && (
                  <button
                    onClick={clearSearch}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    title="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {showAutocompleteSuggestions && (autocompletePredictions.length > 0 || isLoadingSuggestions) && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-72 overflow-y-auto">
                  <div className="p-2">
                    {isLoadingSuggestions ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span className="ml-2 text-sm text-gray-600">Searching...</span>
                      </div>
                    ) : (
                      <>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 mb-2">
                          Did you mean:
                        </div>
                        {autocompletePredictions.map((prediction, index) => (
                          <button
                            key={prediction.place_id || index}
                            className="w-full flex items-start gap-3 p-3 hover:bg-blue-50 cursor-pointer rounded transition-colors text-left"
                            onClick={() => handleSuggestionSelect(prediction)}
                            onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                          >
                            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {prediction.structured_formatting?.main_text || prediction.description}
                              </p>
                              <p className="text-xs text-gray-500 truncate mt-1">
                                {prediction.structured_formatting?.secondary_text || ''}
                              </p>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Search History */}
              {showSearchHistory && searchHistory.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Recent Searches
                      </span>
                      <button
                        onClick={clearSearchHistory}
                        className="text-xs text-red-500 hover:text-red-700 p-1"
                      >
                        Clear All
                      </button>
                    </div>
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded text-left"
                        onClick={() => selectFromHistory(item)}
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isSearching && (
                <div className="absolute right-24 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative" style={{ minHeight: '400px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ pointerEvents: 'auto', width: '100%', height: '100%', flex: 1, minHeight: '400px' }}>
              {isGoogleMapsLoaded ? (
                <GoogleMap
                  key={`${mapCenter.lat}-${mapCenter.lng}`}
                  zoom={mapZoom}
                  center={mapCenter}
                  onLoad={onLoadMap}
                  mapContainerStyle={containerStyle}
                  options={{
                    clickableIcons: true,
                    gestureHandling: 'greedy',
                    zoomControl: true,
                    mapTypeControl: true,
                    scaleControl: true,
                    streetViewControl: true,
                    rotateControl: true,
                    fullscreenControl: true,
                    mapTypeControlOptions: {
                      position: window.google?.maps?.ControlPosition?.TOP_LEFT,
                      mapTypeIds: [
                        window.google?.maps?.MapTypeId?.ROADMAP,
                        window.google?.maps?.MapTypeId?.SATELLITE,
                        window.google?.maps?.MapTypeId?.HYBRID,
                        window.google?.maps?.MapTypeId?.TERRAIN
                      ]
                    }
                  }}
                >
                {selectedLocation && (
                  <Marker
                    position={{ lat: selectedLocation.lat, lng: selectedLocation.lon }}
                    icon={{
                      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 0C9.507 0 1 8.507 1 19c0 13.5 19 31 19 31s19-17.5 19-31C39 8.507 30.493 0 20 0zm0 28c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9-4.029 9-9 9z" fill="#ff6b9d"/>
                          <circle cx="20" cy="19" r="6" fill="white"/>
                          <circle cx="20" cy="19" r="3" fill="#ff6b9d"/>
                        </svg>
                      `),
                      scaledSize: new window.google.maps.Size(40, 50),
                      anchor: new window.google.maps.Point(20, 50)
                    }}
                    title={selectedLocation.address || "Selected location"}
                    animation={window.google?.maps?.Animation?.DROP}
                  />
                )}
                </GoogleMap>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Location Pin Overlay - Positioned above the marker */}
            {selectedLocation && (
              <div 
                className="absolute pointer-events-none z-10"
                style={{
                  top: 'calc(50% - 60px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-lg mb-1 whitespace-nowrap text-sm font-semibold" style={{ backgroundColor: '#ff6b9d' }}>
                  We'll deliver here
                </div>
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent mx-auto" style={{ borderTopColor: '#ff6b9d' }}></div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Always visible at bottom */}
        <div className="flex-shrink-0 border-t-2 border-gray-300 bg-white shadow-lg relative z-10" style={{ padding: '28px 32px', minHeight: 'auto' }}>
          <div className="flex justify-end items-center gap-6" style={{ width: '100%' }}>
            <button
              onClick={onClose}
              type="button"
              className="px-8 py-3.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700 text-base flex items-center justify-center whitespace-nowrap"
              style={{ 
                minWidth: '140px', 
                height: '52px',
                lineHeight: '1.5',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              disabled={!selectedLocation || isSubmitting}
              className="px-10 py-3.5 text-white rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 flex items-center justify-center whitespace-nowrap"
              style={{ 
                backgroundColor: selectedLocation ? '#ff6b9d' : '#ccc',
                minWidth: '220px',
                height: '52px',
                lineHeight: '1.5',
                boxShadow: selectedLocation ? '0 4px 12px rgba(255, 107, 157, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'SUBMIT LOCATION'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;
