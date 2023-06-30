const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#spot-name').value.trim();
  const location = document.querySelector('#spot-location').value.trim();
  const description = document.querySelector('#spot-desc').value.trim();
  const image_url = document.querySelector('#uploadedimage').getAttribute('src');

  if (name && location && description) {
    try {
      const response = await fetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify({ name, location, description, image_url }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.location.replace('/profile');
      } else {
        throw new Error('Failed to create spot');
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }
};

// const delButtonHandler = async (event) => {
//   if (event.target.hasAttribute('data-id')) {
//     const id = event.target.getAttribute('data-id');

//     try {
//       const response = await fetch(`/api/spots/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         document.location.replace('/profile');
//       } else {
//         throw new Error('Failed to delete spot');
//       }
//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     }
//   }
// };

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

const cloudName = 'divq8221r';
const uploadPreset = 'l9mxdgbs';

const myWidget = cloudinary.createUploadWidget(
  {
    cloudName: cloudName,
    uploadPreset: uploadPreset,
  },
  (error, result) => {
    if (!error && result && result.event === 'success') {
      console.log('Done! Here is the image info: ', result.info);
      document.getElementById('uploadedimage').setAttribute('src', result.info.secure_url);
    }
  }
);

document.getElementById('upload_widget').addEventListener('click', () => {
  myWidget.open();
});

function addressAutocomplete(containerElement, callback, options) {
  const inputContainerElement = document.createElement('div');
  inputContainerElement.setAttribute('class', 'input-container');
  containerElement.appendChild(inputContainerElement);

  const inputElement = document.createElement('input');
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('placeholder', options.placeholder);
  inputContainerElement.appendChild(inputElement);

  const MIN_ADDRESS_LENGTH = 3;
  const DEBOUNCE_DELAY = 300;

  let currentTimeout;
  let currentItems;
  let focusedItemIndex;

  const apiUrl = 'https://api.geoapify.com/v1/geocode/autocomplete';
  const apiKey = 'd8eacc4faff043b9920f626698178950';

  function closeDropDownList() {
    const autocompleteItemsElement = inputContainerElement.querySelector('.autocomplete-items');
    if (autocompleteItemsElement) {
      inputContainerElement.removeChild(autocompleteItemsElement);
    }
  }

  function showDropDownList(items) {
    closeDropDownList();

    const autocompleteItemsElement = document.createElement('div');
    autocompleteItemsElement.setAttribute('class', 'autocomplete-items');

    items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.innerHTML = `<strong>${item.properties.formatted}</strong>`;
      itemElement.addEventListener('click', () => {
        callback(item);
        closeDropDownList();
      });

      if (index === focusedItemIndex) {
        itemElement.classList.add('autocomplete-active');
      }

      autocompleteItemsElement.appendChild(itemElement);
    });

    inputContainerElement.appendChild(autocompleteItemsElement);
  }

  async function fetchAddressData(address) {
    const params = new URLSearchParams({
      text: address,
      apiKey: apiKey,
    });

    try {
      const response = await fetch(`${apiUrl}?${params}`);
      if (response.ok) {
        const data = await response.json();
        return data.features;
      } else {
        throw new Error('Error fetching address data: ' + response.status);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching address data: ' + error.message);
    }
  }

  function handleInput() {
    const address = inputElement.value.trim();

    if (address.length >= MIN_ADDRESS_LENGTH) {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      currentTimeout = setTimeout(async () => {
        try {
          const items = await fetchAddressData(address);
          currentItems = items;
          focusedItemIndex = -1;
          showDropDownList(items);
        } catch (error) {
          console.error('Error fetching address data:', error);
        }
      }, DEBOUNCE_DELAY);
    } else {
      closeDropDownList();
    }
  }

  inputElement.addEventListener('input', handleInput);

  inputElement.addEventListener('keydown', function (e) {
    const autocompleteItemsElement = inputContainerElement.querySelector('.autocomplete-items');

    if (autocompleteItemsElement) {
      const items = autocompleteItemsElement.querySelectorAll('div');

      if (e.key === 'ArrowUp') {
        focusedItemIndex = Math.max(focusedItemIndex - 1, 0);
        items.forEach((item, index) => {
          item.classList.toggle('autocomplete-active', index === focusedItemIndex);
        });
      } else if (e.key === 'ArrowDown') {
        focusedItemIndex = Math.min(focusedItemIndex + 1, items.length - 1);
        items.forEach((item, index) => {
          item.classList.toggle('autocomplete-active', index === focusedItemIndex);
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (focusedItemIndex >= 0 && focusedItemIndex < items.length) {
          const selectedItem = currentItems[focusedItemIndex];
          callback(selectedItem);
          closeDropDownList();
        }
      }
    }
  });

  inputElement.addEventListener('focus', function (e) {
    closeDropDownList();
  });

  inputElement.addEventListener('blur', function (e) {
    setTimeout(closeDropDownList, 300);
  });

  const inputGroupElement = document.createElement('div');
  inputGroupElement.setAttribute('class', 'input-group');
  containerElement.appendChild(inputGroupElement);

  const inputGroupPrependElement = document.createElement('div');
  inputGroupPrependElement.setAttribute('class', 'input-group-prepend');
  inputGroupElement.appendChild(inputGroupPrependElement);

  const inputGroupTextElement = document.createElement('span');
  inputGroupTextElement.setAttribute('class', 'input-group-text');
  inputGroupTextElement.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
  inputGroupPrependElement.appendChild(inputGroupTextElement);

  inputGroupElement.appendChild(inputContainerElement);
}

document.querySelector('.new-spot-form').addEventListener('submit', newFormHandler);

const spotList = document.querySelector('.spot-list');
if (spotList) {
  spotList.addEventListener('click', delButtonHandler);
}

addressAutocomplete(document.getElementById('autocomplete-container'), (selectedItem) => {
  document.querySelector('#spot-location').value = selectedItem.properties.formatted;
}, {
  placeholder: 'Start typing a location here',
});
