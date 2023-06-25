const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#spot-name').value.trim();
  const needed_funding = document.querySelector('#spot-funding').value.trim();
  const description = document.querySelector('#spot-desc').value.trim();

  if (name && needed_funding && description) {
    const response = await fetch(`/api/spots`, {
      method: 'POST',
      body: JSON.stringify({ name, needed_funding, description }),
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
