const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#spot-name').value.trim();
  const location = document.querySelector('#spot-location').value.trim();
  const description = document.querySelector('#spot-desc').value.trim();

  if (name && location && description) {
    const response = await fetch(`/api/spots`, {
      method: 'POST',
      body: JSON.stringify({ name, location, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create spot');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/spots/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete spot');
    }
  }
};

document
  .querySelector('.new-spot-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.spot-list')
  .addEventListener('click', delButtonHandler);
