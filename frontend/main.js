let map;
let markers = [];
let placesService;

function initMap() {
    // Initialize map centered at a default location
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
    });

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(pos);
                addMarker(pos, "Your Location");
            },
            () => {
                handleLocationError(true);
            }
        );
    } else {
        handleLocationError(false);
    }

    // Initialize places service
    placesService = new google.maps.places.PlacesService(map);

    // Setup search box
    const searchBox = new google.maps.places.SearchBox(
        document.getElementById("search-box")
    );

    // Listen for selection changes
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;
        
        // Clear existing markers
        clearMarkers();
        
        // Add markers for each place
        places.forEach(place => {
            if (!place.geometry) return;
            addMarker(place.geometry.location, place.name);
        });
    });

    // Setup trip planning button
    document.getElementById("plan-trip").addEventListener("click", planTrip);
}

function addMarker(location, title) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: title
    });
    markers.push(marker);
    return marker;
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function handleLocationError(browserHasGeolocation) {
    alert(browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.");
}

async function planTrip() {
    const email = "user@example.com"; // Replace with actual user email
    if (markers.length === 0) {
        alert("Please add at least one location to plan your trip");
        return;
    }

    // Show loading spinner
    document.querySelector('.loader').style.display = 'block';
    document.getElementById('plan-trip').disabled = true;

    // Get all marked locations
    const locations = markers.map(marker => ({
        name: marker.getTitle(),
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
    }));

    const tripData = {
        email: email,
        locations: locations,
        startDate: document.getElementById('start-date').value || new Date().toISOString().split('T')[0],
        duration: document.getElementById('duration').value || 3
    };

    try {
        const response = await fetch('http://localhost:5000/api/generate-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tripData),
        });

        const data = await response.json();
        if (response.ok) {
            displayItinerary(data.itinerary);
        } else {
            alert("Error generating itinerary: " + data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while generating the itinerary.");
    } finally {
        document.querySelector('.loader').style.display = 'none';
        document.getElementById('plan-trip').disabled = false;
    }
}

function displayItinerary(itinerary) {
    const itineraryDiv = document.getElementById('itinerary');
    itineraryDiv.style.display = 'block';
    itineraryDiv.innerHTML = '<h3>Your Itinerary</h3>';
    
    if (typeof itinerary === 'string') {
        itineraryDiv.innerHTML += `<p>${itinerary}</p>`;
    } else if (Array.isArray(itinerary)) {
        itinerary.forEach((day, index) => {
            itineraryDiv.innerHTML += `<h4>Day ${index + 1}</h4>`;
            itineraryDiv.innerHTML += `<p>${day}</p>`;
        });
    } else {
        itineraryDiv.innerHTML += `<p>${JSON.stringify(itinerary)}</p>`;
    }
}


// Initialize the map when the window loads
window.initMap = initMap;
