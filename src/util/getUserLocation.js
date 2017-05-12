export default function getUserLocation(useStaticLocation = true) {
  return new Promise(function (resolve) {
    if (useStaticLocation) {
      resolve({
        lat: 56.043832,
        lng: 12.6941808
      });
    } else {
      navigator.geolocation.getCurrentPosition(function (position) {
        resolve({lat: position.coords.latitude, lng: position.coords.longitude});
      });
    }
  });
}
