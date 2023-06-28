const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#spot-name').value.trim();
  const location = document.querySelector('#spot-location').value.trim();
  const description = document.querySelector('#spot-desc').value.trim();
  const image_url = document.querySelector('#uploadedimage').dataset.url;
  console.log(image_url);

  if (name && location && description) {
    const response = await fetch(`/api/spots`, {
      method: 'POST',
      body: JSON.stringify({ name, location, description, image_url }),
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

const cloudName = "divq8221r";
const uploadPreset = "l9mxdgbs";

const myWidget = cloudinary.createUploadWidget(
  {
    cloudName: cloudName,
    uploadPreset: uploadPreset,
    // cropping: true, //add a cropping step
    // showAdvancedOptions: true,  //add advanced options (public_id and tag)
    // sources: [ "local", "url"], // restrict the upload sources to URL and local files
    // multiple: false,  //restrict upload to a single file
    // folder: "user_images", //upload files to the specified folder
    // tags: ["users", "profile"], //add the given tags to the uploaded files
    // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
    // clientAllowedFormats: ["images"], //restrict uploading to image files only
    // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
    // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
    // theme: "purple", //change to a purple theme
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log("Done! Here is the image info: ", result.info);
      document
        .getElementById("uploadedimage")
        .setAttribute("src", result.info.secure_url)
      document
        .getElementById("uploadedimage")
        .setAttribute("data-url", result.info.secure_url);
    }
  }
);

document.getElementById("upload_widget").addEventListener(
  "click",
  function () {
    myWidget.open();
  },
  false
);

document
  .querySelector('.new-spot-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.spot-list')
  .addEventListener('click', delButtonHandler);