async function fetchEvents() {
    try {
        const response = await fetch('http://localhost:4000/api/events');
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error('Error:', error);
    }
}
function displayEvents(events) {
    const eventsContainer = document.querySelector('.events-container');
    eventsContainer.innerHTML = '';

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');

        eventCard.innerHTML = `
            <img src="${event.imageUrl}" alt="${event.title}" class="event-image">
            <div class="event-info">
                <h2 class="event-title">${event.title}</h2>
                <p class="event-date">${event.date}</p>
                <p class="event-location">${event.location}</p>
                <p class="event-company">${event.company}</p>
                <p class="event-price">$${event.price}</p>
                <button class="view-event-btn" data-id="${event.id}">View</button>
                <button class="edit-event-btn" data-id="${event.id}">Edit</button>
                <button class="delete-event-btn" data-id="${event.id}">Delete</button>
            </div>
        `;

        eventsContainer.appendChild(eventCard);
    });

    attachEventButtonListeners();
}
function attachEventButtonListeners() {
    document.querySelectorAll('.view-event-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const eventId = event.target.getAttribute('data-id');
            await viewEvent(eventId);
        });
    });

    document.querySelectorAll('.edit-event-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const eventId = event.target.getAttribute('data-id');
            await showEditEventForm(eventId);
        });
    });

    document.querySelectorAll('.delete-event-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const eventId = event.target.getAttribute('data-id');
            await deleteEvent(eventId);
            fetchEvents(); 
        });
    });
}
function showAddEventForm() {
    document.getElementById('add-event-btn').addEventListener('click', () => {
        document.getElementById('add-event-form').style.display = 'flex';
    });

    document.getElementById('add-event-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const newEvent = {
            title: event.target.title.value,
            date: event.target.date.value,
            location: event.target.location.value,
            company: event.target.company.value,
            price: event.target.price.value,
            imageUrl: event.target.imageUrl.value,
        };

        await addEvent(newEvent);
        fetchEvents();
        document.getElementById('add-event-form').reset(); 
    });
}
async function addEvent(newEvent) {
    const response = await fetch('http://localhost:4000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
    });
    const result = await response.json();
    console.log(result);
}
async function viewEvent(eventId) {
    const response = await fetch(`http://localhost:4000/api/events/${eventId}`);
    const event = await response.json();

    const eventDetails = `
        <h2>${event.title}</h2>
        <p class="event-date">${event.date}</p>
        <p class="event-location">${event.location}</p>
        <p class="event-company">${event.company}</p>
        <p class="event-price">$${event.price}</p>
    `;

    document.getElementById('event-details').innerHTML = eventDetails;
    document.getElementById('event-modal').style.display = 'block';
}

document.querySelector('.close-btn').onclick = function() {
    document.getElementById('event-modal').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == document.getElementById('event-modal')) {
        document.getElementById('event-modal').style.display = 'none';
    }
}
async function showEditEventForm(eventId) {
    const response = await fetch(`http://localhost:4000/api/events/${eventId}`);
    const event = await response.json();
    const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : '';

    const editFormHtml = `
        <form id="edit-event-form">
            <label>Title</label><input type="text" name="title" value="${event.title}" />
            <label>Date</label><input type="date" name="date" value="${formattedDate}" />
            <label>Location</label><input type="text" name="location" value="${event.location}" />
            <label>Company</label><input type="text" name="company" value="${event.company}" />
            <label>Price</label><input type="number" name="price" value="${event.price}" />
            <label>Image URL</label><input type="text" name="imageUrl" value="${event.imageUrl}" />
            <button type="submit">Save Changes</button>
        </form>
    `;

    document.querySelector('.events-container').innerHTML = editFormHtml;

    document.getElementById('edit-event-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedEvent = {
            id: event.id,
            title: e.target.title.value,
            date: e.target.date.value,
            location: e.target.location.value,
            company: e.target.company.value,
            price: e.target.price.value,
            imageUrl: e.target.imageUrl.value,
        };

        await updateEvent(eventId, updatedEvent);
        fetchEvents();
    });
}
async function updateEvent(eventId, updatedEvent) {
    const response = await fetch(`http://localhost:4000/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
    });
    const result = await response.json();
    console.log(result);
}
async function deleteEvent(eventId) {
    await fetch(`http://localhost:4000/api/events/${eventId}`, {
        method: 'DELETE',
    });
}

fetchEvents();

showAddEventForm();
