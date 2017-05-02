export default function getUserLocation() {
  return new Promise(function (resolve) {
    navigator.geolocation.getCurrentPosition(function (position) {
      resolve({lat: position.coords.latitude, lng: position.coords.longitude});
    });
  });
}
