async function getEvents() {
    try {
        const response = await fetch("http://localhost:4000/api/events");
        if (!response.ok) {
            throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        displayEvents(data);
    } catch (error) {
        console.error("Error:", error);
    }
}
getEvents();

let displayEvents = (events) => {
    const eventsContainer = document.querySelector(".events-container");
    eventsContainer.innerHTML = ""; 
    events.forEach((event) => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.innerHTML = `
            <img src="${event.imageUrl}" alt="${event.title}" class="event-image">
            <div class="event-info">
                <h2 class="event-title">${event.title}</h2>
                <p class="event-date">${event.date}</p>
                <p class="event-location">${event.location}</p>
                <p class="event-company">${event.company}</p>
                <p class="event-price">$${event.price}</p>
                <button class="view-event-btn" data-id="${event.id}">View</button>
                <button class="update-event-btn" data-id="${event.id}">Update</button>
                <button class="delete-event-btn" data-id="${event.id}">Delete</button>
            </div>
        `;
        eventsContainer.appendChild(eventCard);
    });
};
    // Add event listeners for buttons
    document.querySelectorAll(".view-event-btn").forEach(button => {
        button.addEventListener("click", viewEvent);
    });

    document.querySelectorAll(".update-event-btn").forEach(button => {
        button.addEventListener("click", updateEvent);
    });

    document.querySelectorAll(".delete-event-btn").forEach(button => {
        button.addEventListener("click", deleteEvent);
    });
    // Function to handle viewing an event
    async function viewEvent() {
        const eventId = this.getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:4000/api/events/${eventId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch event");
            }
            const event = await response.json();
            displayEvent(event);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    // Function to handle updating an event
    async function updateEvent() {
        const eventId = this.getAttribute("data-id");
        const updatedEvent = {
            title: "Updated Event",
            date: "2022-12-31",
            location: "New Location",
            company: "New Company",
            price: 100,
            imageUrl: "https://via.placeholder.com/300",
        };
        try {
            const response = await fetch(`http://localhost:4000/api/events/${eventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedEvent),
            });
            if (!response.ok) {
                throw new Error("Failed to update event");
            }
            const event = await response.json();
            displayEvent(event);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    // Function to handle deleting an event
    async function deleteEvent() {
        const eventId = this.getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:4000/api/events/${eventId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete event");
            }
            const data = await response.json();
            console.log(data.message);
            getEvents();
        } catch (error) {
            console.error("Error:", error);
        }
    }
    // Function to add a new event
    async function addEvent() {
        const newEvent = {
            title: "New Event",
            date: "2022-01-01",
            location: "Location",
            company: "Company",
            price: 50,
            imageUrl: "https://via.placeholder.com/300",
        };
        try {
            const response = await fetch("http://localhost:4000/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEvent),
            });
            if (!response.ok) {
                throw new Error("Failed to add event");
            }
            const event = await response.json();
            displayEvent(event);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    // Attach event listener to "Add New Event" button
    document.querySelector(".add-event-btn").addEventListener("click", addEvent);
    // Fetch and display events on page load
    getEvents();
